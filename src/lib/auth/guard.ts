import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";

export async function requireUser(next = "/dashboard") {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return user;
}
