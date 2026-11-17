import type { Metadata } from "next";
import { AuthHeading } from "@/components/auth/auth-heading";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { authCopy } from "@/content/product";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a single-use password reset link for your VeltrixVault account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <AuthHeading
        eyebrow={authCopy.forgot.eyebrow}
        title={authCopy.forgot.title}
        copy={authCopy.forgot.copy}
      />
      <ForgotPasswordForm />
    </div>
  );
}
