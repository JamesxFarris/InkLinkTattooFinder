/**
 * Simple in-memory rate limiter using a sliding window.
 * No external dependencies — uses a Map with TTL cleanup.
 */

type RateLimitEntry = { count: number; resetAt: number };

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(name: string): Map<string, RateLimitEntry> {
  if (!stores.has(name)) stores.set(name, new Map());
  return stores.get(name)!;
}

/**
 * Create a rate limiter with the given config.
 * @param name   Unique name for this limiter (e.g. "register", "contact")
 * @param limit  Max requests per window
 * @param windowMs  Window duration in milliseconds
 */
export function rateLimit(name: string, limit: number, windowMs: number) {
  const store = getStore(name);

  return {
    /**
     * Check if the key (usually IP) is within the rate limit.
     * Returns { success: true } if allowed, { success: false } if blocked.
     */
    check(key: string): { success: boolean; remaining: number } {
      const now = Date.now();
      const entry = store.get(key);

      // Cleanup expired entries periodically (every 100 checks)
      if (Math.random() < 0.01) {
        for (const [k, v] of store) {
          if (v.resetAt < now) store.delete(k);
        }
      }

      if (!entry || entry.resetAt < now) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: limit - 1 };
      }

      if (entry.count >= limit) {
        return { success: false, remaining: 0 };
      }

      entry.count++;
      return { success: true, remaining: limit - entry.count };
    },
  };
}

// Pre-configured limiters
export const authLimiter = rateLimit("auth", 5, 60_000); // 5 attempts per minute
export const formLimiter = rateLimit("form", 10, 60_000); // 10 submissions per minute
export const searchLimiter = rateLimit("search", 30, 60_000); // 30 searches per minute
