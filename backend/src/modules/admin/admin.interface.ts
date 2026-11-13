export interface IAdminSeedPayload {
  name: string;
  email: string;
  password: string;
}

export interface IAdminSeedResult {
  isNew: boolean;
  email: string;
  message: string;
  id?: string;
}

export interface IGrowthChartItem {
  month: string;
  candidates: number;
  recruiters: number;
  jobs: number;
}

export interface ICategoryDistributionItem {
  name: string;
  count: number;
}

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
      createdAt: Date;
    }>;
    recruiters: Array<{
      id: string;
      name: string;
      email: string;
      image: string;
      status: string;
      createdAt: Date;
    }>;
    jobs: Array<{
      id: string;
      title: string;
      companyName: string;
      hiringStatus: string;
      visible: boolean;
      createdAt: Date;
    }>;
    applications: Array<{
      id: string;
      candidateName: string;
      jobTitle: string;
      companyName: string;
      status: string;
      createdAt: Date;
    }>;
  };
}

export interface IAdminCandidateItem {
  id: string;
  name: string;
  email: string;
  profilePicture?: { url: string; publicId: string } | null;
  title: string;
  skills: string[];
  resume: string;
  isEmailVerified: boolean;
  status: "active" | "blocked" | string;
  isDeleted: boolean;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminRecruiterItem {
  id: string;
  name: string;
  email: string;
  image: string;
  website: string;
  location: string;
  companySize: string;
  isEmailVerified: boolean;
  status: "active" | "blocked" | string;
  isDeleted: boolean;
  jobCount: number;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminJobItem {
  id: string;
  title: string;
  location: string;
  salary: number;
  jobType: string;
  level: string;
  hiringStatus: string;
  visible: boolean;
  isDeleted: boolean;
  deadline: Date;
  createdAt: Date;
  company: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  applicationCount: number;
}

export interface IModerateUserPayload {
  action?: "block" | "unblock" | "delete";
  status?: "active" | "blocked";
  isDeleted?: boolean;
}

export interface IModerateJobPayload {
  visible?: boolean;
  hiringStatus?: "Ongoing" | "Closed";
  isDeleted?: boolean;
}

export interface ITrashItem {
  id: string;
  type: "candidate" | "recruiter" | "job" | "category";
  title: string;
  subtitle: string;
  deletedAt: Date | null;
  meta?: Record<string, unknown>;
}

export interface IRestoreTrashPayload {
  type: "candidate" | "recruiter" | "job" | "category";
  id: string;
}

export interface ICloudinaryFile {
  url: string;
  publicId: string;
}

export interface IUpdateAdminProfilePayload {
  name?: string;
  email?: string;
  removeProfileImage?: boolean | string;
}

export interface IChangeAdminPasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IAdminProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  profilePicture?: ICloudinaryFile | null;
  profileImage?: ICloudinaryFile | null;
  createdAt: Date;
  updatedAt: Date;
}
