import type { RecruiterApplicantStatus } from "@/types/recruiter.type";

export interface ICompanyProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  description: string;
  website: string;
  location: string;
  companySize: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
    facebook?: string;
  } | null;
  isEmailVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IApplicantInflowChartItem {
  date: string;
  applications: number;
}

export interface IRecruiterApplicant {
  id: string;
  status: RecruiterApplicantStatus;
  createdAt: string;
  updatedAt?: string;
  candidate: {
    id: string;
    name: string;
    email: string;
    profilePicture?: { url: string; publicId: string } | null;
    title: string;
    bio: string;
    skills: string[];
    socialLinks: {
      linkedin?: string;
      github?: string;
      portfolio?: string;
      twitter?: string;
      facebook?: string;
    } | null;
    resume: string;
  };
  job: {
    id: string;
    title: string;
    location: string;
    hiringStatus: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

export interface IUpdateCompanyProfilePayload {
  name?: string;
  description?: string;
  website?: string;
  location?: string;
  companySize?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
    facebook?: string;
  } | null;
}

export type CandidateMatchLevel =
  | "Excellent Match"
  | "Strong Match"
  | "Good Match"
  | "Moderate Match"
  | "Weak Match"
  | "Low Match";

export interface IMatchedCandidateData {
  id: string;
  name: string;
  email: string;
  profilePicture?: {
    url: string;
    publicId: string;
  } | null;
  title: string;
  bio: string;
  skills: string[];
  socialLinks?: Record<string, string> | null;
  resume?: string;
  createdAt: string;
}

export interface ICandidateMatch {
  candidateId: string;
  matchScore: number;
  matchLevel: CandidateMatchLevel;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
  candidate: IMatchedCandidateData;
  matchedTechnicalSkills?: string[];
  missingRequiredSkills?: string[];
  matchedProfessionalSkills?: string[];
  matchedPreferredSkills?: string[];
  titleCompatibility?: number;
  bioCompatibility?: number;
  experienceCompatibility?: number;
  qualificationCompatibility?: number;
  responsibilityCompatibility?: number;
  mandatoryRequirementsPassed?: boolean;
  explanation?: string;
  rejectionReasons?: string[];
}

export interface ICandidateMatchingResponseData {
  jobId: string;
  job: {
    id: string;
    title: string;
    location: string;
    level: string;
    jobType: string;
    hiringStatus: string;
    category?: string;
  };
  matches: ICandidateMatch[];
  meta: {
    total: number;
    cached: boolean;
    evaluatedCount: number;
    timestamp: string;
    message?: string;
  };
}

