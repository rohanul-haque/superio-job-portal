import type { IJob } from "@/types/job";

export interface ICloudinaryFile {
  url: string;
  publicId: string;
}

export interface ICandidateProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: ICloudinaryFile | null;
  title: string;
  bio: string;
  skills: string[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    facebook?: string;
    twitter?: string;
  } | null;
  resume?: ICloudinaryFile | string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IApplicationActivityItem {
  date: string;
  applications: number;
}

export interface IUpdateCandidateProfilePayload {
  name?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    facebook?: string;
    twitter?: string;
  } | null;
}

export type MatchLevel =
  | "Excellent Match"
  | "Good Match"
  | "Moderate Match"
  | "Low Match";

export interface IJobRecommendation {
  jobId: string;
  matchScore: number;
  matchLevel: MatchLevel;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
  job: IJob;
}

export interface IRecommendationsResponseData {
  recommendations: IJobRecommendation[];
  meta: {
    total: number;
    profileCompleted: boolean;
    cached: boolean;
    evaluatedCount: number;
    timestamp: string;
    message?: string;
  };
}
