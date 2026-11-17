import type { Match } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export function MatchList({
  matches,
  title,
  limit,
  empty = "No finished matches in this snapshot.",
}: {
  matches: Match[];
  title?: string;
  limit?: number;
  empty?: string;
}) {
  const rows = limit ? matches.slice(0, limit) : matches;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      {title ? (
        <div className="border-b border-line bg-card-2/70 px-4 py-3">
          <h3 className="font-display text-[14px] font-bold text-ink">{title}</h3>
        </div>
      ) : null}
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-[13px] text-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-line/70">
          {rows.map((match) => {
            const homeWin = match.homeGoals > match.awayGoals;
            const awayWin = match.awayGoals > match.homeGoals;

            return (
              <li key={match.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2.5 sm:px-4">
                <div className="min-w-0 text-right">
                  <p
                    className={`truncate text-[12.5px] ${
                      homeWin ? "font-semibold text-ink" : "text-muted"
                    }`}
                  >
                    {match.homeTeam}
                  </p>
                </div>
                <div className="text-center">
                  <p className="mono inline-flex items-center gap-1 rounded-lg border border-line bg-paper-2 px-2 py-1 text-[11.5px] font-semibold text-ink">
                    <span className={homeWin ? "text-brand dark:text-lime" : ""}>{match.homeGoals}</span>
                    <span className="text-muted/50">–</span>
                    <span className={awayWin ? "text-brand dark:text-lime" : ""}>{match.awayGoals}</span>
                  </p>
                  <p className="mono mt-1 hidden text-[9.5px] uppercase tracking-wide text-muted sm:block">
                    {formatDate(match.date)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p
                    className={`truncate text-[12.5px] ${
                      awayWin ? "font-semibold text-ink" : "text-muted"
                    }`}
                  >
                    {match.awayTeam}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
