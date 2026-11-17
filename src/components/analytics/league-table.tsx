import Link from "next/link";
import type { Team } from "@prisma/client";
import { FormPills } from "@/components/ui/form-pills";
import { TeamMonogram } from "@/components/ui/team-monogram";

export function LeagueTable({
  teams,
  compact = false,
}: {
  teams: Team[];
  compact?: boolean;
}) {
  const rows = compact ? teams.slice(0, 6) : teams;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <caption className="sr-only">
            League table showing position, matches played, results, goals, goal difference and points
          </caption>
          <thead>
            <tr className="border-b border-line bg-card-2/80 text-[10.5px] uppercase tracking-[0.1em] text-muted">
              <th scope="col" className="w-10 px-3 py-3 text-center font-semibold">
                #
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                Team
              </th>
              <th scope="col" className="w-10 px-2 py-3 text-center font-semibold">
                P
              </th>
              <th scope="col" className="hidden w-10 px-2 py-3 text-center font-semibold sm:table-cell">
                W
              </th>
              <th scope="col" className="hidden w-10 px-2 py-3 text-center font-semibold sm:table-cell">
                D
              </th>
              <th scope="col" className="hidden w-10 px-2 py-3 text-center font-semibold sm:table-cell">
                L
              </th>
              <th scope="col" className="hidden w-12 px-2 py-3 text-center font-semibold md:table-cell">
                GF
              </th>
              <th scope="col" className="hidden w-12 px-2 py-3 text-center font-semibold md:table-cell">
                GA
              </th>
              <th scope="col" className="w-12 px-2 py-3 text-center font-semibold">
                GD
              </th>
              <th scope="col" className="w-12 px-2 py-3 text-center font-semibold">
                Pts
              </th>
              <th scope="col" className="hidden w-36 px-3 py-3 font-semibold lg:table-cell">
                Form
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((team, index) => (
              <tr
                key={team.id}
                className="group border-b border-line/70 last:border-0 hover:bg-paper-2/55"
              >
                <td className="px-3 py-2.5 text-center">
                  <span className="mono text-[11.5px] text-muted">{index + 1}</span>
                </td>
                <td className="px-3 py-2.5">
                  <Link
                    href={`/teams/${team.id}`}
                    className="flex min-w-0 items-center gap-2.5 rounded-lg"
                  >
                    <TeamMonogram
                      name={team.name}
                      monogram={team.monogram}
                      color={team.color}
                      size="sm"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold text-ink group-hover:underline group-hover:underline-offset-2">
                        <span className="sm:hidden">{team.shortName}</span>
                        <span className="hidden sm:inline">{team.name}</span>
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="mono px-2 py-2.5 text-center text-[12px] text-muted">{team.played}</td>
                <td className="mono hidden px-2 py-2.5 text-center text-[12px] text-muted sm:table-cell">
                  {team.wins}
                </td>
                <td className="mono hidden px-2 py-2.5 text-center text-[12px] text-muted sm:table-cell">
                  {team.draws}
                </td>
                <td className="mono hidden px-2 py-2.5 text-center text-[12px] text-muted sm:table-cell">
                  {team.losses}
                </td>
                <td className="mono hidden px-2 py-2.5 text-center text-[12px] text-muted md:table-cell">
                  {team.goalsFor}
                </td>
                <td className="mono hidden px-2 py-2.5 text-center text-[12px] text-muted md:table-cell">
                  {team.goalsAgainst}
                </td>
                <td
                  className={`mono px-2 py-2.5 text-center text-[12px] ${
                    team.goalsFor - team.goalsAgainst > 0
                      ? "text-brand dark:text-lime"
                      : team.goalsFor - team.goalsAgainst < 0
                        ? "text-coral"
                        : "text-muted"
                  }`}
                >
                  {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}
                  {team.goalsFor - team.goalsAgainst}
                </td>
                <td className="mono px-2 py-2.5 text-center text-[13px] font-semibold text-ink">
                  {team.points}
                </td>
                <td className="hidden px-3 py-2.5 lg:table-cell">
                  <FormPills form={team.form} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
