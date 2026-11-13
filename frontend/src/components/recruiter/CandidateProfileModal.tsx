"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IRecruiterApplicant } from "@/types/recruiter";
import {
  ExternalLink,
  FileText,
  Github,
  Globe,
  Linkedin,
  Mail,
  User,
  X,
} from "lucide-react";
import React from "react";

interface CandidateProfileModalProps {
  applicant: IRecruiterApplicant | null;
  onClose: () => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  applicant,
  onClose,
}) => {
  if (!applicant) return null;

  const candidate = applicant.candidate;
  const socialLinks = candidate.socialLinks || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Profile Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
          <Avatar className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200">
            <AvatarImage
              src={candidate.profilePicture?.url}
              alt={candidate.name}
              className="rounded-2xl object-cover"
            />
            <AvatarFallback className="rounded-2xl bg-slate-100 text-2xl font-bold text-slate-600">
              {candidate.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900">
              {candidate.name}
            </h2>
            <p className="text-xs font-semibold text-indigo-600">
              {candidate.title || "Applicant"}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Mail className="h-3.5 w-3.5" />
              {candidate.email}
            </p>
          </div>

          {candidate.resume && (
            <a
              href={candidate.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs self-start sm:self-auto"
            >
              <FileText className="h-4 w-4" />
              View PDF Resume
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Applied Position Info */}
        <div className="my-5 rounded-xl border border-slate-100 bg-slate-50 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div>
            <span className="text-slate-400">Applied for: </span>
            <span className="font-bold text-slate-900">{applicant.job.title}</span>
            <span className="ml-2 text-slate-500">({applicant.job.location})</span>
          </div>
          <div>
            <span className="text-slate-400">Submitted on: </span>
            <span className="font-medium text-slate-700">
              {new Date(applicant.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Bio / Summary */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            About Candidate
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-white rounded-xl border border-slate-100 p-3.5">
            {candidate.bio || "No candidate summary provided."}
          </p>
        </div>

        {/* Skills Tag Cloud */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Skills & Competencies
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills && candidate.skills.length > 0 ? (
              candidate.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-slate-100 text-slate-800 border-slate-200 text-xs px-2.5 py-1"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                No specific skill tags declared.
              </span>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Links & Online Profiles
          </h3>
          <div className="flex flex-wrap gap-2">
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 hover:border-blue-300 transition"
              >
                <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                LinkedIn
              </a>
            )}
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:border-slate-400 transition"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            {socialLinks.portfolio && (
              <a
                href={socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition"
              >
                <Globe className="h-3.5 w-3.5 text-indigo-600" />
                Portfolio
              </a>
            )}
            {!socialLinks.linkedin && !socialLinks.github && !socialLinks.portfolio && (
              <p className="text-xs text-slate-400 italic">No external links provided.</p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileModal;

