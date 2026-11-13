import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";
import { StatusCodes } from "http-status-codes";
import config from "./config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";
import routes from "./routes";

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: [config.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "Superio Job Portal Enterprise API v2",
  });
});

app.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Welcome to Superio Job Portal Enterprise API (v2.0)",
    version: "2.0.0",
    documentation: "/api/v1",
  });
});

// Main API Routes
app.use("/api/v1", routes);

// Global Error Handler
app.use(globalErrorHandler);

// 404 Route Handler
app.use(notFoundHandler);

export default app;
