import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import ADMIN_MESSAGES from "./admin.messages";
import adminService from "./admin.service";

const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await adminService.getDashboardStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.DASHBOARD_STATS_FETCHED,
    data: result,
  });
});

const getCandidates = catchAsync(async (req: Request, res: Response) => {
  const { candidates, meta } = await adminService.getCandidates({
    search: req.query.search as string,
    status: req.query.status as string,
    page: req.query.page as string,
    limit: req.query.limit as string,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.CANDIDATES_FETCHED,
    meta,
    data: candidates,
  });
});

const moderateCandidate = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.moderateCandidate(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.CANDIDATE_MODERATED,
    data: result,
  });
});

const getRecruiters = catchAsync(async (req: Request, res: Response) => {
  const { recruiters, meta } = await adminService.getRecruiters({
    search: req.query.search as string,
    status: req.query.status as string,
    page: req.query.page as string,
    limit: req.query.limit as string,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.RECRUITERS_FETCHED,
    meta,
    data: recruiters,
  });
});

const moderateRecruiter = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.moderateRecruiter(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.RECRUITER_MODERATED,
    data: result,
  });
});

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const { jobs, meta } = await adminService.getAllJobs({
    search: req.query.search as string,
    categoryId: req.query.categoryId as string,
    hiringStatus: req.query.hiringStatus as string,
    visible: req.query.visible as string,
    page: req.query.page as string,
    limit: req.query.limit as string,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.JOBS_FETCHED,
    meta,
    data: jobs,
  });
});

const moderateJob = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.moderateJob(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.JOB_MODERATED,
    data: result,
  });
});

const getTrashItems = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getTrashItems({
    type: req.query.type as string,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.TRASH_FETCHED,
    data: result,
  });
});

const restoreTrashItem = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.restoreTrashItem(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const permanentlyDeleteTrashItem = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.permanentlyDeleteTrashItem(
      req.params.type as string,
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: result.message,
      data: result,
    });
  },
);

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user!.id;
  const result = await adminService.getAdminProfile(adminId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.ADMIN_PROFILE_FETCHED,
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user!.id;
  const result = await adminService.updateAdminProfile(
    adminId,
    req.body,
    req.file,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: req.file
      ? ADMIN_MESSAGES.PROFILE_IMAGE_UPLOADED
      : ADMIN_MESSAGES.ADMIN_PROFILE_UPDATED,
    data: result,
  });
});

const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user!.id;
  const result = await adminService.uploadAdminProfileImage(
    adminId,
    req.file!,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.PROFILE_IMAGE_UPLOADED,
    data: result,
  });
});

const removeProfileImage = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user!.id;
  const result = await adminService.removeAdminProfileImage(adminId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ADMIN_MESSAGES.PROFILE_IMAGE_REMOVED,
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user!.id;
  const result = await adminService.changeAdminPassword(adminId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const adminController = {
  getDashboardStats,
  getCandidates,
  moderateCandidate,
  getRecruiters,
  moderateRecruiter,
  getAllJobs,
  moderateJob,
  getTrashItems,
  restoreTrashItem,
  permanentlyDeleteTrashItem,
  getProfile,
  updateProfile,
  uploadProfileImage,
  removeProfileImage,
  changePassword,
};

export default adminController;
