import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { IBookmark } from "@/types/bookmark";
import { Briefcase, MapPin, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface SavedJobCardProps {
  bookmark: IBookmark;
  isRemoving: boolean;
  onRemove: (jobId: string) => void;
}

export function SavedJobCard({
  bookmark: b,
  isRemoving,
  onRemove,
}: SavedJobCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:border-blue-300 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700">
              {b.job.company?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.job.company.image}
                  alt={b.job.company.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                b.job.company?.name.charAt(0) || "C"
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                {b.job.company?.name || "Verified Employer"}
              </p>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <MapPin className="h-3 w-3" />
                {b.job.location}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(b.job.id)}
            disabled={isRemoving}
            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Remove Bookmark"
          >
            {isRemoving ? (
              <Spinner size="sm" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Link
          href={`/all-jobs?search=${encodeURIComponent(b.job.title)}`}
          className="block mt-4"
        >
          <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition line-clamp-1">
            {b.job.title}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {b.job.category && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-semibold"
            >
              {b.job.category.name}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] font-medium"
          >
            {b.job.jobType}
          </Badge>
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] font-medium"
          >
            {b.job.level}
          </Badge>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block">
            Offered Salary
          </span>
          <span className="text-sm font-bold text-slate-900">
            ${b.job.salary.toLocaleString()}{" "}
            <span className="text-xs font-normal text-slate-500">/ mo</span>
          </span>
        </div>

        <Link href={`/all-jobs?search=${encodeURIComponent(b.job.title)}`}>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 rounded-lg"
          >
            View Vacancy
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default SavedJobCard;
