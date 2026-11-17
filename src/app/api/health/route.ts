import { db } from "@/lib/db";
import { json } from "@/lib/http";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return json({ status: "ok", time: new Date().toISOString() });
  } catch (error) {
    console.error("Health check failed", error);
    return json({ status: "unavailable" }, 503);
  }
}
