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

export interface IRecruiterDashboardStats {
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
    createdAt: string;
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

export interface IRecruiterApplicant {
  id: string;
  status: "Pending" | "Shortlisted" | "Accepted" | "Rejected" | "Withdrawn";
  createdAt: string;
  updatedAt: string;
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

