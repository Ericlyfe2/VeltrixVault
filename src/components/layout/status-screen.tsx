import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatusScreen({
  eyebrow,
  title,
  copy,
  icon,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  icon: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container-vv flex min-h-[62vh] items-center justify-center py-16", className)}>
      <div className="w-full max-w-xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
          {icon}
        </span>
        <p className="eyebrow mt-6 text-muted">{eyebrow}</p>
        <h1 className="mt-2 font-display text-[clamp(30px,5vw,46px)] font-bold leading-[1.05] tracking-[-0.04em] text-ink balance">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">{copy}</p>
        {children ? <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div> : null}
      </div>
    </div>
  );
}
