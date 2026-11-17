"use client";

import Link from "next/link";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { dashboardCopy } from "@/content/product";
import { requestJson } from "@/lib/client-api";

type ResendResponse = {
  ok: true;
  message: string;
  devVerifyUrl?: string;
};

export function ResendVerificationButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resend() {
    setLoading(true);
    setError(null);
    const response = await requestJson<ResendResponse>("/api/auth/resend-verification", {
      method: "POST",
      body: { email },
    });
    setLoading(false);

    if (!response.ok) {
      setError(response.message);
      return;
    }

    setResult(response.data);
  }

  return (
    <div className="space-y-3">
      <Button type="button" variant="outline" onClick={resend} loading={loading} disabled={loading}>
        {loading ? dashboardCopy.account.resending : dashboardCopy.account.resend}
      </Button>

      {error ? <Alert tone="error">{error}</Alert> : null}

      {result ? (
        <Alert tone="success" title="Request received">
          <span className="flex items-start gap-2">
            <MailCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {result.message}
          </span>
        </Alert>
      ) : null}

      {result?.devVerifyUrl ? (
        <Alert tone="warning" title="Development verification link">
          <Link href={result.devVerifyUrl} className="break-all font-semibold underline underline-offset-2">
            {result.devVerifyUrl}
          </Link>
        </Alert>
      ) : null}
    </div>
  );
}
