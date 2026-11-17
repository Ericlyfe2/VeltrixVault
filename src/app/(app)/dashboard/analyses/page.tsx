import type { Metadata } from "next";
import { ArrowRight, FlaskConical, Sparkles } from "lucide-react";
import { AnalysisCard } from "@/components/dashboard/analysis-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ButtonLink } from "@/components/ui/button-link";
import { dashboardCopy } from "@/content/product";
import { requireUser } from "@/lib/auth/guard";
import { getUserAnalyses } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Saved analyses",
};

export default async function AnalysesPage() {
  const user = await requireUser("/dashboard/analyses");
  const analyses = await getUserAnalyses(user.id);

  return (
    <>
      <DashboardHeader
        eyebrow={dashboardCopy.analyses.eyebrow}
        title={dashboardCopy.analyses.title}
        copy={dashboardCopy.analyses.copy}
        actions={
          <>
            <ButtonLink href="/match-lab" size="sm">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              {dashboardCopy.analyses.newAnalysis}
            </ButtonLink>
            <ButtonLink href="/analytics" variant="outline" size="sm">
              Browse leagues
            </ButtonLink>
          </>
        }
      />

      {analyses.length > 0 ? (
        <>
          <p className="mb-4 flex items-center gap-2 text-[11.5px] text-muted">
            <span className="mono rounded-full border border-line bg-paper-2 px-2 py-0.5 font-semibold text-ink">
              {analyses.length}
            </span>
            {analyses.length === 1 ? "saved analysis" : "saved analyses"} · newest first
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {analyses.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-paper-2/45 p-4 text-[11.5px] leading-relaxed text-muted">
            Each card keeps the probabilities and scoreline from the moment you saved it. Open an
            analysis to see the full frozen snapshot, or re-run the fixture in the Match Lab for a
            fresh output.
          </div>
        </>
      ) : (
        <div className="card-vv flex flex-col items-start p-7 sm:p-9">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-[22px] font-bold tracking-tight text-ink">
            Nothing saved yet.
          </h2>
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted">
            {dashboardCopy.analyses.empty}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href="/match-lab" size="sm">
              Open the Match Lab
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/analytics" variant="outline" size="sm">
              Explore the leagues
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  );
}
