/**
 * Sliding Window In-Memory Rate Limiter
 * Provides DDoS and brute-force mitigation for sensitive API endpoints
 */

interface RateLimitRecord {
  timestamps: number[];
}

/** Upper bound on tracked clients, so a flood of distinct addresses cannot grow memory without limit. */
const MAX_KEYS = 20_000;

class InMemoryRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Run cleanup every 5 minutes to prevent memory leak
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, 5 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  public check(
    key: string,
    limit: number,
    windowMs: number
  ): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  } {
    const now = Date.now();
    const windowStart = now - windowMs;

    let record = this.store.get(key);
    if (!record) {
      if (this.store.size >= MAX_KEYS) this.evict();
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Filter out timestamps outside the active sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= limit) {
      const oldest = record.timestamps[0] || now;
      const reset = Math.ceil((oldest + windowMs - now) / 1000);
      return {
        success: false,
        limit,
        remaining: 0,
        reset,
      };
    }

    // Record the current access timestamp
    record.timestamps.push(now);

    return {
      success: true,
      limit,
      remaining: limit - record.timestamps.length,
      reset: Math.ceil(windowMs / 1000),
    };
  }

  public reset(key: string): void {
    this.store.delete(key);
  }

  /** Drop expired entries, then the oldest tenth if the store is still full. */
  private evict(): void {
    this.cleanup();
    if (this.store.size < MAX_KEYS) return;
    let remove = Math.ceil(MAX_KEYS / 10);
    for (const key of this.store.keys()) {
      this.store.delete(key);
      if (--remove <= 0) break;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const maxWindow = 15 * 60 * 1000; // 15 minutes max window
    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < maxWindow);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

// Global singleton instance
export const rateLimiter = new InMemoryRateLimiter();

/**
 * Extract client IP from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
