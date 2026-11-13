import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import authController from "./auth.controller";
import authValidation from "./auth.validation";

const router = Router();

// Candidate registration
router.post(
  "/candidate/register",
  validateRequest(authValidation.candidateRegisterValidationSchema),
  authController.registerCandidate,
);

// Recruiter registration
router.post(
  "/recruiter/register",
  validateRequest(authValidation.recruiterRegisterValidationSchema),
  authController.registerRecruiter,
);

// Email verification (via HTTP-only cookie or login-gated on new device)
router.post("/verify-email", authController.verifyEmail);
router.post(
  "/verify-email/credentials",
  validateRequest(authValidation.verifyEmailCredentialsValidationSchema),
  authController.verifyEmail,
);

// Login (sets HTTP-only accessToken & refreshToken cookies)
router.post(
  "/login",
  validateRequest(authValidation.loginValidationSchema),
  authController.login,
);

// Refresh Access Token (extracts refreshToken from cookie, sets new accessToken cookie)
router.post(
  "/refresh-token",
  validateRequest(authValidation.refreshTokenValidationSchema),
  authController.refreshToken,
);

// Logout (clears all authentication cookies)
router.post("/logout", authController.logout);

// Resend verification
router.post(
  "/resend-verification",
  validateRequest(authValidation.resendVerificationValidationSchema),
  authController.resendVerificationEmail,
);

// Current user profile
router.get(
  "/me",
  authGuard("candidate", "recruiter", "admin"),
  authController.getMe,
);

export default router;
