import JobsCatalogue from "@/components/jobs/JobsCatalogue";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Explore Jobs — Hirenest Job Portal",
  description:
    "Search, filter, and discover career opportunities across leading global employers on Hirenest.",
};

export default function AllJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
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

