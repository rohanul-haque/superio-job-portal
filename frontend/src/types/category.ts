export interface ICategoryIcon {
  url: string;
  publicId: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  icon: ICategoryIcon;
  isActive: boolean;
  createdById?: string;
  isDeleted?: boolean;
  jobCount?: number;
  _count?: {
    jobs: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategoryFormData {
  name: string;
  isActive?: boolean;
  image?: File | null;
}
