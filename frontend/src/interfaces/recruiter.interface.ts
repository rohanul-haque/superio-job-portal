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
