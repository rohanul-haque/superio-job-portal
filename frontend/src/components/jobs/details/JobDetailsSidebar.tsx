import { Button } from "@/components/ui/button";
import type { IJob } from "@/interfaces/job.interface";
import { ArrowRight, Building2, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import React from "react";

export interface JobDetailsSidebarProps {
  job: IJob;
  hasApplied: boolean;
  onApplyClick: () => void;
}

export function JobDetailsSidebar({
  job,
  hasApplied,
  onApplyClick,
}: JobDetailsSidebarProps) {
  const isOngoing = job.hiringStatus === "Ongoing";

  return (
    <div className="space-y-6">
      {/* Company Card */}
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

      {/* Quick Apply Summary Card */}
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
          className={`w-full h-11 font-semibold text-xs sm:text-sm rounded-full shadow-none cursor-pointer ${
            hasApplied
              ? "bg-emerald-600 text-white"
              : isOngoing
                ? "bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
          }`}
        >
          {hasApplied ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Application Submitted
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
    </div>
  );
}
