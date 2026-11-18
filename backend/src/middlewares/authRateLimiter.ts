import type { Request } from "express";
import { createRateLimiter, getClientIp } from "./rateLimiterHelper";

/**
 * Login Rate Limiter
 * Strict protection against credential stuffing and brute-force attacks.
 * - Window: 5 minutes.
 * - Max failed attempts: 5.
 * - skipSuccessfulRequests: true (successful logins do not count toward failed attempts).
 */
export const loginLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5,
  message:
    "Too many login attempts. Please wait 5 minutes before trying again.",
  skipSuccessfulRequests: true,
  keyPrefix: "login",
});

/**
 * Resets the failed login counter for a given client IP upon successful authentication.
 */
export const resetLoginLimit = (req: Request): void => {
  try {
    const clientIp = getClientIp(req);
    loginLimiter.resetKey(`login:${clientIp}`);
  } catch (error) {
    console.error("Failed to reset login rate limit:", error);
  }
};

/**
 * Signup / Account Creation Rate Limiter
 * Protects public registration endpoints from automated bot spam.
 * - Window: 15 minutes.
 * - Max requests: 5.
 */
export const signupLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: "Too many account creation attempts. Please try again later.",
  keyPrefix: "signup",
});

/**
 * Forgot Password Rate Limiter
 * Mitigates email enumeration and email service flooding.
 * - Window: 15 minutes.
 * - Max requests: 3.
 */
export const forgotPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 3,
  message: "Too many password reset requests. Please try again later.",
  keyPrefix: "forgot-password",
});

/**
 * Reset Password Rate Limiter
 * Protects the password-reset confirmation endpoint from token guessing.
 * - Window: 15 minutes.
 * - Max requests: 5.
 */
export const resetPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: "Too many password reset attempts. Please try again later.",
  keyPrefix: "reset-password",
});

/**
 * Email Verification Rate Limiter
 * Prevents automated verification token brute-forcing.
 * - Window: 15 minutes.
 * - Max requests: 10.
 */
export const emailVerificationLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: "Too many verification attempts. Please try again later.",
  keyPrefix: "verify-email",
});

/**
 * Resend Verification Email Rate Limiter
 * Prevents spamming verification emails.
 * - Window: 15 minutes.
 * - Max requests: 3.
 */
export const resendVerificationLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 3,
  message:
    "Too many verification email requests. Please wait 15 minutes before trying again.",
  keyPrefix: "resend-verification",
});

/**
 * Password Change Rate Limiter
 * Restricts repeated password change attempts on authenticated accounts.
 * - Window: 15 minutes.
 * - Max requests: 5.
 */
export const passwordChangeLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: "Too many password change attempts. Please try again later.",
  keyPrefix: "change-password",
});

/**
 * Refresh Token Rate Limiter
 * Restricts excessive token refresh cycles.
 * - Window: 15 minutes.
 * - Max requests: 30.
 */
export const refreshTokenLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30,
  message: "Too many token refresh attempts. Please try again later.",
  keyPrefix: "refresh-token",
});

/**
 * OTP Verification Rate Limiter (if OTP flow is utilized)
 * - Window: 5 minutes.
 * - Max attempts: 5.
 */
export const otpVerificationLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5,
  message:
    "Too many OTP verification attempts. Please wait 5 minutes before trying again.",
  keyPrefix: "otp-verify",
});

/**
 * OTP Resend Rate Limiter (if OTP flow is utilized)
 * - Window: 15 minutes.
 * - Max requests: 3.
 */
export const otpResendLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 3,
  message: "Too many OTP requests. Please wait 15 minutes before trying again.",
  keyPrefix: "otp-resend",
});
