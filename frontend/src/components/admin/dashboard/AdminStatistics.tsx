import { StatsCardSkeleton } from "@/components/loaders/skeleton/CardSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  ShieldAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export interface AdminStatsProps {
  stats?: {
    totalCandidates: number;
    totalRecruiters: number;
    totalActiveJobs: number;
    totalApplications: number;
    totalHired: number;
    totalModerated: number;
  };
  isLoading?: boolean;
}

export function AdminStatistics({
  stats = {
    totalCandidates: 0,
    totalRecruiters: 0,
    totalActiveJobs: 0,
    totalApplications: 0,
    totalHired: 0,
    totalModerated: 0,
  },
  isLoading = false,
}: AdminStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

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

  return (
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
  );
}
