import { CategoryManagementList } from "@/components/admin/categories/CategoryManagementList";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Category Management — HireNest Admin",
  description: "Create, edit, toggle active status, and manage dynamic job categories with automated slugs.",
};

export default function AdminCategoriesPage() {
  return <CategoryManagementList />;
}
