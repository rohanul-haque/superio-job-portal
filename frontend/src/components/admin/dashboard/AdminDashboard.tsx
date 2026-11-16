"use client";

import AdminStatistics from "./AdminStatistics";
import RecentActivity from "./RecentActivity";
import CategoryDistributionChart from "@/components/admin/CategoryDistributionChart";
import PlatformGrowthChart from "@/components/admin/PlatformGrowthChart";
import { ChartSkeleton } from "@/components/loaders/skeleton/DashboardSkeleton";
import TableSkeleton from "@/components/loaders/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import Spinner from "@/components/ui/spinner";
import useAdminDashboard from "@/hooks/use-admin";
import {
  FolderTree,
  RefreshCw,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AdminDashboard() {
  const { data, isLoading, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-72 rounded" />
          </div>
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>

        <AdminStatistics isLoading />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton height="h-64" />
          <ChartSkeleton height="h-64" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <TableSkeleton rows={5} columns={5} />
        </div>
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

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Superio Governance Console
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time platform metrics, user moderation, taxonomy controls, and
            system health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={refetch}
            disabled={isLoading}
            className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
          >
            {isLoading ? (
              <Spinner size="sm" className="text-purple-600" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
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
      <AdminStatistics stats={stats} isLoading={false} />

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
                  Monthly candidate signups, recruiter onboarding, and job
                  vacancies posted.
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
      <RecentActivity recentActivity={data?.recentActivity} />
    </div>
  );
}
