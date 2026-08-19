/**
 * Simple in-memory rate limit for Gor Gor Chat Bridge.
 * Honest limit: Vercel serverless cold starts / multi-instance reset this map —
 * not a hard distributed quota. Good enough for internal staging v0.1.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
/** Remote / production-ish clients. */
const MAX_REQUESTS = 20;
/**
 * Local Beauty benches hit POST /api/minion/chat many times.
 * Keep a soft ceiling so a runaway loop still stops.
 */
const MAX_REQUESTS_LOCAL = 400;

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

function isLoopbackIp(ip: string): boolean {
  const v = (ip || "").trim().toLowerCase();
  return (
    v === "127.0.0.1" ||
    v === "::1" ||
    v === "::ffff:127.0.0.1" ||
    v === "localhost"
  );
}

function isLocalHostHeader(host: string | undefined | null): boolean {
  const h = (host || "").trim().toLowerCase();
  if (!h) return false;
  const bare = h.split(":")[0] || "";
  return bare === "localhost" || bare === "127.0.0.1" || bare === "[::1]";
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

export function checkGorGorRateLimit(
  ip: string,
  opts?: { host?: string | null },
): {
  ok: boolean;
  remaining: number;
  retryAfterSec?: number;
} {
  const local =
    isLoopbackIp(ip) || isLocalHostHeader(opts?.host ?? undefined);
  const max = local ? MAX_REQUESTS_LOCAL : MAX_REQUESTS;
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    bucket = { count: 0, windowStart: now };
    buckets.set(ip, bucket);
  }
  if (bucket.count >= max) {
    const retryAfterSec = Math.ceil((bucket.windowStart + WINDOW_MS - now) / 1000);
    return { ok: false, remaining: 0, retryAfterSec };
  }
  bucket.count += 1;
  return { ok: true, remaining: max - bucket.count };
}

export const GOR_GOR_RATE_LIMIT = {
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  maxLocal: MAX_REQUESTS_LOCAL,
} as const;
