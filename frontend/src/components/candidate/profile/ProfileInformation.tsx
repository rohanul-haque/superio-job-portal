import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2 } from "lucide-react";
import React, { type RefObject } from "react";

interface ProfileInformationProps {
  name: string;
  imagePreview: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
}

function ProfileInformation({
  name,
  imagePreview,
  fileInputRef,
  onImageChange,
  isSaving,
}: ProfileInformationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-8">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-slate-200 shadow-sm">
          <AvatarImage
            src={imagePreview || undefined}
            alt={name || "Candidate Avatar"}
            className="object-cover"
          />
          <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-2xl">
            {name ? name.charAt(0).toUpperCase() : "C"}
          </AvatarFallback>
        </Avatar>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={onImageChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSaving}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
          title="Change Profile Photo"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 text-center sm:text-left flex-1">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <h3 className="text-lg font-bold text-slate-900">
            {name || "Candidate Profile"}
          </h3>
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            Verified Talent
          </Badge>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
          Accepts JPG, PNG, or WEBP up to 5 MB. Photos are automatically optimized and served via secure Cloudinary storage.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSaving}
          className="text-xs border-slate-200 mt-2"
        >
          <Camera className="mr-1.5 h-3.5 w-3.5" />
          Choose New Image
        </Button>
      </div>
    </div>
  );
}

export default ProfileInformation;
