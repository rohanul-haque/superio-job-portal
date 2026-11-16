"use client";

import JobCard from "@/components/jobs/JobCard";
import { JobCardSkeleton } from "@/components/loaders/skeleton/CardSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { useCandidateRecommendations } from "@/hooks/use-candidate";
import type { IJobRecommendation } from "@/interfaces/candidate.interface";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Compass,
  RefreshCw,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function CandidateRecommendationsPage() {
  const { recommendations, meta, isLoading, error, refetch } =
    useCandidateRecommendations();

  const getMatchScoreBadgeStyle = (score: number) => {
    if (score >= 85) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (score >= 70) {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            AI Job Recommendations
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Real-time personalized job matches evaluated against your
            professional title, skills, and background.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/all-jobs">
            <Button
              size="sm"
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs cursor-pointer"
            >
              <Compass className="mr-1.5 h-3.5 w-3.5" />
              Browse All Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span>Analyzing your profile against active job openings...</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="h-10 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
                <JobCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <Card className="rounded-2xl border-red-200 bg-red-50/50 p-8 text-center shadow-none">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Failed to Load Recommendations
          </h3>
          <p className="mt-1 text-xs text-slate-600 max-w-md mx-auto">
            {error}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={() => refetch(true)}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Try Again
            </Button>
            <Link href="/all-jobs">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-slate-200 cursor-pointer"
              >
                Browse Catalogue
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Empty State: Profile Incomplete */}
      {!isLoading && !error && meta?.profileCompleted === false && (
        <Card className="rounded-2xl border-slate-200 bg-white p-8 sm:p-12 text-center shadow-none">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] mb-4">
            <UserCheck className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Complete Your Profile for Recommendations
          </h3>
          <p className="mt-2 text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            Our AI matching engine evaluates your professional title, skills,
            and bio to recommend matching job postings. Add your skills and
            background to unlock personalized job recommendations.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/candidate/dashboard/profile">
              <Button
                size="sm"
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs cursor-pointer"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Complete Profile Now
              </Button>
            </Link>
            <Link href="/all-jobs">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-slate-200 cursor-pointer"
              >
                Browse All Jobs
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Empty State: No Matches Found */}
      {!isLoading &&
        !error &&
        meta?.profileCompleted !== false &&
        recommendations.length === 0 && (
          <Card className="rounded-2xl border-slate-200 bg-white p-8 sm:p-12 text-center shadow-none">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No Matches Found Right Now
            </h3>
            <p className="mt-2 text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              We evaluated all active job openings, but none currently match
              your profile with at least a 50% match score. You can explore all
              available jobs or expand your profile skills to match more
              opportunities.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch(true)}
                className="text-xs border-slate-200 cursor-pointer"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Check Again
              </Button>
              <Link href="/all-jobs">
                <Button
                  size="sm"
                  className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs cursor-pointer"
                >
                  <Compass className="mr-1.5 h-3.5 w-3.5" />
                  Explore All Jobs
                </Button>
              </Link>
            </div>
          </Card>
        )}

      {/* Success State: Recommended Jobs Grid */}
      {!isLoading && !error && recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">
                Found {recommendations.length} recommended{" "}
                {recommendations.length === 1 ? "job" : "jobs"}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Sorted by highest AI match score
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec: IJobRecommendation) => (
              <div
                key={rec.jobId}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-[#6366F1]/50 transition-all duration-200"
              >
                {/* AI Recommendation Context Bar */}
                <div className="bg-slate-50/90 border-b border-slate-100 p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#6366F1] shrink-0" />
                      <span className="text-xs font-bold text-slate-800">
                        Match Score: {rec.matchScore}%
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-semibold px-2.5 py-0.5 ${getMatchScoreBadgeStyle(
                        rec.matchScore,
                      )}`}
                    >
                      {rec.matchLevel}
                    </Badge>
                  </div>

                  {rec.reason && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rec.reason}
                    </p>
                  )}

                  {rec.matchedSkills && rec.matchedSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1">
                        Matched:
                      </span>
                      {rec.matchedSkills.slice(0, 5).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                          {skill}
                        </span>
                      ))}
                      {rec.missingSkills && rec.missingSkills.length > 0 && (
                        <>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-1 mr-1">
                            Missing:
                          </span>
                          {rec.missingSkills.slice(0, 2).map((mSkill, mIdx) => (
                            <span
                              key={mIdx}
                              className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 border border-slate-200"
                            >
                              {mSkill}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Reused Existing Job Card Component */}
                <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
                  <JobCard
                    job={rec.job}
                    featured={rec.matchScore >= 85}
                    actionLabel="View Details & Apply"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
