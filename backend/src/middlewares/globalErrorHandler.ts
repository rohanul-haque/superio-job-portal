import { Prisma } from "@prisma/client";
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import config from "../config";
import type { IGenericErrorMessage } from "../types";
import AppError from "../utils/AppError";

const globalErrorHandler: ErrorRequestHandler = (
  err:
    | Error
    | AppError
    | ZodError
    | Prisma.PrismaClientKnownRequestError
    | Record<string, unknown>,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources: IGenericErrorMessage[] = [];

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation Error";
    errorSources = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1] ?? "",
      message: issue.message,
    }));
  }
  // 2. Prisma Known Request Error
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = StatusCodes.CONFLICT;
      const target = (err.meta?.target as string[]) || [];
      message = `Duplicate field value entered: ${target.join(", ")}. Please use another value!`;
      errorSources = [
        {
          path: target.join(".") || "duplicate",
          message: `${target.join(", ")} already exists`,
        },
      ];
    } else if (err.code === "P2025") {
      statusCode = StatusCodes.NOT_FOUND;
      message = (err.meta?.cause as string) || "Record not found";
      errorSources = [{ path: "", message }];
    } else {
      statusCode = StatusCodes.BAD_REQUEST;
      message = `Database query error: ${err.message}`;
    }
  }
  // 3. Custom AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  }
  // 4. JWT Errors
  else if ("name" in err && err.name === "JsonWebTokenError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Invalid authentication token";
    errorSources = [{ path: "", message: (err as Error).message }];
  } else if ("name" in err && err.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Authentication token has expired";
    errorSources = [{ path: "", message: (err as Error).message }];
  }
  // 5. Standard native Error
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  }

  const stack = err instanceof Error ? err.stack : undefined;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorSources: errorSources.length > 0 ? errorSources : undefined,
    stack: config.NODE_ENV === "development" ? stack : undefined,
  });
};

export default globalErrorHandler;
