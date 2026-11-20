/**
 * Public, prerenderable views of the committed football dataset.
 *
 * The marketing pages are static and are generated at build time. Reading the
 * checked-in dataset here means `next build` does not need a database or a
 * DATABASE_URL. Dynamic routes and user data continue to use Prisma.
 */
import dataset from "@/data/dataset.json";
import type { Competition, Match, Team } from "@prisma/client";
import {
  computeLeagueAverages,
  predictMatch,
  type TeamStats,
} from "@/lib/model/poisson";
import {
  publicPrediction,
  type PublicPrediction,
} from "@/lib/model/presentation";

type DatasetEntry = (typeof dataset.competitions)[number];

export type PublicCompetition = Competition & {
  teams: Team[];
  _count: { teams: number; matches: number };
};

export type PublicCompetitionOverview = PublicCompetition & {
  stats: {
    matches: number;
    teams: number;
    goals: number;
    homeWins: number;
    draws: number;
    awayWins: number;
    lastDate: string;
    goalsPerMatch: number;
  };
};

function orderedEntries(): DatasetEntry[] {
  return [...dataset.competitions].sort(
    (a, b) =>
      b.competition.season.localeCompare(a.competition.season) ||
      a.competition.name.localeCompare(b.competition.name),
  );
}

function toTeams(entry: DatasetEntry): Team[] {
  return [...entry.teams]
    .sort((a, b) => b.points - a.points || b.goalsFor - a.goalsFor)
    .map(
      (team) =>
        ({
          ...team,
          form: team.form.join(""),
          competitionId: entry.competition.id,
        }) as Team,
    );
}

function toCompetition(entry: DatasetEntry): PublicCompetition {
  return {
    ...entry.competition,
    teams: toTeams(entry),
    _count: { teams: entry.teams.length, matches: entry.matches.length },
  };
}

function toMatches(entry: DatasetEntry): Match[] {
  return entry.matches.map(
    (match) => ({ ...match, competitionId: entry.competition.id }) as Match,
  );
}

export function getPublicDatasetOverview() {
  const competitions = dataset.competitions.length;
  const teams = dataset.competitions.reduce((total, entry) => total + entry.teams.length, 0);
  const matches = dataset.competitions.reduce((total, entry) => total + entry.matches.length, 0);
  const goals = dataset.competitions.reduce((total, entry) => total + entry.stats.goals, 0);
  const lastMatchDate = dataset.competitions.reduce<string | null>((latest, entry) => {
    const date = entry.stats.lastDate;
    return date && (!latest || date > latest) ? date : latest;
  }, null);

  return { competitions, teams, matches, goals, lastMatchDate };
}

export function getPublicCompetitions(): PublicCompetition[] {
  return orderedEntries().map(toCompetition);
}

export function getPublicDefaultCompetition(): PublicCompetition | null {
  const entries = orderedEntries();
  const preferred = entries.find(
    (entry) => entry.competition.slug === "premier-league" && entry.competition.season === "2025/26",
  );
  const selected = preferred ?? entries[0];
  return selected ? toCompetition(selected) : null;
}

export function getPublicCompetitionOverviews(): PublicCompetitionOverview[] {
  return orderedEntries().map((entry) => ({
    ...toCompetition(entry),
    stats: {
      ...entry.stats,
      goalsPerMatch: entry.stats.matches > 0 ? entry.stats.goals / entry.stats.matches : 0,
    },
  }));
}

export function getPublicRecentMatches(competitionId: string, limit = 8): Match[] {
  const entry = dataset.competitions.find((item) => item.competition.id === competitionId);
  if (!entry) return [];

  return toMatches(entry)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function getPublicPrediction(
  competitionId: string,
  homeTeamId: string,
  awayTeamId: string,
): PublicPrediction | null {
  const entry = dataset.competitions.find((item) => item.competition.id === competitionId);
  if (!entry || homeTeamId === awayTeamId) return null;

  const teams = toTeams(entry);
  const home = teams.find((team) => team.id === homeTeamId);
  const away = teams.find((team) => team.id === awayTeamId);
  if (!home || !away) return null;

  const averages = computeLeagueAverages(teams as unknown as TeamStats[]);
  const prediction = predictMatch(
    home as unknown as TeamStats,
    away as unknown as TeamStats,
    averages,
  );

  return publicPrediction({
    competition: { ...entry.competition },
    home,
    away,
    prediction,
    averages,
  });
}
