export type SessionSummary = {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  emailVerified: boolean;
};

export type PredictionTeam = {
  id: string;
  name: string;
  shortName: string;
  monogram: string;
  color: string;
  played: number;
  points: number;
  form: string;
  goalsFor: number;
  goalsAgainst: number;
};

export type PredictionScoreline = {
  home: number;
  away: number;
  probability: number;
};

export type PredictionResult = {
  competition: {
    id: string;
    name: string;
    season: string;
    country: string;
  };
  home: PredictionTeam;
  away: PredictionTeam;
  averages: {
    homeGoalsPerMatch: number;
    awayGoalsPerMatch: number;
  };
  prediction: {
    expectedHome: number;
    expectedAway: number;
    homeWin: number;
    draw: number;
    awayWin: number;
    over25: number;
    under25: number;
    btts: number;
    topScorelines: PredictionScoreline[];
    averageGoals: number;
    lowSample: boolean;
    sampleMatches: number;
  };
  model: {
    name: string;
    version: string;
    disclosure: string;
  };
};

export type SavedAnalysis = {
  id: string;
  title: string;
  notes: string | null;
  competitionId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  over25: number;
  btts: number;
  expectedHome: number;
  expectedAway: number;
  scoreline: string;
  createdAt: string | Date;
};

export type ModelTeamOption = {
  id: string;
  name: string;
  shortName: string;
  monogram: string;
  color: string;
  played: number;
  points: number;
};

export type ModelLeagueOption = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  season: string;
  matchCount: number;
  teams: ModelTeamOption[];
};
