import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserDropdown } from "@/components/UserDropdown";
import * as githubApi from "@/lib/api/github";
import type { GitHubUser } from "@/lib/schemas/github";

// Mock the GitHub API
vi.mock("@/lib/api/github", () => ({
  fetchUserRepositories: vi.fn(),
}));

const mockFetchUserRepositories = vi.mocked(githubApi.fetchUserRepositories);

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

const mockUser: GitHubUser = {
  id: 1,
  login: "octocat",
  avatar_url: "https://github.com/images/error/octocat_happy.gif",
  html_url: "https://github.com/octocat",
};

test("renders collapsed state with username and toggle button", () => {
  const onToggle = vi.fn();

  renderWithQueryClient(
    <UserDropdown user={mockUser} isExpanded={false} onToggle={onToggle} />,
  );

  const button = screen.getByRole("button", { name: /octocat/i });
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute("aria-expanded", "false");

  // Repositories section should not be visible when collapsed
  expect(
    screen.queryByRole("region", { name: /repositories for octocat/i }),
  ).not.toBeInTheDocument();
});

test("toggle button click triggers onToggle callback", async () => {
  const user = userEvent.setup();
  const onToggle = vi.fn();

  renderWithQueryClient(
    <UserDropdown user={mockUser} isExpanded={false} onToggle={onToggle} />,
  );

  const button = screen.getByRole("button", { name: /octocat/i });
  await user.click(button);

  expect(onToggle).toHaveBeenCalledTimes(1);
});

test("shows loading state when expanded and data is loading", () => {
  const onToggle = vi.fn();
  mockFetchUserRepositories.mockImplementation(
    () =>
      new Promise(() => {
        /* never resolves */
      }),
  );

  renderWithQueryClient(
    <UserDropdown user={mockUser} isExpanded={true} onToggle={onToggle} />,
  );

  expect(
    screen.getByRole("region", { name: /repositories for octocat/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/loading repositories/i)).toBeInTheDocument();
});

test("shows 'No repositories found' when expanded with empty data", async () => {
  const onToggle = vi.fn();
  mockFetchUserRepositories.mockResolvedValue([]);

  renderWithQueryClient(
    <UserDropdown user={mockUser} isExpanded={true} onToggle={onToggle} />,
  );

  expect(await screen.findByText(/no repositories found/i)).toBeInTheDocument();
});

test("renders repository list when expanded with data", async () => {
  const onToggle = vi.fn();
  mockFetchUserRepositories.mockResolvedValue([
    {
      id: 101,
      name: "hello-world",
      description: "My first repository",
      stargazers_count: 42,
      html_url: "https://github.com/octocat/hello-world",
    },
    {
      id: 102,
      name: "awesome-project",
      description: null,
      stargazers_count: 128,
      html_url: "https://github.com/octocat/awesome-project",
    },
  ]);

  renderWithQueryClient(
    <UserDropdown user={mockUser} isExpanded={true} onToggle={onToggle} />,
  );

  // Wait for repositories to load
  expect(await screen.findByText("hello-world")).toBeInTheDocument();
  expect(screen.getByText("My first repository")).toBeInTheDocument();
  expect(screen.getByText("42")).toBeInTheDocument();

  expect(screen.getByText("awesome-project")).toBeInTheDocument();
  // Second repo has null description, so it shouldn't be rendered
  expect(screen.queryByText("null")).not.toBeInTheDocument();
  expect(screen.getByText("128")).toBeInTheDocument();

  // Check links
  const links = screen.getAllByRole("link");
  expect(links).toHaveLength(2);
  expect(links[0]).toHaveAttribute(
    "href",
    "https://github.com/octocat/hello-world",
  );
  expect(links[1]).toHaveAttribute(
    "href",
    "https://github.com/octocat/awesome-project",
  );
});

test("has correct aria attributes for accessibility", () => {
  const onToggle = vi.fn();

  renderWithQueryClient(
    <UserDropdown user={mockUser} isExpanded={true} onToggle={onToggle} />,
  );

  const button = screen.getByRole("button", { name: /octocat/i });
  expect(button).toHaveAttribute("aria-expanded", "true");
  expect(button).toHaveAttribute("aria-controls", "repos-1");

  const region = screen.getByRole("region", {
    name: /repositories for octocat/i,
  });
  expect(region).toHaveAttribute("id", "repos-1");
});

test("shows error message when repository fetch fails", async () => {
  const onToggle = vi.fn();
  mockFetchUserRepositories.mockRejectedValue(
    new Error("Failed to fetch repositories for octocat: Forbidden"),
  );

  renderWithQueryClient(
    <UserDropdown user={mockUser} isExpanded={true} onToggle={onToggle} />,
  );

  // Wait for error message to appear
  expect(
    await screen.findByText(/failed to load repositories/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/forbidden/i)).toBeInTheDocument();

  // Verify no empty state or repository list shown
  expect(screen.queryByText(/no repositories found/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
