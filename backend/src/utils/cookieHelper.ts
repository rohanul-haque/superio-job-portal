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
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...baseOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export const setAccessTokenCookie = (
  res: Response,
  accessToken: string,
): void => {
  res.cookie("accessToken", accessToken, {
    ...getBaseCookieOptions(),
    maxAge: 15 * 60 * 1000,
  });
};

export const setEmailVerificationCookie = (
  res: Response,
  verificationToken: string,
): void => {
  res.cookie("emailVerificationToken", verificationToken, {
    ...getBaseCookieOptions(),
    maxAge: 5 * 60 * 1000,
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
