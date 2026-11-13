"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import adminService from "@/services/admin.service";
import type { IAdminCandidate } from "@/types/admin";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlock,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<IAdminCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal / Action states
  const [candidateToModerate, setCandidateToModerate] = useState<{
    candidate: IAdminCandidate;
    action: "block" | "unblock" | "delete";
  } | null>(null);
  const [previewCandidate, setPreviewCandidate] = useState<IAdminCandidate | null>(null);

  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCandidates({
        search: searchQuery.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setCandidates(data.candidates);
    } catch (err: unknown) {
      let msg = "Failed to load candidates.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCandidates();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchCandidates]);

  const handleConfirmAction = async () => {
    if (!candidateToModerate) return;
    const { candidate, action } = candidateToModerate;

    setActionLoadingId(candidate.id);
    try {
      await adminService.moderateCandidate(candidate.id, { action });
      toast.success(
        action === "delete"
          ? `Candidate moved to Trash Center.`
          : `Candidate account status updated to ${action === "block" ? "Blocked" : "Active"}.`,
      );
      setCandidateToModerate(null);
      await fetchCandidates();
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
            Candidate Moderation
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review registered talent, inspect candidate credentials, block abusive accounts, and soft-delete users.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchCandidates}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-purple-600" : ""}`}
          />
          Refresh Candidates
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search candidate name, email, or role title..."
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
                <option value="all">All Account Statuses</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Accounts</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
              <p className="text-sm font-medium text-slate-600">
                Loading candidate records...
              </p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Candidates Found
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">
                No candidate records match your current search query or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Candidate Profile
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Title & Skills
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Account Status
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Resume
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Applications
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Moderation Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((c) => {
                    const isBusy = actionLoadingId === c.id;

                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Profile */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 shrink-0 border border-slate-200">
                              <AvatarImage
                                src={c.profilePicture?.url}
                                alt={c.name}
                              />
                              <AvatarFallback className="bg-purple-50 text-purple-700 font-bold text-sm">
                                {c.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 leading-tight">
                                {c.name}
                              </p>
                              <p className="text-xs text-slate-500 leading-normal">
                                {c.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Title & Skills */}
                        <td className="px-6 py-4 max-w-xs">
                          <p className="font-semibold text-slate-800 text-xs truncate">
                            {c.title || "Not Specified"}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {c.skills?.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                              >
                                {skill}
                              </span>
                            ))}
                            {(c.skills?.length || 0) > 3 && (
                              <span className="text-[10px] text-slate-400 self-center">
                                +{c.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status Badges */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            {c.status === "active" ? (
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

                            {c.isEmailVerified ? (
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

                        {/* Resume */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {c.resume ? (
                            <a
                              href={c.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-purple-600 hover:bg-purple-50 transition"
                            >
                              <FileText className="h-3 w-3" />
                              Resume
                              <ExternalLink className="h-3 w-3 text-slate-400" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              None
                            </span>
                          )}
                        </td>

                        {/* Applications Count */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
                          {c.applicationCount || 0} applied
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewCandidate(c)}
                              className="h-8 px-2 text-xs text-slate-600 hover:text-purple-600"
                              title="Preview Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>

                            {c.status === "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isBusy}
                                onClick={() =>
                                  setCandidateToModerate({
                                    candidate: c,
                                    action: "block",
                                  })
                                }
                                className="h-8 px-2 text-xs text-amber-600 hover:bg-amber-50 hover:border-amber-200"
                                title="Block Account"
                              >
                                <Ban className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isBusy}
                                onClick={() =>
                                  setCandidateToModerate({
                                    candidate: c,
                                    action: "unblock",
                                  })
                                }
                                className="h-8 px-2 text-xs text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
                                title="Unblock Account"
                              >
                                <Unlock className="h-3.5 w-3.5" />
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isBusy}
                              onClick={() =>
                                setCandidateToModerate({
                                  candidate: c,
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

      {/* Candidate Profile Details Drawer / Modal */}
      {previewCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewCandidate(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewCandidate(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <Avatar className="h-14 w-14 shrink-0 rounded-2xl border border-purple-200">
                <AvatarImage
                  src={previewCandidate.profilePicture?.url}
                  alt={previewCandidate.name}
                  className="rounded-2xl object-cover"
                />
                <AvatarFallback className="rounded-2xl bg-purple-100 text-purple-700 font-bold text-xl">
                  {previewCandidate.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {previewCandidate.name}
                </h3>
                <p className="text-xs text-purple-700 font-semibold">
                  {previewCandidate.title || "Talent Candidate"}
                </p>
                <p className="text-xs text-slate-500">{previewCandidate.email}</p>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700">Account ID: </span>
                <span className="font-mono text-slate-500">{previewCandidate.id}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Member Since: </span>
                <span className="text-slate-600">
                  {new Date(previewCandidate.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Skills ({previewCandidate.skills?.length || 0}): </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {previewCandidate.skills?.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 font-medium"
                    >
                      {s}
                    </span>
                  )) || "None listed"}
                </div>
              </div>

              {previewCandidate.resume && (
                <div className="pt-2">
                  <a
                    href={previewCandidate.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700"
                  >
                    <FileText className="h-4 w-4" />
                    Open PDF Resume
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Moderation Confirmation Modal */}
      {candidateToModerate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setCandidateToModerate(null)}
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
                  Confirm Account Moderation
                </h3>
                <p className="text-xs text-slate-500 capitalize">
                  Action: {candidateToModerate.action} candidate
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to{" "}
              <strong className="text-slate-900 font-bold">
                {candidateToModerate.action}
              </strong>{" "}
              account for{" "}
              <strong className="text-slate-900 font-bold">
                &quot;{candidateToModerate.candidate.name}&quot;
              </strong>{" "}
              ({candidateToModerate.candidate.email})?
              {candidateToModerate.action === "delete" &&
                " The record will be moved to the Trash Center where you can restore it if necessary."}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCandidateToModerate(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmAction}
                disabled={Boolean(actionLoadingId)}
                className={`text-xs text-white font-bold ${
                  candidateToModerate.action === "delete"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : candidateToModerate.action === "block"
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
                  `Confirm ${candidateToModerate.action}`
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

