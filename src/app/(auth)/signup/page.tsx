import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthHeading } from "@/components/auth/auth-heading";
import { SignupForm } from "@/components/auth/signup-form";
import { authCopy } from "@/content/product";
import { getSessionUser } from "@/lib/auth/session";
import { normaliseReferralCode } from "@/lib/referral";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create a free account",
  description: "Create a free VeltrixVault account to save analyses and follow teams.",
  robots: { index: false, follow: false },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string | string[]; referral?: string | string[] }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();

  if (user) redirect("/dashboard");

  const raw = typeof params.ref === "string" ? params.ref : typeof params.referral === "string" ? params.referral : "";
  const referral = normaliseReferralCode(raw) ?? "";

  return (
    <div>
      <AuthHeading
        eyebrow={authCopy.signup.eyebrow}
        title={authCopy.signup.title}
        copy={authCopy.signup.copy}
      />
      <SignupForm defaultReferral={referral} />
    </div>
  );
}
