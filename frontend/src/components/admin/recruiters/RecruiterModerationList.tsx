"use client";

import RecruiterItemRow from "./RecruiterItemRow";
import RecruiterPreviewModal from "./RecruiterPreviewModal";
import TableSkeleton from "@/components/loaders/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import type { IAdminRecruiter } from "@/interfaces/admin.interface";
import {
  getRecruiters,
  moderateRecruiter,
} from "@/services/admin.service";
import {
  AlertTriangle,
  Building2,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";

export default function RecruiterModerationList() {
  const [recruiters, setRecruiters] = useState<IAdminRecruiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal / Action states
  const [recruiterToModerate, setRecruiterToModerate] = useState<{
    recruiter: IAdminRecruiter;
    action: "block" | "unblock" | "delete";
  } | null>(null);
  const [previewRecruiter, setPreviewRecruiter] =
    useState<IAdminRecruiter | null>(null);

  const fetchRecruiters = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRecruiters({
        search: searchQuery.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setRecruiters(data.recruiters);
    } catch (err: unknown) {
      let msg = "Failed to load recruiters.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecruiters();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchRecruiters]);

  const handleConfirmAction = async () => {
    if (!recruiterToModerate) return;
    const { recruiter, action } = recruiterToModerate;

    setActionLoadingId(recruiter.id);
    try {
      await moderateRecruiter(recruiter.id, { action });
      toast.success(
        action === "delete"
          ? `Recruiter moved to Trash Center.`
          : `Recruiter company status updated to ${action === "block" ? "Blocked" : "Active"}.`
      );
      setRecruiterToModerate(null);
      await fetchRecruiters();
    } catch (err: unknown) {
      let msg = "Failed to apply moderation action.";
      if (err instanceof Error) msg = err.message;
      toast.error("Action Failed", { description: msg });
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
            Recruiter Moderation
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Inspect verified employers, monitor job postings, block suspicious
            accounts, and soft-delete organizations.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchRecruiters}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
        >
          {isLoading ? (
            <Spinner size="sm" className="text-purple-600" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh Recruiters
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search company name, email, website, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:border-purple-500 focus:outline-hidden"
              >
                <option value="all">All Company Statuses</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Accounts</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recruiters Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={5} columns={6} />
            </div>
          ) : recruiters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Recruiters Found
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">
                No recruiter company accounts match your current filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Company Profile
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Headquarters & Size
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Status & Verification
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Jobs & Inflow
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Registered
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recruiters.map((r) => (
                    <RecruiterItemRow
                      key={r.id}
                      recruiter={r}
                      isBusy={actionLoadingId === r.id}
                      onPreview={(rec) => setPreviewRecruiter(rec)}
                      onModerate={(rec, act) =>
                        setRecruiterToModerate({ recruiter: rec, action: act })
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recruiter Details Modal */}
      <RecruiterPreviewModal
        recruiter={previewRecruiter}
        onClose={() => setPreviewRecruiter(null)}
      />

      {/* Moderation Confirmation Modal */}
      {recruiterToModerate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setRecruiterToModerate(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Recruiter Moderation
                </h3>
                <p className="text-xs text-slate-500 capitalize">
                  Action: {recruiterToModerate.action} company account
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to{" "}
              <strong className="text-slate-900 font-bold">
                {recruiterToModerate.action}
              </strong>{" "}
              company account for{" "}
              <strong className="text-slate-900 font-bold">
                &quot;{recruiterToModerate.recruiter.name}&quot;
              </strong>{" "}
              ({recruiterToModerate.recruiter.email})?
              {recruiterToModerate.action === "delete" &&
                " All its active jobs will also be archived and can be restored from the Trash Center."}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecruiterToModerate(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmAction}
                disabled={Boolean(actionLoadingId)}
                className={`text-xs text-white font-bold ${
                  recruiterToModerate.action === "delete"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : recruiterToModerate.action === "block"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {actionLoadingId ? (
                  <>
                    <Spinner size="sm" className="mr-1.5" />
                    Processing...
                  </>
                ) : (
                  `Confirm ${recruiterToModerate.action}`
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
