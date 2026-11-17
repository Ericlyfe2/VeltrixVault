import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
  align = "left",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  copy?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start",
        action ? "md:flex-row md:items-end md:justify-between" : "",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" ? "mx-auto" : "")}>
        {eyebrow ? (
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand dark:bg-lime" />
            <span className="eyebrow text-muted">{eyebrow}</span>
          </div>
        ) : null}
        <h2
          className={cn(
            "display text-[clamp(32px,4.2vw,52px)] text-ink balance",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {copy ? (
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-muted md:text-base">
            {copy}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
