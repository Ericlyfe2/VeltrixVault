import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FlaskConical, GitCompareArrows, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { MatchList } from "@/components/analytics/match-list";
import { WatchlistButton } from "@/components/analytics/watchlist-button";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { FormPills } from "@/components/ui/form-pills";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TeamMonogram } from "@/components/ui/team-monogram";
import { teamPage } from "@/content/product";
import { isFollowingTeam } from "@/lib/dashboard";
import { getTeamProfile } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth/session";
import { formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ teamId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { teamId } = await params;
  const profile = await getTeamProfile(teamId);

  if (!profile) return { title: "Team not found" };

  return {
    title: `${profile.team.name} — ${profile.competition?.name ?? "Team profile"}`,
    description: `Record, home and away splits, recent form, and results for ${profile.team.name} in ${profile.competition?.name ?? "the current snapshot"}.`,
  };
}

export default async function TeamPage({ params }: Params) {
  const { teamId } = await params;
  const [profile, user] = await Promise.all([getTeamProfile(teamId), getSessionUser()]);

  if (!profile) notFound();

  const { team, competition, position, teamCount, recentMatches, split } = profile;
  const signedIn = Boolean(user);
  const following = user ? await isFollowingTeam(user.id, team.id) : false;
  const goalDifference = team.goalsFor - team.goalsAgainst;

  const splitRows = [
    {
      label: teamPage.splits.home,
      icon: ShieldCheck,
      ...split.home,
    },
    {
      label: teamPage.splits.away,
      icon: TrendingUp,
      ...split.away,
    },
  ];

  return (
    <>
      <PageHero
        breadcrumb={[
          { href: "/analytics", label: "League explorer" },
          ...(competition
            ? [{ href: `/analytics/${competition.id}`, label: competition.name }]
            : []),
          { label: team.shortName },
        ]}
        eyebrow={teamPage.eyebrow}
        title={
          <>
            {team.name}{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-brand dark:text-lime">
              in numbers.
            </span>
          </>
        }
        copy={
          competition
            ? `${competition.name} ${competition.season} · ${team.played} matches played · ${team.points} points. The record is recomputed from finished results in the public snapshot.`
            : "A profile built from the finished matches in the public snapshot."
        }
        aside={
          <div className="space-y-4">
            <div className="card-vv p-5">
              <div className="flex items-center gap-4">
                <TeamMonogram
                  name={team.name}
                  monogram={team.monogram}
                  color={team.color}
                  size="xl"
                />
                <div className="min-w-0">
                  <p className="eyebrow text-muted">
                    {teamCount > 0 ? `Position ${position} of ${teamCount}` : "Season record"}
                  </p>
                  <p className="mono mt-1.5 text-[30px] font-semibold leading-none tracking-tight text-ink">
                    {team.points}
                    <span className="ml-1 text-[13px] font-normal text-muted">pts</span>
                  </p>
                  <p className="mt-1 text-[11.5px] text-muted">
                    {team.wins}W · {team.draws}D · {team.losses}L
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <WatchlistButton
                  teamId={team.id}
                  initialFollowing={following}
                  signedIn={signedIn}
                  loginHref={`/login?next=${encodeURIComponent(`/teams/${team.id}`)}`}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="brand">{formatPercent(profile.pointsPerMatch, 2)} pts/match</Badge>
              <Badge tone="muted">{team.goalsFor} goals for</Badge>
              <Badge tone={goalDifference >= 0 ? "lime" : "coral"}>
                {goalDifference >= 0 ? "+" : ""}
                {goalDifference} GD
              </Badge>
            </div>
          </div>
        }
      />

      <section className="container-vv py-14 md:py-20">
        <Reveal>
          <SectionHeading
            eyebrow={teamPage.record.eyebrow}
            title={teamPage.record.title}
            copy={teamPage.record.copy}
            titleClassName="text-[clamp(28px,3.6vw,42px)]"
          />
        </Reveal>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Position", value: position > 0 ? `${position}` : "—", hint: competition ? competition.name : undefined },
            { label: "Played", value: team.played, hint: `${team.wins}W · ${team.draws}D · ${team.losses}L` },
            { label: "Goals for", value: team.goalsFor, hint: `${profile.goalsPerMatch.toFixed(2)} per match` },
            { label: "Goals against", value: team.goalsAgainst, hint: `${profile.concededPerMatch.toFixed(2)} per match` },
          ].map((item, index) => (
            <Reveal key={item.label} delay={index * 0.04}>
              <div className="card-vv h-full p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{item.label}</p>
                <p className="mono mt-2 text-[28px] font-semibold leading-none tracking-tight text-ink">
                  {item.value}
                </p>
                {item.hint ? <p className="mt-2 text-[11px] text-muted">{item.hint}</p> : null}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="card-vv p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow text-muted">{teamPage.splits.title}</p>
                  <h2 className="mt-1 font-display text-[20px] font-bold tracking-tight text-ink">
                    Home and away, separated.
                  </h2>
                </div>
                <GitCompareArrows className="h-5 w-5 text-muted" aria-hidden="true" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {splitRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="rounded-2xl border border-line bg-paper-2/45 p-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-brand dark:text-lime" aria-hidden="true" />
                        <p className="text-[12px] font-semibold text-ink">{row.label}</p>
                      </div>
                      <p className="mono mt-3 text-[24px] font-semibold leading-none text-ink">
                        {row.wins}
                        <span className="mx-1 text-muted/50">–</span>
                        {row.draws}
                        <span className="mx-1 text-muted/50">–</span>
                        {row.losses}
                      </p>
                      <p className="mt-1 text-[10.5px] text-muted">{row.played} played</p>

                      <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
                        <div>
                          <dt className="text-[9.5px] uppercase tracking-wide text-muted">
                            {teamPage.splits.goalsFor}
                          </dt>
                          <dd className="mono mt-0.5 text-[13px] font-semibold text-ink">{row.goalsFor}</dd>
                        </div>
                        <div>
                          <dt className="text-[9.5px] uppercase tracking-wide text-muted">
                            {teamPage.splits.goalsAgainst}
                          </dt>
                          <dd className="mono mt-0.5 text-[13px] font-semibold text-ink">{row.goalsAgainst}</dd>
                        </div>
                        <div>
                          <dt className="text-[9.5px] uppercase tracking-wide text-muted">
                            {teamPage.splits.perMatch}
                          </dt>
                          <dd className="mono mt-0.5 text-[13px] font-semibold text-ink">
                            {row.played > 0 ? (row.goalsFor / row.played).toFixed(2) : "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[9.5px] uppercase tracking-wide text-muted">Conceded / match</dt>
                          <dd className="mono mt-0.5 text-[13px] font-semibold text-ink">
                            {row.played > 0 ? (row.goalsAgainst / row.played).toFixed(2) : "—"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="card-vv flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow text-muted">{teamPage.form.title}</p>
                  <h2 className="mt-1 font-display text-[20px] font-bold tracking-tight text-ink">
                    Last five results.
                  </h2>
                </div>
                <Target className="h-5 w-5 text-muted" aria-hidden="true" />
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{teamPage.form.copy}</p>

              <div className="mt-5">
                <FormPills form={team.form} />
              </div>

              <div className="mt-auto border-t border-line pt-4">
                <p className="mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  {competition ? `${competition.name} · ${competition.season}` : "Public snapshot"}
                </p>
                {competition ? (
                  <Link
                    href={`/analytics/${competition.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline dark:text-lime"
                  >
                    Back to the full table
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2/35">
        <div className="container-vv py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <Reveal>
              <SectionHeading
                eyebrow="Results"
                title={teamPage.results.title}
                copy={teamPage.results.copy}
                titleClassName="text-[clamp(28px,3.6vw,42px)]"
              />
              <div className="mt-6">
                <ButtonLink
                  href={`/match-lab?competition=${team.competitionId}`}
                  size="sm"
                >
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  {teamPage.cta.label}
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <MatchList matches={recentMatches} limit={8} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-vv py-14 md:py-20">
        <Reveal>
          <div className="flex flex-col gap-5 rounded-3xl border border-line bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="eyebrow text-muted">Next step</p>
              <h2 className="mt-2 font-display text-[24px] font-bold tracking-tight text-ink">
                {teamPage.cta.title}
              </h2>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">{teamPage.cta.copy}</p>
            </div>
            <ButtonLink href={`/match-lab?competition=${team.competitionId}`} className="shrink-0">
              {teamPage.cta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
