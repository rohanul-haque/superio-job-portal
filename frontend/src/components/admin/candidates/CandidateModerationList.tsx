"use client";

import CandidateItemRow from "./CandidateItemRow";
import CandidatePreviewModal from "./CandidatePreviewModal";
import TableSkeleton from "@/components/loaders/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import type { IAdminCandidate } from "@/interfaces/admin.interface";
import {
  getCandidates,
  moderateCandidate,
} from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Filter,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "@/components/ui/toast";

export default function CandidateModerationList() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal / Action states
  const [candidateToModerate, setCandidateToModerate] = useState<{
    candidate: IAdminCandidate;
    action: "block" | "unblock" | "delete";
  } | null>(null);
  const [previewCandidate, setPreviewCandidate] =
    useState<IAdminCandidate | null>(null);

  const queryParams = {
    search: searchQuery.trim() || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  };

  const {
    data: candidatesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.candidates(queryParams),
    queryFn: () => getCandidates(queryParams),
  });

  const candidates = candidatesData?.candidates || [];

  const moderateMutation = useMutation({
    mutationFn: ({
      id,
      action,
    }: {
      id: string;
      action: "block" | "unblock" | "delete";
    }) => moderateCandidate(id, { action }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.candidates() });
      if (variables.action === "delete") {
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.trash() });
      }
      toast.success(
        variables.action === "delete"
          ? `Candidate moved to Trash Center.`
          : `Candidate account status updated to ${variables.action === "block" ? "Blocked" : "Active"}.`
      );
      setCandidateToModerate(null);
    },
    onError: (err: unknown) => {
      let msg = "Failed to apply moderation action.";
      if (err instanceof Error) msg = err.message;
      toast.error("Action Failed", { description: msg });
    },
    onSettled: () => {
      setActionLoadingId(null);
    },
  });

  const handleConfirmAction = () => {
    if (!candidateToModerate) return;
    const { candidate, action } = candidateToModerate;

    setActionLoadingId(candidate.id);
    moderateMutation.mutate({ id: candidate.id, action });
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
            Review registered talent, inspect candidate credentials, block
            abusive accounts, and soft-delete users.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
        >
          {isLoading ? (
            <Spinner size="sm" className="text-purple-600" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
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
            <div className="p-6">
              <TableSkeleton rows={5} columns={6} />
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
                  {candidates.map((c) => (
                    <CandidateItemRow
                      key={c.id}
                      candidate={c}
                      isBusy={actionLoadingId === c.id}
                      onPreview={(cand) => setPreviewCandidate(cand)}
                      onModerate={(cand, act) =>
                        setCandidateToModerate({ candidate: cand, action: act })
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidate Profile Details Drawer / Modal */}
      <CandidatePreviewModal
        candidate={previewCandidate}
        onClose={() => setPreviewCandidate(null)}
      />

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
                    <Spinner size="sm" className="mr-1.5" />
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
