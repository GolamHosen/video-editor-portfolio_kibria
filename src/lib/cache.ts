import { unstable_cache } from "next/cache";

/**
 * Wrap a data-fetching function with Next.js built-in Data Cache.
 *
 * Use for read-only public data. Values must be JSON-serializable.
 * Combined with `s-maxage` headers this makes public API routes / pages fast
 * and dramatically reduces MongoDB load.
 */
export function cacheQuery<T>(
  loader: () => Promise<T>,
  key: string[],
  ttlSeconds = 60
): () => Promise<T> {
  return unstable_cache(loader, key, { revalidate: ttlSeconds });
}

/** Short-lived cache TTL used for highly volatile data (comments/stats). */
export const SHORT_CACHE = 30;
/** Standard TTL for stable portfolio content. */
export const STANDARD_CACHE = 60;

/** CDN-friendly cache headers for public JSON responses. */
export function publicCacheHeaders(ttlSeconds = STANDARD_CACHE): Record<string, string> {
  return {
    "Cache-Control": `public, s-maxage=${ttlSeconds}, max-age=0, stale-while-revalidate=${Math.max(30, ttlSeconds * 0.5)}`,
  };
}