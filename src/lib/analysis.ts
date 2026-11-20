import "server-only";
import { db } from "@/lib/db";
import { computeLeagueAverages, predictMatch, type TeamStats } from "@/lib/model/poisson";
import type { PredictionBundle } from "@/lib/model/presentation";

export { publicPrediction } from "@/lib/model/presentation";
export type { PredictionBundle, PublicPrediction } from "@/lib/model/presentation";

export class PredictionError extends Error {
  status: number;
  constructor(message: string, status = 422) {
    super(message);
    this.status = status;
  }
}

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
