"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getMyBookmarks,
  removeBookmark as removeBookmarkApi,
  toggleBookmark as toggleBookmarkApi,
} from "@/services/bookmark.service";
import { getMyApplications } from "@/services/application.service";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CandidateJobStateContextType {
  bookmarkedJobIds: Set<string>;
  appliedJobIds: Set<string>;
  isJobBookmarked: (jobId: string) => boolean;
  hasAppliedToJob: (jobId: string) => boolean;
  toggleBookmark: (jobId: string) => Promise<boolean>;
  removeBookmark: (jobId: string) => Promise<boolean>;
  recordApplication: (jobId: string) => void;
  refetchCandidateJobState: () => Promise<void>;
  isLoading: boolean;
}

const CandidateJobStateContext = createContext<
  CandidateJobStateContextType | undefined
>(undefined);

export const CandidateJobStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const isCandidate = Boolean(isAuthenticated && user?.role === "candidate");

  // Query 1: Candidate Bookmarks (independent server state)
  const bookmarksQuery = useQuery({
    queryKey: queryKeys.candidate.bookmarks(),
    queryFn: getMyBookmarks,
    enabled: isCandidate,
    staleTime: 30 * 1000,
  });

  // Query 2: Candidate Applications (independent server state)
  const applicationsQuery = useQuery({
    queryKey: queryKeys.candidate.applications(),
    queryFn: () => getMyApplications(),
    enabled: isCandidate,
    staleTime: 30 * 1000,
  });

  // Local optimistic overrides to keep UI instantaneous
  const [optimisticBookmarks, setOptimisticBookmarks] = useState<Map<string, boolean>>(
    () => new Map()
  );
  const [optimisticApplied, setOptimisticApplied] = useState<Set<string>>(
    () => new Set()
  );

  // Derive bookmarkedJobIds independently
  const bookmarkedJobIds = useMemo(() => {
    if (!isCandidate) return new Set<string>();
    const ids = new Set<string>();
    if (bookmarksQuery.data) {
      for (const b of bookmarksQuery.data) {
        if (b.jobId) ids.add(b.jobId);
        if (b.job?.id) ids.add(b.job.id);
      }
    }
    // Apply optimistic bookmark mutations
    optimisticBookmarks.forEach((isBookmarked, jobId) => {
      if (isBookmarked) {
        ids.add(jobId);
      } else {
        ids.delete(jobId);
      }
    });
    return ids;
  }, [isCandidate, bookmarksQuery.data, optimisticBookmarks]);

  // Derive appliedJobIds independently
  const appliedJobIds = useMemo(() => {
    if (!isCandidate) return new Set<string>();
    const ids = new Set<string>();
    if (applicationsQuery.data) {
      for (const a of applicationsQuery.data) {
        if (!a.isDeleted) {
          if (a.jobId) ids.add(a.jobId);
          if (a.job?.id) ids.add(a.job.id);
        }
      }
    }
    // Apply optimistic applied recordings
    for (const id of optimisticApplied) {
      ids.add(id);
    }
    return ids;
  }, [isCandidate, applicationsQuery.data, optimisticApplied]);

  // Bookmark Mutation
  const toggleBookmarkMutation = useMutation({
    mutationFn: (jobId: string) => toggleBookmarkApi(jobId),
    onSuccess: (res, jobId) => {
      const serverState = res?.isBookmarked ?? true;
      setOptimisticBookmarks((prev) => {
        const next = new Map(prev);
        next.set(jobId, serverState);
        return next;
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.candidate.bookmarks(),
      });
    },
    onError: (_err, jobId) => {
      // Revert optimistic override on failure
      setOptimisticBookmarks((prev) => {
        const next = new Map(prev);
        next.delete(jobId);
        return next;
      });
    },
  });

  // Remove Bookmark Mutation
  const removeBookmarkMutation = useMutation({
    mutationFn: (jobId: string) => removeBookmarkApi(jobId),
    onSuccess: (_res, jobId) => {
      setOptimisticBookmarks((prev) => {
        const next = new Map(prev);
        next.set(jobId, false);
        return next;
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.candidate.bookmarks(),
      });
    },
    onError: (_err, jobId) => {
      setOptimisticBookmarks((prev) => {
        const next = new Map(prev);
        next.delete(jobId);
        return next;
      });
    },
  });

  const refetchCandidateJobState = useCallback(async () => {
    if (!isCandidate) return;
    await Promise.all([
      bookmarksQuery.refetch(),
      applicationsQuery.refetch(),
    ]);
  }, [isCandidate, bookmarksQuery, applicationsQuery]);

  const isJobBookmarked = useCallback(
    (jobId: string): boolean => {
      if (!jobId) return false;
      return bookmarkedJobIds.has(jobId);
    },
    [bookmarkedJobIds]
  );

  const hasAppliedToJob = useCallback(
    (jobId: string): boolean => {
      if (!jobId) return false;
      return appliedJobIds.has(jobId);
    },
    [appliedJobIds]
  );

  const toggleBookmark = useCallback(
    async (jobId: string): Promise<boolean> => {
      if (!jobId) return false;
      const currentlyBookmarked = bookmarkedJobIds.has(jobId);
      const optimisticNext = !currentlyBookmarked;

      // Set optimistic state immediately
      setOptimisticBookmarks((prev) => new Map(prev).set(jobId, optimisticNext));

      try {
        const res = await toggleBookmarkMutation.mutateAsync(jobId);
        return res?.isBookmarked ?? optimisticNext;
      } catch (error) {
        throw error;
      }
    },
    [bookmarkedJobIds, toggleBookmarkMutation]
  );

  const removeBookmark = useCallback(
    async (jobId: string): Promise<boolean> => {
      if (!jobId) return false;
      setOptimisticBookmarks((prev) => new Map(prev).set(jobId, false));

      try {
        await removeBookmarkMutation.mutateAsync(jobId);
        return true;
      } catch (error) {
        throw error;
      }
    },
    [removeBookmarkMutation]
  );

  const recordApplication = useCallback(
    (jobId: string) => {
      if (!jobId) return;
      setOptimisticApplied((prev) => new Set(prev).add(jobId));
      queryClient.invalidateQueries({
        queryKey: queryKeys.candidate.applications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.candidate.dashboard(),
      });
    },
    [queryClient]
  );

  const isLoading = bookmarksQuery.isLoading || applicationsQuery.isLoading;

  const value = {
    bookmarkedJobIds,
    appliedJobIds,
    isJobBookmarked,
    hasAppliedToJob,
    toggleBookmark,
    removeBookmark,
    recordApplication,
    refetchCandidateJobState,
    isLoading,
  };

  return (
    <CandidateJobStateContext.Provider value={value}>
      {children}
    </CandidateJobStateContext.Provider>
  );
};

export const useCandidateJobState = (): CandidateJobStateContextType => {
  const context = useContext(CandidateJobStateContext);
  if (!context) {
    throw new Error(
      "useCandidateJobState must be used within a CandidateJobStateProvider"
    );
  }
  return context;
};
