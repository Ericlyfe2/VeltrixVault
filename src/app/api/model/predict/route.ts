import { buildPrediction, PredictionError, publicPrediction } from "@/lib/analysis";
import { predictSchema, fieldErrors } from "@/lib/validation";
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

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const limit = rateLimit(`predict:${getClientIp(request)}`, {
    limit: 40,
    windowMs: 60 * 1000,
  });
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSeconds);

  const parsed = predictSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("invalid_input", "Choose a competition and two teams.", 422, fieldErrors(parsed.error));
  }

  try {
    const bundle = await buildPrediction(
      parsed.data.competitionId,
      parsed.data.homeTeamId,
      parsed.data.awayTeamId,
    );
    return json(publicPrediction(bundle));
  } catch (error) {
    if (error instanceof PredictionError) {
      return apiError("invalid_matchup", error.message, error.status);
    }
    console.error("Prediction failed", error);
    return apiError("server_error", "The model could not run. Please try again.", 500);
  }
}
