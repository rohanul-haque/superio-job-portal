import type { IJob } from "@/interfaces/job.interface";
import { Briefcase } from "lucide-react";
import React from "react";

interface JobDetailsDescriptionProps {
  job: IJob;
  className?: string;
  similarJobs?: IJob[];
}

export default function JobDetailsDescription({
  job,
  className = "",
}: JobDetailsDescriptionProps) {
  return (
    <div className={`space-y-8 ${className}`}>
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
    </div>
  );
}
