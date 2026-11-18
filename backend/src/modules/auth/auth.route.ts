import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import {
  emailVerificationLimiter,
  forgotPasswordLimiter,
  loginLimiter,
  refreshTokenLimiter,
  resendVerificationLimiter,
  resetPasswordLimiter,
  signupLimiter,
} from "../../middlewares/authRateLimiter";
import validateRequest from "../../middlewares/validateRequest";
import authController from "./auth.controller";
import authValidation from "./auth.validation";

const router = Router();

// Candidate registration (protected against account creation spam)
router.post(
  "/candidate/register",
  signupLimiter,
  validateRequest(authValidation.candidateRegisterValidationSchema),
  authController.registerCandidate,
);

// Recruiter registration (protected against account creation spam)
router.post(
  "/recruiter/register",
  signupLimiter,
  validateRequest(authValidation.recruiterRegisterValidationSchema),
  authController.registerRecruiter,
);

// Email verification (via HTTP-only cookie or login-gated on new device)
router.post(
  "/verify-email",
  emailVerificationLimiter,
  authController.verifyEmail,
);
router.post(
  "/verify-email/credentials",
  loginLimiter,
  validateRequest(authValidation.verifyEmailCredentialsValidationSchema),
  authController.verifyEmail,
);

// Login (strict failed-attempt rate limiting to protect against brute force)
router.post(
  "/login",
  loginLimiter,
  validateRequest(authValidation.loginValidationSchema),
  authController.login,
);

// Refresh Access Token (extracts refreshToken from cookie, sets new accessToken cookie)
router.post(
  "/refresh-token",
  refreshTokenLimiter,
  validateRequest(authValidation.refreshTokenValidationSchema),
  authController.refreshToken,
);

// Logout (clears all authentication cookies)
router.post("/logout", authController.logout);

// Resend verification (strict quota to prevent email dispatch abuse)
router.post(
  "/resend-verification",
  resendVerificationLimiter,
  validateRequest(authValidation.resendVerificationValidationSchema),
  authController.resendVerificationEmail,
);

// Forgot Password (generates secure token & dispatches reset email)
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateRequest(authValidation.forgotPasswordValidationSchema),
  authController.forgotPassword,
);

// Reset Password (single-use token verification & password update)
router.post(
  "/reset-password",
  resetPasswordLimiter,
  validateRequest(authValidation.resetPasswordValidationSchema),
  authController.resetPassword,
);

// Current user profile
router.get(
  "/me",
  authGuard("candidate", "recruiter", "admin"),
  authController.getMe,
);

export default router;
