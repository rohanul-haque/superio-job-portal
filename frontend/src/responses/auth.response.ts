import type { IAuthUser } from "@/interfaces/auth.interface";

export interface IVerifyEmailResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
  role: string;
  message: string;
}

export interface IAuthResponse {
  user: IAuthUser;
  message?: string;
}
