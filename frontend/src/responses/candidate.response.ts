import type { IApplicationActivityItem } from "@/interfaces/candidate.interface";

export interface ICandidateDashboardStats {
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
    createdAt: string;
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
