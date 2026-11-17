"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Field, Input } from "@/components/ui/field";
import { authCopy } from "@/content/product";
import { requestJson } from "@/lib/client-api";
import { passwordSchema } from "@/lib/validation";

const resetFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Repeat your new password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type ResetValues = z.input<typeof resetFormSchema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await requestJson<{ ok: true }>("/api/auth/reset-password", {
      method: "POST",
      body: { token, password: values.password },
    });

    if (!result.ok) {
      setFormError(result.message);
      if (result.fields) {
        for (const [key, message] of Object.entries(result.fields)) {
          if (key === "password" || key === "confirmPassword") {
            setError(key, { message });
          }
        }
      }
      return;
    }

    setDone(true);
  });

  if (done) {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand-soft/60 p-4 dark:border-lime/25 dark:bg-lime/10">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand dark:text-lime" aria-hidden="true" />
          <div>
            <p className="text-[13.5px] font-semibold text-ink">Password updated.</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
              Other sessions were signed out. Sign in with your new password to continue.
            </p>
          </div>
        </div>

        <ButtonLink href="/login" size="lg" className="w-full">
          {authCopy.verify.signIn}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {formError ? <Alert tone="error">{formError}</Alert> : null}

      <Field
        label="New password"
        htmlFor="password"
        error={errors.password?.message}
        hint="At least 10 characters, including a letter and a number."
      >
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Choose a new password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
      </Field>

      <Field label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat it"
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          {...register("confirmPassword")}
        />
      </Field>

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? authCopy.reset.submitting : authCopy.reset.submit}
        {!isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </Button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-[13px] font-semibold text-brand underline underline-offset-2 dark:text-lime"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {authCopy.reset.back}
      </Link>
    </form>
  );
}
