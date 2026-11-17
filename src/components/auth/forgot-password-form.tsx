"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { authCopy } from "@/content/product";
import { requestJson } from "@/lib/client-api";
import { forgotPasswordSchema } from "@/lib/validation";

type ForgotValues = z.input<typeof forgotPasswordSchema>;

type ForgotResponse = {
  ok: true;
  message: string;
  devResetUrl?: string;
};

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState<ForgotResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await requestJson<ForgotResponse>("/api/auth/forgot-password", {
      method: "POST",
      body: values,
    });

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    setSent(result.data);
  });

  if (sent) {
    return (
      <div className="space-y-4">
        <Alert tone="success" title="Check your inbox">
          {sent.message}
        </Alert>

        {sent.devResetUrl ? (
          <Alert tone="warning" title="Development reset link">
            <Link href={sent.devResetUrl} className="break-all font-semibold underline underline-offset-2">
              {sent.devResetUrl}
            </Link>
          </Alert>
        ) : null}

        <p className="text-[12.5px] leading-relaxed text-muted">
          The link expires in one hour and can only be used once. If it does not arrive, check spam or try
          again in a few minutes.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand underline underline-offset-2 dark:text-lime"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {authCopy.forgot.back}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {formError ? <Alert tone="error">{formError}</Alert> : null}

      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
      </Field>

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? authCopy.forgot.submitting : authCopy.forgot.submit}
        {!isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </Button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-[13px] font-semibold text-brand underline underline-offset-2 dark:text-lime"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {authCopy.forgot.back}
      </Link>
    </form>
  );
}
