import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import bookmarkService from "./bookmark.service";

const toggleBookmark = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { jobId } = req.body;

  const result = await bookmarkService.toggleBookmark(userId, jobId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const getMyBookmarks = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await bookmarkService.getMyBookmarks(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Saved jobs retrieved successfully",
    data: result,
  });
});

const removeBookmark = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const jobId = req.params.jobId as string;

  const result = await bookmarkService.removeBookmark(userId, jobId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const bookmarkController = {
  toggleBookmark,
  getMyBookmarks,
  removeBookmark,
};

export default bookmarkController;

