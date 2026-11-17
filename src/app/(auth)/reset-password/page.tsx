import type { Metadata } from "next";
import Link from "next/link";
import { AuthHeading } from "@/components/auth/auth-heading";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Alert } from "@/components/ui/alert";
import { authCopy } from "@/content/product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your VeltrixVault account.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <div>
      <AuthHeading
        eyebrow={authCopy.reset.eyebrow}
        title={authCopy.reset.title}
        copy={authCopy.reset.copy}
      />
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-4">
          <Alert tone="error">{authCopy.reset.invalid}</Alert>
          <Link
            href="/forgot-password"
            className="inline-flex text-[13px] font-semibold text-brand underline underline-offset-2 dark:text-lime"
          >
            Request a new reset link
          </Link>
        </div>
      )}
    </div>
  );
}
