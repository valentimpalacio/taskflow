import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

const rateLimiters = new Map<string, RateLimiterMemory>();

export interface RateLimitOptions {
  points: number; // Number of requests
  duration: number; // Per duration in seconds
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
  remaining?: number;
  resetTime?: number;
}

export function getRateLimiter(
  key: string,
  points: number,
  duration: number
): RateLimiterMemory {
  const cacheKey = `${key}:${points}:${duration}`;
  if (!rateLimiters.has(cacheKey)) {
    rateLimiters.set(
      cacheKey,
      new RateLimiterMemory({
        keyPrefix: cacheKey,
        points,
        duration,
      })
    );
  }
  return rateLimiters.get(cacheKey)!;
}

export async function checkRateLimit(
  identifier: string,
  key: string,
  points: number,
  duration: number
): Promise<RateLimitResult> {
  const limiter = getRateLimiter(key, points, duration);
  try {
    const res: RateLimiterRes = await limiter.consume(identifier);
    return {
      allowed: true,
      remaining: res.remainingPoints,
      resetTime: Date.now() + res.msBeforeNext,
    };
  } catch (rejRes: unknown) {
    const msBeforeNext = (rejRes as RateLimiterRes).msBeforeNext || 0;
    const retryAfter = Math.ceil(msBeforeNext / 1000);
    return {
      allowed: false,
      retryAfter,
      resetTime: Date.now() + msBeforeNext,
    };
  }
}

export function createRateLimitMiddleware(
  options: RateLimitOptions,
  identifierExtractor: (req: Request) => string = (req) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    return ip;
  }
) {
  return async (req: Request, handler: (req: Request) => Promise<Response>): Promise<Response> => {
    const identifier = identifierExtractor(req);
    const result = await checkRateLimit(
      identifier,
      options.points.toString(),
      options.points,
      options.duration
    );

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': options.points.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetTime?.toString() || '',
            'Retry-After': result.retryAfter?.toString() || '',
          },
        }
      );
    }

    const response = await handler(req);
    
    // Add rate limit headers to successful responses
    if (result.remaining !== undefined) {
      response.headers.set('X-RateLimit-Limit', options.points.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      if (result.resetTime) {
        response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
      }
    }

    return response;
  };
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  api: { points: 100, duration: 60 }, // 100 requests per minute
  auth: { points: 5, duration: 60 * 15 }, // 5 requests per 15 minutes
  upload: { points: 10, duration: 60 }, // 10 uploads per minute
  default: { points: 60, duration: 60 }, // 60 requests per minute
} as const;
