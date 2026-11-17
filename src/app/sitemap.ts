import type { MetadataRoute } from "next";
import dataset from "@/data/dataset.json";
import { env } from "@/lib/env";

type DatasetCompetition = {
  competition: { id: string; lastDate?: string; isComplete?: boolean };
  stats?: { lastDate?: string };
  teams: Array<{ id: string }>;
};

const competitions = dataset.competitions as DatasetCompetition[];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.appUrl;

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/analytics`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/match-lab`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/methodology`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const competitionPages: MetadataRoute.Sitemap = competitions.map((entry) => ({
    url: `${base}/analytics/${entry.competition.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: entry.stats?.lastDate ?? undefined,
  }));

  const teamPages: MetadataRoute.Sitemap = competitions.flatMap((entry) =>
    entry.teams.map((team) => ({
      url: `${base}/teams/${team.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  );

  return [...staticPages, ...competitionPages, ...teamPages];
}
