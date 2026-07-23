/**
 * Simple in-memory rate limit for Gor Gor Chat Bridge.
 * Honest limit: Vercel serverless cold starts / multi-instance reset this map —
 * not a hard distributed quota. Good enough for internal staging v0.1.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 20;

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

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

export function checkGorGorRateLimit(ip: string): {
  ok: boolean;
  remaining: number;
  retryAfterSec?: number;
} {
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    bucket = { count: 0, windowStart: now };
    buckets.set(ip, bucket);
  }
  if (bucket.count >= MAX_REQUESTS) {
    const retryAfterSec = Math.ceil((bucket.windowStart + WINDOW_MS - now) / 1000);
    return { ok: false, remaining: 0, retryAfterSec };
  }
  bucket.count += 1;
  return { ok: true, remaining: MAX_REQUESTS - bucket.count };
}

export const GOR_GOR_RATE_LIMIT = { windowMs: WINDOW_MS, max: MAX_REQUESTS } as const;
