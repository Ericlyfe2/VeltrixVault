import { destroySession, getSessionUser } from "@/lib/auth/session";
import { forbiddenCrossOrigin, isSameOrigin, json } from "@/lib/http";
import { recordAudit } from "@/lib/audit";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const user = await getSessionUser();
  await destroySession();

  if (user) {
    await recordAudit("auth.logout", { userId: user.id });
  }

  return json({ ok: true });
}
