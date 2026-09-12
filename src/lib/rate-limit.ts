import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

// Unconfigured Upstash (no env vars, e.g. local dev without a Redis instance)
// fails open rather than blocking every auth request.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function createLimiter(prefix: string, tokens: number, window: `${number} ${"m" | "h"}`) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: `ratelimit:${prefix}`,
  });
}

export const rateLimiters = {
  login: createLimiter("login", 5, "15 m"),
  register: createLimiter("register", 3, "1 h"),
  forgotPassword: createLimiter("forgot-password", 3, "1 h"),
  resetPassword: createLimiter("reset-password", 5, "15 m"),
  resendVerification: createLimiter("resend-verification", 3, "15 m"),
};

const OPEN_RESULT: RateLimitResult = { success: true, remaining: Infinity, reset: 0 };

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<RateLimitResult> {
  if (!limiter) return OPEN_RESULT;

  try {
    const { success, remaining, reset } = await limiter.limit(identifier);
    return { success, remaining, reset };
  } catch (error) {
    console.error("Rate limit check failed, allowing request:", error);
    return OPEN_RESULT;
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function rateLimitExceededResponse(result: RateLimitResult): NextResponse {
  const retryAfterSeconds = Math.max(0, Math.ceil((result.reset - Date.now()) / 1000));
  const retryAfterMinutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));

  return NextResponse.json(
    { error: `Too many attempts. Please try again in ${retryAfterMinutes} minutes.` },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    },
  );
}
