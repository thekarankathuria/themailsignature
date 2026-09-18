# Launch Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Each task ends green on `npm test` / `tsc` / `lint` / `next build`, and one commit.

**Goal:** Everything that stands between a working application and a public one, apart from the accounts only the owner can open (Stripe, the mail domain, the host).

**Spec:** `docs/superpowers/specs/2026-09-15-themailsignature-production-design.md` §5 Phase 6 and §7.

## Global Constraints

- Nothing here may require a key the owner has not given us. Where a key is needed, the code reads it and degrades honestly without it.
- A Content-Security-Policy goes in report-only first: a policy that breaks the editor is worse than no policy.
- No cookie banner unless a non-essential cookie actually exists. Today the only cookie is the session, which is strictly necessary.
- Every user-facing string: no em dashes, no unverifiable claims (check-marketing rules).

## Tasks

1. **Custom 404 and 500** — `app/not-found.tsx` and `app/error.tsx` (plus `app/global-error.tsx` for the root shell), in the site's own design, offering the editor, the templates and help rather than a dead end. The error page must not leak a stack trace or a digest to the visitor. Check: visit a missing URL and a route that throws.

2. **Security headers and CSP** — extend `headers()` in `next.config.ts`: `Content-Security-Policy-Report-Only` with the sources the app actually uses (self, inline styles for the signature previews, `data:` and the upload origin for images), plus `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Permissions-Policy` and `Strict-Transport-Security` (production only). A `scripts/check-headers.ts` asserts each one against a running server. The report-only header stays until the owner has watched the reports.

3. **Health and monitoring** — `app/api/health/route.ts` returning the build, the database (a real query), the outbox transport and the upload directory, with a non-200 when something is wrong, so any uptime monitor can watch one URL. It must not reveal paths or versions to an anonymous caller beyond what a monitor needs.

4. **Backups** — `scripts/backup.ts` using SQLite's online backup so it is safe while the site is running, copying the upload directory alongside it, keeping the last N, and `npm run backup`. Document the restore, and rehearse it once in the test.

5. **Container and compose** — a multi-stage `Dockerfile` on the Node 24 image using Next's standalone output, a non-root user, and `docker-compose.yml` mounting a volume for `data/` and the uploads, with the environment variables the app reads. `next.config.ts` gains `output: "standalone"`. Check the image builds and the container answers on `/api/health`.

6. **Cookie policy honesty pass** — read `/legal/cookies` against what the app actually sets today (one session cookie, plus `localStorage` in the editor, which is not a cookie) and correct it. Add the consent banner only if a non-essential cookie is introduced; record that decision in the page itself.

7. **Stock headshots** — replace the generated monogram avatars for the sample people with photographs under a licence that allows commercial use, recorded in `public/samples/CREDITS.md`, and regenerate the marketing previews.

8. **Accessibility and SEO pass** — Lighthouse over the new signed-in pages and the marketing pages that changed, fix what it reports, and run the `/seo` skill over the marketing site. Finish with `check:routes`, `check:flow` and `check:headers` against a production build.
