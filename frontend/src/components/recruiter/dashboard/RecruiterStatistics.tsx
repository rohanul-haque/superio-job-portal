import {
  RecruiterStatisticsCard,
  type RecruiterStatCardProps,
} from "./RecruiterStatisticsCard";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Users,
  XCircle,
} from "lucide-react";
import React from "react";

export interface RecruiterStatisticsProps {
  stats?: {
    totalJobsPosted: number;
    ongoingJobs: number;
    closedJobs: number;
    totalApplicants: number;
    hiredCandidates: number;
  };
  isLoading?: boolean;
}

export function RecruiterStatistics({
  stats = {
    totalJobsPosted: 0,
    ongoingJobs: 0,
    closedJobs: 0,
    totalApplicants: 0,
    hiredCandidates: 0,
  },
  isLoading = false,
}: RecruiterStatisticsProps) {
  const statCards: Omit<RecruiterStatCardProps, "isLoading">[] = [
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <RecruiterStatisticsCard
              key={i}
              label=""
              value={0}
              icon={Briefcase}
              color=""
              bg=""
              border=""
              description=""
              isLoading
            />
          ))
        : statCards.map((card) => (
            <RecruiterStatisticsCard
              key={card.label}
              {...card}
              isLoading={false}
            />
          ))}
    </div>
  );
}
