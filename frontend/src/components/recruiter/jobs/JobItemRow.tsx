import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IJob } from "@/interfaces/job.interface";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  Pencil,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export interface JobItemRowProps {
  job: IJob;
  isBusy: boolean;
  onToggleVisibility: (job: IJob) => void;
  onToggleHiringStatus: (job: IJob) => void;
  onDeleteRequest: (job: IJob) => void;
}

export function JobItemRow({
  job,
  isBusy,
  onToggleVisibility,
  onToggleHiringStatus,
  onDeleteRequest,
}: JobItemRowProps) {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      {/* Title & Category */}
      <td className="py-4 px-5">
        <Link
          href={`/apply-job/${job.id}`}
          className="font-bold text-slate-900 hover:text-indigo-600 transition"
        >
          {job.title}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          {job.category && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
              {job.category.name}
            </span>
          )}
          <span className="text-[11px] text-slate-400">
            Vacancy: {job.vacancy || 1}
          </span>
        </div>
      </td>

      {/* Location & Type */}
      <td className="py-4 px-5">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          {job.location}
        </div>
        <div className="mt-0.5 text-[11px] text-slate-400">
          {job.jobType} • ${job.salary.toLocaleString()}/yr
        </div>
      </td>

      {/* Applicants Badge */}
      <td className="py-4 px-5 text-center">
        <Link
          href={`/recruiter/dashboard/view-applicants?jobId=${job.id}`}
          className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 hover:bg-purple-100 transition"
        >
          <Users className="h-3 w-3" />
          {job.applicationCount || 0}
        </Link>
      </td>

      {/* Hiring Status Toggle (Ongoing / Closed) */}
      <td className="py-4 px-5 text-center">
        <button
          type="button"
          onClick={() => onToggleHiringStatus(job)}
          disabled={isBusy}
          className="cursor-pointer"
          title="Click to toggle Hiring Status"
        >
          {job.hiringStatus === "Ongoing" ? (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] gap-1 hover:bg-emerald-100 font-semibold">
              <CheckCircle2 className="h-3 w-3" />
              Ongoing
            </Badge>
          ) : (
            <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[11px] gap-1 hover:bg-slate-200">
              <XCircle className="h-3 w-3" />
              Closed
            </Badge>
          )}
        </button>
      </td>

      {/* Public Visibility Toggle */}
      <td className="py-4 px-5 text-center">
        <button
          type="button"
          onClick={() => onToggleVisibility(job)}
          disabled={isBusy}
          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
            job.visible
              ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
          title="Toggle public visibility"
        >
          {job.visible ? (
            <>
              <Eye className="h-3 w-3 text-blue-600" />
              Visible
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3 text-slate-400" />
              Hidden
            </>
          )}
        </button>
      </td>

      {/* Actions */}
      <td className="py-4 px-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/apply-job/${job.id}`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs text-slate-600 hover:text-indigo-600"
              title="View public post"
            >
              <Globe className="h-3.5 w-3.5" />
            </Button>
          </Link>

          <Link href={`/recruiter/dashboard/edit-job/${job.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs text-slate-600 hover:text-indigo-600"
              title="Edit job post"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteRequest(job)}
            className="h-8 px-2 text-xs text-red-600 hover:bg-red-50 hover:border-red-200"
            title="Soft delete job"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
