/**
 * Rate Limiting Utility
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max users per interval
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  async check(key: string, limit: number): Promise<void> {
    const now = Date.now();
    const windowStart = now - this.config.interval;

    // Get or create entry
    let entry = this.store[key];
    if (!entry || entry.resetTime < windowStart) {
      entry = {
        count: 0,
        resetTime: now,
      };
      this.store[key] = entry;
    }

    // Check if limit exceeded
    if (entry.count >= limit) {
      throw new Error('Rate limit exceeded');
    }

    // Increment count
    entry.count++;
  }

  async getRemaining(key: string, limit: number): Promise<number> {
    const now = Date.now();
    const windowStart = now - this.config.interval;

    const entry = this.store[key];
    if (!entry || entry.resetTime < windowStart) {
      return limit;
    }

    return limit - entry.count;
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.interval;

    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < windowStart) {
        delete this.store[key];
      }
    });
  }
}

// Create singleton instance with default config
const defaultConfig: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
};

export const rateLimit = (config?: Partial<RateLimitConfig>) => {
  const finalConfig = { ...defaultConfig, ...config };
  return new RateLimiter(finalConfig);
};

// Memory store for distributed environments (Redis would be better for production)
export class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now();
    const windowStart = now - windowMs;

    let entry = this.store.get(key);
    if (!entry || entry.resetTime < windowStart) {
      entry = { count: 0, resetTime: now };
    }

    entry.count++;
    this.store.set(key, entry);
    return entry;
  }

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    return this.store.get(key) || null;
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  async cleanup(windowMs: number): Promise<void> {
    const now = Date.now();
    const windowStart = now - windowMs;

    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < windowStart) {
        this.store.delete(key);
      }
    }
  }
}

// Rate limit middleware for API routes
export function createRateLimitMiddleware(options: {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}) {
  const store = new MemoryStore();
  const {
    windowMs = 60 * 1000,
    max = 10,
    message = 'Too many requests, please try again later.',
    keyGenerator = (req: Request) => {
      const ip = req.headers.get('x-forwarded-for') || 'unknown';
      return `rl:${ip}`;
    },
  } = options;

  return async function rateLimitMiddleware(req: Request) {
    const key = keyGenerator(req);
    const { count, resetTime } = await store.increment(key, windowMs);

    const resetTimeInSeconds = Math.ceil(resetTime / 1000);
    const remaining = Math.max(0, max - count);

    // Set rate limit headers
    const headers = new Headers({
      'X-RateLimit-Limit': max.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': resetTimeInSeconds.toString(),
    });

    if (count > max) {
      headers.set('Retry-After', resetTimeInSeconds.toString());
      return new Response(
        JSON.stringify({
          error: 'RateLimitExceeded',
          message,
          retryAfter: resetTimeInSeconds,
        }),
        {
          status: 429,
          headers,
        }
      );
    }

    return { headers };
  };
}