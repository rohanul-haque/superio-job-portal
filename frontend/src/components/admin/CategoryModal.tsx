"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import categoryService from "@/services/category.service";
import type { ICategory } from "@/types/category";
import {
  AlertCircle,
  CheckCircle2,
  FolderPlus,
  ImageIcon,
  Loader2,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ICategory | null;
  onSuccess: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSuccess,
}) => {
  const isEditMode = Boolean(category);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync state when modal opens or category changes
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name || "");
        setIsActive(category.isActive ?? true);
        setSelectedFile(null);
        setPreviewUrl(category.icon?.url || null);
      } else {
        setName("");
        setIsActive(true);
        setSelectedFile(null);
        setPreviewUrl(null);
      }
      setFormError(null);
    }
  }, [isOpen, category]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type", {
        description: "Only JPEG, PNG, and WEBP formats are allowed.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeded", {
        description: "Image size must be less than 5 MB.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // If editing and user cancels replacing, revert to existing icon
    if (isEditMode && category?.icon?.url) {
      setPreviewUrl(category.icon.url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Category name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setFormError("Category name must be at least 2 characters.");
      return;
    }

    // In Create mode, Category icon/image is strictly mandatory
    if (!isEditMode && !selectedFile) {
      setFormError("Category icon/image is mandatory. Please upload an image file.");
      toast.error("Image required", {
        description: "Please select an image file for the new category.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("isActive", String(isActive));

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (isEditMode && category) {
        await categoryService.updateCategory(category.id, formData);
        toast.success("Category updated successfully!", {
          description: `Category "${trimmedName}" has been updated.`,
        });
      } else {
        await categoryService.createCategory(formData);
        toast.success("Category created successfully!", {
          description: `Category "${trimmedName}" has been created with an automatic slug.`,
        });
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      let message = "An error occurred while saving the category.";
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
      setFormError(message);
      toast.error("Operation failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {isEditMode ? (
              <Pencil className="h-5 w-5" />
            ) : (
              <FolderPlus className="h-5 w-5" />
            )}
          </div>
          <div>
            <h2
              id="category-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              {isEditMode ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditMode
                ? "Update category details and manage its Cloudinary icon."
                : "Create a job category with an auto-generated slug and Cloudinary icon."}
            </p>
          </div>
        </div>

        {/* Form Error Alert */}
        {formError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
            <p className="leading-relaxed font-medium">{formError}</p>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Name */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name" className="text-xs font-semibold text-slate-700">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category-name"
              type="text"
              placeholder="e.g. Software Development, Marketing, Design"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
              className="text-sm"
            />
          </div>

          {/* Automatic Slug Preview Info */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
              Automatic Slug System
            </div>
            {isEditMode && category?.slug ? (
              <p className="text-[11px] text-slate-500">
                Current slug: <code className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-blue-700 font-semibold">{category.slug}</code>. If the category name is changed, a new slug with a 10-character unique suffix will be generated automatically.
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">
                Slug will be generated automatically upon creation in the format: <code className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-blue-700 font-semibold">category-name-xxxxxxxxxx</code> (10 random alphanumeric chars).
              </p>
            )}
          </div>

          {/* Cloudinary Image Upload Section */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700">
              Category Icon / Image{" "}
              {!isEditMode ? (
                <span className="text-red-500 font-bold">* (Required)</span>
              ) : (
                <span className="text-slate-400 font-normal">(Optional on update)</span>
              )}
            </Label>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="hidden"
              id="category-image-input"
            />

            {previewUrl ? (
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <img
                    src={previewUrl}
                    alt="Category Preview"
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">
                    {selectedFile ? selectedFile.name : "Current Cloudinary Image"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload`
                      : "Managed in Cloudinary"}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSubmitting}
                      className="h-7 px-2.5 text-xs text-slate-700 hover:bg-white"
                    >
                      <Upload className="mr-1.5 h-3 w-3" />
                      {selectedFile ? "Change File" : "Replace Image"}
                    </Button>
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={isSubmitting}
                        className="h-7 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="mr-1.5 h-3 w-3" />
                        {isEditMode ? "Cancel Replace" : "Remove"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-red-200/80 bg-red-50/20 p-5 text-center transition hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition">
                  Click to upload category icon <span className="text-red-500 font-bold">*</span>
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  PNG, JPG, WEBP up to 5 MB • Mandatory for new category
                </p>
              </div>
            )}
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5">
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Active Status
              </div>
              <div className="text-[11px] text-slate-500">
                Active categories are visible to users on the homepage and job filters.
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isSubmitting}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
            </label>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;

