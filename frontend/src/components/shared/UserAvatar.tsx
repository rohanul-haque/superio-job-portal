"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IAuthUser } from "@/types/auth";
import { User as UserIcon } from "lucide-react";
import React from "react";

export interface UserAvatarProps {
  user?: IAuthUser | null;
  className?: string;
  fallbackClassName?: string;
}

/**
 * Standard UserAvatar component adhering to Superio avatar requirements:
 * 1. If profilePicture exists and has a valid URL, displays the uploaded image.
 * 2. If profilePicture does not exist, displays the uppercase first non-empty letter of the candidate's name.
 * 3. If name is unavailable/empty, renders a clean default User icon without broken image icons.
 * 4. Compatible with candidate profilePicture, recruiter company logo, and admin avatars.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  className = "h-8 w-8",
  fallbackClassName,
}) => {
  // Safe resolution: reads profilePicture.url for both Candidate and Recruiter, falling back to user.image
  const profilePictureUrl =
    user?.profilePicture &&
    typeof user.profilePicture === "object" &&
    typeof user.profilePicture.url === "string"
      ? user.profilePicture.url.trim()
      : typeof user?.profilePicture === "string"
        ? (user.profilePicture as string).trim()
        : undefined;

  const legacyImageUrl =
    typeof user?.image === "string" && user.image.trim()
      ? user.image.trim()
      : undefined;

  const avatarUrl = profilePictureUrl || legacyImageUrl || "";

  // Extract first non-empty character converted to uppercase
  const rawName = user?.name?.trim() || "";
  const firstLetter = rawName ? rawName.charAt(0).toUpperCase() : "";

  const defaultFallbackColor =
    user?.role === "admin"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";

  return (
    <Avatar className={className}>
      {avatarUrl ? (
        <AvatarImage
          src={avatarUrl}
          alt={rawName || "User"}
          className="object-cover"
        />
      ) : null}
      <AvatarFallback
        className={
          fallbackClassName ||
          `${defaultFallbackColor} font-bold text-xs select-none`
        }
      >
        {firstLetter ? (
          firstLetter
        ) : (
          <UserIcon className="h-3.5 w-3.5 text-slate-500" />
        )}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
