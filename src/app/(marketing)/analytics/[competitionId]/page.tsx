import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Database, FlaskConical, Goal, Home, ShieldAlert, Table2 } from "lucide-react";
import { LeagueTable } from "@/components/analytics/league-table";
import { MatchList } from "@/components/analytics/match-list";
import { StatCard } from "@/components/analytics/stat-card";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { leaguePage } from "@/content/product";
import { getCompetition, getCompetitionAnalytics } from "@/lib/queries";
import { formatDate, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ competitionId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { competitionId } = await params;
  const competition = await getCompetition(competitionId);

  if (!competition) {
    return { title: "Competition not found" };
  }

  return {
    title: `${competition.name} ${competition.season}`,
    description: `League table, scoring profile, and recent results for ${competition.name} ${competition.season}, recomputed from ${competition._count.matches} public-data matches.`,
  };
}

export default async function CompetitionPage({ params }: Params) {
  const { competitionId } = await params;
  const analytics = await getCompetitionAnalytics(competitionId);

  if (!analytics) notFound();

  const { competition, matches, stats } = analytics;
  const latest = stats.lastDate ? formatDate(stats.lastDate) : "unknown";
  const shownResults = Math.min(12, matches.length);

  return (
    <>
      <PageHero
        breadcrumb={[
          { href: "/analytics", label: "League explorer" },
          { label: `${competition.name} ${competition.season}` },
        ]}
        eyebrow={leaguePage.eyebrow}
        title={
          <>
            {competition.name},{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-brand dark:text-lime">
              {competition.season}.
            </span>
          </>
        }
        copy={`${formatNumber(stats.matches)} finished matches, ${competition.teams.length} teams, and ${formatNumber(stats.goals)} goals in the current snapshot. Latest result: ${latest}.`}
        aside={
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Matches"
              value={formatNumber(stats.matches)}
              icon={<Table2 className="h-4 w-4" />}
            />
            <StatCard
              label="Goals / match"
              value={stats.goalsPerMatch.toFixed(2)}
              icon={<Goal className="h-4 w-4" />}
              tone="brand"
            />
            <StatCard
              label="Home wins"
              value={`${(stats.homeWinRate * 100).toFixed(0)}%`}
              icon={<Home className="h-4 w-4" />}
            />
            <StatCard
              label="Clean sheets"
              value={`${(stats.cleanSheetRate * 100).toFixed(0)}%`}
              icon={<ShieldAlert className="h-4 w-4" />}
              tone="gold"
            />
          </div>
        }
      />

      <section className="container-vv py-14 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="min-w-0">
            <Reveal>
              <SectionHeading
                eyebrow={leaguePage.table.eyebrow}
                title={leaguePage.table.title}
                copy={leaguePage.table.copy}
                titleClassName="text-[clamp(28px,3.6vw,42px)]"
              />
            </Reveal>
            <Reveal delay={0.06} className="mt-7">
              <LeagueTable teams={competition.teams} />
            </Reveal>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
              <span>P played · W D L · GF GA · GD · Pts</span>
              <span className="h-1 w-1 rounded-full bg-line-strong" aria-hidden="true" />
              <span>Tap a team to open its profile.</span>
            </p>
          </div>

          <aside className="space-y-4">
            <Reveal delay={0.08}>
              <div className="card-vv p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow text-muted">{leaguePage.profile.eyebrow}</p>
                  <Badge tone="outline">{competition.countryCode}</Badge>
                </div>
                <h2 className="mt-2 font-display text-[20px] font-bold tracking-tight text-ink">
                  {leaguePage.profile.title}
                </h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                  {leaguePage.profile.copy}
                </p>

                <div className="mt-5 space-y-4">
                  <ProbabilityBar label="Home win" value={stats.homeWinRate} tone="brand" emphasis />
                  <ProbabilityBar label="Draw" value={stats.drawRate} tone="gold" />
                  <ProbabilityBar label="Away win" value={stats.awayWinRate} tone="coral" />
                </div>

                <dl className="mt-5 space-y-2.5 border-t border-line pt-4">
                  {[
                    { term: "Matches", detail: formatNumber(stats.matches) },
                    { term: "Goals", detail: formatNumber(stats.goals) },
                    { term: "Goals per match", detail: stats.goalsPerMatch.toFixed(2) },
                    {
                      term: "Clean-sheet matches",
                      detail: `${Math.round(stats.cleanSheetRate * 100)}%`,
                    },
                    { term: "Latest result", detail: latest },
                  ].map((row) => (
                    <div key={row.term} className="flex items-baseline justify-between gap-3">
                      <dt className="text-[11.5px] text-muted">{row.term}</dt>
                      <dd className="mono text-[11.5px] font-semibold text-ink">{row.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-3xl border border-gold/30 bg-gold/10 p-5">
                <Database className="h-5 w-5 text-gold" aria-hidden="true" />
                <h2 className="mt-3 font-display text-[15px] font-bold text-ink">
                  {leaguePage.coverage.title}
                </h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                  {leaguePage.coverage.copy}
                </p>
                <p className="mono mt-3 text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  {competition.isComplete ? "Marked complete" : "Not marked complete"}
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2/35">
        <div className="container-vv py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <Reveal>
              <SectionHeading
                eyebrow={leaguePage.results.eyebrow}
                title={leaguePage.results.title}
                copy={leaguePage.results.copy}
                titleClassName="text-[clamp(28px,3.6vw,42px)]"
              />
              <p className="mt-4 text-[11.5px] text-muted">
                Showing the {shownResults} most recent of {formatNumber(matches.length)} finished
                matches.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <ButtonLink href={`/match-lab?competition=${competition.id}`} size="sm">
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  {leaguePage.cta.label}
                </ButtonLink>
                <ButtonLink href="/analytics" variant="outline" size="sm">
                  All competitions
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <MatchList matches={matches} limit={12} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-vv py-14 md:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-brand px-6 py-10 text-on-brand md:px-10 md:py-12">
            <div className="stripe-brand pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="display max-w-xl text-[clamp(26px,3.4vw,40px)] text-on-brand balance">
                  {leaguePage.cta.title}
                </h2>
                <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-on-brand/75">
                  {leaguePage.cta.copy}
                </p>
              </div>
              <ButtonLink
                href={`/match-lab?competition=${competition.id}`}
                variant="lime"
                size="lg"
                className="w-full md:w-auto"
              >
                {leaguePage.cta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
            {competition.source} results
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Goal className="h-3.5 w-3.5" aria-hidden="true" />
            {formatNumber(stats.goals)} goals
          </span>
          <Link href="/methodology" className="font-semibold text-brand underline underline-offset-4 dark:text-lime">
            How the table is built
          </Link>
        </div>
      </section>
    </>
  );
}
