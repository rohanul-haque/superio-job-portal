import type {
  IAdminCandidate,
  IAdminJob,
  IAdminRecruiter,
  ICategoryDistributionItem,
  IGrowthChartItem,
  ITrashItem,
} from "@/interfaces/admin.interface";

export interface IAdminDashboardStats {
  stats: {
    totalCandidates: number;
    totalRecruiters: number;
    totalActiveJobs: number;
    totalApplications: number;
    totalHired: number;
    totalModerated: number;
  };
  growthChart: IGrowthChartItem[];
  categoryDistribution: ICategoryDistributionItem[];
  recentActivity: {
    candidates: Array<{
      id: string;
      name: string;
      email: string;
      profilePicture?: { url: string; publicId: string } | null;
      status: string;
      createdAt: string;
    }>;
    recruiters: Array<{
      id: string;
      name: string;
      email: string;
      image: string;
      status: string;
      createdAt: string;
    }>;
    jobs: Array<{
      id: string;
      title: string;
      companyName: string;
      hiringStatus: string;
      visible: boolean;
      createdAt: string;
    }>;
    applications: Array<{
      id: string;
      candidateName: string;
      jobTitle: string;
      companyName: string;
      status: string;
      createdAt: string;
    }>;
  };
}

export interface IAdminCandidatesResponse {
  candidates: IAdminCandidate[];
}

export interface IAdminRecruitersResponse {
  recruiters: IAdminRecruiter[];
}

export interface IAdminJobsResponse {
  jobs: IAdminJob[];
}

export interface IAdminTrashResponse {
  items: ITrashItem[];
}
