import { describe, expect, test, vi, beforeEach } from "vitest";
import { searchGitHubUsers, fetchUserRepositories } from "@/lib/api/github";
import { GITHUB_API } from "@/lib/constants";

// Mock the global fetch
global.fetch = vi.fn();

describe("GitHub API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchGitHubUsers", () => {
    test("constructs URL with correct per_page parameter", async () => {
      const mockResponse = {
        ok: true,
        statusText: "OK",
        json: vi.fn().mockResolvedValue({
          total_count: 10,
          incomplete_results: false,
          items: [],
        }),
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse,
      );

      await searchGitHubUsers("test-query");

      // Verify fetch was called with the correct URL including per_page limit
      expect(global.fetch).toHaveBeenCalledWith(
        `${GITHUB_API.BASE_URL}${GITHUB_API.ENDPOINTS.SEARCH_USERS}?q=test-query&per_page=${String(GITHUB_API.LIMITS.SEARCH)}`,
      );
    });

    test("enforces limit of 5 users in the API request", async () => {
      const mockResponse = {
        ok: true,
        statusText: "OK",
        json: vi.fn().mockResolvedValue({
          total_count: 100,
          incomplete_results: false,
          items: Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            login: `user${String(i + 1)}`,
            avatar_url: `https://avatars.githubusercontent.com/u/${String(i + 1)}`,
            html_url: `https://github.com/user${String(i + 1)}`,
          })),
        }),
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse,
      );

      const results = await searchGitHubUsers("popular");

      // Verify the URL includes per_page=5
      const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0]?.[0] as string;
      expect(calledUrl).toContain("per_page=5");

      // Verify we get back the results
      expect(results).toHaveLength(5);
    });

    test("encodes query parameters properly", async () => {
      const mockResponse = {
        ok: true,
        statusText: "OK",
        json: vi.fn().mockResolvedValue({
          total_count: 0,
          incomplete_results: false,
          items: [],
        }),
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse,
      );

      await searchGitHubUsers("test query with spaces");

      expect(global.fetch).toHaveBeenCalledWith(
        `${GITHUB_API.BASE_URL}${GITHUB_API.ENDPOINTS.SEARCH_USERS}?q=test%20query%20with%20spaces&per_page=5`,
      );
    });
  });

  describe("fetchUserRepositories", () => {
    test("constructs URL without any limit parameter", async () => {
      const mockResponse = {
        ok: true,
        statusText: "OK",
        json: vi.fn().mockResolvedValue([]),
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse,
      );

      await fetchUserRepositories("octocat");

      // Verify fetch was called without per_page parameter
      const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0]?.[0] as string;
      expect(calledUrl).toBe(
        `${GITHUB_API.BASE_URL}${GITHUB_API.ENDPOINTS.USER_REPOS}/octocat/repos?sort=updated`,
      );
      expect(calledUrl).not.toContain("per_page");
    });

    test("returns all repositories without truncation", async () => {
      const manyRepos = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `repo-${String(i + 1)}`,
        description: `Description ${String(i + 1)}`,
        stargazers_count: (i + 1) * 10,
        html_url: `https://github.com/octocat/repo-${String(i + 1)}`,
      }));

      const mockResponse = {
        ok: true,
        statusText: "OK",
        json: vi.fn().mockResolvedValue(manyRepos),
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse,
      );

      const results = await fetchUserRepositories("octocat");

      // Verify all 30 repositories are returned
      expect(results).toHaveLength(30);
      expect(results[0]?.name).toBe("repo-1");
      expect(results[29]?.name).toBe("repo-30");
    });

    test("encodes username properly", async () => {
      const mockResponse = {
        ok: true,
        statusText: "OK",
        json: vi.fn().mockResolvedValue([]),
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse,
      );

      await fetchUserRepositories("user-with-dashes");

      expect(global.fetch).toHaveBeenCalledWith(
        `${GITHUB_API.BASE_URL}${GITHUB_API.ENDPOINTS.USER_REPOS}/user-with-dashes/repos?sort=updated`,
      );
    });
  });
});
