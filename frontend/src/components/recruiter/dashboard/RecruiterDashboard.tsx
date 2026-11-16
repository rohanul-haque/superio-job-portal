"use client";

import { RecentApplicants } from "./RecentApplicants";
import { RecruiterStatistics } from "./RecruiterStatistics";
import ApplicantInflowChart from "@/components/recruiter/ApplicantInflowChart";
import CandidateProfileModal from "@/components/recruiter/CandidateProfileModal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { useRecruiterDashboard } from "@/hooks/use-recruiter";
import type { IRecruiterApplicant } from "@/interfaces/recruiter.interface";
import { PlusCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export function RecruiterDashboard() {
  const { user } = useAuth();
  const { statsData, isLoading, refetch } = useRecruiterDashboard();
  const [selectedApplicant, setSelectedApplicant] =
    useState<IRecruiterApplicant | null>(null);

  const stats = statsData?.stats || {
    totalJobsPosted: 0,
    ongoingJobs: 0,
    closedJobs: 0,
    totalApplicants: 0,
    hiredCandidates: 0,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Welcome back, {user?.name}! 🏢
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Overview of your published vacancies, candidate flow, and
            recruitment status.
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

          <Link href="/recruiter/dashboard/add-job">
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
            >
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Summary Stat Cards */}
      <RecruiterStatistics stats={stats} isLoading={isLoading} />

      {/* Applicant Inflow Recharts Area Chart */}
      <ApplicantInflowChart data={statsData?.inflowChart || []} />

      {/* Recent Applicants */}
      <RecentApplicants
        applicants={statsData?.recentApplicants || []}
        isLoading={isLoading}
        onSelectApplicant={(app) =>
          setSelectedApplicant(app as unknown as IRecruiterApplicant)
        }
      />

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
      />
    </div>
  );
}
