"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext";
import { useCandidateJobState } from "@/context/CandidateJobStateContext";
import type { IJob } from "@/types/job";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface JobCardProps {
  job: IJob;
  featured?: boolean;
  actionLabel?: string;
  hasApplied?: boolean;
  isBookmarked?: boolean;
  showBookmark?: boolean;
  onBookmarkToggle?: (jobId: string) => void;
  compact?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  featured = false,
  actionLabel = "View Details",
  hasApplied: hasAppliedProp,
  isBookmarked: isBookmarkedProp,
  showBookmark = true,
  onBookmarkToggle,
  compact = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const {
    hasAppliedToJob,
    isJobBookmarked,
    toggleBookmark: toggleCandidateBookmark,
  } = useCandidateJobState();

  const isApplied =
    hasAppliedProp !== undefined
      ? hasAppliedProp
      : hasAppliedToJob(job.id);

  const isSaved =
    isBookmarkedProp !== undefined
      ? isBookmarkedProp
      : isJobBookmarked(job.id);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      toast.info("Please sign in to save this job to your bookmarks.");
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.role !== "candidate") {
      toast.error("Only candidate accounts can bookmark jobs.");
      return;
    }

    if (onBookmarkToggle) {
      onBookmarkToggle(job.id);
      return;
    }

    try {
      const nextState = await toggleCandidateBookmark(job.id);
      if (nextState) {
        toast.success("Job saved to your bookmarks!");
      } else {
        toast.info("Job removed from bookmarks.");
      }
    } catch {
      toast.error("Failed to update bookmark.");
    }
  };

  const formatSalary = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k/mo`;
    }
    return `$${amount}/mo`;
  };

  const getJobTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "full-time":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "remote":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "contract":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "part-time":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "internship":
        return "bg-teal-50 text-teal-700 border-teal-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const isOngoing = job.hiringStatus === "Ongoing";

  const handleCardClick = (e: React.MouseEvent) => {
    // If the click originated from an interactive child (button, link, input), let it handle itself
    if ((e.target as HTMLElement).closest("button, a")) {
      return;
    }
    router.push(`/apply-job/${job.id}`);
  };

  if (compact) {
    return (
      <div
        onClick={handleCardClick}
        className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-4.5 sm:p-5 transition-all duration-200 cursor-pointer ${
          featured
            ? "border-[#6366F1] ring-1 ring-[#6366F1]/20 shadow-none"
            : "border-[#E5E7EB] hover:border-[#4F46E5] hover:shadow-xs shadow-none"
        }`}
      >
        <div>
          {/* Top Row: Logo, Title, Company Name & Bookmark */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm shadow-none overflow-hidden">
                {job.company?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={job.company.image}
                    alt={job.company.name || "Company"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Building2 className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/apply-job/${job.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors line-clamp-1 leading-snug">
                    {job.title}
                  </h4>
                </Link>
                <p className="mt-0.5 text-xs font-semibold text-slate-500 line-clamp-1">
                  {job.company?.name || "Verified Company"}
                </p>
              </div>
            </div>

            {showBookmark && (
              <button
                type="button"
                onClick={handleBookmarkClick}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition cursor-pointer ${
                  isSaved
                    ? "border-amber-300 bg-amber-50 text-amber-600 hover:bg-amber-100"
                    : "border-[#E5E7EB] bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
                title={isSaved ? "Saved to bookmarks" : "Save to bookmarks"}
                aria-label={isSaved ? "Remove bookmark" : "Add bookmark"}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-amber-600 fill-amber-600" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Badges & Meta Info */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <Badge
              variant="outline"
              className={`text-[11px] px-2.5 py-0.5 font-medium shrink-0 ${getJobTypeColor(
                job.jobType,
              )}`}
            >
              {job.jobType}
            </Badge>

            {job.level && (
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-700 text-[11px] px-2.5 py-0.5 font-medium rounded-full"
              >
                {job.level}
              </Badge>
            )}

            <span className="flex items-center gap-1 text-xs text-slate-500 ml-auto truncate">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[120px]">{job.location}</span>
            </span>
          </div>
        </div>

        {/* Footer: Salary & View Details Button */}
        <div className="mt-3.5 border-t border-[#E5E7EB] pt-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
              Salary
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate block">
              {formatSalary(job.salary)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isOngoing && (
              <Badge
                variant="outline"
                className="bg-red-50 text-[#DC2626] border-red-200 text-[10px] px-2 py-0.5"
              >
                Closed
              </Badge>
            )}
            <Link
              href={`/apply-job/${job.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                className={`h-8 px-3 text-xs font-semibold rounded-full cursor-pointer transition ${
                  isApplied
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : isOngoing
                      ? "bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-[#0F172A]"
                }`}
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    Applied
                  </>
                ) : (
                  <>
                    {actionLabel}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 sm:p-6 transition-all duration-200 cursor-pointer ${
        featured
          ? "border-[#6366F1] ring-1 ring-[#6366F1]/20 shadow-none"
          : "border-[#E5E7EB] hover:border-[#4F46E5] shadow-none"
      }`}
    >
      <div>
        {/* Header: Company Logo/Avatar & Badges */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700 font-bold text-base shadow-none overflow-hidden">
              {job.company?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.company.image}
                  alt={job.company.name || "Company"}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2 className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500 line-clamp-1">
                {job.company?.name || "Verified Company"}
              </p>
              <Link href={`/apply-job/${job.id}`}>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors line-clamp-1">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {showBookmark && (
              <button
                type="button"
                onClick={handleBookmarkClick}
                className={`flex h-8 w-8 items-center justify-center rounded-xl border transition cursor-pointer ${
                  isSaved
                    ? "border-amber-300 bg-amber-50 text-amber-600 hover:bg-amber-100"
                    : "border-[#E5E7EB] bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
                title={isSaved ? "Saved to bookmarks" : "Save to bookmarks"}
                aria-label={isSaved ? "Remove bookmark" : "Add bookmark"}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-amber-600 fill-amber-600" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            )}
            <Badge
              variant="outline"
              className={`text-xs px-2.5 py-0.5 font-medium shrink-0 ${getJobTypeColor(
                job.jobType,
              )}`}
            >
              {job.jobType}
            </Badge>
          </div>
        </div>

        {/* Location & Meta info */}
        <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
            {job.category?.name || "Technology"}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            {job.vacancy} {job.vacancy === 1 ? "Opening" : "Openings"}
          </span>
        </div>

        {/* Short description excerpt */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {job.description.replace(/<[^>]*>?/gm, "")}
        </p>
      </div>

      {/* Footer: Salary & Apply Link */}
      <div className="mt-6 border-t border-[#E5E7EB] pt-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Salary
          </span>
          <span className="text-sm font-extrabold text-[#0F172A]">
            {formatSalary(job.salary)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isOngoing && (
            <Badge
              variant="outline"
              className="bg-red-50 text-[#DC2626] border-red-200 text-[10px]"
            >
              Closed
            </Badge>
          )}
          <Link href={`/apply-job/${job.id}`}>
            <Button
              size="sm"
              className={`h-9 px-4 text-xs font-medium rounded-full cursor-pointer transition ${
                isApplied
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : isOngoing
                    ? "bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-[#0F172A]"
              }`}
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Already Applied
                </>
              ) : (
                <>
                  {actionLabel}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

