import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";
import { StatusCodes } from "http-status-codes";
import corsOptions from "./lib/cors-options";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";
import routes from "./routes";
import healthCheckRoutes from "./routes/health-check.route";

const app: Application = express();

// Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.use("/health", healthCheckRoutes);

// Root Endpoint
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
