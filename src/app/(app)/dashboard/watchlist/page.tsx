import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookmarkX, Table2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RemoveWatchlistButton } from "@/components/dashboard/remove-watchlist-button";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { FormPills } from "@/components/ui/form-pills";
import { TeamMonogram } from "@/components/ui/team-monogram";
import { dashboardCopy } from "@/content/product";
import { requireUser } from "@/lib/auth/guard";
import { getWatchlist } from "@/lib/dashboard";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Watchlist",
};

export default async function WatchlistPage() {
  const user = await requireUser("/dashboard/watchlist");
  const items = await getWatchlist(user.id);

  const grouped = items.reduce<Record<string, typeof items>>((groups, item) => {
    const key = item.team.competitionId;
    groups[key] = groups[key] ? [...groups[key], item] : [item];
    return groups;
  }, {});

  return (
    <>
      <DashboardHeader
        eyebrow={dashboardCopy.watchlist.eyebrow}
        title={dashboardCopy.watchlist.title}
        copy={dashboardCopy.watchlist.copy}
        actions={
          <ButtonLink href="/analytics" size="sm">
            <Table2 className="h-4 w-4" aria-hidden="true" />
            {dashboardCopy.watchlist.browse}
          </ButtonLink>
        }
      />

      {items.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(grouped).map(([competitionId, group]) => {
            const competition = group[0]?.team.competition;
            return (
              <section key={competitionId} aria-labelledby={`competition-${competitionId}`}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2
                      id={`competition-${competitionId}`}
                      className="font-display text-[17px] font-bold tracking-tight text-ink"
                    >
                      {competition?.name ?? "Competition"}
                    </h2>
                    {competition ? <Badge tone="muted">{competition.season}</Badge> : null}
                  </div>
                  <Link
                    href={`/analytics/${competitionId}`}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline dark:text-lime"
                  >
                    View table
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <ul className="grid gap-3 md:grid-cols-2">
                  {group.map((item) => (
                    <li key={item.id} className="card-vv flex flex-col p-4">
                      <div className="flex items-start gap-3">
                        <TeamMonogram
                          name={item.team.name}
                          monogram={item.team.monogram}
                          color={item.team.color}
                          size="md"
                        />
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/teams/${item.team.id}`}
                            className="block truncate font-display text-[15px] font-bold text-ink hover:text-brand dark:hover:text-lime"
                          >
                            {item.team.name}
                          </Link>
                          <p className="mono mt-0.5 text-[10.5px] text-muted">
                            {item.team.points} pts · {item.team.played} played ·{" "}
                            {item.team.goalsFor}:{item.team.goalsAgainst}
                          </p>
                        </div>
                        <RemoveWatchlistButton teamId={item.team.id} />
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                        <FormPills form={item.team.form} label={false} />
                        <span className="text-[10.5px] text-muted">
                          Added {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <p className="rounded-2xl border border-line bg-paper-2/45 p-4 text-[11.5px] leading-relaxed text-muted">
            Following a team is a bookmark only. VeltrixVault does not send alerts and never turns a
            follow into a recommendation.
          </p>
        </div>
      ) : (
        <div className="card-vv flex flex-col items-start p-7 sm:p-9">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
            <BookmarkX className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-[22px] font-bold tracking-tight text-ink">
            No teams followed yet.
          </h2>
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted">
            {dashboardCopy.watchlist.empty}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href="/analytics" size="sm">
              {dashboardCopy.watchlist.browse}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/match-lab" variant="outline" size="sm">
              Open the Match Lab
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  );
}
