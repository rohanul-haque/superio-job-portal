"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import adminService from "@/services/admin.service";
import type { ITrashItem } from "@/types/admin";
import {
  AlertTriangle,
  Archive,
  Briefcase,
  Building2,
  FolderTree,
  Loader2,
  RefreshCw,
  RotateCcw,
  Trash2,
  User,
  Users,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminTrashCenterPage() {
  const [trashItems, setTrashItems] = useState<ITrashItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Permanent Delete Modal
  const [itemToPurge, setItemToPurge] = useState<ITrashItem | null>(null);

  const fetchTrashItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getTrashItems({
        type: selectedType !== "all" ? selectedType : undefined,
      });
      setTrashItems(data);
    } catch (err: unknown) {
      let msg = "Failed to load trash items.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    fetchTrashItems();
  }, [fetchTrashItems]);

  const handleRestore = async (item: ITrashItem) => {
    setActionLoadingId(item.id);
    try {
      const res = await adminService.restoreTrashItem({
        type: item.type,
        id: item.id,
      });
      toast.success("Entity Restored", {
        description: res.message || `${item.title} has been restored to active status.`,
      });
      setTrashItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err: unknown) {
      let msg = "Failed to restore item.";
      if (err instanceof Error) msg = err.message;
      toast.error("Restore Failed", { description: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePermanentPurge = async () => {
    if (!itemToPurge) return;

    setActionLoadingId(itemToPurge.id);
    try {
      await adminService.permanentlyDeleteTrashItem(
        itemToPurge.type,
        itemToPurge.id,
      );
      toast.success("Permanently Purged", {
        description: `"${itemToPurge.title}" was permanently removed from database.`,
      });
      setTrashItems((prev) => prev.filter((i) => i.id !== itemToPurge.id));
      setItemToPurge(null);
    } catch (err: unknown) {
      let msg = "Failed to permanently purge item.";
      if (err instanceof Error) msg = err.message;
      toast.error("Purge Failed", { description: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "candidate":
        return (
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-semibold gap-1">
            <User className="h-3 w-3" />
            Candidate
          </Badge>
        );
      case "recruiter":
        return (
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-semibold gap-1">
            <Building2 className="h-3 w-3" />
            Recruiter
          </Badge>
        );
      case "job":
        return (
          <Badge className="bg-sky-50 text-sky-700 border-sky-200 text-xs font-semibold gap-1">
            <Briefcase className="h-3 w-3" />
            Job Post
          </Badge>
        );
      case "category":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-semibold gap-1">
            <FolderTree className="h-3 w-3" />
            Category
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Trash & Restore Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Centralized recovery console for soft-deleted candidates, recruiters, jobs, and categories.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchTrashItems}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-purple-600" : ""}`}
          />
          Refresh Trash
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { label: "All Soft-Deleted Items", value: "all" },
          { label: "Candidates", value: "candidate" },
          { label: "Recruiters", value: "recruiter" },
          { label: "Job Posts", value: "job" },
          { label: "Categories", value: "category" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedType(tab.value)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              selectedType === tab.value
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trash Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
              <p className="text-sm font-medium text-slate-600">
                Scanning trash registry...
              </p>
            </div>
          ) : trashItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                <Archive className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Trash is Empty
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">
                No soft-deleted entities found in the selected category. Platform records are clean.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Entity Type
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Record Title / Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Identifier / Metadata
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Deleted At
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Recovery Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trashItems.map((item) => {
                    const isBusy = actionLoadingId === item.id;

                    return (
                      <tr
                        key={`${item.type}-${item.id}`}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Type Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTypeBadge(item.type)}
                        </td>

                        {/* Title */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-bold text-slate-900">
                            {item.title}
                          </p>
                        </td>

                        {/* Subtitle */}
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-500 font-mono">
                            {item.subtitle}
                          </span>
                        </td>

                        {/* Deleted At */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {item.deletedAt
                            ? new Date(item.deletedAt).toLocaleString()
                            : "Archived"}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              disabled={isBusy}
                              onClick={() => handleRestore(item)}
                              className="gap-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 text-xs font-bold shadow-xs"
                            >
                              {isBusy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RotateCcw className="h-3.5 w-3.5" />
                              )}
                              Restore Record
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isBusy}
                              onClick={() => setItemToPurge(item)}
                              className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                              title="Permanently Purge"
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

      {/* Permanent Purge Confirmation Modal */}
      {itemToPurge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setItemToPurge(null)}
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
                  Permanent Purge Warning
                </h3>
                <p className="text-xs text-slate-500">
                  Hard database delete cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900 font-bold">
                &quot;{itemToPurge.title}&quot;
              </strong>{" "}
              ({itemToPurge.type})? This record will be permanently deleted from MongoDB and cannot be restored.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItemToPurge(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handlePermanentPurge}
                disabled={Boolean(actionLoadingId)}
                className="text-xs bg-rose-600 hover:bg-rose-700 font-bold"
              >
                {actionLoadingId ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Purging...
                  </>
                ) : (
                  "Permanently Purge"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

