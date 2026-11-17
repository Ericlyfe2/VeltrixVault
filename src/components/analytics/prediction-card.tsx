import type { ReactNode } from "react";
import { Info, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { TeamMonogram } from "@/components/ui/team-monogram";
import { formatPercent } from "@/lib/utils";
import type { PredictionResult } from "@/types";

export function PredictionCard({
  data,
  actions,
  compact = false,
  className = "",
}: {
  data: PredictionResult;
  actions?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  const { prediction, home, away, competition } = data;

  return (
    <article className={`card-vv overflow-hidden ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-card-2/70 px-4 py-3 sm:px-6">
        <p className="eyebrow text-muted">
          {competition.name} · {competition.season}
        </p>
        <Badge tone="lime">
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Poisson estimate
        </Badge>
      </header>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          <TeamSide team={home} align="left" />

          <div className="text-center">
            <p className="eyebrow mb-2 text-muted">Expected goals</p>
            <p className="mono text-[26px] font-semibold leading-none tracking-tight text-ink sm:text-[34px]">
              {prediction.expectedHome.toFixed(2)}
              <span className="mx-1.5 text-muted/50 sm:mx-2">–</span>
              {prediction.expectedAway.toFixed(2)}
            </p>
            <p className="mt-2 text-[10.5px] text-muted">model output, not a score prediction</p>
          </div>

          <TeamSide team={away} align="right" />
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-3 text-muted">Match result</p>
            <div className="space-y-3">
              <ProbabilityBar label={`${home.shortName} win`} value={prediction.homeWin} tone="brand" emphasis />
              <ProbabilityBar label="Draw" value={prediction.draw} tone="gold" />
              <ProbabilityBar label={`${away.shortName} win`} value={prediction.awayWin} tone="coral" />
            </div>
          </div>

          <div>
            <p className="eyebrow mb-3 text-muted">Goals markets</p>
            <div className="space-y-3">
              <ProbabilityBar label="Over 2.5 goals" value={prediction.over25} tone="sky" />
              <ProbabilityBar label="Under 2.5 goals" value={prediction.under25} tone="violet" />
              <ProbabilityBar label="Both teams to score" value={prediction.btts} tone="lime" />
            </div>
          </div>
        </div>

        {!compact ? (
          <div className="mt-7 rounded-2xl border border-line bg-paper-2/55 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="eyebrow text-muted">Most likely scorelines</p>
              <span className="mono text-[11px] text-muted">
                avg {prediction.averageGoals.toFixed(2)} goals
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {prediction.topScorelines.map((line) => (
                <div
                  key={`${line.home}-${line.away}`}
                  className="flex min-w-[74px] items-center justify-between gap-2 rounded-xl border border-line bg-card px-3 py-2"
                >
                  <span className="mono text-[13px] font-semibold text-ink">
                    {line.home}–{line.away}
                  </span>
                  <span className="mono text-[11px] text-muted">{formatPercent(line.probability)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {prediction.lowSample ? (
          <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-gold">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Small sample: these teams have played only {prediction.sampleMatches} matches combined, so
            rates are pulled strongly toward the league average.
          </p>
        ) : null}

        {actions ? <div className="mt-6 flex flex-wrap gap-2">{actions}</div> : null}
      </div>

      <footer className="border-t border-line px-4 py-3 text-[10.5px] leading-relaxed text-muted sm:px-6">
        {data.model.name} v{data.model.version}. {data.model.disclosure}
      </footer>
    </article>
  );
}

function TeamSide({
  team,
  align,
}: {
  team: PredictionResult["home"];
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-2 ${
        align === "right" ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <TeamMonogram
        name={team.name}
        monogram={team.monogram}
        color={team.color}
        size="lg"
        className="hidden sm:inline-flex"
      />
      <div className="min-w-0 max-w-full">
        <p className="truncate font-display text-[14px] font-bold leading-tight text-ink sm:text-[16px]">
          {team.shortName}
        </p>
        <p className="mono mt-0.5 text-[10.5px] text-muted">
          {team.played} played · {team.points} pts
        </p>
      </div>
    </div>
  );
}
