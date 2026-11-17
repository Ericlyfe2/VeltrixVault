"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { authCopy } from "@/content/product";
import { requestJson } from "@/lib/client-api";

type State = "verifying" | "success" | "error";

export function VerifyEmailStatus({ token }: { token: string }) {
  const [state, setState] = useState<State>(token ? "verifying" : "error");
  const [message, setMessage] = useState<string>("");
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;

    requestJson<{ ok: true }>("/api/auth/verify-email", {
      method: "POST",
      body: { token },
    }).then((result) => {
      if (result.ok) {
        setState("success");
        return;
      }
      setState("error");
      setMessage(result.message);
    });
  }, [token]);

  if (state === "verifying") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper-2/60 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-brand dark:text-lime" aria-hidden="true" />
          <p className="text-[13.5px] text-muted" role="status">
            {authCopy.verify.verifying}
          </p>
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand-soft/60 p-4 dark:border-lime/25 dark:bg-lime/10">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand dark:text-lime" aria-hidden="true" />
          <div>
            <p className="text-[13.5px] font-semibold text-ink">Email confirmed.</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{authCopy.verify.success}</p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <ButtonLink href="/dashboard" size="lg">
            {authCopy.verify.dashboard}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/analytics" variant="outline" size="lg">
            Explore the leagues
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-2xl border border-coral/25 bg-coral/8 p-4">
        <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-coral" aria-hidden="true" />
        <div>
          <p className="text-[13.5px] font-semibold text-ink">We could not confirm this link.</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
            {message || authCopy.verify.error}
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <ButtonLink href="/login" size="lg">
          {authCopy.verify.signIn}
        </ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">
          {authCopy.verify.home}
        </ButtonLink>
      </div>

      <p className="text-center text-[12px] leading-relaxed text-muted">
        After signing in, open your{" "}
        <Link href="/dashboard/account" className="font-semibold text-brand underline underline-offset-2 dark:text-lime">
          account page
        </Link>{" "}
        to request a fresh verification email.
      </p>
    </div>
  );
}
