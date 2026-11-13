import type { IApiResponse } from "../types/auth";
import type { ICategory } from "../types/category";
import api from "./api";

export const categoryService = {
  async getAllCategories(params?: {
    search?: string;
    isActive?: string;
    isDeleted?: string;
  }): Promise<ICategory[]> {
    const res = await api.get<IApiResponse<ICategory[]>>("/categories", {
      params,
    });
    return res.data.data || [];
  },

  async getCategoryById(id: string): Promise<ICategory> {
    const res = await api.get<IApiResponse<ICategory>>(`/categories/${id}`);
    return res.data.data;
  },

  async createCategory(
    data: FormData | { name: string; isActive?: boolean },
  ): Promise<ICategory> {
    const res = await api.post<IApiResponse<ICategory>>("/categories", data);
    return res.data.data;
  },

  async updateCategory(
    id: string,
    data: FormData | { name?: string; isActive?: boolean },
  ): Promise<ICategory> {
    const res = await api.patch<IApiResponse<ICategory>>(
      `/categories/${id}`,
      data,
    );
    return res.data.data;
  },

  async deleteCategory(id: string): Promise<ICategory> {
    const res = await api.delete<IApiResponse<ICategory>>(`/categories/${id}`);
    return res.data.data;
  },
};

export default categoryService;
