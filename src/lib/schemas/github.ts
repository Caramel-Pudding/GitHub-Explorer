import { z } from "zod";

/**
 * Schema for a GitHub user from search results
 */
export const githubUserSchema = z.object({
  login: z.string(),
  avatar_url: z.url(),
  html_url: z.url(),
  id: z.number(),
  type: z.string().optional(),
});

/**
 * Schema for GitHub search users API response
 */
export const githubSearchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(githubUserSchema),
});

/**
 * Schema for a GitHub repository
 */
export const githubRepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  html_url: z.url(),
});

/**
 * Inferred TypeScript types from schemas
 */
export type GitHubUser = z.infer<typeof githubUserSchema>;
export type GitHubSearchResponse = z.infer<typeof githubSearchResponseSchema>;
export type GitHubRepository = z.infer<typeof githubRepositorySchema>;
