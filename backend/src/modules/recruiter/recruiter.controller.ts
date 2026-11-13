import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import RECRUITER_MESSAGES from "./recruiter.messages";
import recruiterService from "./recruiter.service";

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.user!.id;
  const result = await recruiterService.getProfile(companyId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: RECRUITER_MESSAGES.PROFILE_RETRIEVED_SUCCESS,
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.user!.id;
  const result = await recruiterService.updateProfile(
    companyId,
    req.body,
    req.file,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: RECRUITER_MESSAGES.PROFILE_UPDATED_SUCCESS,
    data: result,
  });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.user!.id;
  const result = await recruiterService.getDashboardStats(companyId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: RECRUITER_MESSAGES.DASHBOARD_STATS_SUCCESS,
    data: result,
  });
});

const getApplicants = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.user!.id;
  const result = await recruiterService.getApplicants(companyId, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: RECRUITER_MESSAGES.APPLICANTS_RETRIEVED_SUCCESS,
    data: result,
  });
});

const updateApplicantStatus = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.user!.id;
  const applicationId = req.params.id as string;
  const { status } = req.body;

  const result = await recruiterService.updateApplicantStatus(
    companyId,
    applicationId,
    status,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: RECRUITER_MESSAGES.STATUS_UPDATED_SUCCESS,
    data: result,
  });
});

const recruiterController = {
  getProfile,
  updateProfile,
  getDashboardStats,
  getApplicants,
  updateApplicantStatus,
};

export default recruiterController;

