import { db } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/api";
import { verifyPassword } from "@/lib/auth/password";
import { destroySession } from "@/lib/auth/session";
import { deleteAccountSchema, fieldErrors } from "@/lib/validation";
import {
  apiError,
  forbiddenCrossOrigin,
  isSameOrigin,
  json,
  rateLimitResponse,
  readJson,
} from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { recordAudit } from "@/lib/audit";

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const user = await requireApiUser();
  if (!user) return apiError("unauthorized", "Sign in to continue.", 401);

  const limit = rateLimit(`account-delete:${user.id}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  const parsed = deleteAccountSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError(
      "invalid_input",
      "Enter your current password to confirm.",
      422,
      fieldErrors(parsed.error),
    );
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return apiError("invalid_credentials", "Your current password is incorrect.", 401, {
      password: "Your current password is incorrect.",
    });
  }

  await recordAudit("account.deleted", {
    userId: user.id,
    meta: { emailDomain: user.email.split("@")[1] ?? null },
  });

  await db.user.delete({ where: { id: user.id } });
  await destroySession();

  return json({ ok: true });
}
