"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { authCopy } from "@/content/product";
import { requestJson } from "@/lib/client-api";
import { signupSchema } from "@/lib/validation";

const signupFormSchema = signupSchema
  .extend({
    confirmPassword: z.string().min(1, "Repeat your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type SignupValues = z.input<typeof signupFormSchema>;

type SignupResponse = {
  ok: true;
  user: {
    id: string;
    name: string;
    email: string;
    referralCode: string;
    emailVerified: boolean;
  };
  referralRecognised: boolean | null;
  verificationEmailSent: boolean;
  devVerifyUrl?: string;
};

export function SignupForm({ defaultReferral = "" }: { defaultReferral?: string }) {
  const [formError, setFormError] = useState<string | null>(null);
  const [created, setCreated] = useState<SignupResponse | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: defaultReferral,
      acceptTerms: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const result = await requestJson<SignupResponse>("/api/auth/register", {
      method: "POST",
      body: {
        name: values.name,
        email: values.email,
        password: values.password,
        referralCode: values.referralCode,
        acceptTerms: values.acceptTerms,
      },
    });

    if (!result.ok) {
      setFormError(result.message);
      if (result.fields) {
        for (const [key, message] of Object.entries(result.fields)) {
          setError(key as keyof SignupValues, { message });
        }
      }
      return;
    }

    setCreated(result.data);
  });

  if (created) {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand-soft/60 p-4 dark:border-lime/25 dark:bg-lime/10">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand dark:text-lime" aria-hidden="true" />
          <div>
            <p className="text-[13.5px] font-semibold text-ink">Your account is ready.</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
              {created.verificationEmailSent
                ? "We sent a confirmation link to your inbox. You can start exploring now; verification keeps account recovery working."
                : "You can start exploring now. Email delivery is not configured on this server, so use the development link below to confirm your address."}
            </p>
          </div>
        </div>

        {created.devVerifyUrl ? (
          <Alert tone="warning" title="Development verification link">
            <Link
              href={created.devVerifyUrl}
              className="break-all font-semibold underline underline-offset-2"
            >
              {created.devVerifyUrl}
            </Link>
          </Alert>
        ) : null}

        {created.referralRecognised ? (
          <p className="flex items-center gap-2 text-[12px] text-muted">
            <MailCheck className="h-3.5 w-3.5 text-brand dark:text-lime" aria-hidden="true" />
            Your invite code was recognised.
          </p>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2">
          <ButtonLink href="/dashboard" size="lg">
            {authCopy.verify.dashboard}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/match-lab" variant="outline" size="lg">
            Open the Match Lab
          </ButtonLink>
        </div>

        <p className="text-center text-[12.5px] text-muted">
          You can request another verification email from your{" "}
          <Link href="/dashboard/account" className="font-semibold text-brand underline underline-offset-2 dark:text-lime">
            account page
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {formError ? <Alert tone="error">{formError}</Alert> : null}

      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
      </Field>

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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          hint="10+ characters, with a letter and a number."
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Choose a password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
        </Field>

        <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
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
      </div>

      <Field
        label="Invite code"
        htmlFor="referralCode"
        error={errors.referralCode?.message}
        hint="Optional. If a friend shared a link, it is already filled in."
      >
        <Input
          id="referralCode"
          autoComplete="off"
          placeholder="VVXXXXXX"
          aria-invalid={errors.referralCode ? true : undefined}
          aria-describedby={errors.referralCode ? "referralCode-error" : undefined}
          {...register("referralCode")}
        />
      </Field>

      <Checkbox
        id="acceptTerms"
        error={errors.acceptTerms?.message}
        label={
          <>
            I agree to the{" "}
            <Link
              href="/terms"
              onClick={(event) => event.stopPropagation()}
              className="font-semibold text-brand underline underline-offset-2 dark:text-lime"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              onClick={(event) => event.stopPropagation()}
              className="font-semibold text-brand underline underline-offset-2 dark:text-lime"
            >
              Privacy notice
            </Link>
            .
          </>
        }
        {...register("acceptTerms")}
      />

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? authCopy.signup.submitting : authCopy.signup.submit}
        {!isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </Button>

      <p className="text-center text-[12.5px] text-muted">
        {authCopy.signup.hasAccount}{" "}
        <Link href="/login" className="font-semibold text-brand underline underline-offset-2 dark:text-lime">
          {authCopy.signup.signIn}
        </Link>
      </p>
    </form>
  );
}
