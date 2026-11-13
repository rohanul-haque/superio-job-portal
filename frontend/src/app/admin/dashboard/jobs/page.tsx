"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import adminService from "@/services/admin.service";
import categoryService from "@/services/category.service";
import type { IAdminJob } from "@/types/admin";
import type { ICategory } from "@/types/category";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Globe,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminManageJobsPage() {
  const [jobs, setJobs] = useState<IAdminJob[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hiringStatusFilter, setHiringStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Soft-delete modal state
  const [jobToDelete, setJobToDelete] = useState<IAdminJob | null>(null);

  // Load categories
  useEffect(() => {
    categoryService
      .getAllCategories({ isActive: "all", isDeleted: "false" })
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllJobs({
        search: searchQuery.trim() || undefined,
        categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
        hiringStatus:
          hiringStatusFilter !== "all" ? hiringStatusFilter : undefined,
        visible: visibilityFilter !== "all" ? visibilityFilter : undefined,
      });
      setJobs(data.jobs);
    } catch (err: unknown) {
      let msg = "Failed to load master jobs catalogue.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, hiringStatusFilter, visibilityFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const handleToggleVisibility = async (job: IAdminJob) => {
    setActionLoadingId(job.id);
    const newVisibility = !job.visible;
    try {
      await adminService.moderateJob(job.id, { visible: newVisibility });
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, visible: newVisibility } : j,
        ),
      );
      toast.success(
        newVisibility
          ? "Job is now visible to candidates"
          : "Job hidden from public catalogue",
      );
    } catch (err: unknown) {
      let msg = "Failed to update visibility.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleHiringStatus = async (job: IAdminJob) => {
    setActionLoadingId(job.id);
    const newStatus = job.hiringStatus === "Ongoing" ? "Closed" : "Ongoing";
    try {
      await adminService.moderateJob(job.id, { hiringStatus: newStatus });
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, hiringStatus: newStatus } : j,
        ),
      );
      toast.success(`Hiring status set to "${newStatus}"`);
    } catch (err: unknown) {
      let msg = "Failed to update hiring status.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;

    setActionLoadingId(jobToDelete.id);
    try {
      await adminService.moderateJob(jobToDelete.id, { isDeleted: true });
      toast.success("Job moved to Trash Center", {
        description: `"${jobToDelete.title}" can be restored anytime from Trash.`,
      });
      setJobToDelete(null);
      await fetchJobs();
    } catch (err: unknown) {
      let msg = "Failed to delete job.";
      if (err instanceof Error) msg = err.message;
      toast.error("Deletion failed", { description: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Master Job Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Platform-wide governance across all employers, categories, hiring statuses, and public listings.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchJobs}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-purple-600" : ""}`}
          />
          Refresh Jobs
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search job title, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:border-purple-500 focus:outline-hidden max-w-[170px] truncate"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={hiringStatusFilter}
                onChange={(e) => setHiringStatusFilter(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:border-purple-500 focus:outline-hidden"
              >
                <option value="all">All Hiring Stages</option>
                <option value="Ongoing">Ongoing Only</option>
                <option value="Closed">Closed Only</option>
              </select>

              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:border-purple-500 focus:outline-hidden"
              >
                <option value="all">All Visibility</option>
                <option value="true">Visible Only</option>
                <option value="false">Hidden Only</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Catalogue Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
              <p className="text-sm font-medium text-slate-600">
                Loading master job vacancy directory...
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Vacancies Found
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">
                No jobs match your selected search terms or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Job Vacancy
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Category & Type
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Hiring Stage
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Visibility
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Applicants
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => {
                    const isBusy = actionLoadingId === job.id;

                    return (
                      <tr
                        key={job.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Title & Location */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 leading-tight">
                            {job.title}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {job.location}
                          </p>
                        </td>

                        {/* Company */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold text-xs overflow-hidden">
                              {job.company?.image ? (
                                <img
                                  src={job.company.image}
                                  alt={job.company.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                job.company?.name?.charAt(0) || "C"
                              )}
                            </div>
                            <span className="text-xs font-semibold text-slate-900">
                              {job.company?.name || "Unknown Company"}
                            </span>
                          </div>
                        </td>

                        {/* Category & Type */}
                        <td className="px-6 py-4">
                          <p className="text-xs font-semibold text-purple-700">
                            {job.category?.name || "General"}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            {job.jobType} • ${job.salary.toLocaleString()}/yr
                          </span>
                        </td>

                        {/* Hiring Status Toggle */}
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleHiringStatus(job)}
                            disabled={isBusy}
                            className="cursor-pointer"
                            title="Click to toggle Hiring Status"
                          >
                            {job.hiringStatus === "Ongoing" ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[11px] gap-1 font-semibold"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                Ongoing
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-800 hover:border-slate-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[11px] gap-1 font-semibold"
                              >
                                <XCircle className="h-3 w-3" />
                                Closed
                              </Badge>
                            )}
                          </button>
                        </td>

                        {/* Public Visibility Toggle */}
                        <td className="px-6 py-4 text-center whitespace-nowrap">
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

                        {/* Applicants Badge */}
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                            <Users className="h-3 w-3" />
                            {job.applicationCount || 0}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link href={`/apply-job/${job.id}`} target="_blank">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs text-slate-600 hover:text-purple-600"
                                title="View public post"
                              >
                                <Globe className="h-3.5 w-3.5" />
                              </Button>
                            </Link>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isBusy}
                              onClick={() => setJobToDelete(job)}
                              className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-200"
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
          onClick={() => setJobToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Soft Deletion
                </h3>
                <p className="text-xs text-slate-500">
                  Job vacancy will be archived to Trash Center.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to soft-delete{" "}
              <strong className="text-slate-900 font-bold">
                &quot;{jobToDelete.title}&quot;
              </strong>{" "}
              posted by {jobToDelete.company?.name}? It will be hidden from all candidate searches and listings, and can be restored from the Trash Center.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setJobToDelete(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={Boolean(actionLoadingId)}
                className="text-xs bg-rose-600 hover:bg-rose-700 font-bold"
              >
                {actionLoadingId ? (
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

