import type { Metadata } from "next";
import { AuthHeading } from "@/components/auth/auth-heading";
import { VerifyEmailStatus } from "@/components/auth/verify-email-status";
import { authCopy } from "@/content/product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Confirm the email address on your VeltrixVault account.",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <div>
      <AuthHeading eyebrow={authCopy.verify.eyebrow} title={authCopy.verify.title} />
      <VerifyEmailStatus token={token} />
    </div>
  );
}
