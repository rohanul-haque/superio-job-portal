"use client";

import JobItemRow from "./JobItemRow";
import TableSkeleton from "@/components/loaders/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import type { IJob } from "@/interfaces/job.interface";
import {
  deleteJob,
  getMyJobs,
  updateJob,
} from "@/services/recruiter.service";
import {
  AlertTriangle,
  Briefcase,
  PlusCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ManageJobsList() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Soft-delete modal state
  const [jobToDelete, setJobToDelete] = useState<IJob | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMyJobs();
      setJobs(data);
    } catch (err: unknown) {
      let msg = "Failed to load jobs.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleToggleVisibility = async (job: IJob) => {
    setUpdatingId(job.id);
    const newVisibility = !job.visible;
    try {
      await updateJob(job.id, { visible: newVisibility });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, visible: newVisibility } : j))
      );
      toast.success(
        newVisibility
          ? "Job is now visible to candidates"
          : "Job hidden from public listings"
      );
    } catch (err: unknown) {
      let msg = "Failed to update visibility.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleHiringStatus = async (job: IJob) => {
    setUpdatingId(job.id);
    const newStatus = job.hiringStatus === "Ongoing" ? "Closed" : "Ongoing";
    try {
      await updateJob(job.id, { hiringStatus: newStatus });
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, hiringStatus: newStatus } : j
        )
      );
      toast.success(`Hiring status set to "${newStatus}"`);
    } catch (err: unknown) {
      let msg = "Failed to update hiring status.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      await deleteJob(jobToDelete.id);
      toast.success("Job soft-deleted successfully", {
        description: `"${jobToDelete.title}" has been moved to archive.`,
      });
      setJobToDelete(null);
      await fetchJobs();
    } catch (err: unknown) {
      let msg = "Failed to delete job.";
      if (err instanceof Error) msg = err.message;
      toast.error("Deletion failed", { description: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.category?.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Manage Job Vacancies
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Control visibility, toggle Ongoing/Closed hiring status, and review applicant counts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchJobs}
            disabled={isLoading}
            className="text-xs border-slate-200"
          >
            {isLoading ? (
              <Spinner size="sm" className="mr-1.5" />
            ) : (
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            )}
            Refresh
          </Button>

          <Link href="/recruiter/dashboard/add-job">
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
            >
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
              Published Job Vacancy
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Search jobs by title, category, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 text-xs bg-white"
        />
      </div>

      {/* Jobs Table Card */}
      <Card className="border-slate-200 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-5">
              <TableSkeleton rows={5} columns={6} />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-800">
                {searchQuery ? "No matching vacancies" : "No job postings yet"}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                {searchQuery
                  ? `No jobs matched your query "${searchQuery}".`
                  : "Start hiring by publishing your first job post on Superio."}
              </p>
              <Link href="/recruiter/dashboard/add-job" className="mt-4">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs text-white"
                >
                  <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                  Publish First Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Job Details</th>
                    <th className="py-3 px-5">Location & Type</th>
                    <th className="py-3 px-5 text-center">Applicants</th>
                    <th className="py-3 px-5 text-center">Hiring Status</th>
                    <th className="py-3 px-5 text-center">Visibility</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredJobs.map((job) => (
                    <JobItemRow
                      key={job.id}
                      job={job}
                      isBusy={updatingId === job.id}
                      onToggleVisibility={handleToggleVisibility}
                      onToggleHiringStatus={handleToggleHiringStatus}
                      onDeleteRequest={(j) => setJobToDelete(j)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Soft-Delete Confirmation Modal */}
      {jobToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !isDeleting && setJobToDelete(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Soft-Delete Job Post?
                </h3>
                <p className="text-xs text-slate-500">
                  This action moves the vacancy to the archive.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900">
                &quot;{jobToDelete.title}&quot;
              </span>
              ? It will no longer appear in search results or the public
              catalogue.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setJobToDelete(null)}
                disabled={isDeleting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteJob}
                disabled={isDeleting}
                className="text-xs bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Spinner size="sm" className="mr-1.5" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
