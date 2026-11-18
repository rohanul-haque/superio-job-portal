"use client";

import CandidateProfileModal from "@/components/recruiter/CandidateProfileModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Skeleton from "@/components/ui/skeleton";
import Spinner from "@/components/ui/spinner";
import { useCandidateMatching } from "@/hooks/use-recruiter";
import type {
  ICandidateMatch,
  IRecruiterApplicant,
} from "@/interfaces/recruiter.interface";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  Mail,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function CandidateMatchingView() {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    matches,
    job,
    meta,
    isLoadingJobs,
    isLoadingMatches,
    error,
    refetch,
  } = useCandidateMatching();

  // Selected candidate state for opening CandidateProfileModal
  const [modalApplicant, setModalApplicant] =
    useState<IRecruiterApplicant | null>(null);

  // Identify the highest matchScore among returned matches for best-match highlighting
  const highestMatchScore = useMemo(() => {
    if (!matches || matches.length === 0) return null;
    const validScores = matches
      .map((m) => m.matchScore)
      .filter(
        (score): score is number =>
          typeof score === "number" &&
          !Number.isNaN(score) &&
          Number.isFinite(score) &&
          score > 0,
      );
    return validScores.length > 0 ? Math.max(...validScores) : null;
  }, [matches]);

  const getMatchScoreBadgeStyle = (score: number) => {
    if (score >= 85) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (score >= 70) {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const handleOpenCandidateModal = (match: ICandidateMatch) => {
    const selectedJob = jobs.find((j) => j.id === selectedJobId) || job;
    const applicantPayload: IRecruiterApplicant = {
      id: match.candidateId,
      status: "Pending",
      createdAt: match.candidate.createdAt,
      candidate: {
        id: match.candidate.id,
        name: match.candidate.name,
        email: match.candidate.email,
        profilePicture: match.candidate.profilePicture,
        title: match.candidate.title,
        bio: match.candidate.bio,
        skills: match.candidate.skills,
        socialLinks:
          (match.candidate.socialLinks as {
            linkedin?: string;
            github?: string;
            portfolio?: string;
            twitter?: string;
            facebook?: string;
          }) || null,
        resume: match.candidate.resume || "",
      },
      job: {
        id: selectedJob?.id || "",
        title: selectedJob?.title || "Role",
        location: selectedJob?.location || "Location",
        hiringStatus: selectedJob?.hiringStatus || "Ongoing",
      },
    };
    setModalApplicant(applicantPayload);
  };

  const currentJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              AI Candidate Matching
            </h1>
            <Badge
              variant="outline"
              className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs px-2.5 py-0.5 flex items-center gap-1 font-semibold"
            >
              <Sparkles className="h-3 w-3 text-indigo-600" />
              AI Powered
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
            Select one of your job vacancies to discover and rank the most
            suitable candidates based on skills, titles, and semantic
            background.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/recruiter/dashboard/add-job">
            <Button
              size="sm"
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs cursor-pointer"
            >
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Job Selection Toolbar */}
      <Card className="rounded-2xl border-slate-200 bg-white shadow-xs">
        <CardContent className="p-5 sm:p-6">
          {isLoadingJobs ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-full max-w-md rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1]">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                No Job Vacancies Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You haven&apos;t posted any active jobs yet. Post a job vacancy
                to start matching relevant candidates.
              </p>
              <div className="pt-2">
                <Link href="/recruiter/dashboard/add-job">
                  <Button
                    size="sm"
                    className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs"
                  >
                    <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                    Create Your First Job
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 max-w-xl">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
                  Select Job Vacancy for Matching:
                </label>
                <Select
                  value={selectedJobId}
                  onValueChange={(val) => setSelectedJobId(val)}
                >
                  <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 bg-white text-xs text-slate-800 font-medium">
                    <SelectValue placeholder="Choose a job vacancy to evaluate..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {jobs.map((j) => (
                      <SelectItem
                        key={j.id}
                        value={j.id}
                        className="text-xs py-2 cursor-pointer"
                      >
                        <span className="font-semibold text-slate-900">
                          {j.title}
                        </span>{" "}
                        <span className="text-slate-500">
                          — {j.location} ({j.jobType})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentJob && (
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-600 border-slate-200 text-xs px-2.5 py-1"
                  >
                    Level: {currentJob.level}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-600 border-slate-200 text-xs px-2.5 py-1"
                  >
                    Type: {currentJob.jobType}
                  </Badge>
                  {currentJob.category?.name && (
                    <Badge
                      variant="outline"
                      className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs px-2.5 py-1"
                    >
                      {currentJob.category.name}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State: Matching in progress */}
      {isLoadingMatches && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
            <Spinner size="sm" />
            <span>
              Evaluating candidate pool against{" "}
              <strong className="text-slate-700">
                {currentJob?.title || "selected vacancy"}
              </strong>
              ...
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Card
                key={idx}
                className="rounded-2xl border-slate-200 bg-white p-5 shadow-none space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoadingMatches && error && (
        <Card className="rounded-2xl border-red-200 bg-red-50/50 p-8 text-center shadow-none">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Matching Evaluation Error
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
          </div>
        </Card>
      )}

      {/* Empty State: No candidate matches >= 50% */}
      {!isLoadingMatches && !error && selectedJobId && matches.length === 0 && (
        <Card className="rounded-2xl border-slate-200 bg-white p-8 sm:p-12 text-center shadow-none">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Matching Candidates Found
          </h3>
          <p className="mt-2 text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            We evaluated all active candidate profiles against{" "}
            <strong>{currentJob?.title || "this vacancy"}</strong>, but none
            currently meet the 50% suitability threshold. Consider expanding the
            job description or check back soon as more talent registers.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch(true)}
              className="text-xs border-slate-200 cursor-pointer"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Re-evaluate Candidates
            </Button>
            {currentJob && (
              <Link href={`/recruiter/dashboard/edit-job/${currentJob.id}`}>
                <Button
                  size="sm"
                  className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs cursor-pointer"
                >
                  Edit Job Requirements
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* Success State: Ranked Candidates Grid */}
      {!isLoadingMatches && !error && matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">
                Found {matches.length} matching{" "}
                {matches.length === 1 ? "candidate" : "candidates"} for{" "}
                <span className="text-indigo-600 font-bold">
                  {currentJob?.title || job?.title}
                </span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Ranked in descending order by suitability score
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match: ICandidateMatch) => {
              const candidate = match.candidate;
              const isBestMatch =
                highestMatchScore !== null &&
                match.matchScore === highestMatchScore;

              return (
                <div
                  key={match.candidateId}
                  className={`flex flex-col justify-between rounded-2xl border bg-white overflow-hidden shadow-xs transition-all duration-200 ${
                    isBestMatch
                      ? "border-[#6366F1] ring-1 ring-[#6366F1]/20"
                      : "border-slate-200 hover:border-[#6366F1]/50"
                  }`}
                >
                  {/* AI Match Context Header Bar */}
                  <div className="bg-slate-50/90 border-b border-slate-100 p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#6366F1] shrink-0" />
                        <span className="text-xs font-bold text-slate-900">
                          Suitability Score: {match.matchScore}%
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-semibold px-2.5 py-0.5 ${getMatchScoreBadgeStyle(
                          match.matchScore,
                        )}`}
                      >
                        {match.matchLevel}
                      </Badge>
                    </div>

                    {match.reason && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {match.reason}
                      </p>
                    )}

                    {/* Matched & Missing Skills Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {match.matchedSkills &&
                        match.matchedSkills.length > 0 && (
                          <>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1">
                              Matched:
                            </span>
                            {match.matchedSkills
                              .slice(0, 5)
                              .map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200"
                                >
                                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                                  {skill}
                                </span>
                              ))}
                          </>
                        )}

                      {match.missingSkills &&
                        match.missingSkills.length > 0 && (
                          <>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-1 mr-1">
                              Missing:
                            </span>
                            {match.missingSkills
                              .slice(0, 2)
                              .map((mSkill, mIdx) => (
                                <span
                                  key={mIdx}
                                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 border border-slate-200"
                                >
                                  <XCircle className="h-2.5 w-2.5 text-slate-400" />
                                  {mSkill}
                                </span>
                              ))}
                          </>
                        )}
                    </div>
                  </div>

                  {/* Candidate Profile Summary Content */}
                  <div className="p-5 space-y-4 flex-1">
                    <div className="flex items-start gap-3.5">
                      <Avatar className="h-12 w-12 shrink-0 rounded-2xl bg-white border border-slate-200 p-0.5">
                        <AvatarImage
                          src={candidate.profilePicture?.url}
                          alt={candidate.name}
                          className="rounded-xl object-contain h-full w-full"
                        />
                        <AvatarFallback className="rounded-xl bg-indigo-50 text-base font-bold text-[#6366F1]">
                          {candidate.name ? candidate.name.charAt(0) : "C"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                          {candidate.name}
                        </h3>
                        <p className="text-xs font-semibold text-indigo-600 line-clamp-1">
                          {candidate.title || "Candidate"}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 line-clamp-1">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {candidate.email}
                        </p>
                      </div>
                    </div>

                    {candidate.bio && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/60 rounded-xl p-3 border border-slate-100">
                        {candidate.bio}
                      </p>
                    )}

                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Candidate Skills
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.skills.slice(0, 6).map((sk) => (
                            <span
                              key={sk}
                              className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                            >
                              {sk}
                            </span>
                          ))}
                          {candidate.skills.length > 6 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{candidate.skills.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="border-t border-slate-100 px-5 py-3.5 bg-slate-50/50 flex items-center justify-between gap-3">
                    <div>
                      {candidate.resume ? (
                        <a
                          href={candidate.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
                        >
                          <FileText className="h-3.5 w-3.5 text-indigo-500" />
                          PDF Resume
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          No PDF uploaded
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleOpenCandidateModal(match)}
                      className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs rounded-full px-4 cursor-pointer gap-1.5 shadow-2xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Profile
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Candidate Profile Details Modal */}
      <CandidateProfileModal
        applicant={modalApplicant}
        onClose={() => setModalApplicant(null)}
      />
    </div>
  );
}
