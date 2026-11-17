/**
 * Normalises the public-domain OpenFootball match archives into a single,
 * application-friendly dataset with per-team season statistics.
 *
 * Run with: npm run data:build
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

type RawMatch = {
  round: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: { ft?: [number, number]; ht?: [number, number] };
};

type RawCompetition = { name: string; matches: RawMatch[] };

type LeagueSpec = {
  file: string;
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  season: string;
  accent: string;
};

const LEAGUES: LeagueSpec[] = [
  {
    file: "en-2025-26.json",
    slug: "premier-league",
    name: "Premier League",
    country: "England",
    countryCode: "ENG",
    season: "2025/26",
    accent: "lime",
  },
  {
    file: "es-2025-26.json",
    slug: "la-liga",
    name: "La Liga",
    country: "Spain",
    countryCode: "ESP",
    season: "2025/26",
    accent: "coral",
  },
  {
    file: "de-2025-26.json",
    slug: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    countryCode: "GER",
    season: "2025/26",
    accent: "gold",
  },
  {
    file: "it-2025-26.json",
    slug: "serie-a",
    name: "Serie A",
    country: "Italy",
    countryCode: "ITA",
    season: "2025/26",
    accent: "sky",
  },
  {
    file: "fr-2025-26.json",
    slug: "ligue-1",
    name: "Ligue 1",
    country: "France",
    countryCode: "FRA",
    season: "2025/26",
    accent: "violet",
  },
  {
    file: "en-2026-27.json",
    slug: "premier-league",
    name: "Premier League",
    country: "England",
    countryCode: "ENG",
    season: "2026/27",
    accent: "lime",
  },
];

const PALETTE = ["#0d5c43", "#b4452b", "#a8741a", "#1e5b8a", "#5b3f86", "#0d6b6b", "#8a2f4d"];

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shortName(name: string) {
  return name
    .replace(/\b(FC|AFC|CF|SC|SV|VfB|VfL|1899|04|05|1\.)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function monogram(name: string) {
  const cleaned = shortName(name).replace(/[^A-Za-z0-9 ]/g, " ");
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "VV";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function colorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

type TableRow = {
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  homeGoalsFor: number;
  homeGoalsAgainst: number;
  awayGoalsFor: number;
  awayGoalsAgainst: number;
  form: string[];
};

function emptyRow(team: string): TableRow {
  return {
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    homeGoalsFor: 0,
    homeGoalsAgainst: 0,
    awayGoalsFor: 0,
    awayGoalsAgainst: 0,
    form: [],
  };
}

const dataset = LEAGUES.map((spec) => {
  const raw = JSON.parse(
    readFileSync(join(process.cwd(), "data", "football", spec.file), "utf8"),
  ) as RawCompetition;

  const rows = new Map<string, TableRow>();
  const played = raw.matches
    .filter((m) => m.score?.ft)
    .sort((a, b) => a.date.localeCompare(b.date));

  for (const match of played) {
    const home = rows.get(match.team1) ?? emptyRow(match.team1);
    const away = rows.get(match.team2) ?? emptyRow(match.team2);
    const [hg, ag] = match.score!.ft!;

    home.played += 1;
    away.played += 1;
    home.goalsFor += hg;
    home.goalsAgainst += ag;
    home.homeGoalsFor += hg;
    home.homeGoalsAgainst += ag;
    away.goalsFor += ag;
    away.goalsAgainst += hg;
    away.awayGoalsFor += ag;
    away.awayGoalsAgainst += hg;

    if (hg > ag) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
      home.form.push("W");
      away.form.push("L");
    } else if (hg < ag) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
      home.form.push("L");
      away.form.push("W");
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
      home.form.push("D");
      away.form.push("D");
    }

    rows.set(match.team1, home);
    rows.set(match.team2, away);
  }

  const competitionId = `${spec.slug}-${spec.season.replace("/", "-")}`;
  const teams = Array.from(rows.values())
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
        b.goalsFor - a.goalsFor,
    )
    .map((row) => ({
      id: `${competitionId}-${slugify(row.team)}`,
      name: row.team,
      shortName: shortName(row.team),
      slug: slugify(row.team),
      monogram: monogram(row.team),
      color: colorFor(row.team),
      played: row.played,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      points: row.points,
      homeGoalsFor: row.homeGoalsFor,
      homeGoalsAgainst: row.homeGoalsAgainst,
      awayGoalsFor: row.awayGoalsFor,
      awayGoalsAgainst: row.awayGoalsAgainst,
      form: row.form.slice(-5),
    }));

  const lastDate = played.at(-1)?.date ?? null;
  const expectedMatches = teams.length * (teams.length - 1);
  const isComplete = teams.length > 0 && played.length >= expectedMatches;

  const stats = {
    matches: played.length,
    teams: teams.length,
    goals: played.reduce((sum, m) => sum + (m.score?.ft?.[0] ?? 0) + (m.score?.ft?.[1] ?? 0), 0),
    homeWins: played.filter((m) => (m.score?.ft?.[0] ?? 0) > (m.score?.ft?.[1] ?? 0)).length,
    draws: played.filter((m) => (m.score?.ft?.[0] ?? 0) === (m.score?.ft?.[1] ?? 0)).length,
    awayWins: played.filter((m) => (m.score?.ft?.[0] ?? 0) < (m.score?.ft?.[1] ?? 0)).length,
    lastDate,
  };

  return {
    competition: {
      id: competitionId,
      slug: spec.slug,
      name: spec.name,
      country: spec.country,
      countryCode: spec.countryCode,
      season: spec.season,
      accent: spec.accent,
      isComplete,
      source: "OpenFootball",
    },
    stats,
    teams,
    matches: played.map((m) => ({
      id: `${competitionId}-${slugify(m.team1)}-${slugify(m.team2)}-${m.date}`,
      round: m.round,
      date: m.date,
      homeTeam: m.team1,
      awayTeam: m.team2,
      homeGoals: m.score!.ft![0],
      awayGoals: m.score!.ft![1],
    })),
  };
});

const output = {
  generatedAt: new Date().toISOString(),
  source: {
    name: "OpenFootball",
    url: "https://github.com/openfootball/football.json",
    license: "Public domain",
  },
  competitions: dataset,
};

mkdirSync(join(process.cwd(), "src", "data"), { recursive: true });
writeFileSync(
  join(process.cwd(), "src", "data", "dataset.json"),
  JSON.stringify(output, null, 2),
);

console.log(
  `Wrote ${dataset.length} competitions, ${dataset.reduce((n, d) => n + d.teams.length, 0)} teams and ${dataset.reduce(
    (n, d) => n + d.stats.matches,
    0,
  )} matches to src/data/dataset.json`,
);
