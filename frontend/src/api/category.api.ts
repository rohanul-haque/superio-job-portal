import type { IApiResponse } from "@/interfaces/api-response.interface";
import type { ICategory } from "@/types/category";
import api from "@/services/api";

export const categoryApi = {
  getAllCategories(params?: {
    search?: string;
    isActive?: string;
    isDeleted?: string;
  }) {
    return api.get<IApiResponse<ICategory[]>>("/categories", { params });
  },

  getCategoryById(id: string) {
    return api.get<IApiResponse<ICategory>>(`/categories/${id}`);
  },

  createCategory(data: FormData | { name: string; isActive?: boolean }) {
    return api.post<IApiResponse<ICategory>>("/categories", data);
  },

  updateCategory(
    id: string,
    data: FormData | { name?: string; isActive?: boolean },
  ) {
    return api.patch<IApiResponse<ICategory>>(`/categories/${id}`, data);
  },

  deleteCategory(id: string) {
    return api.delete<IApiResponse<ICategory>>(`/categories/${id}`);
  },
};

export default categoryApi;
