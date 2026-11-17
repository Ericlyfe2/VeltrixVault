"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { requestJson } from "@/lib/client-api";
import { changePasswordSchema } from "@/lib/validation";

const formSchema = changePasswordSchema
  .extend({
    confirmPassword: z.string().min(1, "Repeat your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type FormValues = z.input<typeof formSchema>;

export function ChangePasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSuccess(null);

    const result = await requestJson<{ ok: true; message: string }>("/api/auth/change-password", {
      method: "POST",
      body: { currentPassword: values.currentPassword, newPassword: values.newPassword },
    });

    if (!result.ok) {
      setFormError(result.message);
      if (result.fields) {
        for (const [key, message] of Object.entries(result.fields)) {
          if (key === "currentPassword" || key === "newPassword" || key === "confirmPassword") {
            setError(key, { message });
          }
        }
      }
      return;
    }

    reset();
    setSuccess(result.data.message);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {formError ? <Alert tone="error">{formError}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}

      <Field label="Current password" htmlFor="currentPassword" error={errors.currentPassword?.message}>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.currentPassword ? true : undefined}
          aria-describedby={errors.currentPassword ? "currentPassword-error" : undefined}
          {...register("currentPassword")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="New password"
          htmlFor="newPassword"
          error={errors.newPassword?.message}
          hint="10+ characters, with a letter and a number."
        >
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.newPassword ? true : undefined}
            aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
            {...register("newPassword")}
          />
        </Field>

        <Field label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? true : undefined}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            {...register("confirmPassword")}
          />
        </Field>
      </div>

      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Updating password" : "Update password"}
      </Button>
    </form>
  );
}
