import { db } from "@/lib/db";
import { requireApiUser } from "@/lib/auth/api";
import { apiError, forbiddenCrossOrigin, isSameOrigin, json } from "@/lib/http";
import { recordAudit } from "@/lib/audit";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(request)) return forbiddenCrossOrigin();

  const user = await requireApiUser();
  if (!user) return apiError("unauthorized", "Sign in to continue.", 401);

  const { id } = await params;
  const analysis = await db.analysis.findUnique({ where: { id } });

  if (!analysis || analysis.userId !== user.id) {
    return apiError("not_found", "That analysis could not be found.", 404);
  }

  await db.analysis.delete({ where: { id } });
  await recordAudit("analysis.deleted", { userId: user.id, meta: { analysisId: id } });

  return json({ ok: true });
}
