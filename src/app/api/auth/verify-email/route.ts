import { db } from "@/lib/db";
import { sha256 } from "@/lib/auth/password";
import { verifyEmailSchema } from "@/lib/validation";
import {
  apiError,
  forbiddenCrossOrigin,
  isSameOrigin,
  json,
  readJson,
} from "@/lib/http";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const parsed = verifyEmailSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("invalid_input", "This verification link is not valid.", 422);
  }

  const record = await db.verificationToken.findUnique({
    where: { tokenHash: sha256(parsed.data.token) },
  });

  if (
    !record ||
    record.type !== "EMAIL_VERIFY" ||
    record.usedAt ||
    record.expiresAt.getTime() <= Date.now()
  ) {
    return apiError(
      "invalid_token",
      "This verification link is invalid or has expired. Sign in and request a new one.",
      400,
    );
  }

  await db.$transaction([
    db.user.update({
      where: { id: record.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    db.verificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    db.auditEvent.create({
      data: { userId: record.userId, type: "auth.email_verified" },
    }),
  ]);

  return json({ ok: true });
}
