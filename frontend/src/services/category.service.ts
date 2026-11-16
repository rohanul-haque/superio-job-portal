import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  getAllCategories as getAllCategoriesApi,
  getCategoryById as getCategoryByIdApi,
  updateCategory as updateCategoryApi,
} from "@/api/category.api";
import type { ICategory } from "@/types/category";

export const getAllCategories = async (params?: {
  search?: string;
  isActive?: string;
  isDeleted?: string;
}): Promise<ICategory[]> => {
  const res = await getAllCategoriesApi(params);
  return res.data.data || [];
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  const res = await getCategoryByIdApi(id);
  return res.data.data;
};

export const createCategory = async (
  data: FormData | { name: string; isActive?: boolean },
): Promise<ICategory> => {
  const res = await createCategoryApi(data);
  return res.data.data;
};

export const updateCategory = async (
  id: string,
  data: FormData | { name?: string; isActive?: boolean },
): Promise<ICategory> => {
  const res = await updateCategoryApi(id, data);
  return res.data.data;
};

export const deleteCategory = async (id: string): Promise<ICategory> => {
  const res = await deleteCategoryApi(id);
  return res.data.data;
};
