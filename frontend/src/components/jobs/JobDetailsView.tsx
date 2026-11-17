"use client";

import JobApplyModal from "./details/JobApplyModal";
import JobDetailsDescription from "./details/JobDetailsDescription";
import JobDetailsHeader from "./details/JobDetailsHeader";
import JobDetailsSidebar from "./details/JobDetailsSidebar";
import { JobDetailsSkeleton } from "@/components/loaders/skeleton/JobListSkeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCandidateJobState } from "@/context/CandidateJobStateContext";
import type { IJob } from "@/interfaces/job.interface";
import { applyJob } from "@/services/application.service";
import { getJobById } from "@/services/job.service";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";

interface JobDetailsViewProps {
  id: string;
}

const JobDetailsView: React.FC<JobDetailsViewProps> = ({ id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const {
    isJobBookmarked,
    hasAppliedToJob,
    toggleBookmark: toggleCandidateBookmark,
    recordApplication,
  } = useCandidateJobState();

  const [job, setJob] = useState<IJob | null>(null);
  const [similarJobs, setSimilarJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interaction State backed by Candidate Job State context & server truth
  const isBookmarked = isJobBookmarked(id);
  const hasApplied = hasAppliedToJob(id);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isResumeWarningOpen, setIsResumeWarningOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await getJobById(id);
        setJob(res.job);
        setSimilarJobs(res.similarJobs || []);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setErrorMessage(
          error.message || "Job not found or no longer publicly available."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

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

  const handleConfirmApplication = async () => {
    setIsApplying(true);
    try {
      await applyJob(id);
      recordApplication(id);
      setIsApplyModalOpen(false);
      toast.success("Application submitted successfully!", {
        description: "Your application has been received by the recruiter.",
      });
    } catch (err: unknown) {
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
    } finally {
      setIsApplying(false);
    }
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
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description + Similar */}
        <JobDetailsDescription job={job} similarJobs={similarJobs} />

        {/* Right Column: Company Summary Card & Quick Apply */}
        <JobDetailsSidebar
          job={job}
          hasApplied={hasApplied}
          onApplyClick={handleApplyClick}
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
