import { Button } from "@/components/ui/button";
import { Building2, Camera, CheckCircle2, Upload } from "lucide-react";
import React from "react";

export interface CompanyLogoUploadProps {
  logoPreview: string | null;
  selectedLogo: File | null;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyLogoUpload({
  logoPreview,
  selectedLogo,
  logoInputRef,
  onLogoChange,
}: CompanyLogoUploadProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
      {/* Logo Preview */}
      <div className="relative group">
        <div
          className={`flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${
            logoPreview
              ? "border border-[#E5E7EB] bg-white p-2.5 shadow-none"
              : "border-2 border-dashed border-slate-300 bg-slate-50 shadow-inner"
          }`}
        >
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Company Logo Preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <Building2 className="h-10 w-10 text-slate-400" />
          )}
        </div>

        <button
          type="button"
          onClick={() => logoInputRef.current?.click()}
          className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition"
          title="Upload New Logo"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      {/* Upload Actions & Help Text */}
      <div className="space-y-2 text-center sm:text-left flex-1">
        <h3 className="text-sm font-bold text-slate-900">Brand Logo</h3>
        <p className="text-xs text-slate-500 max-w-md">
          Upload your organization logo to display on job postings, candidate
          applications, and company badges. JPG, PNG or WEBP up to 5 MB.
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => logoInputRef.current?.click()}
            className="gap-2 rounded-xl text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Upload className="h-3.5 w-3.5" />
            {selectedLogo ? "Replace Selected File" : "Upload Logo"}
          </Button>

          {selectedLogo && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {selectedLogo.name}
            </span>
          )}
        </div>

        <input
          ref={logoInputRef as React.RefObject<HTMLInputElement>}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onLogoChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
