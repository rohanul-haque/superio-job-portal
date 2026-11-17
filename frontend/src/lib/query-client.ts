import { QueryClient } from "@tanstack/react-query";

/**
 * Creates a configured QueryClient with sensible production defaults:
 * - 60s staleTime prevents immediate repetitive network refetches
 * - 10m gcTime retains cached data in memory
 * - refetchOnWindowFocus disabled to avoid aggressive background refetching
 * - Smart retry: ignores 4xx client errors (e.g. 401 Unauthorized, 404 Not Found)
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error: unknown) => {
          const err = error as {
            response?: { status?: number };
            statusCode?: number;
          };
          const status = err?.response?.status || err?.statusCode;
          if (status && status >= 400 && status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always make a fresh query client per request
    return makeQueryClient();
  }
  // Browser: keep singleton query client
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
