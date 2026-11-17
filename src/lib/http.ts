import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { hashIp } from "@/lib/auth/password";

export type ApiErrorBody = {
  error: string;
  message: string;
  fields?: Record<string, string>;
};

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function apiError(
  error: string,
  message: string,
  status: number,
  fields?: Record<string, string>,
) {
  return json<ApiErrorBody>({ error, message, ...(fields ? { fields } : {}) }, status);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

export function getIpHash(request: Request): string {
  return hashIp(getClientIp(request), env.ipHashSecret);
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const secFetchSite = request.headers.get("sec-fetch-site");

  if (secFetchSite === "cross-site") return false;
  if (!origin) return true;

  const allowed = new Set<string>();
  try {
    allowed.add(new URL(request.url).origin);
  } catch {
    /* ignore malformed request URLs */
  }
  try {
    allowed.add(new URL(env.appUrl).origin);
  } catch {
    /* ignore malformed configuration */
  }

  return allowed.has(origin);
}

export function forbiddenCrossOrigin() {
  return apiError("forbidden", "This request could not be verified. Please refresh and try again.", 403);
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: "rate_limited",
      message: `Too many attempts. Try again in ${retryAfterSeconds} seconds.`,
    },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
