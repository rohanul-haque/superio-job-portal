import { z } from "zod";

const applyJobValidationSchema = z.object({
  body: z.object({
    jobId: z.string({ required_error: "Job ID is required" }).trim().min(1, "Job ID is required"),
  }),
});

const applicationValidation = {
  applyJobValidationSchema,
};

export default applicationValidation;

