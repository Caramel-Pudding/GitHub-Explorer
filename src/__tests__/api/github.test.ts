import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { searchGitHubUsers, fetchUserRepositories } from "@/lib/api/github";
import { GITHUB_API } from "@/lib/constants";

// Mock the global fetch
global.fetch = vi.fn();

describe("GitHub API", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original env after each test
    process.env = originalEnv;
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
      const [url] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0] as [string, RequestInit];
      expect(url).toBe(
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

      const [url] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0] as [string, RequestInit];
      expect(url).toBe(
        `${GITHUB_API.BASE_URL}${GITHUB_API.ENDPOINTS.SEARCH_USERS}?q=test%20query%20with%20spaces&per_page=5`,
      );
    });
  });

  describe("Authentication", () => {
    test("includes Authorization header when GITHUB_TOKEN is set", async () => {
      process.env["NEXT_PUBLIC_GITHUB_TOKEN"] = "test-token-123";

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

      await searchGitHubUsers("test");

      // Verify fetch was called with Authorization header
      const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0] as [string, RequestInit];
      expect(options.headers).toMatchObject({
        Accept: "application/vnd.github.v3+json",
        Authorization: "Bearer test-token-123",
      });
    });

    test("does not include Authorization header when GITHUB_TOKEN is not set", async () => {
      delete process.env["NEXT_PUBLIC_GITHUB_TOKEN"];

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

      await searchGitHubUsers("test");

      // Verify fetch was called without Authorization header
      const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0] as [string, RequestInit];
      expect(options.headers).toMatchObject({
        Accept: "application/vnd.github.v3+json",
      });
      expect(options.headers).not.toHaveProperty("Authorization");
    });

    test("works correctly for repository fetch with auth token", async () => {
      process.env["NEXT_PUBLIC_GITHUB_TOKEN"] = "repo-test-token";

      const mockResponse = {
        ok: true,
        statusText: "OK",
        json: vi.fn().mockResolvedValue([]),
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse,
      );

      await fetchUserRepositories("octocat");

      // Verify fetch was called with Authorization header
      const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0] as [string, RequestInit];
      expect(options.headers).toMatchObject({
        Accept: "application/vnd.github.v3+json",
        Authorization: "Bearer repo-test-token",
      });
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

      const [url] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0] as [string, RequestInit];
      expect(url).toBe(
        `${GITHUB_API.BASE_URL}${GITHUB_API.ENDPOINTS.USER_REPOS}/user-with-dashes/repos?sort=updated`,
      );
    });
  });
});
