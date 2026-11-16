"use client";

import JobCard from "@/components/jobs/JobCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import applicationService from "@/services/application.service";
import bookmarkService from "@/services/bookmark.service";
import jobService from "@/services/job.service";
import type { IJob } from "@/types/job";
import {
  AlertCircle,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Share2,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface JobDetailsViewProps {
  id: string;
}

export const JobDetailsView: React.FC<JobDetailsViewProps> = ({ id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState<IJob | null>(null);
  const [similarJobs, setSimilarJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interaction State
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isResumeWarningOpen, setIsResumeWarningOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await jobService.getJobById(id);
        setJob(res.job);
        setSimilarJobs(res.similarJobs || []);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setErrorMessage(
          error.message || "Job not found or no longer publicly available.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const formatSalary = (amount: number) => {
    if (amount >= 1000) {
      return `$${amount.toLocaleString()} / mo`;
    }
    return `$${amount} / mo`;
  };

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to save this job to your bookmarks.");
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      const nextState = !isBookmarked;
      setIsBookmarked(nextState);
      await bookmarkService.toggleBookmark(id);
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
    // 1. Check Authentication
    if (!isAuthenticated || !user) {
      toast.info("Please sign in as a candidate to apply for this job.");
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Check Candidate Role
    if (user.role !== "candidate") {
      toast.error(
        `Only verified Candidate accounts can apply for jobs. You are signed in as a ${user.role}.`,
      );
      return;
    }

    // 3. Check Resume Guard (Enterprise Specification 3.4)
    const resumeUrl =
      typeof user.resume === "object" ? user.resume?.url : user.resume;
    if (!resumeUrl || resumeUrl.trim() === "") {
      setIsResumeWarningOpen(true);
      return;
    }

    // 4. Open Application Confirmation Dialog
    setIsApplyModalOpen(true);
  };

  const handleConfirmApplication = async () => {
    setIsApplying(true);
    try {
      await applicationService.applyJob(id);
      setHasApplied(true);
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
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message
      ) {
        message = (err as { response: { data: { message: string } } }).response
          .data.message;
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
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
        <p className="text-sm font-medium text-slate-500">
          Loading job details...
        </p>
      </div>
    );
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

  const isOngoing = job.hiringStatus === "Ongoing";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link href="/" className="hover:text-[#4F46E5] transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/all-jobs" className="hover:text-[#4F46E5] transition">
          All Jobs
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold truncate max-w-[200px] sm:max-w-xs">
          {job.title}
        </span>
      </nav>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Top Section – Left Side */}
          <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
            {/* Company Avatar / Logo */}
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-slate-50 text-slate-700 font-bold text-xl shadow-none overflow-hidden">
              {job.company?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.company.image}
                  alt={job.company.name || "Company"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-slate-400" />
              )}
            </div>

            {/* Badges, Title & Company Name */}
            <div className="min-w-0 flex-1">
              {/* Badges above title */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="bg-[#EEF2FF] text-[#4F46E5] border-transparent text-xs font-semibold rounded-full px-3 py-0.5"
                >
                  {job.jobType}
                </Badge>
                {isOngoing ? (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold rounded-full px-3 py-0.5"
                  >
                    ● Hiring Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 text-xs font-semibold rounded-full px-3 py-0.5"
                  >
                    ● Applications Closed
                  </Badge>
                )}
                {job.level && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 text-xs font-medium rounded-full px-3 py-0.5"
                  >
                    {job.level}
                  </Badge>
                )}
                {job.category?.name && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 text-xs font-medium rounded-full px-3 py-0.5"
                  >
                    {job.category.name}
                  </Badge>
                )}
              </div>

              {/* Job Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                {job.title}
              </h1>

              {/* Company Name */}
              <div className="mt-2 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600">
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{job.company?.name || "Verified Enterprise Employer"}</span>
              </div>

              {/* Job Information: Salary, Open Vacancies, Deadline */}
              <div className="mt-3.5 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-600">
                <span className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                  <DollarSign className="h-4 w-4 text-[#4F46E5] shrink-0" />
                  {formatSalary(job.salary)}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Users className="h-4 w-4 text-[#4F46E5] shrink-0" />
                  {job.vacancy} {job.vacancy === 1 ? "Position" : "Positions"}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <CalendarDays className="h-4 w-4 text-[#4F46E5] shrink-0" />
                  {formatDate(job.deadline)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Section – Right Side */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            {/* Horizontally aligned action buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Bookmark */}
              <button
                type="button"
                onClick={handleBookmarkToggle}
                className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-semibold transition cursor-pointer ${
                  isBookmarked
                    ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 text-amber-600 fill-amber-600" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 text-slate-400" />
                    Bookmark
                  </>
                )}
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                aria-label="Share job"
              >
                <Share2 className="h-4 w-4" />
              </button>

              {/* Apply Now */}
              <Button
                onClick={handleApplyClick}
                disabled={!isOngoing || hasApplied}
                className={`h-11 px-7 font-semibold text-xs sm:text-sm rounded-full cursor-pointer shadow-none ${
                  hasApplied
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : isOngoing
                      ? "bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                {hasApplied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Applied Successfully
                  </>
                ) : isOngoing ? (
                  <>
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Applications Closed"
                )}
              </Button>
            </div>

            {/* Location & Posted Date directly below the 3 action buttons */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 lg:justify-end">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                Posted {formatDate(job.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout: Left 2/3 (Description + Similar) & Right 1/3 (Company Profile + Meta) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
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

        {/* Right Column: Company Summary Card & Application Guard */}
        <div className="space-y-6">
          {/* Company Card */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-none">
            <h3 className="text-base font-bold text-[#0F172A] mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#4F46E5]" />
              About the Company
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E5E7EB] bg-slate-50 text-slate-700 font-bold text-base overflow-hidden shadow-none">
                {job.company?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={job.company.image}
                    alt={job.company.name || "Company"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">
                  {job.company?.name || "Hirenest Verified Employer"}
                </h4>
                <p className="text-xs text-slate-500">
                  {job.company?.location || job.location}
                </p>
              </div>
            </div>

            {job.company?.description && (
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {job.company.description}
              </p>
            )}

            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              {job.company?.website && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Website</span>
                  <a
                    href={
                      job.company.website.startsWith("http")
                        ? job.company.website
                        : `https://${job.company.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-semibold text-[#4F46E5] hover:underline"
                  >
                    Visit Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {job.company?.companySize && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Company Size</span>
                  <span className="font-semibold text-slate-800">
                    {job.company.companySize}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Security Verification</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Employer
                </span>
              </div>
            </div>
          </div>

          {/* Quick Apply Summary Card */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-none space-y-4">
            <h3 className="text-base font-bold text-[#0F172A] pb-3 border-b border-slate-100">
              Apply for this Position
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit your verified candidate credentials, resume, and portfolio
              directly to the hiring manager.
            </p>

            <Button
              onClick={handleApplyClick}
              disabled={!isOngoing || hasApplied}
              className={`w-full h-11 font-semibold text-xs sm:text-sm rounded-full shadow-none cursor-pointer ${
                hasApplied
                  ? "bg-emerald-600 text-white"
                  : isOngoing
                    ? "bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
            >
              {hasApplied ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Application Submitted
                </>
              ) : isOngoing ? (
                <>
                  Submit Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Position Closed"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Resume Required Guard Dialog (Enterprise Spec 3.4) */}
      {isResumeWarningOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsResumeWarningOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-50/50 mb-4">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Resume Upload Required
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 text-center leading-relaxed">
              Enterprise policy requires candidates to have an uploaded PDF
              resume on their profile before submitting applications.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link href="/candidate/dashboard/profile">
                <Button className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-full">
                  Upload Resume in Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => setIsResumeWarningOpen(false)}
                className="text-slate-600 rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Application Confirmation Modal */}
      {isApplyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsApplyModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-[#0F172A]">
                Confirm Application
              </h3>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                You are about to apply for:
              </p>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-[#E5E7EB]">
                <h4 className="text-sm font-bold text-[#0F172A]">
                  {job.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {job.company?.name} • {job.location}
                </p>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-[#EEF2FF] p-3 text-xs text-indigo-950">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#4F46E5] shrink-0" />
                  <span>
                    Your verified profile (<strong>{user?.name}</strong>) and
                    attached resume will be shared with the recruiter.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsApplyModalOpen(false)}
                disabled={isApplying}
                className="text-xs rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmApplication}
                disabled={isApplying}
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs rounded-full"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsView;
