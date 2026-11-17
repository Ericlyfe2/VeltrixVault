import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  lime: "bg-lime/25 text-brand border-lime-deep/40 dark:bg-lime/15 dark:text-lime",
  brand: "bg-brand-soft text-brand border-brand/20 dark:text-brand",
  muted: "bg-paper-2 text-muted border-line",
  coral: "bg-coral/10 text-coral border-coral/25",
  gold: "bg-gold/15 text-[#8a5a0a] border-gold/35 dark:text-gold",
  sky: "bg-sky/10 text-sky border-sky/25",
  violet: "bg-violet/10 text-violet border-violet/25",
  outline: "bg-transparent text-muted border-line-strong",
} as const;

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
