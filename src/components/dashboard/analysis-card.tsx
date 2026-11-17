import Link from "next/link";
import { ArrowUpRight, CalendarDays, StickyNote } from "lucide-react";
import { DeleteAnalysisButton } from "@/components/dashboard/delete-analysis-button";
import { TeamMonogram } from "@/components/ui/team-monogram";
import type { AnalysisWithContext } from "@/lib/dashboard";
import { formatDate, formatPercent } from "@/lib/utils";

export function AnalysisCard({ analysis }: { analysis: AnalysisWithContext }) {
  const homeName = analysis.home?.shortName ?? "Home";
  const awayName = analysis.away?.shortName ?? "Away";
  const competition = analysis.competition;

  return (
    <article className="card-vv group flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--vv-shadow-sm)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {competition ? `${competition.name} · ${competition.season}` : "Saved analysis"}
          </p>
          <h3 className="mt-1.5 truncate font-display text-[17px] font-bold tracking-tight text-ink">
            {analysis.title}
          </h3>
        </div>
        <span className="mono shrink-0 rounded-lg border border-line bg-paper-2 px-2 py-1 text-[10.5px] font-semibold text-muted">
          {analysis.scoreline}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        {analysis.home ? (
          <TeamMonogram name={analysis.home.name} monogram={analysis.home.monogram} color={analysis.home.color} size="sm" />
        ) : null}
        <span className="text-[12.5px] font-semibold text-ink">{homeName}</span>
        <span className="mono text-[10px] text-muted">vs</span>
        <span className="text-[12.5px] font-semibold text-ink">{awayName}</span>
        {analysis.away ? (
          <TeamMonogram name={analysis.away.name} monogram={analysis.away.monogram} color={analysis.away.color} size="sm" />
        ) : null}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-1.5">
        {[
          { label: `${homeName} win`, value: analysis.homeWin },
          { label: "Draw", value: analysis.draw },
          { label: `${awayName} win`, value: analysis.awayWin },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-line bg-paper-2/55 px-2 py-2">
            <dt className="truncate text-[9px] uppercase tracking-wide text-muted">{item.label}</dt>
            <dd className="mono mt-0.5 text-[12.5px] font-semibold text-ink">{formatPercent(item.value)}</dd>
          </div>
        ))}
      </dl>

      {analysis.notes ? (
        <p className="mt-3 flex items-start gap-2 text-[11.5px] leading-relaxed text-muted">
          <StickyNote className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="line-clamp-2">{analysis.notes}</span>
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
        <span className="inline-flex items-center gap-1.5 text-[10.5px] text-muted">
          <CalendarDays className="h-3 w-3" aria-hidden="true" />
          {formatDate(analysis.createdAt)}
        </span>
        <div className="flex items-center gap-1">
          <DeleteAnalysisButton id={analysis.id} />
          <Link
            href={`/dashboard/analyses/${analysis.id}`}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11.5px] font-semibold text-brand hover:bg-brand-soft/70 dark:text-lime dark:hover:bg-lime/10"
          >
            Open
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
