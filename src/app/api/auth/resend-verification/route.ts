import { db } from "@/lib/db";
import { randomToken, sha256 } from "@/lib/auth/password";
import { sendVerificationEmail } from "@/lib/mail";
import { resendVerificationSchema, fieldErrors } from "@/lib/validation";
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

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const limit = rateLimit(`resend:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  const parsed = resendVerificationSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("invalid_input", "Enter a valid email address.", 422, fieldErrors(parsed.error));
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  let devVerifyUrl: string | undefined;

  if (user && !user.emailVerifiedAt) {
    const perUser = rateLimit(`resend:user:${user.id}`, { limit: 1, windowMs: 60 * 1000 });
    if (!perUser.ok) {
      return json({
        ok: true,
        message: "If that account needs verification, a new link has been sent.",
      });
    }

    await db.verificationToken.deleteMany({
      where: { userId: user.id, type: "EMAIL_VERIFY", usedAt: null },
    });

    const token = randomToken(32);
    await db.verificationToken.create({
      data: {
        tokenHash: sha256(token),
        userId: user.id,
        type: "EMAIL_VERIFY",
        expiresAt: new Date(Date.now() + VERIFY_TTL_MS),
      },
    });

    await sendVerificationEmail(user.email, user.name, token);
    await recordAudit("auth.verification_resent", { userId: user.id });

    if (!env.isProduction) {
      devVerifyUrl = `${env.appUrl}/verify-email?token=${encodeURIComponent(token)}`;
    }
  }

  return json({
    ok: true,
    message: "If that account needs verification, a new link has been sent.",
    ...(devVerifyUrl ? { devVerifyUrl } : {}),
  });
}
