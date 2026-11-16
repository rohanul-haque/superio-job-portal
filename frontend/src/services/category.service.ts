import { categoryApi } from "@/api/category.api";
import type { ICategory } from "@/types/category";

export const categoryService = {
  async getAllCategories(params?: {
    search?: string;
    isActive?: string;
    isDeleted?: string;
  }): Promise<ICategory[]> {
    const res = await categoryApi.getAllCategories(params);
    return res.data.data || [];
  },

  async getCategoryById(id: string): Promise<ICategory> {
    const res = await categoryApi.getCategoryById(id);
    return res.data.data;
  },

  async createCategory(
    data: FormData | { name: string; isActive?: boolean },
  ): Promise<ICategory> {
    const res = await categoryApi.createCategory(data);
    return res.data.data;
  },

  async updateCategory(
    id: string,
    data: FormData | { name?: string; isActive?: boolean },
  ): Promise<ICategory> {
    const res = await categoryApi.updateCategory(id, data);
    return res.data.data;
  },

  async deleteCategory(id: string): Promise<ICategory> {
    const res = await categoryApi.deleteCategory(id);
    return res.data.data;
  },
};

export default categoryService;
