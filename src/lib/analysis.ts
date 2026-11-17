import "server-only";
import { db } from "@/lib/db";
import {
  computeLeagueAverages,
  predictMatch,
  type LeagueAverages,
  type Prediction,
  type TeamStats,
} from "@/lib/model/poisson";
import type { Competition, Team } from "@prisma/client";

export class PredictionError extends Error {
  status: number;
  constructor(message: string, status = 422) {
    super(message);
    this.status = status;
  }
}

export type PredictionBundle = {
  competition: Competition;
  home: Team;
  away: Team;
  prediction: Prediction;
  averages: LeagueAverages;
};

export async function buildPrediction(
  competitionId: string,
  homeTeamId: string,
  awayTeamId: string,
): Promise<PredictionBundle> {
  if (homeTeamId === awayTeamId) {
    throw new PredictionError("Choose two different teams.");
  }

  const competition = await db.competition.findUnique({
    where: { id: competitionId },
    include: { teams: true },
  });

  if (!competition) throw new PredictionError("That competition could not be found.", 404);

  const home = competition.teams.find((team) => team.id === homeTeamId);
  const away = competition.teams.find((team) => team.id === awayTeamId);

  if (!home || !away) {
    throw new PredictionError("Both teams must belong to the selected competition.");
  }

  const averages = computeLeagueAverages(competition.teams as unknown as TeamStats[]);
  const prediction = predictMatch(
    home as unknown as TeamStats,
    away as unknown as TeamStats,
    averages,
  );

  return { competition, home, away, prediction, averages };
}

export function publicPrediction(bundle: PredictionBundle) {
  const { competition, home, away, prediction, averages } = bundle;

  return {
    competition: {
      id: competition.id,
      name: competition.name,
      season: competition.season,
      country: competition.country,
    },
    home: {
      id: home.id,
      name: home.name,
      shortName: home.shortName,
      monogram: home.monogram,
      color: home.color,
      played: home.played,
      points: home.points,
      form: home.form,
      goalsFor: home.goalsFor,
      goalsAgainst: home.goalsAgainst,
    },
    away: {
      id: away.id,
      name: away.name,
      shortName: away.shortName,
      monogram: away.monogram,
      color: away.color,
      played: away.played,
      points: away.points,
      form: away.form,
      goalsFor: away.goalsFor,
      goalsAgainst: away.goalsAgainst,
    },
    averages,
    prediction,
    model: {
      name: "Independent Poisson",
      version: "1.0",
      disclosure:
        "Statistical estimate for analysis and education. Not betting advice, and no outcome is guaranteed.",
    },
  };
}

export type PublicPrediction = ReturnType<typeof publicPrediction>;
