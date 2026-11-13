"use client";

import ApplicantInflowChart from "@/components/recruiter/ApplicantInflowChart";
import CandidateProfileModal from "@/components/recruiter/CandidateProfileModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import recruiterService from "@/services/recruiter.service";
import type {
  IRecruiterApplicant,
  IRecruiterDashboardStats,
} from "@/types/recruiter";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Loader2,
  PlusCircle,
  RefreshCw,
  Sparkles,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function RecruiterDashboardOverviewPage() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState<IRecruiterDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Candidate Preview Modal
  const [selectedApplicant, setSelectedApplicant] = useState<IRecruiterApplicant | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await recruiterService.getDashboardStats();
      setStatsData(data);
    } catch (err: unknown) {
      let msg = "Failed to load recruiter analytics.";
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
    totalJobsPosted: 0,
    ongoingJobs: 0,
    closedJobs: 0,
    totalApplicants: 0,
    hiredCandidates: 0,
  };

  const statCards = [
    {
      label: "Total Jobs Posted",
      value: stats.totalJobsPosted,
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "hover:border-indigo-300",
      description: "All published positions",
    },
    {
      label: "Ongoing Jobs",
      value: stats.ongoingJobs,
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "hover:border-blue-300",
      description: "Actively hiring vacancies",
    },
    {
      label: "Closed Jobs",
      value: stats.closedJobs,
      icon: XCircle,
      color: "text-slate-600",
      bg: "bg-slate-100",
      border: "hover:border-slate-300",
      description: "Archived or filled roles",
    },
    {
      label: "Total Applicants",
      value: stats.totalApplicants,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "hover:border-purple-300",
      description: "Candidate applications",
    },
    {
      label: "Candidates Hired",
      value: stats.hiredCandidates,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "hover:border-emerald-300",
      description: "Accepted job offers",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
      case "In Review":
      case "Pending Review":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-white hover:text-amber-800 hover:border-amber-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold cursor-default select-none"
          >
            Pending
          </Badge>
        );
      case "Shortlisted":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-white hover:text-purple-800 hover:border-purple-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold cursor-default select-none"
          >
            Shortlisted
          </Badge>
        );
      case "Accepted":
      case "Hired":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold cursor-default select-none"
          >
            Accepted
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 hover:bg-white hover:text-red-800 hover:border-red-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold cursor-default select-none"
          >
            Rejected
          </Badge>
        );
      case "Withdrawn":
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-800 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold cursor-default select-none"
          >
            Withdrawn
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-white hover:text-slate-900 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold cursor-default select-none"
          >
            {status}
          </Badge>
        );
    }
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
            Overview of your published vacancies, candidate flow, and recruitment status.
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

          <Link href="/recruiter/dashboard/add-job">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
              Post New Job
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

      {/* Applicant Inflow Recharts Area Chart */}
      <ApplicantInflowChart data={statsData?.inflowChart || []} />

      {/* Recent Applicants / Application Activation Section */}
      <Card
        id="application-activation"
        data-testid="application-activation"
        className="border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Applicants
            </h3>
            <p className="text-xs text-slate-500">
              Latest candidate submissions across your active job postings
            </p>
          </div>
          <Link
            href="/recruiter/dashboard/view-applicants"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
          >
            Manage all applicants
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <p className="mt-2 text-xs text-slate-500">Loading applicant pipeline...</p>
            </div>
          ) : !statsData?.recentApplicants || statsData.recentApplicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Users className="h-6 w-6" />
              </div>
              <p className="mt-3 text-xs font-bold text-slate-800">No applicants yet</p>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                As candidates apply to your job listings, their profiles and resumes will appear here.
              </p>
              <Link href="/recruiter/dashboard/add-job" className="mt-4">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs text-white">
                  Publish a Job Opening
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Candidate</th>
                    <th className="py-3 px-5">Applied Job</th>
                    <th className="py-3 px-5">Submission Date</th>
                    <th className="py-3 px-5 text-center">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {statsData.recentApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 shrink-0">
                            {app.candidate.profilePicture?.url ? (
                              <AvatarImage src={app.candidate.profilePicture.url} alt={app.candidate.name} />
                            ) : null}
                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
                              {app.candidate.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-slate-900">
                              {app.candidate.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {app.candidate.title || app.candidate.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-800">
                        {app.job.title}
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
                        <div className="flex items-center justify-end gap-2">
                          {app.candidate.resume && (
                            <a
                              href={app.candidate.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Resume
                            </a>
                          )}
                          <Link
                            href="/recruiter/dashboard/view-applicants"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Eye className="h-3 w-3" />
                            Review
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
      />
    </div>
  );
}
