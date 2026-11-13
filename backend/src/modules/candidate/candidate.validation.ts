import { z } from "zod";

const updateCandidateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60).optional(),
    title: z.string().trim().max(100, "Title cannot exceed 100 characters").optional(),
    bio: z.string().trim().max(1500, "Bio cannot exceed 1500 characters").optional(),
    skills: z.union([z.array(z.string()), z.string()]).optional(),
    socialLinks: z.union([z.record(z.string(), z.string().optional()), z.string()]).optional(),
  }),
});

const candidateValidation = {
  updateCandidateProfileValidationSchema,
};

export default candidateValidation;

