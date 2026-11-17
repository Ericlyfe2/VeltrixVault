import { cn } from "@/lib/utils";

export const buttonStyles = {
  base: "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:translate-y-px",
  variant: {
    primary:
      "bg-brand text-on-brand shadow-[0_10px_24px_-14px_rgba(7,60,43,0.8)] hover:bg-brand-deep hover:shadow-[0_14px_30px_-14px_rgba(7,60,43,0.85)] dark:hover:bg-lime dark:hover:text-[#0b1f18]",
    lime:
      "bg-lime text-[#0b1f18] shadow-[0_12px_28px_-16px_rgba(11,31,24,0.6)] hover:bg-lime-deep",
    outline:
      "border border-line-strong bg-transparent text-ink hover:border-brand hover:bg-brand-soft/60",
    soft: "bg-paper-2 text-ink hover:bg-line/60",
    ghost: "text-ink hover:bg-paper-2",
    danger: "bg-coral text-white hover:brightness-95",
    header:
      "bg-lime text-[#0b1f18] hover:bg-lime-deep shadow-[0_10px_24px_-16px_rgba(0,0,0,0.7)]",
    headerGhost:
      "border border-white/25 bg-white/5 text-header-ink hover:border-lime hover:bg-white/10",
  },
  size: {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-5 text-sm",
    lg: "h-13 px-6 text-[15px]",
  },
} as const;

export type ButtonVariant = keyof typeof buttonStyles.variant;
export type ButtonSize = keyof typeof buttonStyles.size;

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(buttonStyles.base, buttonStyles.variant[variant], buttonStyles.size[size], className);
}
