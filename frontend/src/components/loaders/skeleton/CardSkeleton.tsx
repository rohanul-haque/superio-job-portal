import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-7 w-20 rounded" />
        <Skeleton className="h-3.5 w-28 rounded" />
        <Skeleton className="h-3 w-36 rounded" />
      </div>
    </div>
  );
}

export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-none flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header: Logo, Badges, Bookmark */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2 pt-1">
          <Skeleton className="h-5 w-4/5 rounded" />
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-3.5 w-20 rounded" />
        </div>
      </div>

      {/* Footer Button */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    </Card>
  );
}

export function AuthCardSkeleton() {
  return (
    <Card className="border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-8 max-w-md mx-auto space-y-6 bg-white">
      <div className="space-y-2 text-center">
        <Skeleton className="h-7 w-48 mx-auto rounded" />
        <Skeleton className="h-4 w-64 mx-auto rounded" />
      </div>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl pt-2" />
      </div>
    </Card>
  );
}
