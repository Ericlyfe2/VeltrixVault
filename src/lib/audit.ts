import "server-only";
import { db } from "@/lib/db";

export async function recordAudit(
  type: string,
  options: { userId?: string | null; meta?: Record<string, unknown> } = {},
) {
  try {
    await db.auditEvent.create({
      data: {
        type,
        userId: options.userId ?? null,
        meta: options.meta ? JSON.stringify(options.meta) : null,
      },
    });
  } catch (error) {
    // Auditing must never block a user-facing operation.
    console.error("Audit write failed", error);
  }
}
