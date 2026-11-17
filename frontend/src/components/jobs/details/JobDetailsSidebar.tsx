import JobCard from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import type { IJob } from "@/interfaces/job.interface";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

interface JobDetailsSidebarProps {
  currentJobId?: string;
  similarJobs?: IJob[];
  job?: IJob;
  hasApplied?: boolean;
  onApplyClick?: () => void;
  className?: string;
}

export default function JobDetailsSidebar({
  currentJobId,
  similarJobs = [],
  job,
  className = "",
}: JobDetailsSidebarProps) {
  const activeCurrentId = currentJobId || job?.id;

  // Filter out the currently viewed job, enforce same category, and take 3-4 cards (prefer 4, max 4)
  const displaySimilarJobs = useMemo(() => {
    const currentCategoryId =
      job?.categoryId || (job?.category as { id?: string })?.id;

    return (similarJobs || [])
      .filter((simJob) => {
        // Exclude the currently viewed job
        if (activeCurrentId && simJob.id === activeCurrentId) {
          return false;
        }
        // Enforce strict category match if current category ID is known
        if (currentCategoryId) {
          const simCategoryId =
            simJob.categoryId || (simJob.category as { id?: string })?.id;
          if (simCategoryId && simCategoryId !== currentCategoryId) {
            return false;
          }
        }
        return true;
      })
      .slice(0, 4);
  }, [similarJobs, activeCurrentId, job]);

  return (
    <aside className={`space-y-4 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-[#4F46E5]" />
          <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Similar Jobs
          </h3>
        </div>
        <Link
          href={
            job?.categoryId
              ? `/all-jobs?category=${job.categoryId}`
              : "/all-jobs"
          }
          className="text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] hover:underline transition"
        >
          View All
        </Link>
      </div>

      {/* Cards list or Empty state */}
      {displaySimilarJobs.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 text-center shadow-none">
          <Briefcase className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            No similar jobs found in this category.
          </p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Explore our full jobs catalog for other available opportunities.
          </p>
          <Link href="/all-jobs">
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs rounded-full border-[#E5E7EB] hover:border-[#4F46E5] hover:text-[#4F46E5]"
            >
              Browse All Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displaySimilarJobs.map((simJob) => (
            <JobCard key={simJob.id} job={simJob} compact />
          ))}
        </div>
      )}
    </aside>
  );
}

// Preserve underlying components for "About the Company" and "Apply for this Position"
// in case reusable references are required elsewhere.
export function AboutCompanyCard({ job }: { job: IJob }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-none">
      <h3 className="text-base font-bold text-[#0F172A] mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-[#4F46E5]" />
        About the Company
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white p-1.5 text-slate-700 font-bold text-base overflow-hidden shadow-none">
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
        <div>
          <h4 className="text-sm font-bold text-[#0F172A]">
            {job.company?.name || "Hirenest Verified Employer"}
          </h4>
          <p className="text-xs text-slate-500">
            {job.company?.location || job.location}
          </p>
        </div>
      </div>

      {job.company?.description && (
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {job.company.description}
        </p>
      )}

      <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
        {job.company?.website && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Website</span>
            <a
              href={
                job.company.website.startsWith("http")
                  ? job.company.website
                  : `https://${job.company.website}`
              }
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-semibold text-[#4F46E5] hover:underline"
            >
              Visit Website
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
        {job.company?.companySize && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Company Size</span>
            <span className="font-semibold text-slate-800">
              {job.company.companySize}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Security Verification</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Employer
          </span>
        </div>
      </div>
    </div>
  );
}

export function QuickApplyCard({
  job,
  hasApplied,
  onApplyClick,
}: {
  job: IJob;
  hasApplied: boolean;
  onApplyClick: () => void;
}) {
  const isOngoing = job.hiringStatus === "Ongoing";

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-none space-y-4">
      <h3 className="text-base font-bold text-[#0F172A] pb-3 border-b border-slate-100">
        Apply for this Position
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed">
        Submit your verified candidate credentials, resume, and portfolio
        directly to the hiring manager.
      </p>

      <Button
        onClick={onApplyClick}
        disabled={!isOngoing || hasApplied}
        className={`w-full h-11 font-semibold text-xs sm:text-sm rounded-full shadow-none ${
          hasApplied
            ? "bg-emerald-600 text-white opacity-90 cursor-not-allowed"
            : isOngoing
              ? "bg-[#6366F1] hover:bg-[#4F46E5] text-white cursor-pointer"
              : "bg-slate-200 text-slate-500 cursor-not-allowed"
        }`}
      >
        {hasApplied ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Already Applied
          </>
        ) : isOngoing ? (
          <>
            Submit Application
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        ) : (
          "Position Closed"
        )}
      </Button>
    </div>
  );
}
