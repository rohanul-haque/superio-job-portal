import { queryKeys } from "@/lib/query-keys";
import { getMyBookmarks } from "@/services/bookmark.service";
import { useQuery } from "@tanstack/react-query";

export default function useBookmarks() {
  const query = useQuery({
    queryKey: queryKeys.candidate.bookmarks(),
    queryFn: getMyBookmarks,
  });

  return {
    bookmarks: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error
      ? query.error.message
      : query.error
        ? String(query.error)
        : null,
    refetch: query.refetch,
  };
}
