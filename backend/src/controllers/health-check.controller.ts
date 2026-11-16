import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const healthCheck = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: "Hire Nest API is running...",
  });
};

export default healthCheck;
