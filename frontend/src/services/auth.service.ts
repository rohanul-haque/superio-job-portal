import {
  getMe as getMeApi,
  login as loginApi,
  logout as logoutApi,
  refreshToken as refreshTokenApi,
  registerCandidate as registerCandidateApi,
  registerRecruiter as registerRecruiterApi,
  resendVerification as resendVerificationApi,
  verifyEmail as verifyEmailApi,
  verifyEmailWithCredentials as verifyEmailWithCredentialsApi,
} from "@/api/auth.api";
import type {
  IAuthUser,
  ICandidateRegisterPayload,
  ILoginPayload,
  IRecruiterRegisterPayload,
  IVerifyEmailCredentialsPayload,
} from "@/interfaces/auth.interface";
import type { IVerifyEmailResponse } from "@/responses/auth.response";

export const registerCandidate = async (
  payload: ICandidateRegisterPayload,
): Promise<IAuthUser> => {
  const res = await registerCandidateApi(payload);
  return res.data.data;
};

export const registerRecruiter = async (
  payload: IRecruiterRegisterPayload,
): Promise<IAuthUser> => {
  const res = await registerRecruiterApi(payload);
  return res.data.data;
};

/**
 * Same-Browser Verification: relies on the HTTP-only emailVerificationToken cookie.
 */
export const verifyEmail = async (): Promise<IVerifyEmailResponse> => {
  const res = await verifyEmailApi();
  return {
    user: res.data.data,
    role: res.data.data.role,
    message: res.data.message,
  };
};

/**
 * Cross-Device / New-Browser Verification: login-gated via credentials.
 * Sets authenticated session cookies upon verification.
 */
export const verifyEmailWithCredentials = async (
  payload: IVerifyEmailCredentialsPayload,
): Promise<IVerifyEmailResponse> => {
  const res = await verifyEmailWithCredentialsApi(payload);
  return {
    user: res.data.data,
    role: res.data.data.role,
    message: res.data.message,
  };
};

export const resendVerification = async (email: string): Promise<string> => {
  const res = await resendVerificationApi(email);
  return res.data.message;
};

export const login = async (
  payload: ILoginPayload,
): Promise<{ user: IAuthUser }> => {
  const res = await loginApi(payload);
  return res.data.data;
};

export const refreshToken = async (): Promise<void> => {
  await refreshTokenApi();
};

export const logout = async (): Promise<void> => {
  await logoutApi();
};

export const getMe = async (): Promise<IAuthUser> => {
  const res = await getMeApi();
  return res.data.data;
};
