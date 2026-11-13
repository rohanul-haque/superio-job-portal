import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import JOB_MESSAGES from "./job.messages";
import jobService from "./job.service";

const createJob = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.user!.id;
  const result = await jobService.createJob(companyId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: JOB_MESSAGES.CREATE_SUCCESS,
    data: result,
  });
});

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const result = await jobService.getAllJobs(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: JOB_MESSAGES.FETCH_ALL_SUCCESS,
    meta: result.meta,
    data: result.data,
  });
});

const getJobById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await jobService.getJobById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: JOB_MESSAGES.FETCH_SINGLE_SUCCESS,
    data: result,
  });
});

const getMyJobs = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.user!.id;
  const result = await jobService.getMyJobs(companyId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Recruiter jobs retrieved successfully",
    data: result,
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = { id: req.user!.id, role: req.user!.role };
  const result = await jobService.updateJob(id, user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: JOB_MESSAGES.UPDATE_SUCCESS,
    data: result,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = { id: req.user!.id, role: req.user!.role };
  const result = await jobService.deleteJob(id, user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: JOB_MESSAGES.DELETE_SUCCESS,
    data: result,
  });
});

const jobController = {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
};

export default jobController;
