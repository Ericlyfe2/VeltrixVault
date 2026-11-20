/**
 * Pure presentation helpers for model output. This module deliberately has no
 * database dependency so prerendered pages can format predictions from the
 * committed public dataset without a DATABASE_URL at build time.
 */
import type { Competition, Team } from "@prisma/client";
import type { LeagueAverages, Prediction } from "@/lib/model/poisson";

export type PredictionBundle = {
  competition: Competition;
  home: Team;
  away: Team;
  prediction: Prediction;
  averages: LeagueAverages;
};

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
