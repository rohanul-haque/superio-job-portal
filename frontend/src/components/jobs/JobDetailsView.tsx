"use client";

import JobApplyModal from "./details/JobApplyModal";
import JobDetailsDescription from "./details/JobDetailsDescription";
import JobDetailsHeader from "./details/JobDetailsHeader";
import JobDetailsSidebar from "./details/JobDetailsSidebar";
import { JobDetailsSkeleton } from "@/components/loaders/skeleton/JobListSkeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCandidateJobState } from "@/context/CandidateJobStateContext";
import { queryKeys } from "@/lib/query-keys";
import { applyJob } from "@/services/application.service";
import { getJobById } from "@/services/job.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "@/components/ui/toast";

interface JobDetailsViewProps {
  id: string;
}

const JobDetailsView: React.FC<JobDetailsViewProps> = ({ id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const {
    isJobBookmarked,
    hasAppliedToJob,
    toggleBookmark: toggleCandidateBookmark,
    recordApplication,
  } = useCandidateJobState();

  const jobDetailQuery = useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => getJobById(id),
    enabled: Boolean(id),
  });

  const job = jobDetailQuery.data?.job || null;
  const similarJobs = jobDetailQuery.data?.similarJobs || [];
  const isLoading = jobDetailQuery.isLoading;
  const errorMessage = jobDetailQuery.error instanceof Error
    ? jobDetailQuery.error.message
    : jobDetailQuery.error
      ? String(jobDetailQuery.error)
      : null;

  // Interaction State backed by Candidate Job State context & server truth
  const isBookmarked = isJobBookmarked(id);
  const hasApplied = hasAppliedToJob(id);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isResumeWarningOpen, setIsResumeWarningOpen] = useState(false);

  const applyMutation = useMutation({
    mutationFn: () => applyJob(id),
    onSuccess: () => {
      recordApplication(id);
      setIsApplyModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: queryKeys.candidate.applications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.candidate.dashboard(),
      });
      toast.success("Application submitted successfully!", {
        description: "Your application has been received by the recruiter.",
      });
    },
    onError: (err: unknown) => {
      let message = "Failed to submit application.";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string }; status?: number } })
          .response
      ) {
        const resp = (
          err as {
            response: { data?: { message?: string }; status?: number };
          }
        ).response;
        if (
          resp?.status === 409 ||
          resp?.data?.message?.toLowerCase().includes("already applied")
        ) {
          recordApplication(id);
          setIsApplyModalOpen(false);
        }
        if (resp?.data?.message) {
          message = resp.data.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    },
  });

  const isApplying = applyMutation.isPending;

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated || !user) {
      toast.info("Please sign in to save this job to your bookmarks.");
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.role !== "candidate") {
      toast.error("Only candidate accounts can bookmark jobs.");
      return;
    }

    try {
      const nextState = await toggleCandidateBookmark(id);
      if (nextState) {
        toast.success("Job saved to your bookmarks!");
      } else {
        toast.info("Job removed from bookmarks.");
      }
    } catch {
      toast.error("Failed to update bookmark.");
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated || !user) {
      toast.info("Please sign in as a candidate to apply for this job.");
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.role !== "candidate") {
      toast.error(
        `Only verified Candidate accounts can apply for jobs. You are signed in as a ${user.role}.`
      );
      return;
    }

    if (hasApplied) {
      toast.info("You have already applied for this job.");
      return;
    }

    const resumeUrl =
      typeof user.resume === "object" ? user.resume?.url : user.resume;
    if (!resumeUrl || resumeUrl.trim() === "") {
      setIsResumeWarningOpen(true);
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleConfirmApplication = () => {
    applyMutation.mutate();
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  };

  if (isLoading) {
    return <JobDetailsSkeleton />;
  }

  if (errorMessage || !job) {
    return (
      <div className="mx-auto my-16 max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-none">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-bold text-[#0F172A]">
          Job Vacancy Unavailable
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {errorMessage ||
            "The requested job position could not be found or has been closed by the employer."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/all-jobs">
            <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-full">
              Browse Other Jobs
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-full border-[#E5E7EB]">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner & Breadcrumbs */}
      <JobDetailsHeader
        job={job}
        isBookmarked={isBookmarked}
        hasApplied={hasApplied}
        onBookmarkToggle={handleBookmarkToggle}
        onShare={handleShare}
        onApplyClick={handleApplyClick}
      />

      {/* Content Layout */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Description */}
        <JobDetailsDescription
          job={job}
          className="md:col-span-7 lg:col-span-8"
        />

        {/* Right Column: Similar Jobs Sidebar */}
        <JobDetailsSidebar
          currentJobId={job.id}
          similarJobs={similarJobs}
          job={job}
          hasApplied={hasApplied}
          onApplyClick={handleApplyClick}
          className="md:col-span-5 lg:col-span-4"
        />
      </div>

      {/* Dialog Modals */}
      <JobApplyModal
        job={job}
        userName={user?.name}
        isApplyModalOpen={isApplyModalOpen}
        isResumeWarningOpen={isResumeWarningOpen}
        isApplying={isApplying}
        onCloseApplyModal={() => setIsApplyModalOpen(false)}
        onCloseResumeWarning={() => setIsResumeWarningOpen(false)}
        onConfirmApply={handleConfirmApplication}
      />
    </div>
  );
};

export default JobDetailsView;
