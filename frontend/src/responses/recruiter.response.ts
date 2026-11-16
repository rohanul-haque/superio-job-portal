import type { IApplicantInflowChartItem } from "@/interfaces/recruiter.interface";

export interface IRecruiterDashboardRecentApplicant {
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
  recentApplicants: IRecruiterDashboardRecentApplicant[];
}
