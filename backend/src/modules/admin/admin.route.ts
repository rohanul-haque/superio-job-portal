import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import { uploadAdminMedia } from "../../middlewares/upload";
import validateRequest from "../../middlewares/validateRequest";
import adminController from "./admin.controller";
import adminValidation from "./admin.validation";

const router = Router();

// Protect all admin endpoints with admin RBAC auth guard
router.use(authGuard("admin"));

// Platform overview cards, growth area chart, category distribution & activity
router.get("/dashboard-stats", adminController.getDashboardStats);

// Candidate moderation
router.get("/candidates", adminController.getCandidates);
router.patch(
  "/candidates/:id/moderate",
  validateRequest(adminValidation.moderateUserValidationSchema),
  adminController.moderateCandidate,
);

// Recruiter moderation
router.get("/recruiters", adminController.getRecruiters);
router.patch(
  "/recruiters/:id/moderate",
  validateRequest(adminValidation.moderateUserValidationSchema),
  adminController.moderateRecruiter,
);

// All jobs master moderation
router.get("/jobs", adminController.getAllJobs);
router.patch(
  "/jobs/:id/moderate",
  validateRequest(adminValidation.moderateJobValidationSchema),
  adminController.moderateJob,
);

// Centralized Trash & Restore Center
router.get("/trash", adminController.getTrashItems);
router.patch(
  "/trash/restore",
  validateRequest(adminValidation.restoreTrashValidationSchema),
  adminController.restoreTrashItem,
);
router.delete("/trash/:type/:id", adminController.permanentlyDeleteTrashItem);

// Admin Profile, Cloudinary Avatar & Security Settings
router.get("/profile", adminController.getProfile);
router.patch(
  "/profile",
  uploadAdminMedia,
  validateRequest(adminValidation.updateProfileValidationSchema),
  adminController.updateProfile,
);
router.post(
  "/profile/avatar",
  uploadAdminMedia,
  adminController.uploadProfileImage,
);
router.patch(
  "/profile/avatar",
  uploadAdminMedia,
  adminController.uploadProfileImage,
);
router.delete("/profile/avatar", adminController.removeProfileImage);
router.delete("/profile/image", adminController.removeProfileImage);
router.patch(
  "/change-password",
  validateRequest(adminValidation.changePasswordValidationSchema),
  adminController.changePassword,
);

export default router;

