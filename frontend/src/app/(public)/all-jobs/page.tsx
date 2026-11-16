import JobsCatalogue from "@/components/jobs/JobsCatalogue";
import { JobCardSkeleton } from "@/components/shared/skeletons";
import Skeleton from "@/components/ui/skeleton";
import React, { Suspense } from "react";


export default function AllJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header search bar skeleton */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-11 flex-1 rounded-xl" />
            <Skeleton className="h-11 w-full sm:w-48 rounded-xl" />
            <Skeleton className="h-11 w-full sm:w-32 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Filter Sidebar skeleton */}
            <aside className="hidden lg:block lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 h-fit">
              <Skeleton className="h-5 w-32 rounded" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
              </div>
              <Skeleton className="h-5 w-28 rounded pt-2" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
            </aside>

            {/* Right Job Cards Grid skeleton */}
            <main className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            </main>
          </div>
        </div>
      }
    >
      <JobsCatalogue />
    </Suspense>
  );
}
