import { Redis } from "@upstash/redis";

// Redis cache layer - gracefully degrades if not configured
let redis: Redis | null = null;

// Only initialize Redis if credentials are provided
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch {
    console.warn("Redis initialization failed, running without cache");
  }
}

export const CACHE_KEYS = {
  FEATURED_PROJECTS: "portfolio:featured_projects",
  ALL_PROJECTS: "portfolio:all_projects",
  CATEGORIES: "portfolio:categories",
  TESTIMONIALS: "portfolio:testimonials",
  SERVICES: "portfolio:services",
  SITE_SETTINGS: "portfolio:site_settings",
  PROJECT: (slug: string) => `portfolio:project:${slug}`,
};

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};

export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const data = await redis.get<T | string>(key);
    if (data === null || data === undefined) return null;
    if (typeof data === "string") {
      try {
        return JSON.parse(data) as T;
      } catch {
        return data as unknown as T;
      }
    }
    return data as T;
  } catch {
    return null;
  }
}

export async function setCache(
  key: string,
  data: unknown,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(data), { ex: ttl });
  } catch {
    // Silent fail
  }
}

export async function invalidateCache(keys: string | string[]): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(Array.isArray(keys) ? keys : [keys]);
  } catch {
    // Silent fail
  }
}
