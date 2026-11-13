import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import {
  clearAuthCookies,
  clearEmailVerificationCookie,
  setAccessTokenCookie,
  setAuthCookies,
  setEmailVerificationCookie,
} from "../../utils/cookieHelper";
import sendResponse from "../../utils/sendResponse";
import AUTH_MESSAGES from "./auth.messages";
import authService from "./auth.service";

const registerCandidate = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerCandidate(req.body);

  // Set HTTP-only Email Verification Cookie in the registration browser
  setEmailVerificationCookie(res, result.verificationToken);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: AUTH_MESSAGES.CANDIDATE_REGISTER_SUCCESS,
    data: result.user,
  });
});

const registerRecruiter = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerRecruiter(req.body);

  // Set HTTP-only Email Verification Cookie in the registration browser
  setEmailVerificationCookie(res, result.verificationToken);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: AUTH_MESSAGES.RECRUITER_REGISTER_SUCCESS,
    data: result.user,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const cookieToken = req.cookies?.emailVerificationToken;

  // 1. Same-Browser Verification (via HTTP-only cookie)
  if (cookieToken) {
    const result = await authService.verifyEmail(cookieToken);

    // Clear verification cookie upon successful verification
    clearEmailVerificationCookie(res);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: result.message,
      data: result.user,
    });
    return;
  }

  // 2. Cross-Device / New-Browser Verification (Login-Gated via credentials)
  if (req.body?.email && req.body?.password) {
    const result = await authService.verifyEmailWithCredentials(req.body);

    // Set authenticated session cookies on this new device
    setAuthCookies(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    clearEmailVerificationCookie(res);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: result.message,
      data: result.user,
    });
    return;
  }

  // Neither cookie nor credentials provided
  throw new AppError(
    StatusCodes.UNAUTHORIZED,
    AUTH_MESSAGES.VERIFICATION_COOKIE_MISSING,
  );
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  // Store both Access Token and Refresh Token exclusively in HTTP-only cookies
  setAuthCookies(res, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });

  // Tokens are NEVER exposed in the API response body
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    data: { user: result.user },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  const result = await authService.refreshToken(token);

  // Update Access Token in its HTTP-only cookie
  setAccessTokenCookie(res, result.accessToken);

  // Return success without exposing the token in the response body
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: AUTH_MESSAGES.TOKEN_REFRESH_SUCCESS,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  // Clear all authentication and session cookies with matching options
  clearAuthCookies(res);
  clearEmailVerificationCookie(res);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: AUTH_MESSAGES.LOGOUT_SUCCESS,
  });
});

const resendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.resendVerificationEmail(req.body.email);

    // Establish fresh verification cookie in the current browser
    setEmailVerificationCookie(res, result.verificationToken);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: result.message,
    });
  },
);

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await authService.getMe(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: AUTH_MESSAGES.PROFILE_FETCH_SUCCESS,
    data: result,
  });
});

const authController = {
  registerCandidate,
  registerRecruiter,
  verifyEmail,
  login,
  refreshToken,
  logout,
  resendVerificationEmail,
  getMe,
};

export default authController;
