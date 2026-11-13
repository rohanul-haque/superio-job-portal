import { z } from "zod";

const booleanPreprocessor = z.preprocess((val) => {
  if (typeof val === "string") {
    if (val.toLowerCase() === "true") return true;
    if (val.toLowerCase() === "false") return false;
  }
  return val;
}, z.boolean().optional());

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Category name is required" })
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(60, "Category name cannot exceed 60 characters"),
    isActive: booleanPreprocessor.default(true),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(60, "Category name cannot exceed 60 characters")
      .optional(),
    isActive: booleanPreprocessor,
    isDeleted: booleanPreprocessor,
  }),
});

const categoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};

export default categoryValidation;
