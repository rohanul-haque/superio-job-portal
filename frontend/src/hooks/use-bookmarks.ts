import type { IBookmark } from "@/types/bookmark";
import { getMyBookmarks } from "@/services/bookmark.service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyBookmarks();
      setBookmarks(data);
    } catch (err: unknown) {
      let msg = "Failed to load bookmarks.";
      if (err instanceof Error) msg = err.message;
      setError(msg);
      toast.error("Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    isLoading,
    error,
    refetch: fetchBookmarks,
    setBookmarks,
  };
}
