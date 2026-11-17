"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { authCopy } from "@/content/product";
import { requestJson } from "@/lib/client-api";
import { loginSchema } from "@/lib/validation";
import { safeNextPath } from "@/lib/utils";

type LoginValues = z.input<typeof loginSchema>;

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await requestJson<{ ok: true }>("/api/auth/login", {
      method: "POST",
      body: values,
    });

    if (!result.ok) {
      setFormError(result.message);
      if (result.fields) {
        for (const [key, message] of Object.entries(result.fields)) {
          setError(key as keyof LoginValues, { message });
        }
      }
      return;
    }

    router.push(safeNextPath(next));
    router.refresh();
  });

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

      <Field
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
        hint={
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span>Your password is never stored in plain text.</span>
            <Link href="/forgot-password" className="font-semibold text-brand underline underline-offset-2 dark:text-lime">
              {authCopy.login.forgot}
            </Link>
          </span>
        }
      >
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
      </Field>

      <Checkbox
        id="remember"
        label="Keep me signed in on this device for 30 days"
        error={errors.remember?.message}
        {...register("remember")}
      />

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? authCopy.login.submitting : authCopy.login.submit}
        {!isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </Button>

      <p className="text-center text-[12.5px] text-muted">
        {authCopy.login.noAccount}{" "}
        <Link href="/signup" className="font-semibold text-brand underline underline-offset-2 dark:text-lime">
          {authCopy.login.create}
        </Link>
      </p>
    </form>
  );
}
