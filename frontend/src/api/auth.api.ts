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

export const authApi = {
  registerCandidate(payload: ICandidateRegisterPayload) {
    return api.post<IApiResponse<IAuthUser>>("/auth/candidate/register", payload);
  },

  registerRecruiter(payload: IRecruiterRegisterPayload) {
    return api.post<IApiResponse<IAuthUser>>("/auth/recruiter/register", payload);
  },

  verifyEmail() {
    return api.post<IApiResponse<IVerifyEmailResponse["user"]>>("/auth/verify-email");
  },

  verifyEmailWithCredentials(payload: IVerifyEmailCredentialsPayload) {
    return api.post<IApiResponse<IVerifyEmailResponse["user"]>>(
      "/auth/verify-email/credentials",
      payload,
    );
  },

  resendVerification(email: string) {
    return api.post<IApiResponse<{ email: string }>>("/auth/resend-verification", { email });
  },

  login(payload: ILoginPayload) {
    return api.post<IApiResponse<{ user: IAuthUser }>>("/auth/login", payload);
  },

  refreshToken() {
    return api.post<IApiResponse<null>>("/auth/refresh-token", {});
  },

  logout() {
    return api.post<IApiResponse<null>>("/auth/logout", {});
  },

  getMe() {
    return api.get<IApiResponse<IAuthUser>>("/auth/me");
  },
};

export default authApi;
