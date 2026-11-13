import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import { uploadCompanyMedia } from "../../middlewares/upload";
import validateRequest from "../../middlewares/validateRequest";
import recruiterController from "./recruiter.controller";
import recruiterValidation from "./recruiter.validation";

const router = Router();

// Recruiter: Fetch current company profile
router.get("/profile", authGuard("recruiter"), recruiterController.getProfile);

// Recruiter: Update company profile & logo
router.patch(
  "/profile",
  authGuard("recruiter"),
  uploadCompanyMedia,
  validateRequest(recruiterValidation.updateCompanyProfileValidationSchema),
  recruiterController.updateProfile,
);

// Recruiter: Fetch recruiter dashboard metrics & applicant inflow chart
router.get(
  "/dashboard-stats",
  authGuard("recruiter"),
  recruiterController.getDashboardStats,
);

// Recruiter: View filterable applicants
router.get(
  "/applicants",
  authGuard("recruiter"),
  recruiterController.getApplicants,
);

// Recruiter: Mutate applicant status (Shortlisted, Accepted, Rejected)
router.patch(
  "/applicants/:id/status",
  authGuard("recruiter"),
  validateRequest(recruiterValidation.updateApplicantStatusValidationSchema),
  recruiterController.updateApplicantStatus,
);

export default router;

