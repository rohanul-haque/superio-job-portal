import JobCard from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import type { IJob } from "@/interfaces/job.interface";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface JobDetailsDescriptionProps {
  job: IJob;
  similarJobs?: IJob[];
}

export function JobDetailsDescription({
  job,
  similarJobs = [],
}: JobDetailsDescriptionProps) {
  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Job Description Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-none">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-[#4F46E5]" />
          Role Description & Overview
        </h2>

        {/* Rich HTML rendered description */}
        <div
          className="job-description-content text-sm text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
      </div>

      {/* Similar Jobs Section */}
      {similarJobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">
                Similar Job Opportunities
              </h3>
              <p className="text-xs text-slate-500">
                Active openings in {job.category?.name || "this category"}
              </p>
            </div>
            <Link href="/all-jobs">
              <Button
                variant="outline"
                size="sm"
                className="text-xs rounded-full border-[#E5E7EB]"
              >
                View Catalogue
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {similarJobs.map((simJob) => (
              <JobCard key={simJob.id} job={simJob} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
