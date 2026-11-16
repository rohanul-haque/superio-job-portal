import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import recommendationController from "./recommendation.controller";

const router = Router();

// Candidate: Retrieve AI-matched job recommendations
router.get(
  "/",
  authGuard("candidate"),
  recommendationController.getRecommendations,
);

export default router;
