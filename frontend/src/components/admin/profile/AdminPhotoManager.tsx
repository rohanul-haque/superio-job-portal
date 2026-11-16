import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import React from "react";

export interface AdminPhotoManagerProps {
  previewUrl: string | null;
  selectedImage: File | null;
  existingImageUrl?: string | null;
  isUploadingImage: boolean;
  isRemovingImage: boolean;
  name: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadImage: () => void;
  onCancelSelection: () => void;
  onRemoveImage: () => void;
}

export function AdminPhotoManager({
  previewUrl,
  selectedImage,
  existingImageUrl,
  isUploadingImage,
  isRemovingImage,
  name,
  fileInputRef,
  onImageFileSelect,
  onUploadImage,
  onCancelSelection,
  onRemoveImage,
}: AdminPhotoManagerProps) {
  return (
    <Card className="border border-slate-200 shadow-xs bg-white overflow-hidden">
      <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Profile Picture
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Upload a photo to represent your administrator account. Images are
              securely stored on Cloudinary.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef as React.RefObject<HTMLInputElement>}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={onImageFileSelect}
            disabled={isUploadingImage || isRemovingImage}
            className="hidden"
            id="admin-avatar-file-input"
          />

          {/* Avatar Preview Display */}
          <div className="relative group shrink-0">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-2 border-slate-200 shadow-xs">
              <AvatarImage
                src={previewUrl || undefined}
                alt={name || "Administrator"}
                className="rounded-2xl object-cover"
              />
              <AvatarFallback className="rounded-2xl bg-purple-100 text-purple-700 font-bold text-2xl flex items-center justify-center">
                {name ? (
                  name.charAt(0).toUpperCase()
                ) : (
                  <User className="h-10 w-10 text-purple-600" />
                )}
              </AvatarFallback>
            </Avatar>

            {/* Camera overlay badge */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage || isRemovingImage}
              className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white shadow-md hover:bg-purple-700 transition"
              title="Change Profile Photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Actions & Instructions */}
          <div className="space-y-3 flex-1">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  Administrator Avatar
                </h4>
                {existingImageUrl && !selectedImage && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Cloudinary Synced
                  </Badge>
                )}
                {selectedImage && (
                  <Badge className="bg-blue-100 text-blue-700 border-none px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    Pending Upload
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Accepts JPEG, JPG, PNG, or WEBP up to 5 MB. Image is
                automatically optimized and stored in Cloudinary
                (Superio/profile-pictures).
              </p>
            </div>

            {/* Buttons Group */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Select / Change File Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage || isRemovingImage}
                className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-9 rounded-lg"
              >
                <Camera className="h-3.5 w-3.5" />
                {previewUrl ? "Change Photo" : "Upload Photo"}
              </Button>

              {/* Pending Upload Action */}
              {selectedImage && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    onClick={onUploadImage}
                    disabled={isUploadingImage}
                    className="gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-9 rounded-lg shadow-xs"
                  >
                    {isUploadingImage ? (
                      <>
                        <Spinner size="sm" className="mr-1.5" />
                        Uploading to Cloudinary...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        Save Photo
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancelSelection}
                    disabled={isUploadingImage}
                    className="gap-1.5 text-slate-600 hover:bg-slate-100 text-xs font-medium h-9 rounded-lg"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </Button>
                </>
              )}

              {/* Remove Existing Photo */}
              {!selectedImage && existingImageUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRemoveImage}
                  disabled={isRemovingImage || isUploadingImage}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-semibold h-9 rounded-lg"
                >
                  {isRemovingImage ? (
                    <>
                      <Spinner size="sm" className="mr-1.5 text-red-600" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      Remove Photo
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
