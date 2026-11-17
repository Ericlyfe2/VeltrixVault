import { cn, formatPercent } from "@/lib/utils";

const tones = {
  brand: "bg-brand dark:bg-lime",
  lime: "bg-lime",
  gold: "bg-gold",
  coral: "bg-coral",
  muted: "bg-muted",
  sky: "bg-sky",
  violet: "bg-violet",
} as const;

export function ProbabilityBar({
  label,
  value,
  tone = "brand",
  emphasis = false,
  className,
}: {
  label: string;
  value: number;
  tone?: keyof typeof tones;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span
          className={cn(
            "text-[12px] font-medium",
            emphasis ? "text-ink" : "text-muted",
          )}
        >
          {label}
        </span>
        <span className={cn("mono text-[13px] font-semibold", emphasis ? "text-ink" : "text-muted")}>
          {formatPercent(value)}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-paper-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-label={label}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", tones[tone])}
          style={{ width: `${Math.max(1, value * 100)}%` }}
        />
      </div>
    </div>
  );
}
