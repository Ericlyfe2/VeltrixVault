import "server-only";
import { db } from "@/lib/db";
import type { Analysis, Competition, Team } from "@prisma/client";

export type AnalysisWithContext = Analysis & {
  competition: Competition | null;
  home: Team | null;
  away: Team | null;
};

async function attachContext(analyses: Analysis[]): Promise<AnalysisWithContext[]> {
  if (analyses.length === 0) return [];

  const competitionIds = [...new Set(analyses.map((analysis) => analysis.competitionId))];
  const teamIds = [
    ...new Set(analyses.flatMap((analysis) => [analysis.homeTeamId, analysis.awayTeamId])),
  ];

  const [competitions, teams] = await Promise.all([
    db.competition.findMany({ where: { id: { in: competitionIds } } }),
    db.team.findMany({ where: { id: { in: teamIds } } }),
  ]);

  const competitionMap = new Map(competitions.map((competition) => [competition.id, competition]));
  const teamMap = new Map(teams.map((team) => [team.id, team]));

  return analyses.map((analysis) => ({
    ...analysis,
    competition: competitionMap.get(analysis.competitionId) ?? null,
    home: teamMap.get(analysis.homeTeamId) ?? null,
    away: teamMap.get(analysis.awayTeamId) ?? null,
  }));
}

export async function getUserAnalyses(userId: string, limit = 50) {
  const analyses = await db.analysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return attachContext(analyses);
}

export async function getAnalysisDetail(userId: string, id: string) {
  const analysis = await db.analysis.findFirst({ where: { id, userId } });
  if (!analysis) return null;
  const [withContext] = await attachContext([analysis]);
  return withContext;
}

export async function getWatchlist(userId: string) {
  const items = await db.watchlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { team: { include: { competition: true } } },
  });

  return items;
}

export async function isFollowingTeam(userId: string, teamId: string) {
  const item = await db.watchlistItem.findUnique({
    where: { userId_teamId: { userId, teamId } },
    select: { id: true },
  });

  return Boolean(item);
}

export async function getDashboardSummary(userId: string) {
  const [analyses, watchlist, referralCount, recentAnalyses, watchlistItems] = await Promise.all([
    db.analysis.count({ where: { userId } }),
    db.watchlistItem.count({ where: { userId } }),
    db.referral.count({ where: { referrerId: userId } }),
    getUserAnalyses(userId, 4),
    getWatchlist(userId),
  ]);

  return {
    analyses,
    watchlist,
    referralCount,
    recentAnalyses,
    watchlistItems: watchlistItems.slice(0, 4),
  };
}

export async function getReferralSummary(userId: string) {
  const [referrals, user] = await Promise.all([
    db.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
      include: { referee: { select: { name: true, createdAt: true } } },
    }),
    db.user.findUnique({ where: { id: userId }, select: { referralCode: true } }),
  ]);

  return {
    code: user?.referralCode ?? "",
    count: referrals.length,
    recent: referrals.map((referral) => ({
      firstName: referral.referee.name.split(" ")[0] || "Someone",
      joinedAt: referral.createdAt,
    })),
  };
}
