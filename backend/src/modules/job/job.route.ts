import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import jobController from "./job.controller";
import jobValidation from "./job.validation";

const router = Router();

// Public: Server-side filtered, searched, and paginated active jobs
router.get("/", jobController.getAllJobs);

// Recruiter: Get all jobs posted by the logged-in company (including visible/hidden with applicant count)
router.get("/my-jobs", authGuard("recruiter"), jobController.getMyJobs);

// Public: Single job details with company info & similar jobs
router.get("/:id", jobController.getJobById);

// Recruiter: Publish a new job vacancy
router.post(
  "/",
  authGuard("recruiter"),
  validateRequest(jobValidation.createJobValidationSchema),
  jobController.createJob,
);

// Recruiter / Admin: Update job vacancy details, visibility, or hiringStatus
router.patch(
  "/:id",
  authGuard("recruiter", "admin"),
  validateRequest(jobValidation.updateJobValidationSchema),
  jobController.updateJob,
);

// Recruiter / Admin: Soft-delete a job
router.delete("/:id", authGuard("recruiter", "admin"), jobController.deleteJob);

export default router;
