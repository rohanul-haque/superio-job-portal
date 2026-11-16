"use client";

import { TrashItemRow } from "./TrashItemRow";
import { TableSkeleton } from "@/components/loaders/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { ITrashItem } from "@/interfaces/admin.interface";
import adminService from "@/services/admin.service";
import {
  AlertTriangle,
  Archive,
  RefreshCw,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function TrashCenter() {
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
        description:
          res.message || `${item.title} has been restored to active status.`,
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
        itemToPurge.id
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Trash & Restore Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Centralized recovery console for soft-deleted candidates,
            recruiters, jobs, and categories.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchTrashItems}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
        >
          {isLoading ? (
            <Spinner size="sm" className="text-purple-600" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
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
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
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
            <div className="p-6">
              <TableSkeleton rows={5} columns={5} />
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
                No soft-deleted entities found in the selected category.
                Platform records are clean.
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
                  {trashItems.map((item) => (
                    <TrashItemRow
                      key={`${item.type}-${item.id}`}
                      item={item}
                      isBusy={actionLoadingId === item.id}
                      onRestore={handleRestore}
                      onPurgeRequest={(it) => setItemToPurge(it)}
                    />
                  ))}
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
              ({itemToPurge.type})? This record will be permanently deleted from
              MongoDB and cannot be restored.
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
                    <Spinner size="sm" className="mr-1.5" />
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
