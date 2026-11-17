import { db } from "@/lib/db";
import { randomToken, sha256 } from "@/lib/auth/password";
import { sendPasswordResetEmail } from "@/lib/mail";
import { forgotPasswordSchema, fieldErrors } from "@/lib/validation";
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
import { recordAudit } from "@/lib/audit";
import { env } from "@/lib/env";

const RESET_TTL_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const limit = rateLimit(`forgot:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  const parsed = forgotPasswordSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("invalid_input", "Enter a valid email address.", 422, fieldErrors(parsed.error));
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  let devResetUrl: string | undefined;

  if (user) {
    await db.verificationToken.deleteMany({
      where: { userId: user.id, type: "PASSWORD_RESET", usedAt: null },
    });

    const token = randomToken(32);
    await db.verificationToken.create({
      data: {
        tokenHash: sha256(token),
        userId: user.id,
        type: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    });

    await sendPasswordResetEmail(user.email, user.name, token);
    await recordAudit("auth.password_reset_requested", { userId: user.id });

    if (!env.isProduction) {
      devResetUrl = `${env.appUrl}/reset-password?token=${encodeURIComponent(token)}`;
    }
  }

  return json({
    ok: true,
    message: "If an account exists for that email, a reset link is on its way.",
    ...(devResetUrl ? { devResetUrl } : {}),
  });
}
