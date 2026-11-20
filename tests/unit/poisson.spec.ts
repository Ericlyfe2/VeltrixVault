import { describe, expect, it } from "vitest";
import {
  computeLeagueAverages,
  predictMatch,
  type TeamStats,
} from "@/lib/model/poisson";

function team(overrides: Partial<TeamStats> = {}): TeamStats {
  return {
    name: "Example FC",
    shortName: "Example",
    played: 20,
    homeGoalsFor: 14,
    homeGoalsAgainst: 10,
    awayGoalsFor: 11,
    awayGoalsAgainst: 12,
    ...overrides,
  };
}

const league = computeLeagueAverages([team(), team({ name: "Other FC" })]);

describe("computeLeagueAverages", () => {
  it("derives home and away scoring rates from split goals", () => {
    const stats = computeLeagueAverages([
      team({ played: 20, homeGoalsFor: 14, awayGoalsFor: 10 }),
      team({ played: 20, homeGoalsFor: 16, awayGoalsFor: 12 }),
    ]);

    expect(stats.homeGoalsPerMatch).toBeCloseTo(1.5, 10);
    expect(stats.awayGoalsPerMatch).toBeCloseTo(1.1, 10);
  });

  it("falls back to sensible defaults with no data", () => {
    expect(computeLeagueAverages([])).toEqual({
      homeGoalsPerMatch: 1.4,
      awayGoalsPerMatch: 1.1,
    });
  });
});

describe("predictMatch", () => {
  it("keeps a valid probability distribution", () => {
    const result = predictMatch(team(), team({ name: "Away FC" }), league);

    expect(result.homeWin + result.draw + result.awayWin).toBeCloseTo(1, 3);
    expect(result.over25 + result.under25).toBeCloseTo(1, 3);
    expect(result.expectedHome).toBeGreaterThan(0);
    expect(result.expectedAway).toBeGreaterThan(0);

    for (const value of [
      result.homeWin,
      result.draw,
      result.awayWin,
      result.over25,
      result.under25,
      result.btts,
    ]) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it("returns five scorelines ordered by probability", () => {
    const result = predictMatch(team(), team({ name: "Away FC" }), league);

    expect(result.topScorelines).toHaveLength(5);
    for (let index = 1; index < result.topScorelines.length; index += 1) {
      expect(result.topScorelines[index - 1]!.probability).toBeGreaterThanOrEqual(
        result.topScorelines[index]!.probability,
      );
    }
  });

  it("raises expected goals for a stronger home attack", () => {
    const average = predictMatch(team(), team({ name: "Away FC" }), league);
    const strong = predictMatch(
      team({ homeGoalsFor: 26 }),
      team({ name: "Away FC" }),
      league,
    );

    expect(strong.expectedHome).toBeGreaterThan(average.expectedHome);
    expect(strong.homeWin).toBeGreaterThan(average.homeWin);
  });

  it("shrinks small samples toward the league average", () => {
    const tiny = team({ played: 2, homeGoalsFor: 8, awayGoalsFor: 0 });
    const result = predictMatch(tiny, team({ name: "Away FC", played: 20 }), league);

    expect(result.lowSample).toBe(true);
    expect(result.sampleMatches).toBe(22);
    expect(result.expectedHome).toBeLessThan(8);
    expect(result.expectedHome).toBeGreaterThan(league.homeGoalsPerMatch * 0.5);
  });

  it("handles teams with no played matches", () => {
    const result = predictMatch(
      team({ played: 0, homeGoalsFor: 0, awayGoalsFor: 0 }),
      team({ played: 0, name: "Away FC", homeGoalsFor: 0, awayGoalsFor: 0 }),
      league,
    );

    expect(Number.isFinite(result.expectedHome)).toBe(true);
    expect(Number.isFinite(result.expectedAway)).toBe(true);
    expect(result.lowSample).toBe(true);
  });
});
