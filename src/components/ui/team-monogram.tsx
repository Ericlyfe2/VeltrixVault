import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-8 w-8 rounded-[9px] text-[11px]",
  md: "h-10 w-10 rounded-[12px] text-[12px]",
  lg: "h-14 w-14 rounded-[17px] text-base",
  xl: "h-20 w-20 rounded-[24px] text-2xl",
} as const;

export function TeamMonogram({
  name,
  monogram,
  color,
  size = "md",
  className,
}: {
  name: string;
  monogram: string;
  color: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-display font-bold tracking-tight text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {monogram}
    </span>
  );
}
