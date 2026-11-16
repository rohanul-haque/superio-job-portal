import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";
import { StatusCodes } from "http-status-codes";
import corsOptions from "./lib/cors-options";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";
import healthCheckRoutes from "./routes/health-check.route";
import routes from "./routes";

const app: Application = express();

// Middlewares
// 1. CORS configuration
app.use(cors(corsOptions));

// 2. Compression middleware
app.use(compression());

// 3. JSON body parser (10 MB limit)
app.use(express.json({ limit: "10mb" }));

// 4. URL-encoded body parser (10 MB limit)
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 5. Existing global middleware
app.use(cookieParser());

// 6. Application routes
app.use("/health", healthCheckRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "Welcome to Superio Job Portal Enterprise API (v2.0)",
    version: "2.0.0",
    documentation: "/api/v1",
  });
});

app.use("/api/v1", routes);

// 7. Global error handler & 404 handler
app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
