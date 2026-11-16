import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IAdminRecruiter } from "@/interfaces/admin.interface";
import { X } from "lucide-react";
import React from "react";

export interface RecruiterPreviewModalProps {
  recruiter: IAdminRecruiter | null;
  onClose: () => void;
}

export function RecruiterPreviewModal({
  recruiter,
  onClose,
}: RecruiterPreviewModalProps) {
  if (!recruiter) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <Avatar className="h-14 w-14 shrink-0 rounded-2xl border border-purple-200">
            <AvatarImage
              src={recruiter.image}
              alt={recruiter.name}
              className="rounded-2xl object-cover"
            />
            <AvatarFallback className="rounded-2xl bg-purple-100 text-purple-700 font-bold text-xl">
              {recruiter.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {recruiter.name}
            </h3>
            <p className="text-xs text-purple-700 font-semibold">
              {recruiter.companySize || "Employer Organization"}
            </p>
            <p className="text-xs text-slate-500">{recruiter.email}</p>
          </div>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <div>
            <span className="font-bold text-slate-700">Company ID: </span>
            <span className="font-mono text-slate-500">{recruiter.id}</span>
          </div>
          <div>
            <span className="font-bold text-slate-700">Headquarters: </span>
            <span className="text-slate-600">
              {recruiter.location || "Not specified"}
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-700">Member Since: </span>
            <span className="text-slate-600">
              {new Date(recruiter.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-700">Open Jobs: </span>
            <span className="text-purple-700 font-bold">
              {recruiter.jobCount} Vacancies
            </span>
          </div>
          {recruiter.website && (
            <div>
              <span className="font-bold text-slate-700">Website: </span>
              <a
                href={
                  recruiter.website.startsWith("http")
                    ? recruiter.website
                    : `https://${recruiter.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline font-semibold"
              >
                {recruiter.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
