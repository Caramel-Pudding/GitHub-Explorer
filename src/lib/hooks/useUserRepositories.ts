import { useQuery } from "@tanstack/react-query";
import { fetchUserRepositories } from "@/lib/api/github";
import { queryKeys } from "@/lib/queryKeys";
import { GITHUB_API } from "@/lib/constants";

/**
 * Hook to fetch repositories for a specific GitHub user
 * Only fetches when enabled (user dropdown is expanded)
 */
export function useUserRepositories(username: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.repositories.user(username),
    queryFn: () => fetchUserRepositories(username),
    enabled: enabled && username.length > 0,
    staleTime: GITHUB_API.CACHE_TIME,
  });
}
