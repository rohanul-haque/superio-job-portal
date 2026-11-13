"use client";

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
import applicationService from "@/services/application.service";
import type { IJobApplication } from "@/types/application";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  ThumbsDown,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function CandidateAppliedJobsPage() {
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Withdrawal state
  const [applicationToWithdraw, setApplicationToWithdraw] = useState<IJobApplication | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await applicationService.getMyApplications({
        status: selectedStatus !== "all" ? selectedStatus : undefined,
      });
      setApplications(data);
    } catch (err: unknown) {
      let msg = "Failed to load applications.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleWithdraw = async () => {
    if (!applicationToWithdraw) return;

    setIsWithdrawing(true);
    try {
      await applicationService.withdrawApplication(applicationToWithdraw.id);
      toast.success("Application withdrawn", {
        description: `Your application for "${applicationToWithdraw.job.title}" has been withdrawn.`,
      });
      setApplicationToWithdraw(null);
      await fetchApplications();
    } catch (err: unknown) {
      let msg = "Failed to withdraw application.";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        msg = (err as { response: { data: { message: string } } }).response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error("Withdrawal error", { description: msg });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.job.title.toLowerCase().includes(q) ||
      app.company.name.toLowerCase().includes(q) ||
      app.job.location.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    const baseBadgeClasses =
      "hover:text-white hover:[&>svg]:text-white hover:border-transparent transition-all duration-150 ease-in-out cursor-default select-none";

    switch (status) {
      case "Pending":
        return (
          <Badge className={`bg-amber-50 text-amber-700 border-amber-200 text-xs gap-1 ${baseBadgeClasses}`}>
            <Clock className="h-3 w-3 transition-colors duration-150" />
            Pending
          </Badge>
        );
      case "Shortlisted":
        return (
          <Badge className={`bg-purple-50 text-purple-700 border-purple-200 text-xs gap-1 ${baseBadgeClasses}`}>
            <Sparkles className="h-3 w-3 transition-colors duration-150" />
            Shortlisted
          </Badge>
        );
      case "Accepted":
        return (
          <Badge className={`bg-emerald-50 text-emerald-700 border-emerald-200 text-xs gap-1 font-semibold ${baseBadgeClasses}`}>
            <CheckCircle2 className="h-3 w-3 transition-colors duration-150" />
            Accepted
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className={`bg-red-50 text-red-700 border-red-200 text-xs gap-1 ${baseBadgeClasses}`}>
            <ThumbsDown className="h-3 w-3 transition-colors duration-150" />
            Rejected
          </Badge>
        );
      case "Withdrawn":
        return (
          <Badge className={`bg-slate-100 text-slate-500 border-slate-200 text-xs gap-1 ${baseBadgeClasses}`}>
            <XCircle className="h-3 w-3 transition-colors duration-150" />
            Withdrawn
          </Badge>
        );
      default:
        return (
          <Badge className={`bg-slate-100 text-slate-700 border-slate-200 text-xs gap-1 ${baseBadgeClasses}`}>
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            My Applied Jobs
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Monitor submission status, review recruiter feedback, and manage your applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApplications}
            disabled={isLoading}
            className="text-xs border-slate-200"
          >
            <RefreshCw
              className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Link href="/all-jobs">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
              <Briefcase className="mr-1.5 h-3.5 w-3.5" />
              Apply for More Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <Select
            value={selectedStatus}
            onValueChange={(val) => setSelectedStatus(val)}
          >
            <SelectTrigger className="h-10 text-xs font-semibold text-slate-700 w-[160px]">
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

      {/* Applications Table Card */}
      <Card className="border-slate-200 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-3 text-xs font-medium text-slate-500">
                Loading applied jobs...
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-800">
                No Applications Found
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                {searchQuery || selectedStatus !== "all"
                  ? "No applications matched your search or status filter. Try resetting filters."
                  : "You haven't submitted any job applications yet."}
              </p>
              <Link href="/all-jobs" className="mt-4">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                  Browse Active Vacancies
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Job & Company</th>
                    <th className="py-3 px-5">Location & Type</th>
                    <th className="py-3 px-5">Applied Date</th>
                    <th className="py-3 px-5 text-center">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Job & Company */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1">
                            {app.company.image ? (
                              <img
                                src={app.company.image}
                                alt={app.company.name}
                                className="h-full w-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="font-black text-slate-400 text-sm">
                                {app.company.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/apply-job/${app.job.id}`}
                              className="font-bold text-slate-900 hover:text-blue-600 transition"
                            >
                              {app.job.title}
                            </Link>
                            <p className="text-xs font-medium text-slate-500">
                              {app.company.name}
                              {app.job.category && (
                                <span className="ml-2 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                                  {app.job.category.name}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Location & Type */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {app.job.location}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                          {app.job.jobType} • ${app.job.salary.toLocaleString()}/yr
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-5 text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 text-center">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/apply-job/${app.job.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-slate-700 hover:text-blue-600 hover:border-blue-300"
                            >
                              View Job
                            </Button>
                          </Link>

                          {app.status === "Pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setApplicationToWithdraw(app)}
                              className="h-8 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:border-red-200"
                            >
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Confirmation Modal */}
      {applicationToWithdraw && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !isWithdrawing && setApplicationToWithdraw(null)}
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
                  Withdraw Application?
                </h3>
                <p className="text-xs text-slate-500">
                  This action cancels your pending application.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to withdraw your application for{" "}
              <span className="font-bold text-slate-900">
                &quot;{applicationToWithdraw.job.title}&quot;
              </span>{" "}
              at <span className="font-semibold text-slate-800">{applicationToWithdraw.company.name}</span>?
              Your status will be set to Withdrawn and the recruiter will no longer process it.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setApplicationToWithdraw(null)}
                disabled={isWithdrawing}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="text-xs bg-red-600 hover:bg-red-700"
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Withdrawing...
                  </>
                ) : (
                  "Confirm Withdrawal"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

