import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import applicationController from "./application.controller";
import applicationValidation from "./application.validation";

const router = Router();

// Candidate: Apply for a job (enforces Resume Guard & duplicate check)
router.post(
  "/apply",
  authGuard("candidate"),
  validateRequest(applicationValidation.applyJobValidationSchema),
  applicationController.applyJob,
);

// Candidate: List all applications for current candidate
router.get(
  "/my-applications",
  authGuard("candidate"),
  applicationController.getMyApplications,
);

// Candidate: Withdraw a pending application
router.patch(
  "/:id/withdraw",
  authGuard("candidate"),
  applicationController.withdrawApplication,
);

export default router;

