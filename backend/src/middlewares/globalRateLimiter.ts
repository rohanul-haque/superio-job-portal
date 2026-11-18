import { createRateLimiter } from "./rateLimiterHelper";

/**
 * Global Rate Limiter
 * Applied across the entire API (/api/v1).
 * Window: 15 minutes.
 * Limit: 300 requests per IP per window.
 * Returns HTTP 429 Too Many Requests with draft-8 headers.
 */
const globalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  message: "Too many requests. Please try again later.",
  keyPrefix: "global",
});

export default globalRateLimiter;
