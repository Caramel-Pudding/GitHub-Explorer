import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Search } from "@/components/Search";
import * as githubApi from "@/lib/api/github";

// Mock the GitHub API
vi.mock("@/lib/api/github", () => ({
  searchGitHubUsers: vi.fn(),
}));

const mockSearchGitHubUsers = vi.mocked(githubApi.searchGitHubUsers);

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

test("renders search input and button", () => {
  renderWithQueryClient(<Search />);

  expect(screen.getByLabelText(/search github users/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
});

test("user can type in search input", async () => {
  const user = userEvent.setup();
  renderWithQueryClient(<Search />);

  const input = screen.getByLabelText(/search github users/i);

  await user.type(input, "octocat");

  expect(input).toHaveValue("octocat");
});

test("form submission triggers search query", async () => {
  const user = userEvent.setup();
  mockSearchGitHubUsers.mockResolvedValue([
    {
      id: 1,
      login: "octocat",
      avatar_url: "https://github.com/images/error/octocat_happy.gif",
      html_url: "https://github.com/octocat",
    },
  ]);

  renderWithQueryClient(<Search />);

  const input = screen.getByLabelText(/search github users/i);
  const button = screen.getByRole("button", { name: /search/i });

  await user.type(input, "octocat");
  await user.click(button);

  await waitFor(() => {
    expect(mockSearchGitHubUsers).toHaveBeenCalledWith("octocat");
  });
});

test("button is disabled while fetching", async () => {
  const user = userEvent.setup();
  mockSearchGitHubUsers.mockImplementation(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              login: "octocat",
              avatar_url: "https://github.com/images/error/octocat_happy.gif",
              html_url: "https://github.com/octocat",
            },
          ]);
        }, 100);
      }),
  );

  renderWithQueryClient(<Search />);

  const input = screen.getByLabelText(/search github users/i);
  const button = screen.getByRole("button", { name: /search/i });

  expect(button).not.toBeDisabled();

  await user.type(input, "octocat");
  await user.click(button);

  // Button should be disabled while fetching
  await waitFor(() => {
    expect(button).toBeDisabled();
  });

  // Button should be enabled after fetching
  await waitFor(() => {
    expect(button).not.toBeDisabled();
  });
});

test("shows error message when search fails", async () => {
  const user = userEvent.setup();
  mockSearchGitHubUsers.mockRejectedValue(
    new Error("GitHub API error: Forbidden"),
  );

  renderWithQueryClient(<Search />);

  const input = screen.getByLabelText(/search github users/i);
  const button = screen.getByRole("button", { name: /search/i });

  await user.type(input, "octocat");
  await user.click(button);

  // Wait for error message to appear
  expect(
    await screen.findByText(/failed to search users/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/github api error: forbidden/i)).toBeInTheDocument();

  // Verify no empty state or results shown
  expect(screen.queryByText(/no users found/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/showing users for/i)).not.toBeInTheDocument();
});

test("shows empty state when no users found", async () => {
  const user = userEvent.setup();
  mockSearchGitHubUsers.mockResolvedValue([]);

  renderWithQueryClient(<Search />);

  const input = screen.getByLabelText(/search github users/i);
  const button = screen.getByRole("button", { name: /search/i });

  await user.type(input, "nonexistentuser12345");
  await user.click(button);

  // Wait for empty state message
  expect(
    await screen.findByText(/no users found for "nonexistentuser12345"/i),
  ).toBeInTheDocument();

  // Verify no error state shown
  expect(screen.queryByText(/failed to search users/i)).not.toBeInTheDocument();
});

test("displays user results when search succeeds", async () => {
  const user = userEvent.setup();
  mockSearchGitHubUsers.mockResolvedValue([
    {
      id: 1,
      login: "octocat",
      avatar_url: "https://github.com/images/error/octocat_happy.gif",
      html_url: "https://github.com/octocat",
    },
    {
      id: 2,
      login: "torvalds",
      avatar_url: "https://github.com/images/error/torvalds.gif",
      html_url: "https://github.com/torvalds",
    },
  ]);

  renderWithQueryClient(<Search />);

  const input = screen.getByLabelText(/search github users/i);
  const button = screen.getByRole("button", { name: /search/i });

  await user.type(input, "test");
  await user.click(button);

  // Wait for results header
  expect(
    await screen.findByText(/showing users for "test"/i),
  ).toBeInTheDocument();

  // Verify user buttons are rendered
  expect(screen.getByRole("button", { name: /octocat/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /torvalds/i })).toBeInTheDocument();

  // Verify no error or empty state
  expect(screen.queryByText(/failed to search users/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/no users found/i)).not.toBeInTheDocument();
});
