import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import APPLICATION_MESSAGES from "./application.messages";
import applicationService from "./application.service";

const applyJob = catchAsync(async (req: Request, res: Response) => {
  const candidateId = req.user!.id;
  const { jobId } = req.body;

  const result = await applicationService.applyJob(candidateId, jobId);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: APPLICATION_MESSAGES.APPLY_SUCCESS,
    data: result,
  });
});

const getMyApplications = catchAsync(async (req: Request, res: Response) => {
  const candidateId = req.user!.id;
  const result = await applicationService.getMyApplications(
    candidateId,
    req.query,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: APPLICATION_MESSAGES.FETCH_APPLICATIONS_SUCCESS,
    data: result,
  });
});

const withdrawApplication = catchAsync(async (req: Request, res: Response) => {
  const candidateId = req.user!.id;
  const applicationId = req.params.id as string;

  const result = await applicationService.withdrawApplication(
    candidateId,
    applicationId,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: APPLICATION_MESSAGES.WITHDRAW_SUCCESS,
    data: result,
  });
});

const applicationController = {
  applyJob,
  getMyApplications,
  withdrawApplication,
};

export default applicationController;

