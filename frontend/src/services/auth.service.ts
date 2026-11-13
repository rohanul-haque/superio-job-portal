import type {
  IApiResponse,
  IAuthUser,
  ICandidateRegisterPayload,
  ILoginPayload,
  IRecruiterRegisterPayload,
  IVerifyEmailCredentialsPayload,
  IVerifyEmailResponse,
} from "../types/auth";
import api from "./api";

export const authService = {
  async registerCandidate(
    payload: ICandidateRegisterPayload,
  ): Promise<IAuthUser> {
    const res = await api.post<IApiResponse<IAuthUser>>(
      "/auth/candidate/register",
      payload,
    );
    return res.data.data;
  },

  async registerRecruiter(
    payload: IRecruiterRegisterPayload,
  ): Promise<IAuthUser> {
    const res = await api.post<IApiResponse<IAuthUser>>(
      "/auth/recruiter/register",
      payload,
    );
    return res.data.data;
  },

  /**
   * Same-Browser Verification: relies on the HTTP-only emailVerificationToken cookie.
   */
  async verifyEmail(): Promise<IVerifyEmailResponse> {
    const res =
      await api.post<IApiResponse<IVerifyEmailResponse["user"]>>(
        "/auth/verify-email",
      );
    return {
      user: res.data.data,
      role: res.data.data.role,
      message: res.data.message,
    };
  },

  /**
   * Cross-Device / New-Browser Verification: login-gated via credentials.
   * Sets authenticated session cookies upon verification.
   */
  async verifyEmailWithCredentials(
    payload: IVerifyEmailCredentialsPayload,
  ): Promise<IVerifyEmailResponse> {
    const res = await api.post<IApiResponse<IVerifyEmailResponse["user"]>>(
      "/auth/verify-email/credentials",
      payload,
    );
    return {
      user: res.data.data,
      role: res.data.data.role,
      message: res.data.message,
    };
  },

  async resendVerification(email: string): Promise<string> {
    const res = await api.post<IApiResponse<{ email: string }>>(
      "/auth/resend-verification",
      { email },
    );
    return res.data.message;
  },

  async login(payload: ILoginPayload): Promise<{ user: IAuthUser }> {
    const res = await api.post<IApiResponse<{ user: IAuthUser }>>(
      "/auth/login",
      payload,
    );
    return res.data.data;
  },

  async refreshToken(): Promise<void> {
    await api.post<IApiResponse<null>>("/auth/refresh-token", {});
  },

  async logout(): Promise<void> {
    await api.post<IApiResponse<null>>("/auth/logout", {});
  },

  async getMe(): Promise<IAuthUser> {
    const res = await api.get<IApiResponse<IAuthUser>>("/auth/me");
    return res.data.data;
  },
};

export default authService;
