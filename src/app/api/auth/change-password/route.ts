import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroyAllSessions } from "@/lib/auth/session";
import { requireApiUser } from "@/lib/auth/api";
import { changePasswordSchema, fieldErrors } from "@/lib/validation";
import {
  apiError,
  forbiddenCrossOrigin,
  getIpHash,
  isSameOrigin,
  json,
  readJson,
} from "@/lib/http";
import { recordAudit } from "@/lib/audit";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const user = await requireApiUser();
  if (!user) return apiError("unauthorized", "Sign in to continue.", 401);

  const parsed = changePasswordSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("invalid_input", "Please check the highlighted fields.", 422, fieldErrors(parsed.error));
  }

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return apiError("invalid_credentials", "Your current password is incorrect.", 401, {
      currentPassword: "Your current password is incorrect.",
    });
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await db.user.update({ where: { id: user.id }, data: { passwordHash } });
  await destroyAllSessions(user.id);
  await createSession(user.id, {
    userAgent: request.headers.get("user-agent"),
    ipHash: getIpHash(request),
  });
  await recordAudit("auth.password_changed", { userId: user.id });

  return json({ ok: true, message: "Password updated. Other sessions were signed out." });
}
