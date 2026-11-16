"use client";

import ApplicationActivityChart from "@/components/candidate/ApplicationActivityChart";
import CandidateStatistics from "./CandidateStatistics";
import RecentApplications from "./RecentApplications";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { useCandidateDashboard } from "@/hooks/use-candidate";
import { AlertCircle, FileText, RefreshCw } from "lucide-react";
import Link from "next/link";
import React from "react";

function CandidateDashboard() {
  const { user } = useAuth();
  const { statsData, isLoading, refetch } = useCandidateDashboard();

  const isResumeMissing =
    user &&
    (!user.resume ||
      (typeof user.resume === "object" && !user.resume?.url) ||
      (typeof user.resume === "string" && user.resume.trim() === ""));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Resume Guard Warning Banner */}
      {isResumeMissing && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Resume Required to Apply
              </h4>
              <p className="mt-0.5 text-xs text-amber-800">
                You haven&apos;t uploaded your resume yet. Superio enforces the
                Resume Guard rule: all applications require an active PDF resume
                on file.
              </p>
            </div>
          </div>
          <Link href="/candidate/dashboard/profile" className="shrink-0">
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
            >
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
            Here is your job application status and performance analytics for
            today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
            className="text-xs border-slate-200"
          >
            {isLoading ? (
              <Spinner size="sm" className="mr-1.5" />
            ) : (
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            )}
            Refresh
          </Button>
          <Link href="/candidate/dashboard/applied-jobs">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              View All Applications
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Summary Stat Cards */}
      <CandidateStatistics stats={statsData?.stats} isLoading={isLoading} />

      {/* Recharts Area Chart */}
      <ApplicationActivityChart data={statsData?.activityChart || []} />

      {/* Recent Applications Section */}
      <RecentApplications
        applications={statsData?.recentApplications}
        isLoading={isLoading}
      />
    </div>
  );
}

export default CandidateDashboard;
