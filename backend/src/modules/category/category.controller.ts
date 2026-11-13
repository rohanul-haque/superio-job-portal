import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import CATEGORY_MESSAGES from "./category.messages";
import categoryService from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(StatusCodes.BAD_REQUEST, CATEGORY_MESSAGES.ICON_REQUIRED);
  }

  const adminId = req.user!.id;
  const result = await categoryService.createCategory(adminId, req.body, req.file);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: CATEGORY_MESSAGES.CREATE_SUCCESS,
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategories(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: CATEGORY_MESSAGES.FETCH_ALL_SUCCESS,
    data: result,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await categoryService.getCategoryById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: CATEGORY_MESSAGES.FETCH_SINGLE_SUCCESS,
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await categoryService.updateCategory(id, req.body, req.file);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: CATEGORY_MESSAGES.UPDATE_SUCCESS,
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await categoryService.deleteCategory(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: CATEGORY_MESSAGES.DELETE_SUCCESS,
    data: result,
  });
});

const categoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

export default categoryController;
