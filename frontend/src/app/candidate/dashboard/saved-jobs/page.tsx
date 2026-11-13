"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bookmarkService from "@/services/bookmark.service";
import type { IBookmark } from "@/types/bookmark";
import {
  Bookmark,
  Briefcase,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function CandidateSavedJobsPage() {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await bookmarkService.getMyBookmarks();
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
      await bookmarkService.removeBookmark(jobId);
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
            Review your bookmarked opportunities, track deadlines, and apply
            anytime.
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
            <RefreshCw
              className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Link href="/all-jobs">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Briefcase className="mr-1.5 h-3.5 w-3.5" />
              Explore More Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Filter saved jobs by title, company, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 text-xs bg-white"
        />
      </div>

      {/* Bookmarks Grid / Cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-3 text-xs font-medium text-slate-500">
            Loading saved jobs...
          </p>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Bookmark className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-800">
            {searchQuery ? "No matching saved jobs" : "No saved jobs yet"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No bookmarks matching "${searchQuery}".`
              : "Whenever you see an interesting vacancy, click 'Bookmark / Save Job' to save it for later review."}
          </p>
          <Link href="/all-jobs" className="mt-4 inline-block">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
              Browse Job Openings
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookmarks.map((bookmark) => {
            const job = bookmark.job;
            const company = job.company;
            return (
              <div
                key={bookmark.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:border-blue-400 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1">
                        {company?.image ? (
                          <img
                            src={company.image}
                            alt={company.name}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="font-bold text-slate-500">
                            {company?.name?.charAt(0) || "C"}
                          </span>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/apply-job/${job.id}`}
                          className="font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs font-medium text-slate-500">
                          {company?.name}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBookmark(job.id)}
                      disabled={removingId === job.id}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:border-red-200"
                      title="Remove bookmark"
                    >
                      {removingId === job.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {job.category && (
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px]">
                        {job.category.name}
                      </Badge>
                    )}
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                      {job.jobType}
                    </Badge>
                    <Badge
                      className={`text-[10px] ${
                        job.hiringStatus === "Ongoing"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {job.hiringStatus}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="font-bold text-slate-900">
                      {job.salary && Number(job.salary) > 0
                        ? `$${Math.round(Number(job.salary) / 12).toLocaleString()}/month`
                        : "Salary Negotiable"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Saved on{" "}
                    {new Date(bookmark.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <Link href={`/apply-job/${job.id}`}>
                    <Button
                      size="sm"
                      className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
