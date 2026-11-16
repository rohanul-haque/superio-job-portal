import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IAdminCandidate } from "@/interfaces/admin.interface";
import { ExternalLink, FileText, X } from "lucide-react";
import React from "react";

export interface CandidatePreviewModalProps {
  candidate: IAdminCandidate | null;
  onClose: () => void;
}

export function CandidatePreviewModal({
  candidate,
  onClose,
}: CandidatePreviewModalProps) {
  if (!candidate) return null;

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
              src={candidate.profilePicture?.url}
              alt={candidate.name}
              className="rounded-2xl object-cover"
            />
            <AvatarFallback className="rounded-2xl bg-purple-100 text-purple-700 font-bold text-xl">
              {candidate.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{candidate.name}</h3>
            <p className="text-xs text-purple-700 font-semibold">
              {candidate.title || "Talent Candidate"}
            </p>
            <p className="text-xs text-slate-500">{candidate.email}</p>
          </div>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <div>
            <span className="font-bold text-slate-700">Account ID: </span>
            <span className="font-mono text-slate-500">{candidate.id}</span>
          </div>
          <div>
            <span className="font-bold text-slate-700">Member Since: </span>
            <span className="text-slate-600">
              {new Date(candidate.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-700">
              Skills ({candidate.skills?.length || 0}):{" "}
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {candidate.skills?.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 font-medium"
                >
                  {s}
                </span>
              )) || "None listed"}
            </div>
          </div>

          {candidate.resume && (
            <div className="pt-2">
              <a
                href={candidate.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700"
              >
                <FileText className="h-4 w-4" />
                Open PDF Resume
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
