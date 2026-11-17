import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import dataset from "../src/data/dataset.json";

const prisma = new PrismaClient();

type Dataset = typeof dataset;

async function main() {
  const data = dataset as Dataset;

  await prisma.match.deleteMany();
  await prisma.watchlistItem.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.team.deleteMany();
  await prisma.competition.deleteMany();

  for (const entry of data.competitions) {
    const { competition, teams, matches } = entry;

    await prisma.competition.create({
      data: {
        id: competition.id,
        slug: competition.slug,
        name: competition.name,
        country: competition.country,
        countryCode: competition.countryCode,
        season: competition.season,
        accent: competition.accent,
        isComplete: competition.isComplete,
        source: competition.source,
      },
    });

    await prisma.team.createMany({
      data: teams.map((team) => ({
        id: team.id,
        name: team.name,
        shortName: team.shortName,
        slug: team.slug,
        monogram: team.monogram,
        color: team.color,
        played: team.played,
        wins: team.wins,
        draws: team.draws,
        losses: team.losses,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        points: team.points,
        homeGoalsFor: team.homeGoalsFor,
        homeGoalsAgainst: team.homeGoalsAgainst,
        awayGoalsFor: team.awayGoalsFor,
        awayGoalsAgainst: team.awayGoalsAgainst,
        form: team.form.join(""),
        competitionId: competition.id,
      })),
    });

    await prisma.match.createMany({
      data: matches.map((match) => ({
        id: match.id,
        round: match.round,
        date: match.date,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
        competitionId: competition.id,
      })),
    });

    console.log(
      `Seeded ${competition.name} ${competition.season}: ${teams.length} teams, ${matches.length} matches`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
