import "server-only";
import { getSessionUser } from "@/lib/auth/session";

export async function requireApiUser() {
  const user = await getSessionUser();
  return user;
}
