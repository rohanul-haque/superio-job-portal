import { StatsCardSkeleton } from "@/components/loaders/skeleton/CardSkeleton";
import { TableSkeleton } from "@/components/loaders/skeleton/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export function ChartSkeleton({ height = "h-72" }: { height?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-36 rounded" />
          <Skeleton className="h-3.5 w-52 rounded" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className={`w-full ${height} flex items-end gap-3 pt-6`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-t-md"
            style={{ height: `${20 + (i % 5) * 18}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton({
  cardCount = 6,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}: {
  cardCount?: number;
  gridCols?: string;
}) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* Cards Grid */}
      <div className={`grid ${gridCols} gap-5`}>
        {Array.from({ length: cardCount }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton height="h-64" />
        <ChartSkeleton height="h-64" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <TableSkeleton rows={5} columns={5} />
      </div>
    </div>
  );
}

export default DashboardSkeleton;
