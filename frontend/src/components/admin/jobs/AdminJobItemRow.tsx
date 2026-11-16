import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IAdminJob } from "@/interfaces/admin.interface";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface AdminJobItemRowProps {
  job: IAdminJob;
  isBusy: boolean;
  onToggleVisibility: (job: IAdminJob) => void;
  onToggleHiringStatus: (job: IAdminJob) => void;
  onDeleteRequest: (job: IAdminJob) => void;
}

export default function AdminJobItemRow({
  job,
  isBusy,
  onToggleVisibility,
  onToggleHiringStatus,
  onDeleteRequest,
}: AdminJobItemRowProps) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      {/* Title & Location */}
      <td className="px-6 py-4">
        <p className="font-bold text-slate-900 leading-tight">{job.title}</p>
        <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
          <MapPin className="h-3 w-3 shrink-0" />
          {job.location}
        </p>
      </td>

      {/* Company */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold text-xs overflow-hidden">
            {job.company?.image ? (
              <img
                src={job.company.image}
                alt={job.company.name}
                className="h-full w-full object-cover"
              />
            ) : (
              job.company?.name?.charAt(0) || "C"
            )}
          </div>
          <span className="text-xs font-semibold text-slate-900">
            {job.company?.name || "Unknown Company"}
          </span>
        </div>
      </td>

      {/* Category & Type */}
      <td className="px-6 py-4">
        <p className="text-xs font-semibold text-purple-700">
          {job.category?.name || "General"}
        </p>
        <span className="text-[11px] text-slate-500">
          {job.jobType} • ${job.salary.toLocaleString()}/yr
        </span>
      </td>

      {/* Hiring Status Toggle */}
      <td className="px-6 py-4 text-center whitespace-nowrap">
        <button
          type="button"
          onClick={() => onToggleHiringStatus(job)}
          disabled={isBusy}
          className="cursor-pointer"
          title="Click to toggle Hiring Status"
        >
          {job.hiringStatus === "Ongoing" ? (
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[11px] gap-1 font-semibold"
            >
              <CheckCircle2 className="h-3 w-3" />
              Ongoing
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-800 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[11px] gap-1 font-semibold"
            >
              <XCircle className="h-3 w-3" />
              Closed
            </Badge>
          )}
        </button>
      </td>

      {/* Public Visibility Toggle */}
      <td className="px-6 py-4 text-center whitespace-nowrap">
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

      {/* Applicants Badge */}
      <td className="px-6 py-4 text-center whitespace-nowrap">
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700">
          <Users className="h-3 w-3" />
          {job.applicationCount || 0}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link href={`/apply-job/${job.id}`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs text-slate-600 hover:text-purple-600"
              title="View public post"
            >
              <Globe className="h-3.5 w-3.5" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => onDeleteRequest(job)}
            className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-200"
            title="Soft delete job"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
