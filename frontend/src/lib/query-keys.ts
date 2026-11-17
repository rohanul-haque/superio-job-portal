/**
 * Centralized, type-safe TanStack Query keys for HireNest frontend.
 * Hierarchy ensures targeted invalidation without accidental cache pollution.
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    user: () => ["auth", "user"] as const,
  },

  categories: {
    all: ["categories"] as const,
    list: (params?: Record<string, unknown>) =>
      ["categories", "list", params || {}] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
  },

  jobs: {
    all: ["jobs"] as const,
    list: (params?: Record<string, unknown>) =>
      ["jobs", "list", params || {}] as const,
    detail: (id: string) => ["jobs", "detail", id] as const,
  },

  candidate: {
    all: ["candidate"] as const,
    profile: () => ["candidate", "profile"] as const,
    dashboard: () => ["candidate", "dashboard"] as const,
    recommendations: (refresh = false) =>
      ["candidate", "recommendations", { refresh }] as const,
    applications: (status?: string) =>
      ["candidate", "applications", { status: status || "all" }] as const,
    bookmarks: () => ["candidate", "bookmarks"] as const,
  },

  recruiter: {
    all: ["recruiter"] as const,
    profile: () => ["recruiter", "profile"] as const,
    dashboard: () => ["recruiter", "dashboard"] as const,
    jobs: () => ["recruiter", "jobs"] as const,
    applicants: (params?: Record<string, unknown>) =>
      ["recruiter", "applicants", params || {}] as const,
    matches: (jobId: string, refresh = false) =>
      ["recruiter", "matches", jobId, { refresh }] as const,
  },

  admin: {
    all: ["admin"] as const,
    profile: () => ["admin", "profile"] as const,
    dashboard: () => ["admin", "dashboard"] as const,
    candidates: (params?: Record<string, unknown>) =>
      ["admin", "candidates", params || {}] as const,
    recruiters: (params?: Record<string, unknown>) =>
      ["admin", "recruiters", params || {}] as const,
    jobs: (params?: Record<string, unknown>) =>
      ["admin", "jobs", params || {}] as const,
    categories: (params?: Record<string, unknown>) =>
      ["admin", "categories", params || {}] as const,
    trash: (type?: string) =>
      ["admin", "trash", { type: type || "all" }] as const,
  },
};
