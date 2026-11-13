export interface IUpdateCompanyProfilePayload {
  name?: string;
  description?: string;
  website?: string;
  location?: string;
  companySize?: string;
  socialLinks?: Record<string, string> | string;
}

export interface ICompanyProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  description: string;
  website: string;
  location: string;
  companySize: string;
  socialLinks: Record<string, string> | null;
  isEmailVerified: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplicantInflowChartItem {
  date: string;
  applications: number;
}

export interface IRecruiterDashboardStatsResponse {
  stats: {
    totalJobsPosted: number;
    ongoingJobs: number;
    closedJobs: number;
    totalApplicants: number;
    hiredCandidates: number;
  };
  inflowChart: IApplicantInflowChartItem[];
  recentApplicants: Array<{
    id: string;
    status: string;
    createdAt: Date;
    candidate: {
      id: string;
      name: string;
      email: string;
      profilePicture?: { url: string; publicId: string } | null;
      title: string;
      resume: string;
    };
    job: {
      id: string;
      title: string;
    };
  }>;
}

export interface IRecruiterApplicantResponse {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  candidate: {
    id: string;
    name: string;
    email: string;
    profilePicture?: { url: string; publicId: string } | null;
    title: string;
    bio: string;
    skills: string[];
    socialLinks: Record<string, string> | null;
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

