"use client";

import ApplicationCard from "./ApplicationCard";
import TableSkeleton from "@/components/loaders/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import type { IJobApplication } from "@/interfaces/application.interface";
import {
  getMyApplications,
  withdrawApplication,
} from "@/services/application.service";
import {
  AlertTriangle,
  Briefcase,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function ApplicationList() {
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Withdrawal modal state
  const [applicationToWithdraw, setApplicationToWithdraw] =
    useState<IJobApplication | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMyApplications({
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
      await withdrawApplication(applicationToWithdraw.id);
      toast.success("Application withdrawn", {
        description: `Your application for "${applicationToWithdraw.job.title}" has been withdrawn.`,
      });
      setApplicationToWithdraw(null);
      await fetchApplications();
    } catch (err: unknown) {
      let msg = "Failed to withdraw application.";
      if (err instanceof Error) msg = err.message;
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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Submitted Applications
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Track and monitor the review status of your active job applications
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
            {isLoading ? (
              <Spinner size="sm" className="mr-1.5" />
            ) : (
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            )}
            Refresh
          </Button>

          <Link href="/all-jobs">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Briefcase className="mr-1.5 h-3.5 w-3.5" />
              Explore More Vacancies
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
            placeholder="Search applied jobs, companies, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Filter Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Accepted">Accepted / Hired</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Applications Table Card */}
      <Card className="border-slate-200 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={6} columns={5} />
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
                {searchQuery
                  ? `No applications matched "${searchQuery}". Try adjusting your search keywords.`
                  : "You haven't submitted any job applications yet."}
              </p>
              <Link href="/all-jobs" className="mt-4">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                  Browse Active Jobs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Job Position</th>
                    <th className="py-3 px-6">Company</th>
                    <th className="py-3 px-6">Date Applied</th>
                    <th className="py-3 px-6 text-center">Application Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredApplications.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      onWithdraw={(application) => setApplicationToWithdraw(application)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal for Withdrawal */}
      {applicationToWithdraw && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs"
          onClick={() => setApplicationToWithdraw(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Confirm Application Withdrawal
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to withdraw your application for{" "}
              <strong className="text-slate-900 font-bold">
                &quot;{applicationToWithdraw.job.title}&quot;
              </strong>{" "}
              at {applicationToWithdraw.company.name}? The employer will no longer consider your profile.
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
                    <Spinner size="sm" className="mr-1.5" />
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

export default ApplicationList;
