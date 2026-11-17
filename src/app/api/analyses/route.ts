import { db } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/api";
import { buildPrediction, PredictionError } from "@/lib/analysis";
import { saveAnalysisSchema, fieldErrors } from "@/lib/validation";
import {
  apiError,
  forbiddenCrossOrigin,
  getClientIp,
  isSameOrigin,
  json,
  rateLimitResponse,
  readJson,
} from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { recordAudit } from "@/lib/audit";

export async function GET() {
  const user = await requireApiUser();
  if (!user) return apiError("unauthorized", "Sign in to continue.", 401);

  const analyses = await db.analysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return json({ analyses });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const user = await requireApiUser();
  if (!user) return apiError("unauthorized", "Sign in to continue.", 401);

  const limit = rateLimit(`analysis:${user.id}:${getClientIp(request)}`, {
    limit: 60,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  const parsed = saveAnalysisSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("invalid_input", "Please check the highlighted fields.", 422, fieldErrors(parsed.error));
  }

  try {
    const bundle = await buildPrediction(
      parsed.data.competitionId,
      parsed.data.homeTeamId,
      parsed.data.awayTeamId,
    );

    const title =
      parsed.data.title?.trim() ||
      `${bundle.home.shortName} vs ${bundle.away.shortName}`;

    const analysis = await db.analysis.create({
      data: {
        userId: user.id,
        competitionId: bundle.competition.id,
        homeTeamId: bundle.home.id,
        awayTeamId: bundle.away.id,
        title,
        notes: parsed.data.notes?.trim() || null,
        homeWin: bundle.prediction.homeWin,
        draw: bundle.prediction.draw,
        awayWin: bundle.prediction.awayWin,
        over25: bundle.prediction.over25,
        btts: bundle.prediction.btts,
        expectedHome: bundle.prediction.expectedHome,
        expectedAway: bundle.prediction.expectedAway,
        scoreline:
          bundle.prediction.topScorelines[0]?.home +
          "-" +
          bundle.prediction.topScorelines[0]?.away,
      },
    });

    await recordAudit("analysis.created", {
      userId: user.id,
      meta: { analysisId: analysis.id },
    });

    return json({ ok: true, analysis }, 201);
  } catch (error) {
    if (error instanceof PredictionError) {
      return apiError("invalid_matchup", error.message, error.status);
    }
    console.error("Saving analysis failed", error);
    return apiError("server_error", "The analysis could not be saved. Please try again.", 500);
  }
}
