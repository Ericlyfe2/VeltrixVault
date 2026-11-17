import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const styles = {
  error: "border-coral/30 bg-coral/8 text-coral",
  success: "border-brand/25 bg-brand-soft/70 text-brand dark:text-lime",
  info: "border-sky/25 bg-sky/8 text-sky",
  warning: "border-gold/40 bg-gold/12 text-[#7a5208] dark:text-gold",
} as const;

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: keyof typeof styles;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-2xl border px-4 py-3 text-[13px] leading-relaxed", styles[tone], className)}
    >
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      {children}
    </div>
  );
}
