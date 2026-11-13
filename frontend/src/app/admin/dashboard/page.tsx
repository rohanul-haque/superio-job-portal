"use client";

import CategoryDistributionChart from "@/components/admin/CategoryDistributionChart";
import PlatformGrowthChart from "@/components/admin/PlatformGrowthChart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import adminService from "@/services/admin.service";
import type { IAdminDashboardStats } from "@/types/admin";
import {
  Activity,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  FolderTree,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [data, setData] = useState<IAdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const stats = await adminService.getDashboardStats();
      setData(stats);
    } catch (err: unknown) {
      let msg = "Failed to load admin metrics.";
      if (err instanceof Error) msg = err.message;
      toast.error("Dashboard Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <Loader2 className="h-9 w-9 animate-spin text-purple-600 mb-3" />
        <p className="text-sm font-medium text-slate-600">
          Loading platform intelligence & system metrics...
        </p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalCandidates: 0,
    totalRecruiters: 0,
    totalActiveJobs: 0,
    totalApplications: 0,
    totalHired: 0,
    totalModerated: 0,
  };

  const statCards = [
    {
      title: "Total Candidates",
      value: stats.totalCandidates,
      icon: Users,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      link: "/admin/dashboard/candidates",
    },
    {
      title: "Total Recruiters",
      value: stats.totalRecruiters,
      icon: Building2,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      link: "/admin/dashboard/recruiters",
    },
    {
      title: "Active Job Vacancies",
      value: stats.totalActiveJobs,
      icon: Briefcase,
      color: "bg-sky-50 text-sky-600 border-sky-100",
      link: "/admin/dashboard/jobs",
    },
    {
      title: "Applications Submitted",
      value: stats.totalApplications,
      icon: FileText,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      link: "/admin/dashboard/jobs",
    },
    {
      title: "Candidates Hired",
      value: stats.totalHired,
      icon: CheckCircle2,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      link: "/admin/dashboard/candidates",
    },
    {
      title: "Moderated / Blocked",
      value: stats.totalModerated,
      icon: ShieldAlert,
      color: "bg-rose-50 text-rose-600 border-rose-100",
      link: "/admin/dashboard/trash",
    },
  ];

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
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Superio Governance Console
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time platform metrics, user moderation, taxonomy controls, and system health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchData}
            disabled={isLoading}
            className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-purple-600" : ""}`}
            />
            Refresh Telemetry
          </Button>

          <Link href="/admin/dashboard/trash">
            <Button
              variant="outline"
              className="gap-1.5 text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Trash Center
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.link}>
              <Card className="border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all duration-150 cursor-pointer">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      {card.title}
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${card.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Growth Area Chart */}
        <Card className="border-slate-200 shadow-xs lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Platform Growth & Inflow
                </h3>
                <p className="text-xs text-slate-500">
                  Monthly candidate signups, recruiter onboarding, and job vacancies posted.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  Candidates
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-purple-600" />
                  Recruiters
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  Jobs
                </span>
              </div>
            </div>

            <PlatformGrowthChart data={data?.growthChart || []} />
          </CardContent>
        </Card>

        {/* Category Vacancies Distribution */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="h-4 w-4 text-indigo-600" />
                Category Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Active job vacancies per taxonomy category.
              </p>
            </div>

            <CategoryDistributionChart
              data={
                data?.categoryDistribution
                  ?.filter((cat) => (cat.count || 0) > 0)
                  ?.slice(0, 3) || []
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Platform Activity Feeds */}
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

            {data?.recentActivity?.recruiters?.length ? (
              <div className="divide-y divide-slate-100">
                {data.recentActivity.recruiters.map((r) => (
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

            {data?.recentActivity?.applications?.length ? (
              <div className="divide-y divide-slate-100">
                {data.recentActivity.applications.map((a) => (
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
    </div>
  );
}
