"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { dashboardCopy } from "@/content/product";
import { requestJson } from "@/lib/client-api";

const formSchema = z.object({
  password: z.string().min(1, "Enter your current password to confirm."),
  confirm: z
    .boolean()
    .refine((value) => value, "Tick the box to confirm you understand this is permanent."),
});

type FormValues = z.input<typeof formSchema>;

export function DeleteAccountForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirm: false },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const result = await requestJson<{ ok: true }>("/api/account", {
      method: "DELETE",
      body: { password: values.password },
    });

    if (!result.ok) {
      setFormError(result.message);
      if (result.fields?.password) {
        setError("password", { message: result.fields.password });
      }
      return;
    }

    router.push("/");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="flex items-start gap-3 rounded-2xl border border-coral/25 bg-coral/8 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-coral" aria-hidden="true" />
        <div>
          <p className="text-[13px] font-semibold text-ink">This cannot be undone.</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{dashboardCopy.account.dangerCopy}</p>
        </div>
      </div>

      {formError ? <Alert tone="error">{formError}</Alert> : null}

      <Field label="Current password" htmlFor="delete-password" error={errors.password?.message}>
        <Input
          id="delete-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "delete-password-error" : undefined}
          {...register("password")}
        />
      </Field>

      <Checkbox
        id="delete-confirm"
        label="I understand that my account, saved analyses, watchlist, and referrals will be deleted."
        error={errors.confirm?.message}
        {...register("confirm")}
      />

      <Button type="submit" variant="danger" loading={isSubmitting} disabled={isSubmitting}>
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? dashboardCopy.account.deleting : dashboardCopy.account.deleteSubmit}
      </Button>
    </form>
  );
}
