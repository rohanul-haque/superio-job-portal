import { v2 as cloudinary } from "cloudinary";
import config from "../config";

// Initialize Cloudinary with environment configuration
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface ICloudinaryUploadResult {
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

export interface ICloudinaryResource {
  publicId: string;
  url: string;
  format: string;
  bytes: number;
}

export interface IUploadImageOptions {
  folder?: string;
  publicId?: string;
  resourceType?: "image" | "raw" | "auto";
  format?: string;
}

/**
 * Uploads an image or document (e.g. PDF resume) Buffer or file path to Cloudinary.
 */
export const uploadFile = async (
  file: Buffer | Express.Multer.File | string,
  options?: IUploadImageOptions,
): Promise<ICloudinaryUploadResult> => {
  const folder = options?.folder || "Superio/uploads";
  const resource_type = options?.resourceType || "auto";

  const buffer =
    typeof file === "string"
      ? null
      : Buffer.isBuffer(file)
        ? file
        : file.buffer;

  if (buffer) {
    return new Promise<ICloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: options?.publicId,
          resource_type,
          format:
            options?.format || (resource_type === "raw" ? "pdf" : undefined),
          overwrite: false,
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              error ||
                new Error("Cloudinary file upload failed with no result."),
            );
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        },
      );
      uploadStream.end(buffer);
    });
  }

  const result = await cloudinary.uploader.upload(file as string, {
    folder,
    public_id: options?.publicId,
    resource_type,
    overwrite: false,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    bytes: result.bytes,
  };
};

/**
 * Uploads an image Buffer or file path to Cloudinary.
 * Defaults to the 'Superio/categories' folder.
 */
export const uploadImage = async (
  file: Buffer | Express.Multer.File | string,
  options?: IUploadImageOptions,
): Promise<ICloudinaryUploadResult> => {
  return uploadFile(file, {
    folder: options?.folder || "Superio/categories",
    publicId: options?.publicId,
    resourceType: options?.resourceType || "image",
  });
};

/**
 * Uploads a profile picture Buffer or file path to Cloudinary.
 * Defaults to 'Superio/profile-pictures' folder with image resource type.
 */
export const uploadProfilePicture = async (
  file: Buffer | Express.Multer.File | string,
  options?: IUploadImageOptions,
): Promise<ICloudinaryUploadResult> => {
  return uploadFile(file, {
    folder: options?.folder || "Superio/profile-pictures",
    publicId: options?.publicId,
    resourceType: "image",
  });
};

/**
 * Uploads a resume document Buffer or file path to Cloudinary.
 * Defaults to 'Superio/resumes' folder with raw document resource type.
 */
export const uploadResumeDocument = async (
  file: Buffer | Express.Multer.File | string,
  options?: IUploadImageOptions,
): Promise<ICloudinaryUploadResult> => {
  return uploadFile(file, {
    folder: options?.folder || "Superio/resumes",
    publicId: options?.publicId,
    resourceType: "raw",
    format: "pdf",
  });
};

/**
 * Deletes an asset (image or raw document) from Cloudinary using its publicId.
 */
export const deleteAsset = async (
  publicId: string,
  resourceType: "image" | "raw" | "auto" = "image",
): Promise<boolean> => {
  if (!publicId || publicId.trim() === "") return false;
  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType === "auto" ? "image" : resourceType,
      invalidate: true,
    });
    return res.result === "ok";
  } catch (error) {
    console.error(
      `Failed to delete Cloudinary asset [${resourceType}]: ${publicId}`,
      error,
    );
    return false;
  }
};

/**
 * Deletes an image from Cloudinary using its publicId.
 */
export const deleteImage = async (publicId: string): Promise<boolean> => {
  return deleteAsset(publicId, "image");
};

/**
 * Retrieves Cloudinary resource details for existence and integrity checks.
 */
export const getImageResource = async (
  publicId: string,
): Promise<ICloudinaryResource | null> => {
  if (!publicId) return null;
  try {
    const res = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });
    return {
      publicId: res.public_id,
      url: res.secure_url,
      format: res.format,
      bytes: res.bytes,
    };
  } catch {
    return null;
  }
};

const cloudinaryService = {
  uploadFile,
  uploadImage,
  uploadProfilePicture,
  uploadResumeDocument,
  deleteAsset,
  deleteImage,
  getImageResource,
};

export default cloudinaryService;
