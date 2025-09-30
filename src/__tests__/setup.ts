import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Extend Vitest's expect with Jest DOM matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
