import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { IApiResponse } from "../types/auth";

export class ApiError extends Error {
  statusCode: number;
  errorSources?: Array<{ path: string | number; message: string }>;

  constructor(
    message: string,
    statusCode = 500,
    errorSources?: Array<{ path: string | number; message: string }>,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorSources = errorSources;
  }
}

/**
 * In browser environments, routes all API requests through the same-origin Next.js BFF proxy (/api/backend).
 * This binds HttpOnly authentication cookies directly to the frontend domain (Vercel), solving cross-domain issues.
 * In server-side Node.js contexts (SSR), falls back to direct backend URL.
 */
export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return "/api/backend";
  }
  const rawUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1";
  return rawUrl.trim().replace(/\/+$/, "");
};

const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor: allow browser/Axios to set multipart boundary for FormData payloads
api.interceptors.request.use(
  (config) => {
    // Ensure browser requests always target same-origin BFF proxy
    if (typeof window !== "undefined") {
      if (!config.baseURL || !config.baseURL.startsWith("http")) {
        config.baseURL = "/api/backend";
      }
    }

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers) {
        if (typeof config.headers.delete === "function") {
          config.headers.delete("Content-Type");
        } else {
          delete (config.headers as Record<string, unknown>)["Content-Type"];
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Paths that must NEVER trigger automatic token refresh to prevent infinite loops
const AUTH_BYPASS_URLS = [
  "/auth/login",
  "/auth/refresh-token",
  "/auth/logout",
  "/auth/candidate/register",
  "/auth/recruiter/register",
  "/auth/verify-email",
  "/auth/verify-email/credentials",
  "/auth/resend-verification",
];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

// Session lifecycle tracking
let sessionActive = true; // initially true to allow initial session restoration check
let explicitLogout = false;

export const setSessionActive = (active: boolean): void => {
  sessionActive = active;
};

export const isSessionActive = (): boolean => sessionActive;

export const setExplicitLogout = (loggingOut: boolean): void => {
  explicitLogout = loggingOut;
};

export const isExplicitLogout = (): boolean => explicitLogout;

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(api(prom.config));
    }
  });
  failedQueue = [];
};

// Response interceptor with controlled automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<IApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const statusCode = error.response?.status;
    const errorData = error.response?.data;
    const errorMessage =
      errorData?.message ||
      error.message ||
      "An unexpected error occurred. Please try again.";
    const errorSources = errorData?.errorSources;

    const apiError = new ApiError(errorMessage, statusCode || 500, errorSources);

    // If not a 401, return structured ApiError immediately
    if (!originalRequest || statusCode !== 401) {
      return Promise.reject(apiError);
    }

    const requestUrl = originalRequest.url || "";
    const isBypassUrl = AUTH_BYPASS_URLS.some((url) => requestUrl.includes(url));

    // Do NOT refresh if:
    // 1. The URL is explicitly bypassed (login, register, logout, etc.)
    // 2. Request was already retried
    // 3. User explicitly logged out
    // 4. We already know there is no active session
    if (
      isBypassUrl ||
      originalRequest._retry ||
      explicitLogout ||
      !sessionActive
    ) {
      return Promise.reject(apiError);
    }

    if (isRefreshing) {
      // Queue concurrent 401 requests while refresh is pending
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call backend refresh endpoint; browser sends HTTP-only refreshToken cookie via BFF
      const refreshUrl =
        typeof window !== "undefined"
          ? "/api/backend/auth/refresh-token"
          : `${getApiBaseUrl()}/auth/refresh-token`;

      await axios.post(
        refreshUrl,
        {},
        { withCredentials: true },
      );

      // Successfully refreshed: session confirmed active
      sessionActive = true;
      processQueue(null);

      // Retry the original request
      return api(originalRequest);
    } catch (refreshError: unknown) {
      // Refresh failed: session is not active
      sessionActive = false;
      processQueue(refreshError);

      const err = refreshError as AxiosError<IApiResponse>;
      const refreshStatus = err.response?.status;

      // Only dispatch session-expired if an active session genuinely expired (401),
      // and NEVER if the user explicitly logged out or had no refresh token cookie (400)
      if (
        !explicitLogout &&
        refreshStatus === 401 &&
        typeof window !== "undefined"
      ) {
        window.dispatchEvent(new Event("superio:session-expired"));
      }

      return Promise.reject(
        new ApiError(
          "Your session has expired. Please sign in again.",
          401,
        ),
      );
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
