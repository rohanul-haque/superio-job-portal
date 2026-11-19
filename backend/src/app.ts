import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import corsOptions from "./lib/cors-options";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import globalRateLimiter from "./middlewares/globalRateLimiter";
import notFoundHandler from "./middlewares/notFoundHandler";
import routes from "./routes";

const app: Application = express();

// Trust reverse proxy (e.g. Render, Cloudflare, AWS ALB) for accurate client IP identification
app.set("trust proxy", 1);

// Security and performance: disable x-powered-by header to prevent fingerprinting and reduce byte payload
app.disable("x-powered-by");

// Middlewares
// 1. CORS configuration
app.use(cors(corsOptions));

// 2. Compression middleware - threshold set to 1024 bytes (1 KB) to prevent CPU overhead on tiny responses
app.use(
  compression({
    threshold: 1024,
  }),
);

// 3. JSON body parser (10 MB limit)
app.use(express.json({ limit: "10mb" }));

// 4. URL-encoded body parser (10 MB limit)
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 5. Existing global middleware
app.use(cookieParser());

// Protect all /api/v1 endpoints with the Global Rate Limiter
app.use("/api/v1", globalRateLimiter, routes);

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    version: "2.0.0",
    message: "Hire Nest API is healthy",
    timeStamp: new Date().toLocaleTimeString(),
  });
});

// 7. Global error handler & 404 handler
app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
