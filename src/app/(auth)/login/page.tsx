import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthHeading } from "@/components/auth/auth-heading";
import { LoginForm } from "@/components/auth/login-form";
import { authCopy } from "@/content/product";
import { getSessionUser } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your VeltrixVault workspace.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  const user = await getSessionUser();

  if (user) redirect(safeNextPath(next));

  return (
    <div>
      <AuthHeading
        eyebrow={authCopy.login.eyebrow}
        title={authCopy.login.title}
        copy={authCopy.login.copy}
      />
      <LoginForm next={next} />
    </div>
  );
}
