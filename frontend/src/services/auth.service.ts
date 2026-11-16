import { authApi } from "@/api/auth.api";
import type {
  IAuthUser,
  ICandidateRegisterPayload,
  ILoginPayload,
  IRecruiterRegisterPayload,
  IVerifyEmailCredentialsPayload,
} from "@/interfaces/auth.interface";
import type { IVerifyEmailResponse } from "@/responses/auth.response";

export const authService = {
  async registerCandidate(
    payload: ICandidateRegisterPayload,
  ): Promise<IAuthUser> {
    const res = await authApi.registerCandidate(payload);
    return res.data.data;
  },

  async registerRecruiter(
    payload: IRecruiterRegisterPayload,
  ): Promise<IAuthUser> {
    const res = await authApi.registerRecruiter(payload);
    return res.data.data;
  },

  /**
   * Same-Browser Verification: relies on the HTTP-only emailVerificationToken cookie.
   */
  async verifyEmail(): Promise<IVerifyEmailResponse> {
    const res = await authApi.verifyEmail();
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
    const res = await authApi.verifyEmailWithCredentials(payload);
    return {
      user: res.data.data,
      role: res.data.data.role,
      message: res.data.message,
    };
  },

  async resendVerification(email: string): Promise<string> {
    const res = await authApi.resendVerification(email);
    return res.data.message;
  },

  async login(payload: ILoginPayload): Promise<{ user: IAuthUser }> {
    const res = await authApi.login(payload);
    return res.data.data;
  },

  async refreshToken(): Promise<void> {
    await authApi.refreshToken();
  },

  async logout(): Promise<void> {
    await authApi.logout();
  },

  async getMe(): Promise<IAuthUser> {
    const res = await authApi.getMe();
    return res.data.data;
  },
};

export default authService;
