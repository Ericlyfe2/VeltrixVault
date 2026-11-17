import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { createUniqueReferralCode, normaliseReferralCode } from "@/lib/referral";
import { signupSchema, fieldErrors } from "@/lib/validation";
import {
  apiError,
  forbiddenCrossOrigin,
  getClientIp,
  getIpHash,
  isSameOrigin,
  json,
  rateLimitResponse,
  readJson,
} from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { recordAudit } from "@/lib/audit";
import { sendVerificationEmail } from "@/lib/mail";
import { randomToken, sha256 } from "@/lib/auth/password";
import { env } from "@/lib/env";

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const ip = getClientIp(request);
  const limit = rateLimit(`register:${ip}`, { limit: 6, windowMs: 15 * 60 * 1000 });
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  const body = await readJson(request);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("invalid_input", "Please check the highlighted fields.", 422, fieldErrors(parsed.error));
  }

  const { name, email, password } = parsed.data;
  const suppliedCode = normaliseReferralCode(parsed.data.referralCode);

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return apiError("email_in_use", "An account with this email already exists.", 409, {
      email: "An account with this email already exists.",
    });
  }

  const referrer = suppliedCode
    ? await db.user.findUnique({ where: { referralCode: suppliedCode } })
    : null;

  const [passwordHash, referralCode] = await Promise.all([
    hashPassword(password),
    createUniqueReferralCode(),
  ]);

  const user = await db.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { name, email, passwordHash, referralCode },
    });

    if (referrer && referrer.id !== created.id) {
      await tx.referral.create({
        data: {
          referrerId: referrer.id,
          refereeId: created.id,
          code: suppliedCode!,
        },
      });
      await tx.auditEvent.create({
        data: {
          userId: referrer.id,
          type: "referral.attributed",
          meta: JSON.stringify({ refereeId: created.id, code: suppliedCode }),
        },
      });
    }

    await tx.auditEvent.create({
      data: { userId: created.id, type: "auth.registered" },
    });

    return created;
  });

  const verifyToken = randomToken(32);
  await db.verificationToken.create({
    data: {
      tokenHash: sha256(verifyToken),
      userId: user.id,
      type: "EMAIL_VERIFY",
      expiresAt: new Date(Date.now() + VERIFY_TTL_MS),
    },
  });

  const mailDelivered = await sendVerificationEmail(user.email, user.name, verifyToken);

  if (suppliedCode && !referrer) {
    await recordAudit("referral.invalid", { userId: user.id, meta: { code: suppliedCode } });
  }

  await createSession(user.id, {
    userAgent: request.headers.get("user-agent"),
    ipHash: getIpHash(request),
  });

  return json(
    {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        emailVerified: false,
      },
      referralApplied: Boolean(referrer),
      referralRecognised: suppliedCode ? Boolean(referrer) : null,
      verificationEmailSent: mailDelivered,
      ...(env.isProduction
        ? {}
        : { devVerifyUrl: `${env.appUrl}/verify-email?token=${encodeURIComponent(verifyToken)}` }),
    },
    201,
  );
}
