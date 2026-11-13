"use client";

import ApplicationActivityChart from "@/components/candidate/ApplicationActivityChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import candidateService from "@/services/candidate.service";
import type { ICandidateDashboardStats } from "@/types/candidate";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function CandidateDashboardOverviewPage() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState<ICandidateDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await candidateService.getDashboardStats();
      setStatsData(data);
    } catch (err: unknown) {
      let msg = "Failed to load dashboard metrics.";
      if (err instanceof Error) msg = err.message;
      toast.error("Dashboard error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const stats = statsData?.stats || {
    totalApplied: 0,
    pending: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
  };

  const statCards = [
    {
      label: "Total Applied",
      value: stats.totalApplied,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "hover:border-blue-300",
      description: "Submitted applications",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "hover:border-amber-300",
      description: "Awaiting recruiter review",
    },
    {
      label: "Shortlisted",
      value: stats.shortlisted,
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "hover:border-purple-300",
      description: "Selected for interview",
    },
    {
      label: "Approved / Hired",
      value: stats.accepted,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "hover:border-emerald-300",
      description: "Accepted offers",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: ThumbsDown,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "hover:border-red-300",
      description: "Unsuccessful submissions",
    },
  ];

  const getStatusBadge = (status: string) => {
    const baseBadgeClasses =
      "hover:text-white hover:border-transparent transition-all duration-150 ease-in-out cursor-default select-none";

    switch (status) {
      case "Pending":
        return (
          <Badge className={`bg-amber-50 text-amber-700 border-amber-200 ${baseBadgeClasses}`}>
            Pending
          </Badge>
        );
      case "Shortlisted":
        return (
          <Badge className={`bg-purple-50 text-purple-700 border-purple-200 ${baseBadgeClasses}`}>
            Shortlisted
          </Badge>
        );
      case "Accepted":
        return (
          <Badge className={`bg-emerald-50 text-emerald-700 border-emerald-200 ${baseBadgeClasses}`}>
            Accepted
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className={`bg-red-50 text-red-700 border-red-200 ${baseBadgeClasses}`}>
            Rejected
          </Badge>
        );
      case "Withdrawn":
        return (
          <Badge className={`bg-slate-100 text-slate-600 border-slate-200 ${baseBadgeClasses}`}>
            Withdrawn
          </Badge>
        );
      default:
        return (
          <Badge className={`bg-slate-100 text-slate-700 border-slate-200 ${baseBadgeClasses}`}>
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Resume Guard Notice (If candidate hasn't uploaded a resume) */}
      {!(user?.resume && (typeof user.resume === "object" ? user.resume.url : user.resume)) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Resume Required to Apply
              </h4>
              <p className="mt-0.5 text-xs text-amber-800">
                You haven&apos;t uploaded your resume yet. Superio enforces the Resume Guard rule: all applications require an active PDF resume on file.
              </p>
            </div>
          </div>
          <Link href="/candidate/dashboard/profile" className="shrink-0">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Upload PDF Resume
            </Button>
          </Link>
        </div>
      )}

      {/* Overview Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Welcome back, {user?.name}! 👋
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Here is your job application status and performance analytics for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={isLoading}
            className="text-xs border-slate-200"
          >
            <RefreshCw
              className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Link href="/candidate/dashboard/applied-jobs">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
              View All Applications
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 ${card.border}`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900">
                  {isLoading ? (
                    <div className="h-8 w-12 animate-pulse rounded bg-slate-100" />
                  ) : (
                    card.value
                  )}
                </div>
                <h3 className="mt-0.5 text-xs font-bold text-slate-800">
                  {card.label}
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Area Chart */}
      <ApplicationActivityChart data={statsData?.activityChart || []} />

      {/* Recent Applications Section */}
      <Card id="recent-applicant-applications" className="border-slate-200 shadow-xs overflow-hidden">
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
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <p className="mt-2 text-xs text-slate-500">Loading recent applications...</p>
            </div>
          ) : !statsData?.recentApplications || statsData.recentApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <p className="mt-3 text-xs font-bold text-slate-800">No applications submitted yet</p>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                Explore available vacancies on Superio and start submitting applications.
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
                  {statsData.recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
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
    </div>
  );
}
