import { Badge } from "@/components/ui/badge";
import React from "react";

export interface ApplicationStatusProps {
  status: string;
}

export function ApplicationStatus({ status }: ApplicationStatusProps) {
  const baseClasses =
    "hover:text-white hover:border-transparent transition-all duration-150 ease-in-out cursor-default select-none text-xs font-semibold";

  switch (status) {
    case "Pending":
      return (
        <Badge className={`bg-amber-50 text-amber-700 border-amber-200 ${baseClasses}`}>
          Pending
        </Badge>
      );
    case "Shortlisted":
      return (
        <Badge className={`bg-purple-50 text-purple-700 border-purple-200 ${baseClasses}`}>
          Shortlisted
        </Badge>
      );
    case "Accepted":
      return (
        <Badge className={`bg-emerald-50 text-emerald-700 border-emerald-200 ${baseClasses}`}>
          Accepted
        </Badge>
      );
    case "Rejected":
      return (
        <Badge className={`bg-red-50 text-red-700 border-red-200 ${baseClasses}`}>
          Rejected
        </Badge>
      );
    case "Withdrawn":
      return (
        <Badge className={`bg-slate-100 text-slate-600 border-slate-200 ${baseClasses}`}>
          Withdrawn
        </Badge>
      );
    default:
      return (
        <Badge className={`bg-slate-100 text-slate-700 border-slate-200 ${baseClasses}`}>
          {status}
        </Badge>
      );
  }
}

export default ApplicationStatus;
