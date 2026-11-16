import type { CorsOptions } from "cors";
import config from "../config";

const allowedOrigins = [
  config.FRONTEND_URL?.replace(/\/+$/, ""),
  "https://superio-job-portal-gamma.vercel.app",
  "http://localhost:3000",
].filter(Boolean) as string[];

const corsOptions: CorsOptions = {
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
};

export default corsOptions;
