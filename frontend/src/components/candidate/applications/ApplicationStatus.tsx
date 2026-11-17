import { Badge } from "@/components/ui/badge";
import React from "react";

interface ApplicationStatusProps {
  status: string;
}

function ApplicationStatus({ status }: ApplicationStatusProps) {
  const baseClasses =
    "hover:bg-blue-50 hover:border-blue-200 transition-all duration-150 ease-in-out cursor-default select-none text-xs font-semibold";

  const normalized = status?.toLowerCase();
  switch (normalized) {
    case "pending":
      return (
        <Badge
          className={`bg-amber-50 text-amber-700 border-amber-200 hover:text-amber-800 ${baseClasses}`}
        >
          Pending
        </Badge>
      );
    case "shortlisted":
      return (
        <Badge
          className={`bg-purple-50 text-purple-700 border-purple-200 hover:text-blue-700 ${baseClasses}`}
        >
          Shortlisted
        </Badge>
      );
    case "accepted":
      return (
        <Badge
          className={`bg-emerald-50 text-emerald-700 border-emerald-200 hover:text-emerald-800 ${baseClasses}`}
        >
          Accepted
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          className={`bg-red-50 text-red-700 border-red-200 hover:text-red-800 ${baseClasses}`}
        >
          Rejected
        </Badge>
      );
    case "withdrawn":
      return (
        <Badge
          className={`bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-800 ${baseClasses}`}
        >
          Withdrawn
        </Badge>
      );
    default:
      return (
        <Badge
          className={`bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900 ${baseClasses}`}
        >
          {status}
        </Badge>
      );
  }
}

export default ApplicationStatus;
