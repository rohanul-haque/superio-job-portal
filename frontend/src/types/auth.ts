export type UserRole = "candidate" | "recruiter" | "admin";

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
  resume?: {
    url: string;
    publicId: string;
  } | string | null;
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

export type CandidateProfile = IAuthUser & { role: "candidate" };
export type RecruiterProfile = IAuthUser & { role: "recruiter" };
export type AdminProfile = IAuthUser & { role: "admin" };
export type AuthUser = IAuthUser;

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

export interface IApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  errorSources?: Array<{
    path: string | number;
    message: string;
  }>;
}

export type ApiResponse<T> = IApiResponse<T>;

export interface IApiError {
  statusCode: number;
  message: string;
  errorSources?: Array<{
    path: string | number;
    message: string;
  }>;
}
