export const GITHUB_API = {
  BASE_URL: "https://api.github.com",
  ENDPOINTS: {
    SEARCH_USERS: "/search/users",
    USER_REPOS: "/users",
  },
  LIMITS: {
    SEARCH: 5,
    REPOSITORIES: 10,
  },
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;

export const UI_TEXT = {
  PLACEHOLDERS: {
    SEARCH: "Enter username...",
  },
  LABELS: {
    SEARCH: "Search GitHub users",
    SEARCH_BUTTON: "Search",
  },
  MESSAGES: {
    LOADING_REPOS: "Loading repositories...",
    NO_USERS: (query: string) => `No users found for "${query}"`,
    NO_REPOS: "No repositories found",
    SHOWING_RESULTS: (query: string) => `Showing users for "${query}"`,
  },
  ERRORS: {
    SEARCH_FAILED: "Failed to search users:",
    REPOS_FAILED: "Failed to load repositories:",
  },
} as const;
