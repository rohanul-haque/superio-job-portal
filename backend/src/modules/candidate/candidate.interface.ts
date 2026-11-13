export interface ICloudinaryFile {
  url: string;
  publicId: string;
}

export interface IUpdateCandidateProfilePayload {
  name?: string;
  title?: string;
  bio?: string;
  skills?: string[] | string;
  socialLinks?: Record<string, string> | string;
}

export interface ICandidateProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: ICloudinaryFile | null;
  title: string;
  bio: string;
  skills: string[];
  socialLinks: Record<string, string> | null;
  resume?: ICloudinaryFile | null;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplicationActivityItem {
  date: string;
  applications: number;
}

export interface ICandidateDashboardStatsResponse {
  stats: {
    totalApplied: number;
    pending: number;
    shortlisted: number;
    accepted: number;
    rejected: number;
  };
  activityChart: IApplicationActivityItem[];
  recentApplications: Array<{
    id: string;
    status: string;
    createdAt: Date;
    job: {
      id: string;
      title: string;
      location: string;
      jobType: string;
      salary: number;
      hiringStatus: string;
    };
    company: {
      id: string;
      name: string;
      image: string;
      location: string;
    };
  }>;
}

