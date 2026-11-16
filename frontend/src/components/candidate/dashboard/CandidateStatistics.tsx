import {
  CandidateStatisticsCard,
  type CandidateStatCardProps,
} from "./CandidateStatisticsCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  ThumbsDown,
} from "lucide-react";
import React from "react";

export interface CandidateStatisticsProps {
  stats?: {
    totalApplied: number;
    pending: number;
    shortlisted: number;
    accepted: number;
    rejected: number;
  };
  isLoading?: boolean;
}

export function CandidateStatistics({
  stats = {
    totalApplied: 0,
    pending: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
  },
  isLoading = false,
}: CandidateStatisticsProps) {
  const cards: Omit<CandidateStatCardProps, "isLoading">[] = [
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-8 w-14 rounded" />
                <Skeleton className="mt-0.5 h-4 w-24 rounded" />
                <Skeleton className="mt-0.5 h-3.5 w-28 rounded" />
              </div>
            </div>
          ))
        : cards.map((card) => (
            <CandidateStatisticsCard
              key={card.label}
              {...card}
              isLoading={false}
            />
          ))}
    </div>
  );
}

export default CandidateStatistics;
