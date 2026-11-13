import type { CookieOptions, Response } from "express";
import config from "../config";

const isProduction = config.NODE_ENV === "production";

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
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...baseOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const setAccessTokenCookie = (
  res: Response,
  accessToken: string,
): void => {
  res.cookie("accessToken", accessToken, {
    ...getBaseCookieOptions(),
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

export const setEmailVerificationCookie = (
  res: Response,
  verificationToken: string,
): void => {
  res.cookie("emailVerificationToken", verificationToken, {
    ...getBaseCookieOptions(),
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
