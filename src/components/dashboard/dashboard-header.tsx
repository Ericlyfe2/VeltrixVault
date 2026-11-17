import type { ReactNode } from "react";

export function DashboardHeader({
  eyebrow,
  title,
  copy,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-line pb-7 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand dark:bg-lime" />
          <span className="eyebrow text-muted">{eyebrow}</span>
        </div>
        <h1 className="font-display text-[clamp(28px,4vw,40px)] font-bold leading-[1.05] tracking-[-0.035em] text-ink balance">
          {title}
        </h1>
        {copy ? <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{copy}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
