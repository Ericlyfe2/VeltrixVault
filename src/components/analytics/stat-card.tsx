import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "brand" | "gold" | "coral";
  icon?: ReactNode;
  className?: string;
}) {
  const tones = {
    default: "text-ink",
    brand: "text-brand dark:text-lime",
    gold: "text-gold",
    coral: "text-coral",
  } as const;

  return (
    <div className={cn("card-vv p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{label}</p>
        {icon ? <span className="text-muted/70">{icon}</span> : null}
      </div>
      <p className={cn("mono mt-2 text-[26px] font-semibold leading-none tracking-tight", tones[tone])}>
        {value}
      </p>
      {hint ? <p className="mt-2 text-[11px] leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}
