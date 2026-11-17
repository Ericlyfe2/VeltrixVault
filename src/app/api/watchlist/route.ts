import { db } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/api";
import { watchlistSchema, fieldErrors } from "@/lib/validation";
import {
  apiError,
  forbiddenCrossOrigin,
  isSameOrigin,
  json,
  readJson,
} from "@/lib/http";
import { recordAudit } from "@/lib/audit";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const user = await requireApiUser();
  if (!user) return apiError("unauthorized", "Sign in to continue.", 401);

  const parsed = watchlistSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return apiError("invalid_input", "Choose a team to follow.", 422, fieldErrors(parsed.error));
  }

  const team = await db.team.findUnique({ where: { id: parsed.data.teamId } });
  if (!team) return apiError("not_found", "That team could not be found.", 404);

  const exists = await db.watchlistItem.findUnique({
    where: { userId_teamId: { userId: user.id, teamId: team.id } },
  });

  if (!exists) {
    await db.watchlistItem.create({ data: { userId: user.id, teamId: team.id } });
    await recordAudit("watchlist.added", {
      userId: user.id,
      meta: { teamId: team.id },
    });
  }

  return json({ ok: true, following: true });
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const user = await requireApiUser();
  if (!user) return apiError("unauthorized", "Sign in to continue.", 401);

  const teamId = new URL(request.url).searchParams.get("teamId");
  const parsed = watchlistSchema.safeParse({ teamId });
  if (!parsed.success) {
    return apiError("invalid_input", "Choose a team to remove.", 422);
  }

  await db.watchlistItem.deleteMany({
    where: { userId: user.id, teamId: parsed.data.teamId },
  });
  await recordAudit("watchlist.removed", {
    userId: user.id,
    meta: { teamId: parsed.data.teamId },
  });

  return json({ ok: true, following: false });
}
