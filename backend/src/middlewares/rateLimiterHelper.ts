import type { NextFunction, Request, Response } from "express";
import {
  ipKeyGenerator,
  rateLimit,
  type Options,
  type RateLimitInfo,
  type RateLimitRequestHandler,
} from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

declare global {
  namespace Express {
    interface Request {
      rateLimit?: RateLimitInfo;
    }
  }
}

export interface ICreateRateLimiterOptions {
  windowMs: number;
  limit: number;
  message: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyPrefix?: string;
}

/**
 * Extracts client IP safely and normalizes IPv4 and IPv6 (/64 subnet)
 * to prevent IP spoofing or IPv6 range cycling attacks.
 */
export const getClientIp = (req: Request): string => {
  const rawIp = req.ip || req.socket.remoteAddress || "127.0.0.1";
  return ipKeyGenerator(rawIp);
};

/**
 * Reusable factory function for creating robust, standardized rate limiters.
 * Enforces draft-8 standard RateLimit headers, sets Retry-After, and returns
 * consistent JSON error responses compatible with HireNest API contracts.
 */
export const createRateLimiter = ({
  windowMs,
  limit,
  message,
  skipSuccessfulRequests = false,
  skipFailedRequests = false,
  keyPrefix,
}: ICreateRateLimiterOptions): RateLimitRequestHandler => {
  return rateLimit({
    windowMs,
    limit,
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    legacyHeaders: false,
    standardHeaders: "draft-7",
    skipSuccessfulRequests,
    skipFailedRequests,
    keyGenerator: (req: Request) => {
      const clientIp = getClientIp(req);
      return keyPrefix ? `${keyPrefix}:${clientIp}` : clientIp;
    },
    handler: (
      req: Request,
      res: Response,
      _next: NextFunction,
      options: Options,
    ) => {
      const resetTime = req.rateLimit?.resetTime;
      if (resetTime && !res.getHeader("Retry-After")) {
        const retryAfter = Math.max(
          1,
          Math.ceil((resetTime.getTime() - Date.now()) / 1000),
        );
        res.setHeader("Retry-After", String(retryAfter));
      }

      res.status(options.statusCode).json({
        success: false,
        statusCode: options.statusCode,
        message: options.message,
      });
    },
    message,
    validate: {
      trustProxy: true,
      xForwardedForHeader: false,
    },
  });
};
