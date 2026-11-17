import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { loginSchema, fieldErrors } from "@/lib/validation";
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

const DUMMY_HASH =
  "scrypt$16384$8$1$00000000000000000000000000000000$" +
  "0".repeat(128);

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const ip = getClientIp(request);
  const body = await readJson(request);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("invalid_input", "Please check the highlighted fields.", 422, fieldErrors(parsed.error));
  }

  const { email, password, remember } = parsed.data;
  const limit = rateLimit(`login:${ip}:${email}`, { limit: 8, windowMs: 15 * 60 * 1000 });
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  const user = await db.user.findUnique({ where: { email } });
  const valid = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword(password, DUMMY_HASH);

  if (!user || !valid) {
    await recordAudit("auth.login_failed", { userId: user?.id ?? null, meta: { ip } });
    return apiError("invalid_credentials", "Email or password is incorrect.", 401);
  }

  await createSession(user.id, {
    remember,
    userAgent: request.headers.get("user-agent"),
    ipHash: getIpHash(request),
  });

  await recordAudit("auth.login", { userId: user.id });

  return json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      emailVerified: Boolean(user.emailVerifiedAt),
    },
  });
}
