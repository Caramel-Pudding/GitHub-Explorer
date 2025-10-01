import {
  githubSearchResponseSchema,
  githubRepositorySchema,
} from "@/lib/schemas/github";
import { z } from "zod";
import { GITHUB_API } from "@/lib/constants";

async function fetchFromGitHub<T>(
  url: string,
  schema: z.ZodType<T>,
  errorPrefix: string,
): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  // Add authorization header if token is available
  const token = process.env["NEXT_PUBLIC_GITHUB_TOKEN"];
  console.log(token);
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`${errorPrefix}: ${response.statusText}`);
  }

  const rawData: unknown = await response.json();
  const parseResult = schema.safeParse(rawData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid GitHub API response: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}

export async function searchGitHubUsers(query: string) {
  const url = `${GITHUB_API.BASE_URL}${GITHUB_API.ENDPOINTS.SEARCH_USERS}?q=${encodeURIComponent(query)}&per_page=${String(GITHUB_API.LIMITS.SEARCH)}`;

  const response = await fetchFromGitHub(
    url,
    githubSearchResponseSchema,
    "GitHub API error",
  );

  return response.items;
}

export async function fetchUserRepositories(username: string) {
  const url = `${GITHUB_API.BASE_URL}${GITHUB_API.ENDPOINTS.USER_REPOS}/${encodeURIComponent(username)}/repos?sort=updated`;

  return fetchFromGitHub(
    url,
    z.array(githubRepositorySchema),
    `Failed to fetch repositories for ${username}`,
  );
}
