import type { IAuthUser } from "@/interfaces/auth.interface";

export type UserRole = "candidate" | "recruiter" | "admin";

export type CandidateProfile = IAuthUser & { role: "candidate" };
export type RecruiterProfile = IAuthUser & { role: "recruiter" };
export type AdminProfile = IAuthUser & { role: "admin" };
export type AuthUser = IAuthUser;

export type AuthVerificationStage = "checking" | "success" | "cross_device" | "error";
