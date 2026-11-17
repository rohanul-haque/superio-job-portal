"use client";

import SavedJobCard from "./SavedJobCard";
import { JobCardSkeleton } from "@/components/loaders/skeleton/CardSkeleton";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import type { IBookmark } from "@/types/bookmark";
import { getMyBookmarks } from "@/services/bookmark.service";
import { useCandidateJobState } from "@/context/CandidateJobStateContext";
import { Bookmark, Briefcase, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";

function SavedJobsList() {
  const { removeBookmark: removeCandidateBookmark } = useCandidateJobState();
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMyBookmarks();
      setBookmarks(data);
    } catch (err: unknown) {
      let msg = "Failed to load saved jobs.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemoveBookmark = async (jobId: string) => {
    setRemovingId(jobId);
    try {
      await removeCandidateBookmark(jobId);
      toast.success("Bookmark removed", {
        description: "The job was removed from your saved list.",
      });
      setBookmarks((prev) => prev.filter((b) => b.job.id !== jobId));
    } catch (err: unknown) {
      let msg = "Failed to remove bookmark.";
      if (err instanceof Error) msg = err.message;
      toast.error("Error", { description: msg });
    } finally {
      setRemovingId(null);
    }
  };

  const filteredBookmarks = bookmarks.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.job.title.toLowerCase().includes(q) ||
      b.job.company?.name.toLowerCase().includes(q) ||
      b.job.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Saved Jobs</h2>
          <p className="mt-1 text-xs text-slate-500">
            Review your bookmarked opportunities, track deadlines, and apply anytime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBookmarks}
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
              Find More Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Search saved job title, company, location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 text-xs bg-white"
        />
      </div>

      {/* Bookmarks Grid / Empty / Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
            <Bookmark className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Bookmarked Jobs Found
          </h3>
          <p className="mt-1 max-w-md mx-auto text-xs text-slate-500">
            {searchQuery
              ? `No saved jobs match "${searchQuery}". Try a different keyword.`
              : "You haven't bookmarked any job postings yet. Browse open vacancies and click the Bookmark button to save them."}
          </p>
          <div className="mt-6">
            <Link href="/all-jobs">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                Explore Jobs Catalogue
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((bookmark) => (
            <SavedJobCard
              key={bookmark.id}
              bookmark={bookmark}
              isRemoving={removingId === bookmark.job.id}
              onRemove={handleRemoveBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedJobsList;
