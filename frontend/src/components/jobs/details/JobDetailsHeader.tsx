import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IJob } from "@/interfaces/job.interface";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface JobDetailsHeaderProps {
  job: IJob;
  isBookmarked: boolean;
  hasApplied: boolean;
  onBookmarkToggle: () => void;
  onShare: () => void;
  onApplyClick: () => void;
}

export default function JobDetailsHeader({
  job,
  isBookmarked,
  hasApplied,
  onBookmarkToggle,
  onShare,
  onApplyClick,
}: JobDetailsHeaderProps) {
  const isOngoing = job.hiringStatus === "Ongoing";

  const formatSalary = (amount: number) => {
    if (amount >= 1000) {
      return `$${amount.toLocaleString()} / mo`;
    }
    return `$${amount} / mo`;
  };

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link href="/" className="hover:text-[#4F46E5] transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/all-jobs" className="hover:text-[#4F46E5] transition">
          All Jobs
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold truncate max-w-[200px] sm:max-w-xs">
          {job.title}
        </span>
      </nav>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Top Section – Left Side */}
          <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
            {/* Company Avatar / Logo */}
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-2.5 sm:p-3 text-slate-700 font-bold text-xl shadow-none overflow-hidden">
              {job.company?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.company.image}
                  alt={job.company.name || "Company"}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2 className="h-8 w-8 text-slate-400" />
              )}
            </div>

            {/* Badges, Title & Company Name */}
            <div className="min-w-0 flex-1">
              {/* Badges above title */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="bg-[#EEF2FF] text-[#4F46E5] border-transparent text-xs font-semibold rounded-full px-3 py-0.5"
                >
                  {job.jobType}
                </Badge>
                {isOngoing ? (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold rounded-full px-3 py-0.5"
                  >
                    ● Hiring Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 text-xs font-semibold rounded-full px-3 py-0.5"
                  >
                    ● Applications Closed
                  </Badge>
                )}
                {job.level && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 text-xs font-medium rounded-full px-3 py-0.5"
                  >
                    {job.level}
                  </Badge>
                )}
                {job.category?.name && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 text-xs font-medium rounded-full px-3 py-0.5"
                  >
                    {job.category.name}
                  </Badge>
                )}
              </div>

              {/* Job Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                {job.title}
              </h1>

              {/* Company Information & Key Meta Row */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-600">
                {/* Company Name */}
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 shrink-0" />
                  {job.company?.name || "Verified Enterprise Employer"}
                </span>

                {/* Salary */}
                <span className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 shrink-0" />
                  {formatSalary(job.salary)}
                </span>

                {/* Open Vacancies */}
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 shrink-0" />
                  {job.vacancy} {job.vacancy === 1 ? "Position" : "Positions"}
                </span>

                {/* Deadline */}
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 shrink-0" />
                  Deadline: {formatDate(job.deadline)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Section – Right Side */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            {/* Horizontally aligned action buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Bookmark */}
              <button
                type="button"
                onClick={onBookmarkToggle}
                className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-semibold transition cursor-pointer ${
                  isBookmarked
                    ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 text-amber-600 fill-amber-600" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 text-slate-400" />
                    Bookmark
                  </>
                )}
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={onShare}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                aria-label="Share job"
              >
                <Share2 className="h-4 w-4" />
              </button>

              {/* Apply Now */}
              <Button
                onClick={onApplyClick}
                disabled={!isOngoing || hasApplied}
                className={`h-11 px-7 font-semibold text-xs sm:text-sm rounded-full cursor-pointer shadow-none ${
                  hasApplied
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : isOngoing
                      ? "bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                {hasApplied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Applied Successfully
                  </>
                ) : isOngoing ? (
                  <>
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Applications Closed"
                )}
              </Button>
            </div>

            {/* Location & Posted Date directly below the 3 action buttons */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 lg:justify-end">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                Posted {formatDate(job.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
