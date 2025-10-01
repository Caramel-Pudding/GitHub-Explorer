import { useQuery } from "@tanstack/react-query";
import { searchGitHubUsers } from "@/lib/api/github";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Hook to search for GitHub users
 * Only fetches when query is not empty
 */
export function useGitHubSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.github.search(query),
    queryFn: () => searchGitHubUsers(query),
    enabled: query.length > 0,
  });
}
