"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { StatusScreen } from "@/components/layout/status-screen";
import { ButtonLink } from "@/components/ui/button-link";
import { errorCopy } from "@/content/product";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-white/10 bg-header">
        <div className="container-vv flex h-[72px] items-center">
          <Logo variant="onDark" />
        </div>
      </header>

      <main id="main" className="flex-1">
        <StatusScreen
          eyebrow={errorCopy.eyebrow}
          title={errorCopy.title}
          copy={errorCopy.copy}
          icon={<AlertTriangle className="h-7 w-7" aria-hidden="true" />}
        >
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-brand px-4 text-[13px] font-semibold text-on-brand transition-colors hover:bg-brand-deep"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {errorCopy.retry}
          </button>
          <ButtonLink href="/" variant="outline" size="sm">
            {errorCopy.home}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </StatusScreen>
      </main>
    </div>
  );
}
