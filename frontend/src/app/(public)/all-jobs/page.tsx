import JobsCatalogue from "@/components/jobs/JobsCatalogue";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Explore Jobs — Superio Job Portal",
  description:
    "Search, filter, and discover career opportunities across leading global employers on Superio Enterprise.",
};

export default function AllJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading job catalogue...
          </p>
        </div>
      }
    >
      <JobsCatalogue />
    </Suspense>
  );
}

