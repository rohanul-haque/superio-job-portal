import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import type { IRecruiterApplicant } from "@/interfaces/recruiter.interface";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  MapPin,
  Sparkles,
  ThumbsDown,
  XCircle,
} from "lucide-react";
import React from "react";

interface ApplicantItemRowProps {
  applicant: IRecruiterApplicant;
  isMutating: boolean;
  onStatusChange: (applicantId: string, newStatus: string) => void;
  onReview: (applicant: IRecruiterApplicant) => void;
}

export default function ApplicantItemRow({
  applicant,
  isMutating,
  onStatusChange,
  onReview,
}: ApplicantItemRowProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
      case "In Review":
      case "Pending Review":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-white hover:text-amber-800 hover:border-amber-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            <Clock className="h-3 w-3 text-amber-600" />
            Pending Review
          </Badge>
        );
      case "Shortlisted":
        return (
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-white hover:text-indigo-800 hover:border-indigo-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            <Sparkles className="h-3 w-3 text-indigo-600" />
            Shortlisted
          </Badge>
        );
      case "Accepted":
      case "Hired":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Accepted / Hired
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-white hover:text-rose-800 hover:border-rose-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            <ThumbsDown className="h-3 w-3 text-rose-600" />
            Rejected
          </Badge>
        );
      case "Withdrawn":
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-800 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            <XCircle className="h-3 w-3 text-slate-500" />
            Withdrawn
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-white hover:text-slate-900 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      {/* Candidate Information */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-slate-200 shrink-0">
            <AvatarImage
              src={applicant.candidate?.profilePicture?.url}
              alt={applicant.candidate?.name || "Candidate"}
            />
            <AvatarFallback className="bg-indigo-50 font-bold text-indigo-700 text-sm">
              {applicant.candidate?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 leading-tight">
              {applicant.candidate?.name || "Unknown"}
            </p>
            <p className="text-xs text-slate-500 leading-normal">
              {applicant.candidate?.email || "No email"}
            </p>
            {applicant.candidate?.title && (
              <span className="inline-block mt-0.5 text-[11px] font-semibold text-indigo-600">
                {applicant.candidate.title}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Target Job */}
      <td className="px-6 py-4">
        <div className="max-w-[200px]">
          <p className="font-bold text-slate-900 truncate">
            {applicant.job?.title || "Job Unavailable"}
          </p>
          <p className="flex items-center gap-1 text-xs text-slate-500 truncate mt-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            {applicant.job?.location || "Remote"}
          </p>
        </div>
      </td>

      {/* Applied Date */}
      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
        {new Date(applicant.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>

      {/* Resume */}
      <td className="px-6 py-4 whitespace-nowrap">
        {applicant.candidate?.resume ? (
          <a
            href={applicant.candidate.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition"
          >
            <FileText className="h-3.5 w-3.5" />
            View PDF
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">Not Provided</span>
        )}
      </td>

      {/* Status Mutation Stage */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {getStatusBadge(applicant.status)}

          {applicant.status !== "Withdrawn" && (
            <div className="relative w-32">
              <Select
                disabled={isMutating}
                value={applicant.status}
                onValueChange={(val) => onStatusChange(applicant.id, val)}
              >
                <SelectTrigger className="h-8 text-xs font-semibold text-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              {isMutating && (
                <Spinner
                  size="sm"
                  className="absolute right-2 top-2 pointer-events-none text-indigo-600"
                />
              )}
            </div>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReview(applicant)}
          className="gap-1.5 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
        >
          <Eye className="h-3.5 w-3.5" />
          Review Profile
        </Button>
      </td>
    </tr>
  );
}
