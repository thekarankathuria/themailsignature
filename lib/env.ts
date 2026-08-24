/**
 * Runtime-validated access to the environment variables this app cannot run
 * without.
 *
 * The call sites used to read `process.env.NEXT_PUBLIC_SUPABASE_URL!`. The `!`
 * is a *type-level* assertion with no runtime effect, so a missing value sailed
 * through into `createServerClient()` and surfaced as a Supabase stack trace
 * from inside proxy.ts — which, because middleware runs before routing, took
 * out every matched route with a blank 500 rather than a diagnosable error.
 *
 * Each variable is spelled out as a literal member expression on purpose:
 * Next.js inlines `NEXT_PUBLIC_*` into the browser bundle by textual
 * substitution, and only for static member access. A dynamic
 * `process.env[name]` lookup is left untouched by the bundler and reads as
 * undefined on the client, so a generic getter would work server-side and fail
 * silently in the browser. Only the validation is shared.
 */

const SETUP_HINT =
  "Copy .env.example to .env.local and fill it in " +
  "(Supabase dashboard -> Project Settings -> API Keys), then restart `npm run dev`.";

class MissingEnvError extends Error {
  constructor(name: string) {
    super(`${name} is not set. ${SETUP_HINT}`);
    this.name = "MissingEnvError";
  }
}

function required(value: string | undefined, name: string): string {
  const trimmed = value?.trim();
  if (!trimmed) throw new MissingEnvError(name);
  return trimmed;
}

export function supabaseUrl(): string {
  return required(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
}

export function supabaseAnonKey(): string {
  return required(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

/**
 * True when both Supabase values are present. Lets a caller branch on
 * configuration without paying for a thrown error.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

/** Absolute origin the site is served from, without a trailing slash. */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (configured || "http://localhost:3000").replace(/\/$/, "");
}

export { MissingEnvError, SETUP_HINT };
