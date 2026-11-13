"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IJob } from "@/types/job";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface JobCardProps {
  job: IJob;
  featured?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, featured = false }) => {
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

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        featured
          ? "border-blue-300 ring-1 ring-blue-500/20 shadow-md"
          : "border-slate-200 hover:border-blue-300"
      }`}
    >
      <div>
        {/* Header: Company Logo/Avatar & Badges */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-700 font-bold text-base shadow-xs overflow-hidden">
              {job.company?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.company.image}
                  alt={job.company.name || "Company"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 line-clamp-1">
                {job.company?.name || "Verified Company"}
              </p>
              <Link href={`/apply-job/${job.id}`}>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`text-xs px-2.5 py-0.5 font-medium shrink-0 ${getJobTypeColor(
              job.jobType,
            )}`}
          >
            {job.jobType}
          </Badge>
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
      <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Salary
          </span>
          <span className="text-sm font-extrabold text-slate-900">
            {formatSalary(job.salary)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isOngoing && (
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200 text-[10px]"
            >
              Closed
            </Badge>
          )}
          <Link href={`/apply-job/${job.id}`}>
            <Button
              size="sm"
              className={`h-9 px-3.5 text-xs font-semibold ${
                isOngoing
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Apply Now
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

