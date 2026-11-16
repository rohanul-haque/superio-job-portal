import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

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

export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 px-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24 rounded" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="flex items-center justify-between gap-4 py-3.5 px-4"
          >
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={c}
                className={`h-4 rounded ${
                  c === 0 ? "w-36" : c === columns - 1 ? "w-20" : "w-24"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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

export function ChartSkeleton({ height = "h-72" }: { height?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-36 rounded" />
          <Skeleton className="h-3.5 w-52 rounded" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <Skeleton className={`w-full ${height} rounded-xl`} />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full shrink-0" />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <Skeleton className="h-6 w-48 rounded mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-32 rounded mx-auto sm:mx-0" />
          <Skeleton className="h-3 w-64 rounded mx-auto sm:mx-0" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      {/* Form Fields Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function JobDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Banner Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-8 w-64 sm:w-96 rounded" />
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-36 rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="h-11 w-11 rounded-full" />
            <Skeleton className="h-11 w-11 rounded-full" />
            <Skeleton className="h-11 w-36 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <Skeleton className="h-6 w-40 rounded" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
            <Skeleton className="h-6 w-48 rounded pt-4" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <Skeleton className="h-5 w-32 rounded" />
            <div className="space-y-3 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
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
