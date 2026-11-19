import type { CookieOptions, Response } from "express";
import config from "../config";

const isProduction = config.NODE_ENV === "production";

/**
 * Parses standard duration strings (e.g., '15m', '30d', '5m', '24h', '60s')
 * or numeric millisecond values into milliseconds.
 */
export const parseDurationToMs = (
  duration: string | number | undefined,
  defaultMs: number,
): number => {
  if (duration === undefined || duration === null || duration === "") {
    return defaultMs;
  }

  if (typeof duration === "number") {
    return duration;
  }

  const trimmed = duration.trim();

  // If purely digits, treat as milliseconds
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }

  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*([smhdw])$/i);
  if (!match) {
    return defaultMs;
  }

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return Math.round(value * 1000);
    case "m":
      return Math.round(value * 60 * 1000);
    case "h":
      return Math.round(value * 60 * 60 * 1000);
    case "d":
      return Math.round(value * 24 * 60 * 60 * 1000);
    case "w":
      return Math.round(value * 7 * 24 * 60 * 60 * 1000);
    default:
      return defaultMs;
  }
};

/**
 * Synchronized cookie maxAge calculated directly from environment configurations.
 * - Access Token: 15 minutes (15 * 60 * 1000 ms)
 * - Refresh Token: 30 days (30 * 24 * 60 * 60 * 1000 ms)
 * - Email Verification Token: 5 minutes (5 * 60 * 1000 ms)
 */
export const getAccessTokenCookieMaxAge = (): number =>
  parseDurationToMs(config.JWT_ACCESS_EXPIRES_IN, 15 * 60 * 1000);

export const getRefreshTokenCookieMaxAge = (): number =>
  parseDurationToMs(config.JWT_REFRESH_EXPIRES_IN, 30 * 24 * 60 * 60 * 1000);

export const getEmailVerificationCookieMaxAge = (): number =>
  parseDurationToMs(config.JWT_EMAIL_VERIFICATION_EXPIRES_IN, 5 * 60 * 1000);

export const getBaseCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
});

export const setAuthCookies = (
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
): void => {
  const baseOptions = getBaseCookieOptions();

  res.cookie("accessToken", tokens.accessToken, {
    ...baseOptions,
    maxAge: getAccessTokenCookieMaxAge(),
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...baseOptions,
    maxAge: getRefreshTokenCookieMaxAge(),
  });
};

export const setAccessTokenCookie = (
  res: Response,
  accessToken: string,
): void => {
  res.cookie("accessToken", accessToken, {
    ...getBaseCookieOptions(),
    maxAge: getAccessTokenCookieMaxAge(),
  });
};

export const setEmailVerificationCookie = (
  res: Response,
  verificationToken: string,
): void => {
  res.cookie("emailVerificationToken", verificationToken, {
    ...getBaseCookieOptions(),
    maxAge: getEmailVerificationCookieMaxAge(),
  });
};

export const clearAuthCookies = (res: Response): void => {
  const baseOptions = getBaseCookieOptions();
  res.clearCookie("accessToken", baseOptions);
  res.clearCookie("refreshToken", baseOptions);
  res.clearCookie("token", baseOptions);
};

export const clearEmailVerificationCookie = (res: Response): void => {
  res.clearCookie("emailVerificationToken", getBaseCookieOptions());
};
