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
const allowedOrigins = [
  config.FRONTEND_URL?.replace(/\/+$/, ""),
  "https://superio-job-portal-gamma.vercel.app",
  "http://localhost:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server BFF calls, mobile apps, health checks)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith(".vercel.app") ||
        cleanOrigin.includes("localhost")
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
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
