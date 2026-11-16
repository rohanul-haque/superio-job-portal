import { TableSkeleton } from "@/components/loaders/skeleton/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface RecentApplicationItem {
  id: string;
  status: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    jobType: string;
    salary: number;
    hiringStatus: string;
  };
  company: {
    id: string;
    name: string;
    image: string;
    location: string;
  };
}

export interface RecentApplicationsProps {
  applications?: RecentApplicationItem[];
  isLoading?: boolean;
}

export function RecentApplications({
  applications = [],
  isLoading = false,
}: RecentApplicationsProps) {
  const getStatusBadge = (status: string) => {
    const baseBadgeClasses =
      "hover:text-white hover:border-transparent transition-all duration-150 ease-in-out cursor-default select-none";

    switch (status) {
      case "Pending":
        return (
          <Badge
            className={`bg-amber-50 text-amber-700 border-amber-200 ${baseBadgeClasses}`}
          >
            Pending
          </Badge>
        );
      case "Shortlisted":
        return (
          <Badge
            className={`bg-purple-50 text-purple-700 border-purple-200 ${baseBadgeClasses}`}
          >
            Shortlisted
          </Badge>
        );
      case "Accepted":
        return (
          <Badge
            className={`bg-emerald-50 text-emerald-700 border-emerald-200 ${baseBadgeClasses}`}
          >
            Accepted
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            className={`bg-red-50 text-red-700 border-red-200 ${baseBadgeClasses}`}
          >
            Rejected
          </Badge>
        );
      case "Withdrawn":
        return (
          <Badge
            className={`bg-slate-100 text-slate-600 border-slate-200 ${baseBadgeClasses}`}
          >
            Withdrawn
          </Badge>
        );
      default:
        return (
          <Badge
            className={`bg-slate-100 text-slate-700 border-slate-200 ${baseBadgeClasses}`}
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card
      id="recent-applicant-applications"
      className="border-slate-200 shadow-xs overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Recent Applications
          </h3>
          <p className="text-xs text-slate-500">
            Snapshot of your 5 most recently submitted job applications
          </p>
        </div>
        <Link
          href="/candidate/dashboard/applied-jobs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
        >
          See all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-5">
            <TableSkeleton rows={5} columns={4} />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <p className="mt-3 text-xs font-bold text-slate-800">
              No applications submitted yet
            </p>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              Explore available vacancies on Superio and start submitting
              applications.
            </p>
            <Link href="/all-jobs" className="mt-4">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                Browse Active Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Job Title</th>
                  <th className="py-3 px-5">Company</th>
                  <th className="py-3 px-5">Applied Date</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {app.job.title}
                      <div className="text-[11px] font-normal text-slate-400">
                        {app.job.location} • {app.job.jobType}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-600">
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
                        <span className="font-semibold text-slate-800">
                          {app.company.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href="/candidate/dashboard/applied-jobs"
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentApplications;
