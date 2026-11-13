"use client";

import { CandidateProfileModal } from "@/components/recruiter/CandidateProfileModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import recruiterService from "@/services/recruiter.service";
import type { IJob } from "@/types/job";
import type { IRecruiterApplicant } from "@/types/recruiter";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  ThumbsDown,
  Users,
  XCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function RecruiterApplicantsContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "all";
  const initialStatus = searchParams.get("status") || "all";

  const [applicants, setApplicants] = useState<IRecruiterApplicant[]>([]);
  const [myJobs, setMyJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");

  // Candidate Profile Preview Modal
  const [selectedApplicant, setSelectedApplicant] =
    useState<IRecruiterApplicant | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [jobsData, applicantsData] = await Promise.all([
        recruiterService.getMyJobs(),
        recruiterService.getApplicants({
          jobId: selectedJobId !== "all" ? selectedJobId : undefined,
        }),
      ]);
      setMyJobs(jobsData);
      setApplicants(applicantsData);
    } catch (err: unknown) {
      let msg = "Failed to load applicants.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [selectedJobId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    setIsUpdatingStatus(applicantId);
    try {
      await recruiterService.updateApplicantStatus(applicantId, newStatus);
      toast.success("Status Updated", {
        description: `Candidate status moved to "${newStatus}".`,
      });
      // Update local state
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicantId
            ? { ...app, status: newStatus as IRecruiterApplicant["status"] }
            : app,
        ),
      );
    } catch (err: unknown) {
      let msg = "Failed to update status.";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message
      ) {
        msg = (err as { response: { data: { message: string } } }).response.data
          .message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error("Status Update Failed", { description: msg });
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      if (selectedStatus !== "all") {
        if (selectedStatus === "Pending") {
          if (app.status !== "Pending" && (app.status as string) !== "In Review") {
            return false;
          }
        } else if (selectedStatus === "Accepted") {
          if (app.status !== "Accepted" && (app.status as string) !== "Hired") {
            return false;
          }
        } else if (app.status !== selectedStatus) {
          return false;
        }
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const candidateName = app.candidate?.name?.toLowerCase() || "";
      const candidateEmail = app.candidate?.email?.toLowerCase() || "";
      const jobTitle = app.job?.title?.toLowerCase() || "";
      const skillsMatch = app.candidate?.skills?.some((s) =>
        s.toLowerCase().includes(q),
      );
      return (
        candidateName.includes(q) ||
        candidateEmail.includes(q) ||
        jobTitle.includes(q) ||
        skillsMatch
      );
    });
  }, [applicants, selectedStatus, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
      case "In Review":
      case "Pending Review":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-white hover:text-amber-800 hover:border-amber-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            <Clock className="h-3 w-3 text-amber-600" />
            Pending Review
          </Badge>
        );
      case "Shortlisted":
        return (
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-white hover:text-indigo-800 hover:border-indigo-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            <Sparkles className="h-3 w-3 text-indigo-600" />
            Shortlisted
          </Badge>
        );
      case "Accepted":
      case "Hired":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Accepted / Hired
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-white hover:text-rose-800 hover:border-rose-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            <ThumbsDown className="h-3 w-3 text-rose-600" />
            Rejected
          </Badge>
        );
      case "Withdrawn":
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-800 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            <XCircle className="h-3 w-3 text-slate-500" />
            Withdrawn
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-white hover:text-slate-900 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-xs font-semibold gap-1.5 cursor-default select-none"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Candidate Applicants
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review applicant resumes, inspect candidate profiles, and manage hiring pipeline stages.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search applicant name, email, role, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Job Selector */}
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                <Select
                  value={selectedJobId}
                  onValueChange={(val) => setSelectedJobId(val)}
                >
                  <SelectTrigger className="h-10 text-xs font-semibold text-slate-700 w-[200px]">
                    <SelectValue placeholder="All Job Vacancies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Vacancies</SelectItem>
                    {myJobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                <Select
                  value={selectedStatus}
                  onValueChange={(val) => setSelectedStatus(val)}
                >
                  <SelectTrigger className="h-10 text-xs font-semibold text-slate-700 w-[150px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants Catalogue Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
              <p className="text-sm font-medium text-slate-600">
                Loading applicant records...
              </p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Applicants Found
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">
                {searchQuery || selectedJobId !== "all" || selectedStatus !== "all"
                  ? "No candidate applications match your current filters. Try resetting the filters."
                  : "You have not received any applications for your posted jobs yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Candidate
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Target Job
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Applied Date
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Resume
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Hiring Stage
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplicants.map((applicant) => {
                    const isMutating = isUpdatingStatus === applicant.id;

                    return (
                      <tr
                        key={applicant.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Candidate Information */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-slate-200 shrink-0">
                              <AvatarImage
                                src={applicant.candidate?.profilePicture?.url}
                                alt={applicant.candidate?.name || "Candidate"}
                              />
                              <AvatarFallback className="bg-indigo-50 font-bold text-indigo-700 text-sm">
                                {applicant.candidate?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 leading-tight">
                                {applicant.candidate?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500 leading-normal">
                                {applicant.candidate?.email || "No email"}
                              </p>
                              {applicant.candidate?.title && (
                                <span className="inline-block mt-0.5 text-[11px] font-semibold text-indigo-600">
                                  {applicant.candidate.title}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Target Job */}
                        <td className="px-6 py-4">
                          <div className="max-w-[200px]">
                            <p className="font-bold text-slate-900 truncate">
                              {applicant.job?.title || "Job Unavailable"}
                            </p>
                            <p className="flex items-center gap-1 text-xs text-slate-500 truncate mt-0.5">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {applicant.job?.location || "Remote"}
                            </p>
                          </div>
                        </td>

                        {/* Applied Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {new Date(applicant.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>

                        {/* Resume */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {applicant.candidate?.resume ? (
                            <a
                              href={applicant.candidate.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              View PDF
                              <ExternalLink className="h-3 w-3 text-slate-400" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Not Provided
                            </span>
                          )}
                        </td>

                        {/* Status Mutation Stage */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(applicant.status)}

                            {applicant.status !== "Withdrawn" && (
                              <div className="relative w-32">
                                <Select
                                  disabled={isMutating}
                                  value={applicant.status}
                                  onValueChange={(val) =>
                                    handleStatusChange(applicant.id, val)
                                  }
                                >
                                  <SelectTrigger className="h-8 text-xs font-semibold text-slate-700">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Shortlisted">
                                      Shortlisted
                                    </SelectItem>
                                    <SelectItem value="Accepted">Accepted</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                                {isMutating && (
                                  <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin text-indigo-600 pointer-events-none" />
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApplicant(applicant)}
                            className="gap-1.5 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Review Profile
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
      />
    </div>
  );
}

export default function RecruiterViewApplicantsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm font-medium text-slate-600">
            Loading applicants dashboard...
          </p>
        </div>
      }
    >
      <RecruiterApplicantsContent />
    </Suspense>
  );
}
