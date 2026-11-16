import type { AdminTrashType, AdminUserStatus } from "@/types/admin.type";

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

export interface IAdminCandidate {
  id: string;
  name: string;
  email: string;
  profilePicture?: { url: string; publicId: string } | null;
  title: string;
  skills: string[];
  resume: string;
  isEmailVerified: boolean;
  status: AdminUserStatus;
  isDeleted: boolean;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminRecruiter {
  id: string;
  name: string;
  email: string;
  image: string;
  website: string;
  location: string;
  companySize: string;
  isEmailVerified: boolean;
  status: AdminUserStatus;
  isDeleted: boolean;
  jobCount: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminJob {
  id: string;
  title: string;
  location: string;
  salary: number;
  jobType: string;
  level: string;
  hiringStatus: string;
  visible: boolean;
  isDeleted: boolean;
  deadline: string;
  createdAt: string;
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

export interface ITrashItem {
  id: string;
  type: AdminTrashType;
  title: string;
  subtitle: string;
  deletedAt: string | null;
  meta?: Record<string, unknown>;
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

export interface IRestoreTrashPayload {
  type: AdminTrashType;
  id: string;
}

export interface IAdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  profilePicture?: {
    url: string;
    publicId: string;
  } | null;
  profileImage?: {
    url: string;
    publicId: string;
  } | null;
  createdAt: string;
  updatedAt: string;
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
