import { useQuery } from "@tanstack/react-query";
import { searchGitHubUsers } from "@/lib/api/github";

export function useGitHubSearch(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: ["github", "search", trimmedQuery],
    queryFn: () => searchGitHubUsers(trimmedQuery),
    enabled: trimmedQuery.length > 0,
  });
}
