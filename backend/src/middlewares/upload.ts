import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import multer, { FileFilterCallback } from "multer";
import AppError from "../utils/AppError";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        StatusCodes.BAD_REQUEST,
        `Invalid file type '${file.mimetype}'. Only JPEG, JPG, PNG, and WEBP formats are supported.`,
      ),
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

export const uploadSingleImage = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err: unknown) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return next(
              new AppError(
                StatusCodes.BAD_REQUEST,
                "File size exceeds the 5 MB limit. Please upload a smaller image.",
              ),
            );
          }
          return next(new AppError(StatusCodes.BAD_REQUEST, err.message));
        }
        return next(err);
      }
      next();
    });
  };
};

export const uploadCategoryImage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fieldsUpload = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]);

  fieldsUpload(req, res, (err: unknown) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new AppError(
              StatusCodes.BAD_REQUEST,
              "File size exceeds the 5 MB limit. Please upload a smaller image.",
            ),
          );
        }
        return next(new AppError(StatusCodes.BAD_REQUEST, err.message));
      }
      return next(err);
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    if (files) {
      req.file = files.image?.[0] || files.icon?.[0] || files.file?.[0];
    }
    next();
  });
};

export const requireUploadedFile = (
  errorMessage = "Category icon/image is required",
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(new AppError(StatusCodes.BAD_REQUEST, errorMessage));
    }
    next();
  };
};

export const uploadCandidateMedia = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const candidateUpload = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
      const mime = file.mimetype.toLowerCase();
      if (file.fieldname === "resume") {
        if (mime === "application/pdf") {
          cb(null, true);
        } else {
          cb(
            new AppError(
              StatusCodes.BAD_REQUEST,
              "Resume must be a PDF document (application/pdf).",
            ),
          );
        }
      } else if (file.fieldname === "profilePicture") {
        if (ALLOWED_MIME_TYPES.includes(mime)) {
          cb(null, true);
        } else {
          cb(
            new AppError(
              StatusCodes.BAD_REQUEST,
              "Profile photo must be a valid image (JPEG, JPG, PNG, or WEBP).",
            ),
          );
        }
      } else {
        cb(null, true);
      }
    },
  });

  const fields = candidateUpload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]);

  fields(req, res, (err: unknown) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new AppError(
              StatusCodes.BAD_REQUEST,
              "Uploaded file exceeds the 5 MB limit.",
            ),
          );
        }
        return next(new AppError(StatusCodes.BAD_REQUEST, err.message));
      }
      return next(err);
    }
    next();
  });
};

export const uploadCompanyMedia = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fieldsUpload = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]);

  fieldsUpload(req, res, (err: unknown) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new AppError(
              StatusCodes.BAD_REQUEST,
              "Company logo exceeds the 5 MB limit. Please upload a smaller image.",
            ),
          );
        }
        return next(new AppError(StatusCodes.BAD_REQUEST, err.message));
      }
      return next(err);
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    if (files) {
      req.file = files.image?.[0] || files.logo?.[0];
    }
    next();
  });
};

export const uploadAdminMedia = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fieldsUpload = upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]);

  fieldsUpload(req, res, (err: unknown) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new AppError(
              StatusCodes.BAD_REQUEST,
              "Profile photo exceeds the 5 MB limit. Please upload a smaller image.",
            ),
          );
        }
        return next(new AppError(StatusCodes.BAD_REQUEST, err.message));
      }
      return next(err);
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    if (files) {
      req.file =
        files.profilePicture?.[0] ||
        files.profileImage?.[0] ||
        files.image?.[0] ||
        files.avatar?.[0] ||
        files.file?.[0];
    }
    next();
  });
};

export default upload;
