// Simple in-memory sliding-window rate limiter (single-instance friendly).
// In Next.js/Vercel serverless each warm instance keeps its own store — good
// enough to stop scripted abuse. For strict multi-region rate limiting you can
// swap this for Vercel KV / Upstash Redis without touching the call sites.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Throttle requests per-client-IP + action key.
 *
 * @param request       The request being processed.
 * @param action        Action identifier, e.g. "login", "contact", "comment".
 * @param maxRequests   Max requests allowed in the window.
 * @param windowSeconds Sliding window length in seconds.
 */
export function rateLimit(
  request: Request,
  action: string,
  maxRequests = 10,
  windowSeconds = 60
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const key = `${action}:${getClientIp(request)}`;

  // Opportunistic cleanup so the map never grows unbounded.
  if (buckets.size > 10_000) {
    for (const [k, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  if (bucket.count > maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return { success: false, remaining: 0, retryAfterSeconds };
  }

  return { success: true, remaining: maxRequests - bucket.count, retryAfterSeconds: 0 };
}

/** 429 JSON helper for rate-limited requests. */
export function rateLimitedResponse(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again shortly." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    }
  );
}