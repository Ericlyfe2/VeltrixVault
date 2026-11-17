import { getSessionUser } from "@/lib/auth/session";
import { json } from "@/lib/http";

export async function GET() {
  const user = await getSessionUser();

  if (!user) return json({ user: null });

  return json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      emailVerified: Boolean(user.emailVerifiedAt),
    },
  });
}
