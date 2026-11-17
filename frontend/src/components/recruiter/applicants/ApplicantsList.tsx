"use client";

import ApplicantItemRow from "./ApplicantItemRow";
import TableSkeleton from "@/components/loaders/skeleton/TableSkeleton";
import CandidateProfileModal from "@/components/recruiter/CandidateProfileModal";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IJob } from "@/interfaces/job.interface";
import type { IRecruiterApplicant } from "@/interfaces/recruiter.interface";
import {
  getApplicants,
  getMyJobs,
  updateApplicantStatus,
} from "@/services/recruiter.service";
import { Briefcase, Filter, Search, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/toast";

function ApplicantsListInner() {
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
        getMyJobs(),
        getApplicants({
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
      await updateApplicantStatus(applicantId, newStatus);
      toast.success("Status Updated", {
        description: `Candidate status moved to "${newStatus}".`,
      });
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicantId
            ? { ...app, status: newStatus as IRecruiterApplicant["status"] }
            : app
        )
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
        s.toLowerCase().includes(q)
      );
      return (
        candidateName.includes(q) ||
        candidateEmail.includes(q) ||
        jobTitle.includes(q) ||
        skillsMatch
      );
    });
  }, [applicants, selectedStatus, searchQuery]);

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
            <div className="p-5">
              <TableSkeleton rows={5} columns={5} />
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
                {searchQuery ||
                selectedJobId !== "all" ||
                selectedStatus !== "all"
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
                  {filteredApplicants.map((applicant) => (
                    <ApplicantItemRow
                      key={applicant.id}
                      applicant={applicant}
                      isMutating={isUpdatingStatus === applicant.id}
                      onStatusChange={handleStatusChange}
                      onReview={(app) => setSelectedApplicant(app)}
                    />
                  ))}
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

function ApplicantsList() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <TableSkeleton rows={6} columns={6} />
          </div>
        </div>
      }
    >
      <ApplicantsListInner />
    </Suspense>
  );
}
export default ApplicantsList;
