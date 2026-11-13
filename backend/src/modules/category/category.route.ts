import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import {
  requireUploadedFile,
  uploadCategoryImage,
} from "../../middlewares/upload";
import validateRequest from "../../middlewares/validateRequest";
import categoryController from "./category.controller";
import CATEGORY_MESSAGES from "./category.messages";
import categoryValidation from "./category.validation";

const router = Router();

// Public: Get all active, non-deleted categories with job counts
router.get("/", categoryController.getAllCategories);

// Public: Get single category by ID
router.get("/:id", categoryController.getCategoryById);

// Admin: Create a new job category (multipart/form-data with mandatory image upload)
router.post(
  "/",
  authGuard("admin"),
  uploadCategoryImage,
  validateRequest(categoryValidation.createCategoryValidationSchema),
  requireUploadedFile(CATEGORY_MESSAGES.ICON_REQUIRED),
  categoryController.createCategory,
);

// Admin: Update a category (multipart/form-data or JSON)
router.patch(
  "/:id",
  authGuard("admin"),
  uploadCategoryImage,
  validateRequest(categoryValidation.updateCategoryValidationSchema),
  categoryController.updateCategory,
);

// Admin: Soft delete a category
router.delete("/:id", authGuard("admin"), categoryController.deleteCategory);

export default router;
