import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { RepositoryCard } from "@/components/RepositoryCard";
import type { GitHubRepository } from "@/lib/schemas/github";
import { styles } from "@/lib/styles";

const mockRepository: GitHubRepository = {
  id: 123,
  name: "test-repo",
  description: "A test repository for unit tests",
  stargazers_count: 42,
  html_url: "https://github.com/user/test-repo",
};

test("renders repository name as a heading", () => {
  render(<RepositoryCard repository={mockRepository} />);

  const heading = screen.getByRole("heading", { level: 3 });
  expect(heading).toHaveTextContent("test-repo");
  expect(heading).toHaveClass("font-semibold", "text-gray-900");
});

test("renders repository description when provided", () => {
  render(<RepositoryCard repository={mockRepository} />);

  const description = screen.getByText("A test repository for unit tests");
  expect(description).toBeInTheDocument();
  expect(description).toHaveClass("mt-1", "text-sm", "text-gray-600");
});

test("does not render description paragraph when description is null", () => {
  const repoWithNullDescription: GitHubRepository = {
    ...mockRepository,
    description: null,
  };

  render(<RepositoryCard repository={repoWithNullDescription} />);

  // Name should still be rendered
  expect(screen.getByText("test-repo")).toBeInTheDocument();

  // But no description paragraph should exist
  const paragraphs = screen.queryAllByRole("paragraph");
  expect(paragraphs).toHaveLength(0);
});

test("displays star count with icon", () => {
  render(<RepositoryCard repository={mockRepository} />);

  // Check star count is displayed
  expect(screen.getByText("42")).toBeInTheDocument();

  // Check that the star icon SVG is rendered by finding it via test id or class
  const starContainer = screen.getByText("42").parentElement;
  expect(starContainer).toBeInTheDocument();

  // Find the SVG element within the star container
  const svgElement = starContainer?.querySelector("svg");
  expect(svgElement).toBeInTheDocument();
  expect(svgElement).toHaveClass("h-4", "w-4");

  // Check the container has correct classes
  expect(starContainer).toHaveClass(
    "flex",
    "items-center",
    "gap-1",
    "text-sm",
    "font-medium",
    "text-gray-700",
  );
});

test("link has correct href and opens in new tab", () => {
  render(<RepositoryCard repository={mockRepository} />);

  const link = screen.getByRole("link");
  expect(link).toHaveAttribute("href", "https://github.com/user/test-repo");
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
});

test("applies correct styles from styles.repository.link", () => {
  render(<RepositoryCard repository={mockRepository} />);

  const link = screen.getByRole("link");
  expect(link).toHaveClass(styles.repository.link);
});

test("renders complete repository card with all elements", () => {
  render(<RepositoryCard repository={mockRepository} />);

  // Verify overall structure
  const link = screen.getByRole("link");
  expect(link).toBeInTheDocument();

  // Check flex container
  const flexContainer = link.firstElementChild;
  expect(flexContainer).toHaveClass(
    "flex",
    "items-start",
    "justify-between",
    "gap-2",
  );

  // Check content section
  const contentSection = flexContainer?.firstElementChild;
  expect(contentSection).toHaveClass("flex-1");

  // Verify all content is present
  expect(
    screen.getByRole("heading", { name: "test-repo" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("A test repository for unit tests"),
  ).toBeInTheDocument();
  expect(screen.getByText("42")).toBeInTheDocument();
});
