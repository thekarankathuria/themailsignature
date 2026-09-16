/**
 * Every module whose copy may cite claims. Pages add their module here when
 * they are built, so the guard scripts see all of them.
 */
import * as pages from "./pages";

export const CONTENT_MODULES: Record<string, unknown> = { pages };
