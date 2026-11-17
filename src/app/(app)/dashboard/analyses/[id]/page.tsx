import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  FlaskConical,
  Info,
  ShieldCheck,
  StickyNote,
} from "lucide-react";
import { DeleteAnalysisButton } from "@/components/dashboard/delete-analysis-button";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { TeamMonogram } from "@/components/ui/team-monogram";
import { requireUser } from "@/lib/auth/guard";
import { getAnalysisDetail } from "@/lib/dashboard";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const user = await requireUser(`/dashboard/analyses/${id}`);
  const analysis = await getAnalysisDetail(user.id, id);

  return {
    title: analysis?.title ?? "Saved analysis",
    robots: { index: false, follow: false },
  };
}

export default async function AnalysisDetailPage({ params }: Params) {
  const { id } = await params;
  const user = await requireUser(`/dashboard/analyses/${id}`);
  const analysis = await getAnalysisDetail(user.id, id);

  if (!analysis) notFound();

  const homeName = analysis.home?.shortName ?? "Home";
  const awayName = analysis.away?.shortName ?? "Away";
  const competition = analysis.competition;

  const rerunQuery = new URLSearchParams({
    competition: analysis.competitionId,
    home: analysis.homeTeamId,
    away: analysis.awayTeamId,
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/analyses"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All saved analyses
        </Link>
        <div className="flex items-center gap-2">
          <DeleteAnalysisButton id={analysis.id} redirectTo="/dashboard/analyses" />
          <ButtonLink
            href={`/match-lab?${rerunQuery.toString()}`}
            size="sm"
            variant="outline"
          >
            <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
            Re-run fixture
          </ButtonLink>
        </div>
      </div>

      <header className="mb-7 border-b border-line pb-7">
        <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand dark:bg-lime" />
          <span className="eyebrow text-muted">Saved analysis</span>
          <Badge tone="lime">
            <Bookmark className="h-3 w-3" aria-hidden="true" />
            snapshot
          </Badge>
        </div>
        <h1 className="font-display text-[clamp(28px,4vw,40px)] font-bold leading-[1.05] tracking-[-0.035em] text-ink balance">
          {analysis.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Saved {formatDate(analysis.createdAt)}
          </span>
          {competition ? (
            <Link
              href={`/analytics/${competition.id}`}
              className="inline-flex items-center gap-1 font-semibold text-brand hover:underline dark:text-lime"
            >
              {competition.name} · {competition.season}
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Independent Poisson · v1.0
          </span>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr] xl:items-start">
        <div className="space-y-5">
          <section aria-labelledby="snapshot-heading" className="card-vv overflow-hidden">
            <div className="border-b border-line bg-card-2/70 px-5 py-3">
              <p className="eyebrow text-muted">The matchup</p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                <TeamSide team={analysis.home} align="left" />
                <div className="text-center">
                  <p className="eyebrow mb-2 text-muted">Expected goals</p>
                  <p className="mono text-[26px] font-semibold leading-none tracking-tight text-ink sm:text-[34px]">
                    {analysis.expectedHome.toFixed(2)}
                    <span className="mx-1.5 text-muted/50 sm:mx-2">–</span>
                    {analysis.expectedAway.toFixed(2)}
                  </p>
                  <p className="mt-2 text-[10.5px] text-muted">model output, not a score prediction</p>
                </div>
                <TeamSide team={analysis.away} align="right" />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-line bg-paper-2/50 px-4 py-3">
                <span className="eyebrow text-muted">Most likely scoreline at save time</span>
                <span className="mono rounded-lg border border-line bg-card px-2.5 py-1 text-[13px] font-semibold text-ink">
                  {analysis.scoreline}
                </span>
              </div>

              <div className="mt-7 grid gap-6 md:grid-cols-2">
                <div>
                  <h2 id="snapshot-heading" className="eyebrow mb-3 text-muted">
                    Match result
                  </h2>
                  <div className="space-y-3">
                    <ProbabilityBar
                      label={`${homeName} win`}
                      value={analysis.homeWin}
                      tone="brand"
                      emphasis
                    />
                    <ProbabilityBar label="Draw" value={analysis.draw} tone="gold" />
                    <ProbabilityBar label={`${awayName} win`} value={analysis.awayWin} tone="coral" />
                  </div>
                </div>

                <div>
                  <h2 className="eyebrow mb-3 text-muted">Goals markets</h2>
                  <div className="space-y-3">
                    <ProbabilityBar label="Over 2.5 goals" value={analysis.over25} tone="sky" />
                    <ProbabilityBar
                      label="Under 2.5 goals"
                      value={1 - analysis.over25}
                      tone="violet"
                    />
                    <ProbabilityBar label="Both teams to score" value={analysis.btts} tone="lime" />
                  </div>
                </div>
              </div>
            </div>

            <footer className="border-t border-line px-5 py-3 text-[10.5px] leading-relaxed text-muted">
              Statistical estimate for analysis and education. Not betting advice, and no outcome is
              guaranteed.
            </footer>
          </section>

          <section aria-labelledby="notes-heading" className="card-vv p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-brand dark:text-lime" aria-hidden="true" />
              <h2 id="notes-heading" className="font-display text-[16px] font-bold text-ink">
                Your notes
              </h2>
            </div>
            {analysis.notes ? (
              <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-muted">
                {analysis.notes}
              </p>
            ) : (
              <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                No notes were attached when this analysis was saved. Re-run the fixture to save a new
                snapshot with notes.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section aria-labelledby="context-heading" className="card-vv p-5">
            <p className="eyebrow text-muted">Context</p>
            <h2 id="context-heading" className="mt-1 font-display text-[17px] font-bold text-ink">
              Follow the thread.
            </h2>

            <ul className="mt-4 space-y-2">
              {[
                analysis.home ? { team: analysis.home, label: homeName } : null,
                analysis.away ? { team: analysis.away, label: awayName } : null,
              ]
                .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
                .map((entry) => (
                  <li key={entry.team.id}>
                    <Link
                      href={`/teams/${entry.team.id}`}
                      className="flex items-center gap-2.5 rounded-xl border border-line bg-paper-2/45 px-3 py-2.5 hover:border-line-strong hover:bg-paper-2"
                    >
                      <TeamMonogram
                        name={entry.team.name}
                        monogram={entry.team.monogram}
                        color={entry.team.color}
                        size="sm"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] font-semibold text-ink">
                          {entry.label}
                        </span>
                        <span className="mono block text-[10px] text-muted">
                          {entry.team.points} pts · {entry.team.played} played
                        </span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
            </ul>

            {competition ? (
              <Link
                href={`/analytics/${competition.id}`}
                className="mt-3 inline-flex w-full items-center justify-between gap-2 rounded-xl border border-line px-3 py-2.5 text-[12px] font-semibold text-brand hover:border-line-strong dark:text-lime"
              >
                Full {competition.name} table
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ) : null}
          </section>

          <section className="rounded-2xl border border-gold/30 bg-gold/8 p-4">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <p className="text-[12px] font-semibold text-ink">A frozen snapshot.</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                  These values are stored exactly as they were when you saved the analysis. League
                  standings and the model&apos;s inputs may have changed since. Re-run the fixture for a
                  current output.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow text-muted">Next step</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            Compare this snapshot with a fresh run on the same fixture.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/match-lab?${rerunQuery.toString()}`} size="sm">
            Re-run in the Match Lab
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/dashboard/analyses" variant="outline" size="sm">
            Back to the list
          </ButtonLink>
        </div>
      </div>
    </>
  );
}

function TeamSide({
  team,
  align,
}: {
  team: NonNullable<Awaited<ReturnType<typeof getAnalysisDetail>>>["home"];
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-2 ${
        align === "right" ? "items-end text-right" : "items-start text-left"
      }`}
    >
      {team ? (
        <TeamMonogram
          name={team.name}
          monogram={team.monogram}
          color={team.color}
          size="lg"
          className="hidden sm:inline-flex"
        />
      ) : null}
      <div className="min-w-0 max-w-full">
        <p className="truncate font-display text-[14px] font-bold leading-tight text-ink sm:text-[16px]">
          {team?.shortName ?? "Unknown team"}
        </p>
        <p className="mono mt-0.5 text-[10.5px] text-muted">
          {team ? `${team.played} played · ${team.points} pts` : "No context available"}
        </p>
      </div>
    </div>
  );
}
