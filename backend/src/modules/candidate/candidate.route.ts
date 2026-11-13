import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import { uploadCandidateMedia } from "../../middlewares/upload";
import validateRequest from "../../middlewares/validateRequest";
import candidateController from "./candidate.controller";
import candidateValidation from "./candidate.validation";

const router = Router();

// Candidate: Fetch current profile
router.get("/profile", authGuard("candidate"), candidateController.getProfile);

// Candidate: Update profile, avatar image, and Cloudinary PDF resume
router.patch(
  "/profile",
  authGuard("candidate"),
  uploadCandidateMedia,
  validateRequest(candidateValidation.updateCandidateProfileValidationSchema),
  candidateController.updateProfile,
);

// Candidate: Fetch dashboard statistics and area chart activity
router.get(
  "/dashboard-stats",
  authGuard("candidate"),
  candidateController.getDashboardStats,
);

export default router;
