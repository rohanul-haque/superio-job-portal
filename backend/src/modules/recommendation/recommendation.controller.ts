import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import type { IRecommendationsResult } from "./recommendation.interface";
import recommendationService from "./recommendation.service";

/**
 * Controller to fetch AI-powered job recommendations for the authenticated Candidate.
 */
const getRecommendations = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access.");
    }

    const candidateId = req.user.id;
    const forceRefresh = req.query.refresh === "true";

    const result: IRecommendationsResult =
      await recommendationService.getRecommendations(candidateId, forceRefresh);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message:
        result.meta.message || "AI job recommendations retrieved successfully.",
      meta: {
        total: result.meta.total,
      },
      data: result,
    });
  },
);

const recommendationController = {
  getRecommendations,
};

export default recommendationController;
