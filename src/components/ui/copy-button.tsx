"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  tone = "light",
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors",
        tone === "dark"
          ? "bg-white/10 text-header-ink hover:bg-white/20"
          : "bg-paper-2 text-ink hover:bg-line/70",
        className,
      )}
      aria-live="polite"
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      {copied ? copiedLabel : label}
    </button>
  );
}
