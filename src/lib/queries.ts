import { cache } from "react";
import { db } from "@/lib/db";

export const getCompetition = cache(async (id: string) => {
  return db.competition.findUnique({
    where: { id },
    include: {
      teams: { orderBy: [{ points: "desc" }, { goalsFor: "desc" }] },
      _count: { select: { matches: true, teams: true } },
    },
  });
});

export const getCompetitionAnalytics = cache(async (competitionId: string) => {
  const competition = await getCompetition(competitionId);
  if (!competition) return null;

  const matches = await db.match.findMany({
    where: { competitionId },
    orderBy: { date: "desc" },
  });

  const total = matches.length;
  const goals = matches.reduce((sum, match) => sum + match.homeGoals + match.awayGoals, 0);
  const homeWins = matches.filter((match) => match.homeGoals > match.awayGoals).length;
  const draws = matches.filter((match) => match.homeGoals === match.awayGoals).length;
  const awayWins = matches.filter((match) => match.homeGoals < match.awayGoals).length;
  const cleanSheets = matches.filter((match) => match.homeGoals === 0 || match.awayGoals === 0).length;

  return {
    competition,
    matches,
    stats: {
      matches: total,
      goals,
      goalsPerMatch: total > 0 ? goals / total : 0,
      homeWins,
      draws,
      awayWins,
      homeWinRate: total > 0 ? homeWins / total : 0,
      drawRate: total > 0 ? draws / total : 0,
      awayWinRate: total > 0 ? awayWins / total : 0,
      cleanSheetRate: total > 0 ? cleanSheets / total : 0,
      lastDate: matches[0]?.date ?? null,
    },
  };
});

export const getTeam = cache(async (id: string) => {
  return db.team.findUnique({
    where: { id },
    include: {
      competition: true,
      _count: { select: { watchlistItems: true } },
    },
  });
});

export async function getTeamMatches(team: { competitionId: string; name: string }, limit = 8) {
  return db.match.findMany({
    where: {
      competitionId: team.competitionId,
      OR: [{ homeTeam: team.name }, { awayTeam: team.name }],
    },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export const getTeamProfile = cache(async (id: string) => {
  const team = await getTeam(id);
  if (!team) return null;

  const [competition, matches] = await Promise.all([
    getCompetition(team.competitionId),
    db.match.findMany({
      where: {
        competitionId: team.competitionId,
        OR: [{ homeTeam: team.name }, { awayTeam: team.name }],
      },
      orderBy: { date: "desc" },
    }),
  ]);

  const position = competition
    ? competition.teams.findIndex((entry) => entry.id === team.id) + 1
    : 0;

  const homeMatches = matches.filter((match) => match.homeTeam === team.name);
  const awayMatches = matches.filter((match) => match.awayTeam === team.name);

  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

  const split = {
    home: {
      played: homeMatches.length,
      goalsFor: sum(homeMatches.map((match) => match.homeGoals)),
      goalsAgainst: sum(homeMatches.map((match) => match.awayGoals)),
      wins: homeMatches.filter((match) => match.homeGoals > match.awayGoals).length,
      draws: homeMatches.filter((match) => match.homeGoals === match.awayGoals).length,
      losses: homeMatches.filter((match) => match.homeGoals < match.awayGoals).length,
    },
    away: {
      played: awayMatches.length,
      goalsFor: sum(awayMatches.map((match) => match.awayGoals)),
      goalsAgainst: sum(awayMatches.map((match) => match.homeGoals)),
      wins: awayMatches.filter((match) => match.awayGoals > match.homeGoals).length,
      draws: awayMatches.filter((match) => match.awayGoals === match.homeGoals).length,
      losses: awayMatches.filter((match) => match.awayGoals < match.homeGoals).length,
    },
  };

  return {
    team,
    competition,
    position,
    teamCount: competition?.teams.length ?? 0,
    matches,
    recentMatches: matches.slice(0, 8),
    split,
    pointsPerMatch: team.played > 0 ? team.points / team.played : 0,
    goalsPerMatch: team.played > 0 ? team.goalsFor / team.played : 0,
    concededPerMatch: team.played > 0 ? team.goalsAgainst / team.played : 0,
  };
});

export const getLeaguesForModel = cache(async () => {
  const competitions = await db.competition.findMany({
    include: {
      teams: { orderBy: { name: "asc" } },
      _count: { select: { matches: true } },
    },
    orderBy: [{ season: "desc" }, { name: "asc" }],
  });

  return competitions.map((competition) => ({
    id: competition.id,
    name: competition.name,
    country: competition.country,
    countryCode: competition.countryCode,
    season: competition.season,
    matchCount: competition._count.matches,
    teams: competition.teams.map((team) => ({
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      monogram: team.monogram,
      color: team.color,
      played: team.played,
      points: team.points,
    })),
  }));
});

export async function getTeamOptions(competitionId: string) {
  return db.team.findMany({
    where: { competitionId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, shortName: true, played: true },
  });
}
