"use client";

import CategoryModal from "@/components/admin/CategoryModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import categoryService from "@/services/category.service";
import type { ICategory } from "@/types/category";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Filter,
  FolderPlus,
  ImageIcon,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAllCategories({
        search: searchQuery.trim() || undefined,
        isActive: statusFilter,
        isDeleted: "false",
      });
      setCategories(data);
    } catch (err: unknown) {
      let message = "Failed to load categories.";
      if (err instanceof Error) message = err.message;
      toast.error("Error loading categories", { description: message });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: ICategory) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setDeletingId(categoryToDelete.id);
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      toast.success("Category soft-deleted", {
        description: `Category "${categoryToDelete.name}" was marked as deleted.`,
      });
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (err: unknown) {
      let message = "Failed to delete category.";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        message = (err as { response: { data: { message: string } } }).response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error("Deletion failed", { description: message });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Category Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, edit, toggle active status, and manage dynamic job categories with automated slugs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchCategories()}
            disabled={isLoading}
            className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-purple-600" : ""}`}
            />
            Refresh Categories
          </Button>

          <Button
            onClick={handleOpenCreateModal}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
          >
            <FolderPlus className="h-4 w-4" />
            Create Category
          </Button>
        </div>
      </div>

        {/* Filters Bar */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by category name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  statusFilter === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("true")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  statusFilter === "true"
                    ? "bg-white text-emerald-700 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("false")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  statusFilter === "false"
                    ? "bg-white text-slate-800 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Categories Table Card */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-3 text-xs font-medium text-slate-500">
                  Loading categories...
                </p>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-800">
                  No Categories Found
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  {searchQuery
                    ? `No categories matching "${searchQuery}". Try a different keyword.`
                    : "You haven't added any job categories yet. Click 'Add Category' to create the first one."}
                </p>
                <Button
                  onClick={handleOpenCreateModal}
                  size="sm"
                  className="mt-4 text-xs bg-blue-600 hover:bg-blue-700"
                >
                  <FolderPlus className="mr-1.5 h-3.5 w-3.5" />
                  Add First Category
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4 sm:px-6">Category</th>
                      <th className="py-3 px-4 sm:px-6">Slug (Auto-Generated)</th>
                      <th className="py-3 px-4 sm:px-6 text-center">Open Jobs</th>
                      <th className="py-3 px-4 sm:px-6 text-center">Status</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {categories.map((category) => {
                      const count = category.jobCount ?? category._count?.jobs ?? 0;
                      return (
                        <tr
                          key={category.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          {/* Category Name & Thumbnail */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 p-1">
                                {category.icon?.url ? (
                                  <img
                                    src={category.icon.url}
                                    alt={category.name}
                                    className="h-full w-full object-contain rounded-lg"
                                  />
                                ) : (
                                  <ImageIcon className="h-5 w-5 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">
                                  {category.name}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  ID: {category.id.slice(-6)}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Auto-Generated Slug */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-medium text-slate-700 border border-slate-200">
                              {category.slug}
                            </code>
                          </td>

                          {/* Open Jobs */}
                          <td className="py-3.5 px-4 sm:px-6 text-center">
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                              <Briefcase className="h-3 w-3 text-slate-400" />
                              {count}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 sm:px-6 text-center">
                            {category.isActive ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] gap-1 font-semibold cursor-default select-none"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-800 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] gap-1 font-semibold cursor-default select-none"
                              >
                                <XCircle className="h-3 w-3" />
                                Inactive
                              </Badge>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEditModal(category)}
                                className="h-8 px-2.5 text-xs text-slate-700 hover:text-blue-600 hover:border-blue-300"
                              >
                                <Pencil className="h-3.5 w-3.5 sm:mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCategoryToDelete(category)}
                                className="h-8 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:border-red-200"
                              >
                                <Trash2 className="h-3.5 w-3.5 sm:mr-1" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        {categoryToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => !deletingId && setCategoryToDelete(null)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Confirm Soft Deletion
                  </h3>
                  <p className="text-xs text-slate-500">
                    This action will soft-delete the category.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete category{" "}
                <span className="font-bold text-slate-900">
                  &quot;{categoryToDelete.name}&quot;
                </span>
                ? It will be hidden from public job searches. (Its Cloudinary asset will remain securely archived).
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCategoryToDelete(null)}
                  disabled={Boolean(deletingId)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={confirmDeleteCategory}
                  disabled={Boolean(deletingId)}
                  className="text-xs bg-red-600 hover:bg-red-700"
                >
                  {deletingId ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

      {/* Category Create/Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSuccess={() => fetchCategories()}
      />
    </div>
  );
}

