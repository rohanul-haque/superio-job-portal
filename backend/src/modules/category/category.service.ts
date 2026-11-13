import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { deleteImage, uploadImage } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type {
  ICategoryFilterQuery,
  ICategoryIcon,
  ICategoryResponse,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";
import CATEGORY_MESSAGES from "./category.messages";

const ALPHANUMERIC_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generates a cryptographically secure random alphanumeric string of exact length.
 */
export const generateRandomAlphanumeric = (length = 10): string => {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC_CHARS[bytes[i] % ALPHANUMERIC_CHARS.length];
  }
  return result;
};

/**
 * Normalizes a category name into a URL-friendly slug prefix.
 */
export const normalizeSlugName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Generates an automatic slug in the format: category-name-xxxxxxxxxx
 * where xxxxxxxxxx is exactly 10 random alphanumeric characters.
 * Retries on MongoDB uniqueness collision.
 */
export const generateUniqueCategorySlug = async (
  name: string,
  excludeCategoryId?: string,
): Promise<string> => {
  const baseSlug = normalizeSlugName(name) || "category";
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const randomSuffix = generateRandomAlphanumeric(10);
    const candidateSlug = `${baseSlug}-${randomSuffix}`;

    const existing = await prisma.category.findFirst({
      where: {
        slug: candidateSlug,
        ...(excludeCategoryId ? { id: { not: excludeCategoryId } } : {}),
      },
    });

    if (!existing) {
      return candidateSlug;
    }
  }

  throw new AppError(
    StatusCodes.INTERNAL_SERVER_ERROR,
    "Failed to generate a unique category slug after multiple attempts.",
  );
};

const createCategory = async (
  adminId: string,
  payload: ICreateCategoryPayload,
  file?: Express.Multer.File,
): Promise<ICategoryResponse> => {
  // Validate that image file is provided (Mandatory)
  if (!file) {
    throw new AppError(StatusCodes.BAD_REQUEST, CATEGORY_MESSAGES.ICON_REQUIRED);
  }

  const name = payload.name.trim();

  // 1. Check for duplicate category name among non-deleted categories
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      isDeleted: false,
    },
  });

  if (existingCategory) {
    throw new AppError(StatusCodes.CONFLICT, CATEGORY_MESSAGES.ALREADY_EXISTS);
  }

  // 2. Automatically generate unique slug: category-name-xxxxxxxxxx
  const slug = await generateUniqueCategorySlug(name);

  // 3. Upload image to Cloudinary (Mandatory)
  let uploadedIcon: ICategoryIcon | null = null;

  const uniqueFilePublicId = `cat_${Date.now()}_${generateRandomAlphanumeric(8)}`;

  const uploadRes = await uploadImage(file, {
    folder: "Superio/categories",
    publicId: uniqueFilePublicId,
  });

  // Verify publicId is not already in use by another category
  const duplicatePublicId = await prisma.category.findFirst({
    where: {
      icon: { is: { publicId: uploadRes.publicId } },
    },
  });

  if (duplicatePublicId) {
    await deleteImage(uploadRes.publicId);
    throw new AppError(
      StatusCodes.CONFLICT,
      "Generated image identifier conflict. Please try again.",
    );
  }

  uploadedIcon = {
    url: uploadRes.url,
    publicId: uploadRes.publicId,
  };

  // 4. Create Category in MongoDB via Prisma
  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        icon: uploadedIcon,
        isActive: payload.isActive !== undefined ? payload.isActive : true,
        createdById: adminId,
      },
      include: {
        _count: {
          select: {
            jobs: {
              where: {
                isDeleted: false,
                visible: true,
                hiringStatus: "Ongoing",
              },
            },
          },
        },
      },
    });

    return {
      ...category,
      jobCount: category._count?.jobs || 0,
    };
  } catch (error) {
    // Clean up uploaded image if database creation failed
    if (uploadedIcon) {
      await deleteImage(uploadedIcon.publicId);
    }
    throw error;
  }
};

const getAllCategories = async (
  query?: ICategoryFilterQuery,
): Promise<ICategoryResponse[]> => {
  const where: {
    isDeleted: boolean;
    isActive?: boolean;
    OR?: Array<{
      name?: { contains: string; mode: "insensitive" };
      slug?: { contains: string; mode: "insensitive" };
    }>;
  } = {
    isDeleted: query?.isDeleted === "true" ? true : false,
  };

  if (query?.isActive === "true") {
    where.isActive = true;
  } else if (query?.isActive === "false") {
    where.isActive = false;
  } else if (query?.isActive !== "all") {
    where.isActive = true;
  }

  if (query?.search && query.search.trim()) {
    const search = query.search.trim();
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          jobs: {
            where: {
              isDeleted: false,
              visible: true,
              hiringStatus: "Ongoing",
            },
          },
        },
      },
    },
  });

  return categories.map((cat) => ({
    ...cat,
    jobCount: cat._count?.jobs || 0,
  }));
};

const getCategoryById = async (id: string): Promise<ICategoryResponse> => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          jobs: {
            where: {
              isDeleted: false,
              visible: true,
              hiringStatus: "Ongoing",
            },
          },
        },
      },
    },
  });

  if (!category || category.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, CATEGORY_MESSAGES.NOT_FOUND);
  }

  return {
    ...category,
    jobCount: category._count?.jobs || 0,
  };
};

const updateCategory = async (
  id: string,
  payload: IUpdateCategoryPayload,
  file?: Express.Multer.File,
): Promise<ICategoryResponse> => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory || existingCategory.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, CATEGORY_MESSAGES.NOT_FOUND);
  }

  const updateData: {
    name?: string;
    slug?: string;
    icon?: ICategoryIcon;
    isActive?: boolean;
    isDeleted?: boolean;
    deletedAt?: Date | null;
  } = {};

  // 1. If Category name changed, check uniqueness and regenerate slug
  if (payload.name && payload.name.trim() !== existingCategory.name) {
    const trimmedName = payload.name.trim();

    const duplicate = await prisma.category.findFirst({
      where: {
        id: { not: id },
        name: { equals: trimmedName, mode: "insensitive" },
        isDeleted: false,
      },
    });

    if (duplicate) {
      throw new AppError(StatusCodes.CONFLICT, CATEGORY_MESSAGES.ALREADY_EXISTS);
    }

    updateData.name = trimmedName;
    updateData.slug = await generateUniqueCategorySlug(trimmedName, id);
  }

  if (payload.isActive !== undefined) {
    updateData.isActive = payload.isActive;
  }

  if (payload.isDeleted !== undefined) {
    updateData.isDeleted = payload.isDeleted;
    updateData.deletedAt = payload.isDeleted ? new Date() : null;
  }

  // 2. Handle Image Upload / Replacement (Scenario B vs Scenario A)
  let newlyUploadedIcon: ICategoryIcon | null = null;
  const oldPublicId = existingCategory.icon?.publicId;

  if (file) {
    const uniqueFilePublicId = `cat_${Date.now()}_${generateRandomAlphanumeric(8)}`;

    const uploadRes = await uploadImage(file, {
      folder: "Superio/categories",
      publicId: uniqueFilePublicId,
    });

    // Check duplicate public ID
    const duplicatePublicId = await prisma.category.findFirst({
      where: {
        id: { not: id },
        icon: { is: { publicId: uploadRes.publicId } },
      },
    });

    if (duplicatePublicId) {
      await deleteImage(uploadRes.publicId);
      throw new AppError(
        StatusCodes.CONFLICT,
        "Cloudinary public identifier collision. Please re-upload.",
      );
    }

    newlyUploadedIcon = {
      url: uploadRes.url,
      publicId: uploadRes.publicId,
    };

    updateData.icon = newlyUploadedIcon;
  }

  // 3. Update Category in Prisma
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            jobs: {
              where: {
                isDeleted: false,
                visible: true,
                hiringStatus: "Ongoing",
              },
            },
          },
        },
      },
    });

    // 4. Safely delete old Cloudinary image only after database update succeeds
    if (newlyUploadedIcon && oldPublicId && oldPublicId !== newlyUploadedIcon.publicId) {
      // Check if any other category still references oldPublicId
      const otherReferencingCategory = await prisma.category.findFirst({
        where: {
          id: { not: id },
          icon: { is: { publicId: oldPublicId } },
        },
      });

      if (!otherReferencingCategory && oldPublicId !== "Superio/categories/default_category_placeholder") {
        await deleteImage(oldPublicId);
      }
    }

    return {
      ...updatedCategory,
      jobCount: updatedCategory._count?.jobs || 0,
    };
  } catch (error) {
    // If Prisma update failed, safely delete the newly uploaded image without destroying old image
    if (newlyUploadedIcon) {
      await deleteImage(newlyUploadedIcon.publicId);
    }
    throw error;
  }
};

const deleteCategory = async (id: string): Promise<ICategoryResponse> => {
  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing || existing.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, CATEGORY_MESSAGES.NOT_FOUND);
  }

  // Soft-deletion: does NOT delete the Cloudinary image
  const deleted = await prisma.category.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
    include: {
      _count: {
        select: {
          jobs: {
            where: {
              isDeleted: false,
              visible: true,
              hiringStatus: "Ongoing",
            },
          },
        },
      },
    },
  });

  return {
    ...deleted,
    jobCount: deleted._count?.jobs || 0,
  };
};

const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

export default categoryService;
