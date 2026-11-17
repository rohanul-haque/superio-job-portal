"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getMyBookmarks,
  removeBookmark as removeBookmarkApi,
  toggleBookmark as toggleBookmarkApi,
} from "@/services/bookmark.service";
import { getMyApplications } from "@/services/application.service";

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
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<Set<string>>(
    () => new Set()
  );
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(
    () => new Set()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const activeFetchIdRef = useRef<number>(0);

  const refetchCandidateJobState = useCallback(async () => {
    if (!isAuthenticated || !user || user.role !== "candidate") {
      setBookmarkedJobIds(new Set());
      setAppliedJobIds(new Set());
      setIsLoading(false);
      return;
    }

    const fetchId = ++activeFetchIdRef.current;
    setIsLoading(true);

    try {
      const [bookmarks, applications] = await Promise.all([
        getMyBookmarks().catch((err) => {
          console.error("Failed to load candidate bookmarks:", err);
          return [];
        }),
        getMyApplications().catch((err) => {
          console.error("Failed to load candidate applications:", err);
          return [];
        }),
      ]);

      if (fetchId !== activeFetchIdRef.current) {
        return;
      }

      const nextBookmarked = new Set<string>();
      for (const b of bookmarks) {
        if (b.jobId) nextBookmarked.add(b.jobId);
        if (b.job?.id) nextBookmarked.add(b.job.id);
      }

      const nextApplied = new Set<string>();
      for (const a of applications) {
        if (!a.isDeleted) {
          if (a.jobId) nextApplied.add(a.jobId);
          if (a.job?.id) nextApplied.add(a.job.id);
        }
      }

      setBookmarkedJobIds(nextBookmarked);
      setAppliedJobIds(nextApplied);
    } finally {
      if (fetchId === activeFetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refetchCandidateJobState();
  }, [refetchCandidateJobState]);

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

      // Optimistic update for immediate UI feedback
      const wasBookmarked = bookmarkedJobIds.has(jobId);
      const optimisticNext = !wasBookmarked;

      setBookmarkedJobIds((prev) => {
        const next = new Set(prev);
        if (optimisticNext) {
          next.add(jobId);
        } else {
          next.delete(jobId);
        }
        return next;
      });

      try {
        const res = await toggleBookmarkApi(jobId);
        const serverState = res?.isBookmarked ?? optimisticNext;

        setBookmarkedJobIds((prev) => {
          const next = new Set(prev);
          if (serverState) {
            next.add(jobId);
          } else {
            next.delete(jobId);
          }
          return next;
        });

        return serverState;
      } catch (error) {
        // Revert to original state on server failure
        setBookmarkedJobIds((prev) => {
          const next = new Set(prev);
          if (wasBookmarked) {
            next.add(jobId);
          } else {
            next.delete(jobId);
          }
          return next;
        });
        throw error;
      }
    },
    [bookmarkedJobIds]
  );

  const removeBookmark = useCallback(
    async (jobId: string): Promise<boolean> => {
      if (!jobId) return false;

      const wasBookmarked = bookmarkedJobIds.has(jobId);

      // Optimistic removal
      setBookmarkedJobIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });

      try {
        await removeBookmarkApi(jobId);
        return true;
      } catch (error) {
        // Revert on error
        if (wasBookmarked) {
          setBookmarkedJobIds((prev) => new Set(prev).add(jobId));
        }
        throw error;
      }
    },
    [bookmarkedJobIds]
  );

  const recordApplication = useCallback((jobId: string) => {
    if (!jobId) return;
    setAppliedJobIds((prev) => {
      if (prev.has(jobId)) return prev;
      const next = new Set(prev);
      next.add(jobId);
      return next;
    });
  }, []);

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
