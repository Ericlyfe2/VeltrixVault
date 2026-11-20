import { describe, expect, it } from "vitest";
import {
  getPublicCompetitionOverviews,
  getPublicCompetitions,
  getPublicDatasetOverview,
  getPublicDefaultCompetition,
  getPublicPrediction,
  getPublicRecentMatches,
} from "@/lib/public-data";

describe("public dataset views", () => {
  it("summarises the committed dataset without querying a database", () => {
    expect(getPublicDatasetOverview()).toEqual({
      competitions: 6,
      teams: 116,
      matches: 1683,
      goals: 4985,
      lastMatchDate: "2026-09-20",
    });
  });

  it("orders competitions and exposes the featured season", () => {
    const competitions = getPublicCompetitions();
    expect(competitions).toHaveLength(6);
    expect(competitions[0].id).toBe("premier-league-2026-27");
    expect(getPublicDefaultCompetition()?.id).toBe("premier-league-2025-26");

    const teams = getPublicDefaultCompetition()!.teams;
    const points = teams.map((team) => team.points);
    expect(points).toEqual([...points].sort((a, b) => b - a));
  });

  it("derives per-competition stats and recent results", () => {
    const overviews = getPublicCompetitionOverviews();
    const premierLeague = overviews.find(
      (entry) => entry.id === "premier-league-2025-26",
    );
    expect(premierLeague?.stats).toMatchObject({
      matches: 353,
      teams: 20,
      goals: 1045,
    });
    expect(premierLeague?.stats.goalsPerMatch).toBeCloseTo(1045 / 353, 5);

    const recent = getPublicRecentMatches("premier-league-2025-26", 3);
    expect(recent).toHaveLength(3);
    expect(recent[0].date >= recent[1].date).toBe(true);
  });

  it("runs the model from the dataset with the same public shape", () => {
    const competition = getPublicDefaultCompetition()!;
    const [home, away] = competition.teams;
    const result = getPublicPrediction(competition.id, home.id, away.id);

    expect(result).not.toBeNull();
    if (!result) return;

    expect(result.home.id).toBe(home.id);
    expect(result.away.id).toBe(away.id);
    expect(result.home.form).toBe(home.form);
    expect(result.prediction.homeWin + result.prediction.draw + result.prediction.awayWin).toBeCloseTo(1, 5);
    expect(getPublicPrediction(competition.id, home.id, home.id)).toBeNull();
  });
});
