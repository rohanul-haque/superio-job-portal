import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Avatar & Summary Card Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full shrink-0" />
        <div className="space-y-3 w-full sm:w-auto flex-1">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-72 rounded" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Details Form Card Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <Skeleton className="h-6 w-40 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
