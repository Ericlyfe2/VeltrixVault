import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "default",
  href = "/",
  showWordmark = true,
}: {
  className?: string;
  variant?: "default" | "onDark";
  href?: string | null;
  showWordmark?: boolean;
}) {
  const content = (
    <>
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-lime shadow-[inset_0_0_0_1px_rgba(11,31,24,0.12)]">
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
          <path
            d="M9 10.5 20 29.5 31 10.5"
            fill="none"
            stroke="#0b1f18"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="9.5" r="2.4" fill="#0b1f18" />
          <circle cx="32.5" cy="8.2" r="1.6" fill="#0b1f18" opacity="0.45" />
        </svg>
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "font-display text-[21px] font-bold tracking-[-0.045em]",
            variant === "onDark" ? "text-header-ink" : "text-ink",
          )}
        >
          Veltrix<span className={variant === "onDark" ? "text-lime" : "text-brand"}>Vault</span>
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return <span className={cn("inline-flex items-center gap-2.5", className)}>{content}</span>;
  }

  return (
    <Link
      href={href}
      aria-label="VeltrixVault home"
      className={cn("inline-flex items-center gap-2.5 rounded-lg", className)}
    >
      {content}
    </Link>
  );
}
