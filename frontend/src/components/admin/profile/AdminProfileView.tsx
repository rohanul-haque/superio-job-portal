"use client";

import AdminPasswordForm from "./AdminPasswordForm";
import AdminPhotoManager from "./AdminPhotoManager";
import AdminProfileForm from "./AdminProfileForm";
import ProfileSkeleton from "@/components/loaders/skeleton/ProfileSkeleton";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import type { IAdminProfile } from "@/interfaces/admin.interface";
import {
  changePassword,
  getProfile,
  removeProfileImage,
  updateProfile,
  uploadProfileImage,
} from "@/services/admin.service";
import { AlertCircle, RefreshCw } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

function AdminProfileView() {
  const { user, refreshUser } = useAuth();

  // Profile data state
  const [profile, setProfile] = useState<IAdminProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Section 1: Profile Picture state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isRemovingImage, setIsRemovingImage] = useState<boolean>(false);

  // Section 2: Personal Information state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);

  // Section 3: Password form state
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // Fetch Admin Profile
  const fetchProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    setLoadError(null);
    try {
      const data = await getProfile();
      setProfile(data);
      setName(data.name || "");
      setEmail(data.email || "");
      const activeImg =
        data.profilePicture?.url ||
        data.profileImage?.url ||
        user?.profilePicture?.url ||
        null;
      setPreviewUrl(activeImg);
    } catch (err: unknown) {
      let message = "Failed to load admin profile information.";
      if (err instanceof Error) message = err.message;
      setLoadError(message);
      toast.error("Profile Error", { description: message });
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user?.profilePicture?.url]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle local image file selection
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      toast.error("Invalid Image Format", {
        description: "Profile photo must be a JPEG, JPG, PNG, or WEBP image.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("File Size Exceeded", {
        description: "Profile photo must be 5 MB or smaller.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload selected profile picture to Cloudinary
  const handleUploadImage = async () => {
    if (!selectedImage) return;

    setIsUploadingImage(true);
    try {
      const updated = await uploadProfileImage(selectedImage);
      setProfile(updated);
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      const newUrl =
        updated.profilePicture?.url || updated.profileImage?.url || null;
      setPreviewUrl(newUrl);

      await refreshUser();

      toast.success("Profile Photo Uploaded", {
        description:
          "Your profile image has been securely uploaded to Cloudinary.",
      });
    } catch (err: unknown) {
      let message = "Failed to upload profile picture to Cloudinary.";
      if (err instanceof Error) message = err.message;
      toast.error("Upload Failed", { description: message });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Cancel selected local image
  const handleCancelSelection = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    const activeImg =
      profile?.profilePicture?.url ||
      profile?.profileImage?.url ||
      user?.profilePicture?.url ||
      null;
    setPreviewUrl(activeImg);
  };

  // Remove existing profile image from Cloudinary
  const handleRemoveImage = async () => {
    setIsRemovingImage(true);
    try {
      const updated = await removeProfileImage();
      setProfile(updated);
      setSelectedImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await refreshUser();

      toast.success("Profile Photo Removed", {
        description:
          "Your profile picture has been removed and reset to the default avatar.",
      });
    } catch (err: unknown) {
      let message = "Failed to remove profile picture.";
      if (err instanceof Error) message = err.message;
      toast.error("Removal Failed", { description: message });
    } finally {
      setIsRemovingImage(false);
    }
  };

  // Section 2: Handle Personal Information Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      toast.error("Validation Error", {
        description: "Full name must be at least 2 characters long.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      toast.error("Validation Error", {
        description: "Please provide a valid email address.",
      });
      return;
    }

    if (
      profile &&
      trimmedName === profile.name &&
      trimmedEmail === profile.email
    ) {
      toast.info("No Changes", {
        description: "No modifications were detected in your personal details.",
      });
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const updated = await updateProfile({
        name: trimmedName,
        email: trimmedEmail,
      });
      setProfile(updated);
      setName(updated.name);
      setEmail(updated.email);

      await refreshUser();

      toast.success("Profile Updated", {
        description:
          "Your administrator profile has been updated successfully.",
      });
    } catch (err: unknown) {
      let message = "Failed to update admin profile.";
      if (err instanceof Error) message = err.message;
      toast.error("Update Failed", { description: message });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Section 3: Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Validation Error", {
        description: "Current password is required.",
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("Validation Error", {
        description: "New password must be at least 6 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Validation Error", {
        description: "New password and confirmation password do not match.",
      });
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("Validation Error", {
        description:
          "New password must be different from your current password.",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password Changed", {
        description:
          res.message || "Your password has been changed successfully.",
      });
    } catch (err: unknown) {
      let message = "Failed to change admin password.";
      if (err instanceof Error) message = err.message;
      toast.error("Password Change Failed", { description: message });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const hasProfileChanges =
    Boolean(profile && (name.trim() !== profile.name || email.trim() !== profile.email));

  const existingImageUrl =
    profile?.profilePicture?.url || profile?.profileImage?.url;

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Admin Profile Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your administrator account information and profile picture.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => fetchProfile()}
          disabled={isLoadingProfile}
          className="self-start sm:self-auto gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
        >
          {isLoadingProfile ? (
            <Spinner size="sm" className="text-purple-600" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </Button>
      </div>

      {/* Loading Skeleton */}
      {isLoadingProfile && !profile && <ProfileSkeleton />}

      {/* Load Error State */}
      {!isLoadingProfile && loadError && !profile && (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50/60 rounded-xl border border-red-200 text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
          <p className="text-sm font-bold text-red-800">{loadError}</p>
          <Button
            onClick={() => fetchProfile()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Main Forms Container */}
      {profile && (
        <div className="space-y-8">
          {/* Section 1: Profile Picture Management */}
          <AdminPhotoManager
            previewUrl={previewUrl}
            selectedImage={selectedImage}
            existingImageUrl={existingImageUrl}
            isUploadingImage={isUploadingImage}
            isRemovingImage={isRemovingImage}
            name={name}
            fileInputRef={fileInputRef}
            onImageFileSelect={handleImageFileSelect}
            onUploadImage={handleUploadImage}
            onCancelSelection={handleCancelSelection}
            onRemoveImage={handleRemoveImage}
          />

          {/* Section 2: Personal Information */}
          <AdminProfileForm
            profile={profile}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            isUpdatingProfile={isUpdatingProfile}
            hasProfileChanges={hasProfileChanges}
            onSubmit={handleUpdateProfile}
          />

          {/* Section 3: Change Password */}
          <AdminPasswordForm
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isChangingPassword={isChangingPassword}
            onSubmit={handleChangePassword}
          />
        </div>
      )}
    </div>
  );
}
export default AdminProfileView;
