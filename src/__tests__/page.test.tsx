import { render, screen, waitFor } from "@testing-library/react";
import { expect, test } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Page from "../app/page";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

test("Page renders main content", async () => {
  const queryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>,
  );

  await waitFor(() => {
    const main = screen.getByRole("main");
    expect(main).toBeDefined();
  });
});
