"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import recruiterService from "@/services/recruiter.service";
import type { IJob } from "@/types/job";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  MapPin,
  Pencil,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function RecruiterManageJobsPage() {
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
      const data = await recruiterService.getMyJobs();
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
      await recruiterService.updateJob(job.id, { visible: newVisibility });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, visible: newVisibility } : j)),
      );
      toast.success(
        newVisibility ? "Job is now visible to candidates" : "Job hidden from public listings",
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
      await recruiterService.updateJob(job.id, { hiringStatus: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, hiringStatus: newStatus } : j)),
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
      await recruiterService.deleteJob(jobToDelete.id);
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
            <RefreshCw
              className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Link href="/recruiter/dashboard/add-job">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
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
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="mt-3 text-xs font-medium text-slate-500">
                Loading published jobs...
              </p>
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
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs text-white">
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
                  {filteredJobs.map((job) => {
                    const isBusy = updatingId === job.id;
                    return (
                      <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Title & Category */}
                        <td className="py-4 px-5">
                          <Link
                            href={`/apply-job/${job.id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition"
                          >
                            {job.title}
                          </Link>
                          <div className="mt-1 flex items-center gap-2">
                            {job.category && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                                {job.category.name}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400">
                              Vacancy: {job.vacancy || 1}
                            </span>
                          </div>
                        </td>

                        {/* Location & Type */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {job.location}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-400">
                            {job.jobType} • ${job.salary.toLocaleString()}/yr
                          </div>
                        </td>

                        {/* Applicants Badge */}
                        <td className="py-4 px-5 text-center">
                          <Link
                            href={`/recruiter/dashboard/view-applicants?jobId=${job.id}`}
                            className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 hover:bg-purple-100 transition"
                          >
                            <Users className="h-3 w-3" />
                            {job.applicationCount || 0}
                          </Link>
                        </td>

                        {/* Hiring Status Toggle (Ongoing / Closed) */}
                        <td className="py-4 px-5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleHiringStatus(job)}
                            disabled={isBusy}
                            className="cursor-pointer"
                            title="Click to toggle Hiring Status"
                          >
                            {job.hiringStatus === "Ongoing" ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] gap-1 hover:bg-emerald-100 font-semibold">
                                <CheckCircle2 className="h-3 w-3" />
                                Ongoing
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[11px] gap-1 hover:bg-slate-200">
                                <XCircle className="h-3 w-3" />
                                Closed
                              </Badge>
                            )}
                          </button>
                        </td>

                        {/* Public Visibility Toggle */}
                        <td className="py-4 px-5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(job)}
                            disabled={isBusy}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                              job.visible
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                            title="Toggle public visibility"
                          >
                            {job.visible ? (
                              <>
                                <Eye className="h-3 w-3 text-blue-600" />
                                Visible
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 text-slate-400" />
                                Hidden
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/apply-job/${job.id}`} target="_blank">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs text-slate-600 hover:text-indigo-600"
                                title="View public post"
                              >
                                <Globe className="h-3.5 w-3.5" />
                              </Button>
                            </Link>

                            <Link href={`/recruiter/dashboard/edit-job/${job.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs text-slate-600 hover:text-indigo-600"
                                title="Edit job post"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </Link>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setJobToDelete(job)}
                              className="h-8 px-2 text-xs text-red-600 hover:bg-red-50 hover:border-red-200"
                              title="Soft delete job"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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
              <span className="font-bold text-slate-900">&quot;{jobToDelete.title}&quot;</span>?
              It will no longer appear in search results or the public catalogue.
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
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
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

