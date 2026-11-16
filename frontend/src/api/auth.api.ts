import type { IApiResponse } from "@/interfaces/api-response.interface";
import type {
  IAuthUser,
  ICandidateRegisterPayload,
  ILoginPayload,
  IRecruiterRegisterPayload,
  IVerifyEmailCredentialsPayload,
} from "@/interfaces/auth.interface";
import type { IVerifyEmailResponse } from "@/responses/auth.response";
import api from "@/services/api";

export const registerCandidate = (payload: ICandidateRegisterPayload) => {
  return api.post<IApiResponse<IAuthUser>>("/auth/candidate/register", payload);
};

export const registerRecruiter = (payload: IRecruiterRegisterPayload) => {
  return api.post<IApiResponse<IAuthUser>>("/auth/recruiter/register", payload);
};

export const verifyEmail = () => {
  return api.post<IApiResponse<IVerifyEmailResponse["user"]>>("/auth/verify-email");
};

export const verifyEmailWithCredentials = (
  payload: IVerifyEmailCredentialsPayload,
) => {
  return api.post<IApiResponse<IVerifyEmailResponse["user"]>>(
    "/auth/verify-email/credentials",
    payload,
  );
};

export const resendVerification = (email: string) => {
  return api.post<IApiResponse<{ email: string }>>("/auth/resend-verification", {
    email,
  });
};

export const login = (payload: ILoginPayload) => {
  return api.post<IApiResponse<{ user: IAuthUser }>>("/auth/login", payload);
};

export const refreshToken = () => {
  return api.post<IApiResponse<null>>("/auth/refresh-token", {});
};

export const logout = () => {
  return api.post<IApiResponse<null>>("/auth/logout", {});
};

export const getMe = () => {
  return api.get<IApiResponse<IAuthUser>>("/auth/me");
};
