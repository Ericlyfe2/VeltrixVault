import type { Metadata } from "next";
import { Check, FlaskConical, ShieldCheck, Sigma } from "lucide-react";
import { MatchLabForm } from "@/components/analytics/match-lab-form";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { matchLabPage } from "@/content/product";
import { buildPrediction, publicPrediction } from "@/lib/analysis";
import { getSessionUser } from "@/lib/auth/session";
import { getLeaguesForModel } from "@/lib/queries";
import type { PredictionResult } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Match Lab",
  description:
    "Run an independent-Poisson football model on any fixture in the public dataset. Expected goals, result probabilities, over/under, both teams to score, and top scorelines.",
};

type SearchParams = Promise<{
  competition?: string | string[];
  home?: string | string[];
  away?: string | string[];
}>;

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function MatchLabPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [leagues, user] = await Promise.all([getLeaguesForModel(), getSessionUser()]);

  const requestedCompetition = single(params.competition);
  const league = leagues.find((entry) => entry.id === requestedCompetition) ?? leagues[0];
  const competitionId = league?.id ?? "";
  const homeId = single(params.home) ?? "";
  const awayId = single(params.away) ?? "";

  const validHome = league?.teams.some((team) => team.id === homeId) ? homeId : "";
  const validAway = league?.teams.some((team) => team.id === awayId) ? awayId : "";

  let initialPrediction: PredictionResult | null = null;

  if (competitionId && validHome && validAway && validHome !== validAway) {
    try {
      initialPrediction = publicPrediction(
        await buildPrediction(competitionId, validHome, validAway),
      );
    } catch {
      initialPrediction = null;
    }
  }

  const query = new URLSearchParams();
  if (competitionId) query.set("competition", competitionId);
  if (validHome) query.set("home", validHome);
  if (validAway) query.set("away", validAway);
  const nextPath = query.size > 0 ? `/match-lab?${query.toString()}` : "/match-lab";

  return (
    <>
      <PageHero
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Match Lab" }]}
        eyebrow={matchLabPage.eyebrow}
        title={
          <>
            One fixture.{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-brand dark:text-lime">
              The full distribution.
            </span>
          </>
        }
        copy={matchLabPage.copy}
        aside={
          <div className="card-vv p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-muted">Inside the lab</p>
              <Badge tone="lime">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                inspectable
              </Badge>
            </div>
            <ul className="mt-4 space-y-3">
              {[
                "Expected goals for each side",
                "Win, draw, and loss probabilities",
                "Over 2.5, under 2.5, and both teams to score",
                "The five most likely scorelines",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-muted">
                  <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-[10.5px] text-muted">
              <Sigma className="h-3.5 w-3.5 text-brand dark:text-lime" aria-hidden="true" />
              Model v1.0 · roughly 40 requests per minute
            </div>
          </div>
        }
      />

      <section className="container-vv py-10 md:py-14">
        <Reveal>
          <MatchLabForm
            leagues={leagues}
            signedIn={Boolean(user)}
            loginHref={`/login?next=${encodeURIComponent(nextPath)}`}
            initialPrediction={initialPrediction}
            initialCompetitionId={competitionId}
            initialHomeId={validHome}
            initialAwayId={validAway}
          />
        </Reveal>

        <Reveal>
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-paper-2/45 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-muted">
              <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand dark:text-lime" aria-hidden="true" />
              The Match Lab is free and does not require an account. Sign in only when you want to save
              an output with your notes.
            </p>
            <Badge tone="outline" className="shrink-0">
              No tips · no deposits · no commissions
            </Badge>
          </div>
        </Reveal>
      </section>
    </>
  );
}
