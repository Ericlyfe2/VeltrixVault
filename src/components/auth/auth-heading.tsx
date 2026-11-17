import type { ReactNode } from "react";

export function AuthHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: ReactNode;
}) {
  return (
    <div className="mb-7">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-brand dark:bg-lime" />
        <span className="eyebrow text-muted">{eyebrow}</span>
      </div>
      <h1 className="display text-[clamp(30px,4.5vw,42px)] text-ink balance">{title}</h1>
      {copy ? <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{copy}</p> : null}
    </div>
  );
}
