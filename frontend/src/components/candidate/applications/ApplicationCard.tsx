import { ApplicationStatus } from "./ApplicationStatus";
import { Button } from "@/components/ui/button";
import type { IJobApplication } from "@/interfaces/application.interface";
import { MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface ApplicationCardProps {
  application: IJobApplication;
  onWithdraw: (application: IJobApplication) => void;
}

export function ApplicationCard({
  application: app,
  onWithdraw,
}: ApplicationCardProps) {
  const canWithdraw = app.status === "Pending" || app.status === "Shortlisted";

  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      <td className="py-4 px-6">
        <Link
          href={`/all-jobs?search=${encodeURIComponent(app.job.title)}`}
          className="font-bold text-slate-900 hover:text-blue-600 transition"
        >
          {app.job.title}
        </Link>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {app.job.location}
          </span>
          <span>•</span>
          <span>{app.job.jobType}</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">
            ${app.job.salary.toLocaleString()} / mo
          </span>
        </div>
      </td>

      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-600">
            {app.company.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={app.company.image}
                alt={app.company.name}
                className="h-full w-full object-cover"
              />
            ) : (
              app.company.name.charAt(0)
            )}
          </div>
          <span className="font-semibold text-slate-800 text-xs">
            {app.company.name}
          </span>
        </div>
      </td>

      <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
        {new Date(app.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>

      <td className="py-4 px-6 text-center whitespace-nowrap">
        <ApplicationStatus status={app.status} />
      </td>

      <td className="py-4 px-6 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/all-jobs?search=${encodeURIComponent(app.job.title)}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              View Vacancy
            </Button>
          </Link>

          {canWithdraw && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWithdraw(app)}
              className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              Withdraw
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default ApplicationCard;
