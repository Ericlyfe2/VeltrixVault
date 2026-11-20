import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Database, Goal, Layers, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { StatCard } from "@/components/analytics/stat-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getPublicCompetitionOverviews,
  getPublicDatasetOverview,
} from "@/lib/public-data";
import { formatDate, formatNumber } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "League explorer",
  description:
    "Browse public-data league tables, home and away splits, recent form, and result coverage across six competition seasons.",
};

const accentStyles: Record<string, string> = {
  lime: "bg-brand",
  coral: "bg-coral",
  gold: "bg-gold",
  sky: "bg-sky",
  violet: "bg-violet",
};

export default async function AnalyticsPage() {
  const [overview, competitions] = await Promise.all([
    getPublicDatasetOverview(),
    getPublicCompetitionOverviews(),
  ]);

  const seasons = [...new Set(competitions.map((competition) => competition.season))].sort(
    (a, b) => b.localeCompare(a),
  );

  return (
    <>
      <PageHero
        eyebrow="League explorer"
        title={
          <>
            Every table,{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-brand dark:text-lime">
              recomputed.
            </span>
          </>
        }
        copy="Open any competition to see the full table, the results behind it, and the scoring profile of the league. Coverage is reported honestly: match counts and latest dates are always visible."
        aside={
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Competitions" value={overview.competitions} icon={<Layers className="h-4 w-4" />} />
            <StatCard label="Teams" value={overview.teams} icon={<ShieldAlert className="h-4 w-4" />} />
            <StatCard label="Matches" value={formatNumber(overview.matches)} icon={<CalendarClock className="h-4 w-4" />} />
            <StatCard label="Goals" value={formatNumber(overview.goals)} icon={<Goal className="h-4 w-4" />} tone="brand" />
          </div>
        }
      />

      <section className="container-vv py-14 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Browse by season"
            title="Six competition seasons."
            copy="Tables use three points for a win and are ordered by points, goal difference, then goals scored."
            titleClassName="text-[clamp(30px,4vw,46px)]"
          />
          <ButtonLink href="/methodology" variant="outline" size="sm">
            How tables are built
          </ButtonLink>
        </div>

        <div className="space-y-12">
          {seasons.map((season) => {
            const seasonCompetitions = competitions.filter(
              (competition) => competition.season === season,
            );

            return (
              <div key={season}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="mono text-[12px] font-semibold uppercase tracking-[0.14em] text-ink">
                    {season}
                  </h2>
                  <span className="h-px flex-1 bg-line" />
                  <span className="mono text-[10.5px] text-muted">
                    {seasonCompetitions.length} league{seasonCompetitions.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {seasonCompetitions.map((competition, index) => (
                    <Reveal key={competition.id} delay={index * 0.04}>
                      <Link
                        href={`/analytics/${competition.id}`}
                        className="group card-vv flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--vv-shadow)]"
                      >
                        <div
                          className={`h-1 w-full ${accentStyles[competition.accent] ?? "bg-brand"}`}
                          aria-hidden="true"
                        />
                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="mono text-[10px] uppercase tracking-[0.16em] text-muted">
                                {competition.countryCode} · {competition.country}
                              </p>
                              <h3 className="mt-1.5 font-display text-[21px] font-bold tracking-tight text-ink">
                                {competition.name}
                              </h3>
                            </div>
                            <Badge tone={competition.season === season ? "muted" : "outline"}>
                              {competition.season}
                            </Badge>
                          </div>

                          <dl className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-paper-2/55 p-3">
                            <div>
                              <dt className="text-[9.5px] uppercase tracking-wide text-muted">Matches</dt>
                              <dd className="mono mt-1 text-[15px] font-semibold text-ink">
                                {formatNumber(competition.stats.matches)}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[9.5px] uppercase tracking-wide text-muted">Goals/game</dt>
                              <dd className="mono mt-1 text-[15px] font-semibold text-ink">
                                {competition.stats.goalsPerMatch.toFixed(2)}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[9.5px] uppercase tracking-wide text-muted">Teams</dt>
                              <dd className="mono mt-1 text-[15px] font-semibold text-ink">
                                {competition.stats.teams}
                              </dd>
                            </div>
                          </dl>

                          <div className="mt-4 flex-1">
                            <p className="text-[9.5px] uppercase tracking-wide text-muted">Top three</p>
                            <ol className="mt-2 space-y-1.5">
                              {competition.teams.slice(0, 3).map((team, rank) => (
                                <li key={team.id} className="flex items-center gap-2 text-[12.5px]">
                                  <span className="mono w-4 text-[10px] text-muted">{rank + 1}</span>
                                  <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: team.color }}
                                    aria-hidden="true"
                                  />
                                  <span className="min-w-0 flex-1 truncate text-ink">{team.shortName}</span>
                                  <span className="mono text-[11px] font-semibold text-muted">
                                    {team.points} pts
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
                            <span className="text-[10.5px] text-muted">
                              Latest {competition.stats.lastDate ? formatDate(competition.stats.lastDate) : "—"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand dark:text-lime">
                              Open
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-14 flex flex-col gap-4 rounded-3xl border border-gold/30 bg-gold/10 p-5 sm:flex-row sm:items-start sm:p-6">
            <Database className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <div>
              <h2 className="font-display text-[16px] font-bold text-ink">Coverage caveat</h2>
              <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-muted">
                OpenFootball archives vary in completeness. Some competitions have missing fixtures, and
                the 2026/27 Premier League snapshot covers only the opening weeks. No league is marked
                complete in this release. Match counts and latest dates are shown on every card so you can
                judge the sample before running the model.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
