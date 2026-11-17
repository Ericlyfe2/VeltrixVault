import { db } from "@/lib/db";
import { hashPassword, sha256 } from "@/lib/auth/password";
import { resetPasswordSchema, fieldErrors } from "@/lib/validation";
import {
  apiError,
  forbiddenCrossOrigin,
  getClientIp,
  isSameOrigin,
  json,
  rateLimitResponse,
  readJson,
} from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const limit = rateLimit(`reset:${getClientIp(request)}`, {
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  const parsed = resetPasswordSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("invalid_input", "Please check the highlighted fields.", 422, fieldErrors(parsed.error));
  }

  const record = await db.verificationToken.findUnique({
    where: { tokenHash: sha256(parsed.data.token) },
  });

  if (
    !record ||
    record.type !== "PASSWORD_RESET" ||
    record.usedAt ||
    record.expiresAt.getTime() <= Date.now()
  ) {
    return apiError(
      "invalid_token",
      "This reset link is invalid or has expired. Request a new one.",
      400,
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db.$transaction([
    db.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    db.verificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    db.session.deleteMany({ where: { userId: record.userId } }),
    db.auditEvent.create({
      data: { userId: record.userId, type: "auth.password_reset" },
    }),
  ]);

  return json({ ok: true });
}
