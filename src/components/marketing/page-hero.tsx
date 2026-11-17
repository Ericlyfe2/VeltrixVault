import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function PageHero({
  eyebrow,
  title,
  copy,
  breadcrumb,
  aside,
  compact = false,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: ReactNode;
  breadcrumb?: Array<{ href?: string; label: string }>;
  aside?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper-2/45">
      <div className="grid-paper pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />
      <div
        className="halo-lime pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] opacity-40 blur-2xl"
        aria-hidden="true"
      />
      <div
        className={`container-vv relative ${compact ? "py-10 md:py-14" : "py-14 md:py-20"}`}
      >
        {breadcrumb ? (
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[11.5px] text-muted">
            {breadcrumb.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1.5">
                {index > 0 ? <ChevronRight className="h-3 w-3 text-muted/60" aria-hidden="true" /> : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        <div className={aside ? "grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]" : ""}>
          <Reveal>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand dark:bg-lime" />
              <span className="eyebrow text-muted">{eyebrow}</span>
            </div>
            <h1 className="display max-w-3xl text-[clamp(38px,6vw,76px)] text-ink balance">
              {title}
            </h1>
            {copy ? (
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted md:text-[16.5px]">
                {copy}
              </p>
            ) : null}
          </Reveal>
          {aside ? <Reveal delay={0.08}>{aside}</Reveal> : null}
        </div>
      </div>
    </section>
  );
}
