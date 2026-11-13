"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import adminService from "@/services/admin.service";
import type { IAdminRecruiter } from "@/types/admin";
import {
  AlertTriangle,
  Ban,
  Building2,
  CheckCircle2,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Unlock,
  Users,
  X,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminRecruitersPage() {
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
  const [previewRecruiter, setPreviewRecruiter] = useState<IAdminRecruiter | null>(null);

  const fetchRecruiters = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getRecruiters({
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
      await adminService.moderateRecruiter(recruiter.id, { action });
      toast.success(
        action === "delete"
          ? `Recruiter moved to Trash Center.`
          : `Recruiter company status updated to ${action === "block" ? "Blocked" : "Active"}.`,
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
            Inspect verified employers, monitor job postings, block suspicious accounts, and soft-delete organizations.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchRecruiters}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-purple-600" : ""}`}
          />
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
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
              <p className="text-sm font-medium text-slate-600">
                Loading recruiter records...
              </p>
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
                  {recruiters.map((r) => {
                    const isBusy = actionLoadingId === r.id;

                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Company Profile */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 shrink-0 rounded-xl border border-slate-200">
                              <AvatarImage
                                src={r.image}
                                alt={r.name}
                                className="rounded-xl object-cover"
                              />
                              <AvatarFallback className="rounded-xl bg-purple-50 text-purple-700 font-bold text-sm">
                                {r.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 leading-tight">
                                {r.name}
                              </p>
                              <p className="text-xs text-slate-500 leading-normal">
                                {r.email}
                              </p>
                              {r.website && (
                                <a
                                  href={
                                    r.website.startsWith("http")
                                      ? r.website
                                      : `https://${r.website}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-purple-600 hover:underline mt-0.5"
                                >
                                  <Globe className="h-3 w-3" />
                                  Website
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Location & Size */}
                        <td className="px-6 py-4">
                          <p className="flex items-center gap-1 text-xs text-slate-700">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {r.location || "Remote / Unspecified"}
                          </p>
                          <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                            <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {r.companySize || "N/A"}
                          </p>
                        </td>

                        {/* Status Badges */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            {r.status === "active" ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-white hover:text-emerald-800 hover:border-emerald-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] font-semibold gap-1 cursor-default select-none"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-white hover:text-rose-800 hover:border-rose-400 hover:shadow-xs transition-all duration-150 ease-in-out text-[10px] font-semibold gap-1 cursor-default select-none"
                              >
                                <Ban className="h-3 w-3" />
                                Blocked
                              </Badge>
                            )}

                            {r.isEmailVerified ? (
                              <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium">
                                <ShieldCheck className="h-3 w-3" />
                                Verified Email
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-600 flex items-center gap-0.5 font-medium">
                                <XCircle className="h-3 w-3" />
                                Unverified
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Jobs & Inflow */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-xs font-bold text-slate-900">
                            {r.jobCount || 0} jobs posted
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {r.applicationCount || 0} applicants received
                          </p>
                        </td>

                        {/* Registered */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewRecruiter(r)}
                              className="h-8 px-2 text-xs text-slate-600 hover:text-purple-600"
                              title="Preview Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>

                            {r.status === "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isBusy}
                                onClick={() =>
                                  setRecruiterToModerate({
                                    recruiter: r,
                                    action: "block",
                                  })
                                }
                                className="h-8 px-2 text-xs text-amber-600 hover:bg-amber-50 hover:border-amber-200"
                                title="Block Recruiter"
                              >
                                <Ban className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isBusy}
                                onClick={() =>
                                  setRecruiterToModerate({
                                    recruiter: r,
                                    action: "unblock",
                                  })
                                }
                                className="h-8 px-2 text-xs text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
                                title="Unblock Recruiter"
                              >
                                <Unlock className="h-3.5 w-3.5" />
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isBusy}
                              onClick={() =>
                                setRecruiterToModerate({
                                  recruiter: r,
                                  action: "delete",
                                })
                              }
                              className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                              title="Soft Delete"
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

      {/* Recruiter Details Modal */}
      {previewRecruiter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewRecruiter(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewRecruiter(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <Avatar className="h-14 w-14 shrink-0 rounded-2xl border border-purple-200">
                <AvatarImage
                  src={previewRecruiter.image}
                  alt={previewRecruiter.name}
                  className="rounded-2xl object-cover"
                />
                <AvatarFallback className="rounded-2xl bg-purple-100 text-purple-700 font-bold text-xl">
                  {previewRecruiter.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {previewRecruiter.name}
                </h3>
                <p className="text-xs text-purple-700 font-semibold">
                  {previewRecruiter.companySize || "Employer Organization"}
                </p>
                <p className="text-xs text-slate-500">{previewRecruiter.email}</p>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700">Company ID: </span>
                <span className="font-mono text-slate-500">{previewRecruiter.id}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Headquarters: </span>
                <span className="text-slate-600">
                  {previewRecruiter.location || "Not specified"}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Member Since: </span>
                <span className="text-slate-600">
                  {new Date(previewRecruiter.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Open Jobs: </span>
                <span className="text-purple-700 font-bold">
                  {previewRecruiter.jobCount} Vacancies
                </span>
              </div>
              {previewRecruiter.website && (
                <div>
                  <span className="font-bold text-slate-700">Website: </span>
                  <a
                    href={
                      previewRecruiter.website.startsWith("http")
                        ? previewRecruiter.website
                        : `https://${previewRecruiter.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline font-semibold"
                  >
                    {previewRecruiter.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
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

