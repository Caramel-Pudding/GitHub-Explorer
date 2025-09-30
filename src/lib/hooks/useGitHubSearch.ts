import { useQuery } from "@tanstack/react-query";
import { searchGitHubUsers } from "@/lib/api/github";

/**
 * Query key factory for GitHub user search
 */
export const githubSearchKeys = {
  all: ["github", "search"] as const,
  search: (query: string) => [...githubSearchKeys.all, query] as const,
};

/**
 * Hook to search for GitHub users
 * Only fetches when query is not empty
 */
export function useGitHubSearch(query: string) {
  return useQuery({
    queryKey: githubSearchKeys.search(query),
    queryFn: () => searchGitHubUsers(query),
    enabled: query.length > 0,
  });
}
