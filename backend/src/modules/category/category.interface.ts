export interface ICategoryIcon {
  url: string;
  publicId: string;
}

export interface ICreateCategoryPayload {
  name: string;
  isActive?: boolean;
}

export interface IUpdateCategoryPayload {
  name?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface ICategoryFilterQuery {
  search?: string;
  isActive?: string;
  isDeleted?: string;
}

export interface ICategoryResponse {
  id: string;
  name: string;
  slug: string;
  icon: ICategoryIcon;
  isActive: boolean;
  createdById: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  jobCount?: number;
  _count?: {
    jobs: number;
  };
}
