import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bookmark, FlaskConical, ShieldCheck, Sparkles, Table2, Users } from "lucide-react";
import { AnalysisCard } from "@/components/dashboard/analysis-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/analytics/stat-card";
import { FormPills } from "@/components/ui/form-pills";
import { TeamMonogram } from "@/components/ui/team-monogram";
import { ButtonLink } from "@/components/ui/button-link";
import { dashboardCopy } from "@/content/product";
import { requireUser } from "@/lib/auth/guard";
import { getDashboardSummary } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const summary = await getDashboardSummary(user.id);
  const firstName = user.name.split(" ")[0] || "there";

  return (
    <>
      <DashboardHeader
        eyebrow={dashboardCopy.overview.eyebrow}
        title={`Good to see you, ${firstName}.`}
        copy={dashboardCopy.overview.copy}
        actions={
          <>
            <ButtonLink href="/match-lab" size="sm">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Run a fixture
            </ButtonLink>
            <ButtonLink href="/dashboard/analyses" variant="outline" size="sm">
              Saved analyses
            </ButtonLink>
          </>
        }
      />

      {!user.emailVerifiedAt ? (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gold/35 bg-gold/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            <div>
              <p className="text-[13px] font-semibold text-ink">{dashboardCopy.verificationBanner.title}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
                {dashboardCopy.verificationBanner.copy}
              </p>
            </div>
          </div>
          <ButtonLink href="/dashboard/account" variant="outline" size="sm">
            {dashboardCopy.verificationBanner.action}
          </ButtonLink>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Saved analyses" value={summary.analyses} icon={<Bookmark className="h-4 w-4" />} tone="brand" />
        <StatCard label="Following" value={summary.watchlist} icon={<Table2 className="h-4 w-4" />} />
        <StatCard label="Invites joined" value={summary.referralCount} icon={<Users className="h-4 w-4" />} tone="gold" />
        <StatCard
          label="Email"
          value={user.emailVerifiedAt ? "Verified" : "Unverified"}
          icon={<ShieldCheck className="h-4 w-4" />}
          tone={user.emailVerifiedAt ? "brand" : "coral"}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <section aria-labelledby="recent-analyses">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-muted">The work</p>
              <h2 id="recent-analyses" className="mt-1 font-display text-[20px] font-bold tracking-tight text-ink">
                Recent analyses
              </h2>
            </div>
            <Link
              href="/dashboard/analyses"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline dark:text-lime"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {summary.recentAnalyses.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {summary.recentAnalyses.map((analysis) => (
                <AnalysisCard key={analysis.id} analysis={analysis} />
              ))}
            </div>
          ) : (
            <div className="card-vv flex flex-col items-start p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-[17px] font-bold text-ink">Your first analysis starts in the Match Lab.</h3>
              <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-muted">
                {dashboardCopy.analyses.empty}
              </p>
              <ButtonLink href="/match-lab" className="mt-4" size="sm">
                Open the Match Lab
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          )}
        </section>

        <section aria-labelledby="watchlist-preview">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-muted">Bookmarks</p>
              <h2 id="watchlist-preview" className="mt-1 font-display text-[20px] font-bold tracking-tight text-ink">
                Watchlist
              </h2>
            </div>
            <Link
              href="/dashboard/watchlist"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline dark:text-lime"
            >
              Manage
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {summary.watchlistItems.length > 0 ? (
            <ul className="card-vv divide-y divide-line overflow-hidden">
              {summary.watchlistItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/teams/${item.team.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-paper-2/60"
                  >
                    <TeamMonogram
                      name={item.team.name}
                      monogram={item.team.monogram}
                      color={item.team.color}
                      size="sm"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-semibold text-ink">{item.team.shortName}</span>
                      <span className="mono block text-[10px] text-muted">
                        {item.team.points} pts · {item.team.played} played
                      </span>
                    </span>
                    <FormPills form={item.team.form} label={false} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card-vv p-5">
              <p className="text-[13px] leading-relaxed text-muted">{dashboardCopy.watchlist.empty}</p>
              <ButtonLink href="/analytics" variant="outline" size="sm" className="mt-3">
                {dashboardCopy.watchlist.browse}
              </ButtonLink>
            </div>
          )}
        </section>
      </div>

      <section aria-labelledby="quick-actions" className="mt-10">
        <p className="eyebrow text-muted">{dashboardCopy.overview.shortcuts}</p>
        <h2 id="quick-actions" className="mt-1 font-display text-[20px] font-bold tracking-tight text-ink">
          Keep going.
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              href: "/match-lab",
              icon: FlaskConical,
              title: "Match Lab",
              copy: "Run a fixture and save the distribution.",
            },
            {
              href: "/analytics",
              icon: Table2,
              title: "League explorer",
              copy: "Browse tables and team records.",
            },
            {
              href: "/dashboard/invite",
              icon: Users,
              title: "Invite a friend",
              copy: "Share a free account, with no rewards attached.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="card-vv group flex items-start gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-line-strong"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-ink">{item.title}</span>
                  <span className="mt-0.5 block text-[11.5px] leading-relaxed text-muted">{item.copy}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
