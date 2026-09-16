import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// The vitest config does not set `test.globals: true`, so Testing Library's
// own auto-cleanup (which detects a global `afterEach`) never registers.
// Without this, each test's rendered tree stays mounted into the next test's
// DOM, and multiple <img alt="TheMailSignature"> elements pile up across
// tests in this same file — confirmed by running the suite without this
// block first: two of three tests failed with "Found multiple elements".
afterEach(() => cleanup());
