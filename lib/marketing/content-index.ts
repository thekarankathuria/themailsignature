/**
 * Every module whose copy may cite claims. Pages add their module here when
 * they are built, so the guard scripts see all of them.
 */
import * as faqs from "./faqs";
import * as home from "./home";
import * as industries from "./industries";
import * as pages from "./pages";
import * as teams from "./teams";

export const CONTENT_MODULES: Record<string, unknown> = { faqs, home, industries, pages, teams };
