import { render, screen, waitFor } from "@testing-library/react";
import { expect, test } from "vitest";
import Page from "../app/page";

test("Page renders main content", async () => {
  render(Page());

  await waitFor(() => {
    const main = screen.getByRole("main");
    expect(main).toBeDefined();
  });
});
