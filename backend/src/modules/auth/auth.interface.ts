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
  role?: "candidate" | "recruiter" | "admin";
}

export interface IVerifyEmailCredentialsPayload {
  email: string;
  password: string;
}

export interface IResendVerificationPayload {
  email: string;
}

export interface IRefreshTokenPayload {
  refreshToken?: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ICandidateProfileDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  bio: string;
  skills: string[];
  isEmailVerified: boolean;
  status: string;
  createdAt: Date;
}

export interface IRecruiterProfileDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  companySize: string;
  website: string;
  description: string;
  isEmailVerified: boolean;
  status: string;
  createdAt: Date;
}

export interface IAuthUserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  profilePicture?: { url: string; publicId: string } | null;
  title?: string;
  bio?: string;
  skills?: string[];
  resume?: string | { url: string; publicId: string } | null;
  location?: string;
  companySize?: string;
  website?: string;
  description?: string;
  socialLinks?: unknown;
  isEmailVerified: boolean;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IRegistrationResult<T> {
  user: T;
  verificationToken: string;
}

export interface ILoginResult {
  accessToken: string;
  refreshToken: string;
  user: Omit<IAuthUserDTO, "password">;
}

export interface IRefreshTokenResult {
  accessToken: string;
}

export interface IVerifyEmailResponseDTO {
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

export interface IResendVerificationResponseDTO {
  email: string;
  message: string;
  verificationToken: string;
}

export type UserRole = "candidate" | "recruiter" | "admin";

export interface IAuthAccount {
  id: string;
  email: string;
  role: string;
  name: string;
  image?: string;
  profilePicture?: { url: string; publicId: string } | null;
  isEmailVerified: boolean;
  status: string;
  isDeleted: boolean;
}

export interface IAuthUserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  image?: string;
  profilePicture?: { url: string; publicId: string } | null;
  title?: string;
  bio?: string;
  skills?: string[];
  resume?: string | { url: string; publicId: string } | null;
  location?: string;
  companySize?: string;
  website?: string;
  description?: string;
  socialLinks?: unknown;
  isEmailVerified: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
