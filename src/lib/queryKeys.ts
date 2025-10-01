/**
 * Centralized query key factory for all React Query keys
 */
export const queryKeys = {
  github: {
    all: ["github"] as const,
    search: (query: string) =>
      [...queryKeys.github.all, "search", query] as const,
  },
  repositories: {
    all: ["repositories"] as const,
    user: (username: string) =>
      [...queryKeys.repositories.all, username] as const,
  },
} as const;
