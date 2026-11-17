import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  Database,
  Eye,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Table2,
} from "lucide-react";
import { PredictionCard } from "@/components/analytics/prediction-card";
import { LeagueTable } from "@/components/analytics/league-table";
import { MatchList } from "@/components/analytics/match-list";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { home } from "@/content/marketing";
import { site } from "@/content/site";
import { buildPrediction, publicPrediction } from "@/lib/analysis";
import {
  getCompetitions,
  getDatasetOverview,
  getDefaultCompetition,
  getRecentMatches,
} from "@/lib/queries";
import { formatDate, formatNumber } from "@/lib/utils";

export const revalidate = 3600;

const featureIcons = {
  table: Table2,
  flask: FlaskConical,
  vault: Bookmark,
  eye: Eye,
  book: BookOpen,
  shield: ShieldCheck,
} as const;

export default async function HomePage() {
  const [overview, competitions, competition] = await Promise.all([
    getDatasetOverview(),
    getCompetitions(),
    getDefaultCompetition(),
  ]);

  let snapshot = null;

  if (competition && competition.teams.length >= 2) {
    const [homeTeam, awayTeam] = competition.teams;
    try {
      snapshot = publicPrediction(
        await buildPrediction(competition.id, homeTeam.id, awayTeam.id),
      );
    } catch {
      snapshot = null;
    }
  }

  const recentMatches = competition ? await getRecentMatches(competition.id, 6) : [];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-paper pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div
          className="halo-lime pointer-events-none absolute -right-24 -top-32 h-[520px] w-[520px] opacity-45 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="halo-gold pointer-events-none absolute -bottom-40 -left-24 h-[380px] w-[380px] opacity-30 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-vv relative py-12 md:py-16 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-card/80 px-3 py-1.5 text-[11px] font-medium text-muted shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-brand dark:bg-lime" />
                </span>
                Public data · Latest result {overview.lastMatchDate ? formatDate(overview.lastMatchDate) : "—"}
              </div>

              <h1 className="display mt-6 text-[clamp(48px,7.4vw,92px)] text-ink balance">
                {home.hero.title}{" "}
                <span className="font-serif font-normal italic tracking-[-0.02em] text-brand dark:text-lime">
                  {home.hero.titleAccent}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-muted md:text-[17px]">
                {home.hero.copy}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href={home.hero.primaryCta.href} size="lg">
                  {home.hero.primaryCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={home.hero.secondaryCta.href} variant="outline" size="lg">
                  {home.hero.secondaryCta.label}
                </ButtonLink>
              </div>

              <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                {home.hero.trust.map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-[12px] font-medium text-muted">
                    <Check className="h-3.5 w-3.5 text-brand dark:text-lime" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-7 sm:grid-cols-4">
                {[
                  { label: "Competitions", value: overview.competitions },
                  { label: "Teams", value: overview.teams },
                  { label: "Matches", value: overview.matches },
                  { label: "Goals", value: overview.goals },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dd className="mono text-[24px] font-semibold leading-none tracking-tight text-ink">
                      {formatNumber(stat.value)}
                    </dd>
                    <dt className="mt-1.5 text-[10.5px] uppercase tracking-[0.14em] text-muted">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.1} className="relative">
              <div className="absolute -top-5 left-4 z-10 hidden -rotate-2 items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-[10.5px] font-semibold text-muted shadow-md sm:inline-flex">
                <Sparkles className="h-3 w-3 text-gold" aria-hidden="true" />
                Computed from the current snapshot
              </div>
              {snapshot ? (
                <PredictionCard data={snapshot} />
              ) : (
                <div className="card-vv p-8 text-center text-sm text-muted">
                  The model snapshot is unavailable until the dataset is seeded.
                </div>
              )}
              <p className="mt-3 px-1 text-[10.5px] leading-relaxed text-muted">
                Example fixture: the top two sides in {competition?.name ?? "the default league"}. Run any
                pairing in the Match Lab.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-card/60">
        <div className="container-vv flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
          <span className="eyebrow text-muted">In the Vault</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {competitions.map((item) => (
              <Link
                key={item.id}
                href={`/analytics/${item.id}`}
                className="group inline-flex items-center gap-2 text-[12px] font-semibold text-muted transition-colors hover:text-ink"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand/60 group-hover:bg-brand dark:bg-lime/60 dark:group-hover:bg-lime" />
                {item.name} {item.season}
                <span className="mono text-[10.5px] font-normal text-muted/70">
                  {item._count.matches}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-vv py-16 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow={home.features.eyebrow}
            title={home.features.title}
            copy={home.features.copy}
            action={
              <ButtonLink href="/signup" variant="outline">
                Create an account
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {home.features.items.map((feature, index) => {
            const Icon = featureIcons[feature.icon];
            return (
              <Reveal key={feature.title} delay={index * 0.04}>
                <article className="group h-full rounded-3xl border border-line bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--vv-shadow-sm)] sm:p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-on-brand dark:bg-lime/10 dark:text-lime dark:group-hover:bg-lime dark:group-hover:text-[#0b1f18]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-[18px] font-bold tracking-tight text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{feature.copy}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-header text-header-ink">
        <div className="container-vv py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                <span className="eyebrow text-lime">{home.workflow.eyebrow}</span>
              </div>
              <h2 className="display text-[clamp(34px,4.5vw,56px)] text-header-ink balance">
                {home.workflow.title}
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-header-ink/65">
                {home.workflow.copy}
              </p>
              <div className="mt-8">
                <ButtonLink href="/match-lab" variant="header">
                  Try the Match Lab
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>

            <ol className="space-y-3">
              {home.workflow.steps.map((step, index) => (
                <li
                  key={step.number}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[auto_1fr] sm:gap-5 sm:p-5"
                >
                  <span className="mono flex h-10 w-10 items-center justify-center rounded-full border border-lime/30 bg-lime/10 text-[12px] font-semibold text-lime">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-[16px] font-bold text-header-ink">{step.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-header-ink/60">{step.copy}</p>
                  </div>
                  {index < home.workflow.steps.length - 1 ? (
                    <span className="sr-only">Next step</span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {competition ? (
        <section className="container-vv py-16 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Live snapshot"
              title={`${competition.name}, ${competition.season}.`}
              copy={`${competition._count.matches} finished matches · ${competition._count.teams} teams. The table is recomputed from results, not copied from a feed.`}
              action={
                <ButtonLink href={`/analytics/${competition.id}`} variant="outline">
                  Open the full league
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              }
            />
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <Reveal>
              <LeagueTable teams={competition.teams} compact />
            </Reveal>
            <Reveal delay={0.08}>
              <MatchList matches={recentMatches} title="Latest results" limit={6} />
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="border-y border-line bg-paper-2/40">
        <div className="container-vv py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <Reveal>
              <SectionHeading eyebrow={home.model.eyebrow} title={home.model.title} copy={home.model.copy} />
              <div className="mt-8 space-y-4">
                {home.model.points.map((point) => (
                  <div key={point.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-[14px] font-semibold text-ink">{point.title}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">{point.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <ButtonLink href={home.model.cta.href} variant="outline">
                  {home.model.cta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-header text-header-ink shadow-[var(--vv-shadow)]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <span className="eyebrow text-lime">Model internals</span>
                  <span className="mono text-[10px] text-header-ink/45">v1.0</span>
                </div>
                <div className="space-y-4 p-5 font-mono text-[11.5px] leading-relaxed text-header-ink/70">
                  <div className="flex items-start gap-3">
                    <span className="mono w-5 shrink-0 text-right text-header-ink/35">1</span>
                    <p>
                      <span className="text-lime">homeAvg</span> = home goals ÷ home fixtures
                      <br />
                      <span className="text-lime">awayAvg</span> = away goals ÷ away fixtures
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mono w-5 shrink-0 text-right text-header-ink/35">2</span>
                    <p>
                      <span className="text-lime">rate</span> = (goals + 6 × avg) ÷ (matches + 6)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mono w-5 shrink-0 text-right text-header-ink/35">3</span>
                    <p>
                      <span className="text-lime">λhome</span> = homeAvg × attack<sub>h</sub> ×
                      defence<sub>a</sub>
                      <br />
                      <span className="text-lime">λaway</span> = awayAvg × attack<sub>a</sub> ×
                      defence<sub>h</sub>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mono w-5 shrink-0 text-right text-header-ink/35">4</span>
                    <p>
                      <span className="text-lime">P(h,a)</span> = Pois(h; λhome) × Pois(a; λaway)
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/10 px-4 py-3 text-[10px] leading-relaxed text-header-ink/40">
                  No proprietary ratings. No hidden weights. Every step is in the methodology.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-vv py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr]">
          <Reveal>
            <SectionHeading eyebrow={home.coverage.eyebrow} title={home.coverage.title} copy={home.coverage.copy} />
            <ul className="mt-7 space-y-3">
              {home.coverage.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-[13.5px] leading-relaxed text-muted">
                  <Database className="mt-0.5 h-4 w-4 shrink-0 text-brand dark:text-lime" aria-hidden="true" />
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href={home.coverage.cta.href} variant="outline">
                {home.coverage.cta.label}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card-vv p-6">
              <p className="eyebrow text-muted">Snapshot ledger</p>
              <dl className="mt-5 space-y-4">
                {[
                  { term: "Source", detail: site.dataSource.name },
                  { term: "Licence", detail: site.dataSource.license },
                  { term: "Latest result", detail: overview.lastMatchDate ? formatDate(overview.lastMatchDate) : "—" },
                  { term: "Matches indexed", detail: formatNumber(overview.matches) },
                  { term: "Goals indexed", detail: formatNumber(overview.goals) },
                ].map((row) => (
                  <div key={row.term} className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
                    <dt className="text-[12px] text-muted">{row.term}</dt>
                    <dd className="mono text-right text-[12px] font-semibold text-ink">{row.detail}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={site.dataSource.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold text-brand underline underline-offset-4 dark:text-lime"
              >
                Inspect the source archive
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2/35">
        <div className="container-vv py-16 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Straight answers"
              title="Questions worth asking."
              copy="If a football site cannot answer these plainly, keep your data somewhere else."
              align="center"
            />
          </Reveal>
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">
            {home.faq.map((item) => (
              <details key={item.question} className="group px-5 py-5 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-[14.5px] font-semibold text-ink">{item.question}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-transform group-open:rotate-45">
                    <span className="text-[16px] leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container-vv py-16 md:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-brand px-6 py-12 text-on-brand md:px-12 md:py-16">
            <div className="stripe-brand pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime/25 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                  <span className="eyebrow text-lime">{home.cta.eyebrow}</span>
                </div>
                <h2 className="display max-w-xl text-[clamp(32px,4.4vw,54px)] text-on-brand balance">
                  {home.cta.title}
                </h2>
                <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-on-brand/75">{home.cta.copy}</p>
              </div>
              <div className="flex flex-col gap-2.5 md:items-end">
                <ButtonLink href={home.cta.primary.href} variant="lime" size="lg" className="w-full md:w-auto">
                  {home.cta.primary.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink
                  href={home.cta.secondary.href}
                  variant="headerGhost"
                  size="lg"
                  className="w-full md:w-auto"
                >
                  {home.cta.secondary.label}
                </ButtonLink>
                <p className="mt-1 text-center text-[10.5px] text-on-brand/55 md:text-right">
                  Free account. No card. No deposit flow.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
