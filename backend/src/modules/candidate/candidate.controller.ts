import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import CANDIDATE_MESSAGES from "./candidate.messages";
import candidateService from "./candidate.service";

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const candidateId = req.user!.id;
  const result = await candidateService.getProfile(candidateId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: CANDIDATE_MESSAGES.PROFILE_RETRIEVED_SUCCESS,
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const candidateId = req.user!.id;
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  if (process.env.NODE_ENV !== "production") {
    console.log("[CandidateController:updateProfile] candidateId:", candidateId, "files received:", {
      hasFiles: !!files,
      profilePicture: files?.profilePicture?.[0]?.originalname,
      resume: files?.resume?.[0]?.originalname,
    });
  }

  const result = await candidateService.updateProfile(
    candidateId,
    req.body,
    files,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: CANDIDATE_MESSAGES.PROFILE_UPDATED_SUCCESS,
    data: result,
  });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const candidateId = req.user!.id;
  const result = await candidateService.getDashboardStats(candidateId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: CANDIDATE_MESSAGES.DASHBOARD_STATS_SUCCESS,
    data: result,
  });
});

const candidateController = {
  getProfile,
  updateProfile,
  getDashboardStats,
};

export default candidateController;
