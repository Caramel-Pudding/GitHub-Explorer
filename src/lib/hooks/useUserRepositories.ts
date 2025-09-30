import { useQuery } from "@tanstack/react-query";
import { fetchUserRepositories } from "@/lib/api/github";

/**
 * Query key factory for user repositories
 */
export const repositoryKeys = {
  all: ["repositories"] as const,
  user: (username: string) => [...repositoryKeys.all, username] as const,
};

/**
 * Hook to fetch repositories for a specific GitHub user
 * Only fetches when enabled (user dropdown is expanded)
 */
export function useUserRepositories(username: string, enabled = true) {
  return useQuery({
    queryKey: repositoryKeys.user(username),
    queryFn: () => fetchUserRepositories(username),
    enabled: enabled && username.length > 0,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}
