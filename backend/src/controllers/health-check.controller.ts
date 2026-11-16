import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const healthCheck = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "Superio Job Portal Enterprise API v2",
  });
};

export default healthCheck;
