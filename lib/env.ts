/**
 * Environment access with useful failures.
 *
 * `requiredEnv` is for server code: it reads `process.env[name]` dynamically,
 * which Next.js does not inline into browser bundles. Browser-visible values
 * (`NEXT_PUBLIC_*`) must be read with a literal member expression, as
 * `siteUrl` does, or the bundler cannot substitute them.
 */

const SETUP_HINT = "Copy .env.example to .env.local, fill it in, then restart `npm run dev`.";

class MissingEnvError extends Error {
  constructor(name: string) {
    super(`${name} is not set. ${SETUP_HINT}`);
    this.name = "MissingEnvError";
  }
}

/** A server-side variable that must be present; whitespace counts as missing. */
export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new MissingEnvError(name);
  return value;
}

/** Absolute origin the site is served from, without a trailing slash. */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (configured || "http://localhost:3000").replace(/\/$/, "");
}

export { MissingEnvError, SETUP_HINT };
