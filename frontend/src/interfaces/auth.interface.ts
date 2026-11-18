import type { UserRole } from "@/types/auth.type";

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  profilePicture?: {
    url: string;
    publicId: string;
  } | null;
  title?: string;
  bio?: string;
  skills?: string[];
  resume?:
    | {
        url: string;
        publicId: string;
      }
    | string
    | null;
  location?: string;
  companySize?: string;
  website?: string;
  description?: string;
  socialLinks?: unknown;
  isEmailVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ICandidateRegisterPayload {
  name: string;
  email: string;
  password: string;
  title?: string;
  bio?: string;
  skills?: string[];
}

export interface IRecruiterRegisterPayload {
  name: string;
  email: string;
  password: string;
  location?: string;
  companySize?: string;
  website?: string;
  description?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
  role?: UserRole;
}

export interface IVerifyEmailCredentialsPayload {
  email: string;
  password: string;
}

export interface IResendVerificationPayload {
  email: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  newPassword: string;
}
