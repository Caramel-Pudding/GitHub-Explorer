import {
  githubSearchResponseSchema,
  githubRepositorySchema,
  type GitHubUser,
  type GitHubRepository,
} from "@/lib/schemas/github";
import { z } from "zod";

const API_BASE = "https://api.github.com";
const SEARCH_LIMIT = 5;

export async function searchGitHubUsers(query: string): Promise<GitHubUser[]> {
  const url = `${API_BASE}/search/users?q=${encodeURIComponent(query)}&per_page=${String(SEARCH_LIMIT)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const rawData: unknown = await response.json();

  // Validate response with Zod schema
  const parseResult = githubSearchResponseSchema.safeParse(rawData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid GitHub API response: ${parseResult.error.message}`,
    );
  }

  return parseResult.data.items;
}

const githubRepositoriesArraySchema = z.array(githubRepositorySchema);

export async function fetchUserRepositories(
  username: string,
): Promise<GitHubRepository[]> {
  const url = `${API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch repositories for ${username}: ${response.statusText}`,
    );
  }

  const rawData: unknown = await response.json();

  // Validate response with Zod schema (array of repositories)
  const parseResult = githubRepositoriesArraySchema.safeParse(rawData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid GitHub repositories response: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}
