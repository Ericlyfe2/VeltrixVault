/**
 * A transparent, independent-Poisson goals model.
 *
 * It is intentionally simple: attack and defence rates are estimated from
 * home/away goal splits, shrunk toward the league average for small samples,
 * then combined to produce expected goals. The product of two Poisson
 * distributions gives the scoreline matrix.
 *
 * This is a statistical estimate for analysis and education. It is not a
 * prediction service, betting advice, or a guarantee of any outcome.
 */

export type TeamStats = {
  name: string;
  shortName: string;
  played: number;
  homeGoalsFor: number;
  homeGoalsAgainst: number;
  awayGoalsFor: number;
  awayGoalsAgainst: number;
};

export type LeagueAverages = {
  homeGoalsPerMatch: number;
  awayGoalsPerMatch: number;
};

export type Scoreline = {
  home: number;
  away: number;
  probability: number;
};

export type Prediction = {
  expectedHome: number;
  expectedAway: number;
  homeWin: number;
  draw: number;
  awayWin: number;
  over25: number;
  under25: number;
  btts: number;
  topScorelines: Scoreline[];
  averageGoals: number;
  lowSample: boolean;
  sampleMatches: number;
};

const MAX_GOALS = 10;
const SHRINK_MATCHES = 6;

function poisson(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let factorial = 1;
  for (let i = 2; i <= k; i += 1) factorial *= i;
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial;
}

function shrinkRate(goals: number, matches: number, leagueAverage: number): number {
  if (matches <= 0) return leagueAverage;
  return (goals + SHRINK_MATCHES * leagueAverage) / (matches + SHRINK_MATCHES);
}

export function computeLeagueAverages(teams: TeamStats[]): LeagueAverages {
  let homeGoals = 0;
  let awayGoals = 0;
  let homeMatches = 0;
  let awayMatches = 0;

  for (const team of teams) {
    homeGoals += team.homeGoalsFor;
    homeMatches += team.played / 2;
    awayGoals += team.awayGoalsFor;
    awayMatches += team.played / 2;
  }

  return {
    homeGoalsPerMatch: homeMatches > 0 ? homeGoals / homeMatches : 1.4,
    awayGoalsPerMatch: awayMatches > 0 ? awayGoals / awayMatches : 1.1,
  };
}

export function predictMatch(
  home: TeamStats,
  away: TeamStats,
  league: LeagueAverages,
): Prediction {
  const homeGames = home.played / 2;
  const awayGames = away.played / 2;

  const homeAttackRate = shrinkRate(home.homeGoalsFor, homeGames, league.homeGoalsPerMatch);
  const awayDefenceRate = shrinkRate(away.awayGoalsAgainst, awayGames, league.homeGoalsPerMatch);
  const awayAttackRate = shrinkRate(away.awayGoalsFor, awayGames, league.awayGoalsPerMatch);
  const homeDefenceRate = shrinkRate(home.homeGoalsAgainst, homeGames, league.awayGoalsPerMatch);

  const expectedHome = Math.max(0.05, league.homeGoalsPerMatch * (homeAttackRate / league.homeGoalsPerMatch) * (awayDefenceRate / league.homeGoalsPerMatch));
  const expectedAway = Math.max(0.05, league.awayGoalsPerMatch * (awayAttackRate / league.awayGoalsPerMatch) * (homeDefenceRate / league.awayGoalsPerMatch));

  const matrix: number[][] = [];
  for (let h = 0; h <= MAX_GOALS; h += 1) {
    matrix[h] = [];
    for (let a = 0; a <= MAX_GOALS; a += 1) {
      matrix[h][a] = poisson(h, expectedHome) * poisson(a, expectedAway);
    }
  }

  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let over25 = 0;
  let btts = 0;
  const scorelines: Scoreline[] = [];

  for (let h = 0; h <= MAX_GOALS; h += 1) {
    for (let a = 0; a <= MAX_GOALS; a += 1) {
      const probability = matrix[h][a];
      if (h > a) homeWin += probability;
      else if (h === a) draw += probability;
      else awayWin += probability;
      if (h + a > 2.5) over25 += probability;
      if (h > 0 && a > 0) btts += probability;
      scorelines.push({ home: h, away: a, probability });
    }
  }

  scorelines.sort((a, b) => b.probability - a.probability);

  return {
    expectedHome: round(expectedHome),
    expectedAway: round(expectedAway),
    homeWin: round(homeWin),
    draw: round(draw),
    awayWin: round(awayWin),
    over25: round(over25),
    under25: round(1 - over25),
    btts: round(btts),
    topScorelines: scorelines.slice(0, 5).map((line) => ({
      ...line,
      probability: round(line.probability),
    })),
    averageGoals: round(expectedHome + expectedAway),
    lowSample: homeGames < 5 || awayGames < 5,
    sampleMatches: home.played + away.played,
  };
}

function round(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
