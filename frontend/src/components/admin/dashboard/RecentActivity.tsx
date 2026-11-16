import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Building2, FileText } from "lucide-react";
import Link from "next/link";
import React from "react";

interface RecentActivityProps {
  recentActivity?: {
    recruiters?: Array<{
      id: string;
      name: string;
      email: string;
      image?: string;
      status: string;
      createdAt: string;
    }>;
    applications?: Array<{
      id: string;
      candidateName: string;
      jobTitle: string;
      companyName: string;
      status: string;
      createdAt: string;
    }>;
  };
}

export default function RecentActivity({ recentActivity }: RecentActivityProps) {
  const getApplicationStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase().trim();
    if (s === "pending" || s === "in review" || s === "pending review") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-white hover:text-amber-800 hover:border-amber-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] font-semibold cursor-default select-none"
        >
          {status}
        </Badge>
      );
    }
    if (s === "shortlisted") {
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-white hover:text-purple-800 hover:border-purple-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] font-semibold cursor-default select-none"
        >
          {status}
        </Badge>
      );
    }
    if (s === "accepted" || s === "hired") {
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] font-semibold cursor-default select-none"
        >
          {status}
        </Badge>
      );
    }
    if (s === "rejected") {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 hover:bg-white hover:text-red-800 hover:border-red-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] font-semibold cursor-default select-none"
        >
          {status}
        </Badge>
      );
    }
    if (s === "withdrawn") {
      return (
        <Badge
          variant="outline"
          className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-800 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] font-semibold cursor-default select-none"
        >
          {status}
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-white hover:text-slate-900 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] font-semibold cursor-default select-none"
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Companies Registered */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" />
              Recent Recruiter Registrations
            </h3>
            <Link
              href="/admin/dashboard/recruiters"
              className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentActivity?.recruiters?.length ? (
            <div className="divide-y divide-slate-100">
              {recentActivity.recruiters.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      {r.image ? (
                        <AvatarImage src={r.image} alt={r.name} />
                      ) : null}
                      <AvatarFallback className="bg-purple-50 text-purple-700 font-bold text-xs">
                        {r.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {r.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {r.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold cursor-default select-none transition-all duration-150 ease-in-out ${
                        r.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs"
                          : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-white hover:text-rose-800 hover:border-rose-400 hover:shadow-xs"
                      }`}
                    >
                      {r.status === "active" ? "Active" : r.status}
                    </Badge>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              No recent company registrations recorded.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Applications Activity */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              Latest Candidate Applications
            </h3>
            <Link
              href="/admin/dashboard/jobs"
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              View Jobs
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentActivity?.applications?.length ? (
            <div className="divide-y divide-slate-100">
              {recentActivity.applications.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {a.candidateName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Applied for{" "}
                      <span className="font-semibold text-slate-700">
                        {a.jobTitle}
                      </span>{" "}
                      at {a.companyName}
                    </p>
                  </div>

                  <div className="text-right whitespace-nowrap pl-2">
                    {getApplicationStatusBadge(a.status)}
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              No recent job applications submitted yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
