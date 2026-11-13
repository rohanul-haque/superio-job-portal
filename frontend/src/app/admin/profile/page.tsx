"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import adminService from "@/services/admin.service";
import type { IAdminProfile } from "@/types/admin";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export default function AdminProfilePage() {
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
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // Fetch Admin Profile
  const fetchProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    setLoadError(null);
    try {
      const data = await adminService.getProfile();
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

  // Object URL cleanup for preview
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
      const updated = await adminService.uploadProfileImage(selectedImage);
      setProfile(updated);
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      const newUrl =
        updated.profilePicture?.url || updated.profileImage?.url || null;
      setPreviewUrl(newUrl);

      // Refresh global AuthContext to immediately sync Dashboard Header avatar
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
      const updated = await adminService.removeProfileImage();
      setProfile(updated);
      setSelectedImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh global AuthContext to sync Dashboard Header avatar fallback
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
      const updated = await adminService.updateProfile({
        name: trimmedName,
        email: trimmedEmail,
      });

      setProfile(updated);
      setName(updated.name);
      setEmail(updated.email);

      // Refresh global auth context to immediately sync Dashboard Header profile
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
      const res = await adminService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Clear password form
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
    profile && (name.trim() !== profile.name || email.trim() !== profile.email);

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
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              isLoadingProfile ? "animate-spin text-purple-600" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Loading Skeleton */}
      {isLoadingProfile && !profile && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-xs">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
          <p className="text-sm font-medium text-slate-600">
            Loading administrator account profile...
          </p>
        </div>
      )}

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
          {/* Section 1: Profile Picture Management (Cloudinary) */}
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
                    Upload a photo to represent your administrator account.
                    Images are securely stored on Cloudinary.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageFileSelect}
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
                          onClick={handleUploadImage}
                          disabled={isUploadingImage}
                          className="gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-9 rounded-lg shadow-xs"
                        >
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
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
                          onClick={handleCancelSelection}
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
                        onClick={handleRemoveImage}
                        disabled={isRemovingImage || isUploadingImage}
                        className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-semibold h-9 rounded-lg"
                      >
                        {isRemovingImage ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-red-600" />
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

          {/* Section 2: Personal Information */}
          <Card className="border border-slate-200 shadow-xs bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Update your primary administrator account name and contact
                    email address.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleUpdateProfile}>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="admin-name"
                      className="text-xs font-bold text-slate-700"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="admin-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Super Admin"
                        className="pl-9 text-xs sm:text-sm h-10 border-slate-200 focus-visible:ring-purple-500"
                        required
                        disabled={isUpdatingProfile}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="admin-email"
                      className="text-xs font-bold text-slate-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. admin@superio.com"
                        className="pl-9 text-xs sm:text-sm h-10 border-slate-200 focus-visible:ring-purple-500"
                        required
                        disabled={isUpdatingProfile}
                      />
                    </div>
                  </div>
                </div>

                {/* Account Details Badges / Info */}
                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-slate-700">
                      Account Role:
                    </span>
                    <Badge className="bg-purple-100 text-purple-700 border-none px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                      {profile.role}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Status:</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5 text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {profile.status === "active" ? "Active" : profile.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">
                      Email Verified:
                    </span>
                    <Badge className="bg-blue-100 text-blue-700 border-none px-2 py-0.5 text-[11px] font-semibold">
                      {profile.isEmailVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50/60 border-t border-slate-100 px-6 py-3 flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile || !hasProfileChanges}
                  className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs min-w-[130px]"
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Update Profile
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Section 3: Change Password */}
          <Card className="border border-slate-200 shadow-xs bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                    Change Password
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Ensure your administrative account remains protected with a
                    strong, secure password.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleChangePassword}>
              <CardContent className="p-6 space-y-5">
                {/* Current Password */}
                <div className="space-y-2 max-w-md">
                  <Label
                    htmlFor="current-password"
                    className="text-xs font-bold text-slate-700"
                  >
                    Current Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="pl-9 pr-10 text-xs sm:text-sm h-10 border-slate-200 focus-visible:ring-amber-500"
                      required
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="new-password"
                      className="text-xs font-bold text-slate-700"
                    >
                      New Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="pl-9 pr-10 text-xs sm:text-sm h-10 border-slate-200 focus-visible:ring-amber-500"
                        required
                        disabled={isChangingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Minimum 6 characters. Use letters, numbers, and symbols
                      for best security.
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-xs font-bold text-slate-700"
                    >
                      Confirm New Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="pl-9 pr-10 text-xs sm:text-sm h-10 border-slate-200 focus-visible:ring-amber-500"
                        required
                        disabled={isChangingPassword}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50/60 border-t border-slate-100 px-6 py-3 flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={
                    isChangingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs min-w-[140px]"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-3.5 w-3.5" />
                      Change Password
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
