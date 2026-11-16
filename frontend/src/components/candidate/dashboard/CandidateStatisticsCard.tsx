import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import React from "react";

export interface CandidateStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  description: string;
  isLoading?: boolean;
}

export function CandidateStatisticsCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  border,
  description,
  isLoading,
}: CandidateStatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-8 w-14 rounded" />
          <Skeleton className="mt-0.5 h-4 w-24 rounded" />
          <Skeleton className="mt-0.5 h-3.5 w-28 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 ${border}`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl font-black text-slate-900">{value}</div>
        <h3 className="mt-0.5 text-xs font-bold text-slate-800">{label}</h3>
        <p className="mt-0.5 text-[11px] text-slate-400">{description}</p>
      </div>
    </div>
  );
}

export default CandidateStatisticsCard;
