# Supabase auth — design

## Why

Auth is being added as the foundation for a future paid/pro tier. This pass
builds login/signup/session/logout only — no plan/role concept, no billing.
Once shipped, using the signature generator requires an account.

## Scope

- Email + password sign-up (with required email confirmation) and login.
- Google OAuth sign-in.
- Session management via cookies, refreshed in middleware.
- `/generator` requires an authenticated session; unauthenticated visitors
  are redirected to `/login?next=/generator`.
- Nav shows "Log in" when signed out, "Log out" when signed in.
- No `profiles` table, no plan/role field, no billing integration — deferred
  to a future piece of work.

## Non-goals

- Payment/Stripe integration.
- Password reset flow (can follow later; not required for this pass).
- Any change to how signature data is stored (still localStorage, per
  existing README — accounts don't yet own signature data).

## Architecture

Use `@supabase/supabase-js` + `@supabase/ssr` (current, non-deprecated
approach for Next.js App Router auth), backed by the existing Supabase
project (`project_ref=cjcexrdtggoluwemdxgf`, configured in `.mcp.json`).

Three integration points:

- `lib/supabase/client.ts` — browser client (`createBrowserClient`), used by
  Client Components (login/signup forms, nav auth state).
- `lib/supabase/server.ts` — server client (`createServerClient`) built from
  `next/headers` cookies, used by Server Components and Route Handlers.
- `middleware.ts` — runs on every request, refreshes the session cookie via
  the server client, and redirects unauthenticated requests to `/generator`
  (and its subpaths, if any exist later) to `/login?next=<path>`.

No custom `profiles` table. Supabase's built-in `auth.users` is sufficient
since there is no plan/role concept yet — adding one now would be
speculative.

## Routes

- `app/(auth)/layout.tsx` — minimal centered layout, imports `globals.css`
  (same CSS boundary as `app/generator/layout.tsx`, not the cloned-site
  `ces.css`).
- `app/(auth)/login/page.tsx` — email/password fields + submit, and a
  "Continue with Google" button. Links to `/signup`.
- `app/(auth)/signup/page.tsx` — email/password fields + submit. On success,
  shows a "check your email to confirm" state (no auto-login, since
  confirmation is required). Links to `/login`.
- `app/auth/callback/route.ts` — Route Handler. Exchanges the `code` query
  param for a session (covers both the Google OAuth redirect and the email
  confirmation link), then redirects to the `next` query param if present,
  else `/generator`.
- A server action for sign-out (colocated with the nav or in
  `lib/supabase/actions.ts`), clearing the session and redirecting to `/`.

## Data flow

**Email/password signup:** form submits to a client-side call to
`supabase.auth.signUp()` → Supabase sends confirmation email (link points at
`/auth/callback`) → user clicks it → callback route exchanges code for a
session → redirect to `/generator`.

**Email/password login:** client-side `supabase.auth.signInWithPassword()` →
on success, redirect to `next` or `/generator`.

**Google OAuth:** client-side `supabase.auth.signInWithOAuth({ provider:
"google" })` with `redirectTo` pointing at `/auth/callback` → Google →
Supabase → callback route exchanges code → redirect.

**Route protection:** middleware matcher covers `/generator`. On each
request it calls `supabase.auth.getUser()` (via the server client wired to
request/response cookies); no user → redirect to `/login?next=<pathname>`.

**Sign-out:** server action calls `supabase.auth.signOut()`, which clears
the auth cookies; redirect to `/`.

**Nav auth state:** `CesNav` (already a Client Component) subscribes to
`supabase.auth.onAuthStateChange` on mount to toggle the existing "Log in"
button between signed-out ("Log in", links to `/login`) and signed-in ("Log
out", triggers the sign-out action) states.

## Error handling

- Failed login/signup: show Supabase's error message inline under the form
  (e.g. "Invalid login credentials", "User already registered").
  No custom error taxonomy needed — Supabase's messages are already
  user-presentable.
- OAuth callback failure (missing/invalid code): redirect to
  `/login?error=auth_failed`, login page shows a generic "Something went
  wrong signing you in, please try again" banner.
- Middleware redirect preserves the originally-requested path via `next` so
  the user lands where they meant to go after logging in.

## Configuration

Once the Supabase MCP tools are available (project directory restart):

- Enable the **Email** provider, with **Confirm email** turned on.
- Enable the **Google** provider (requires a Google OAuth client — client
  ID/secret to be supplied when configuring).
- Site URL: `https://mailsignature.com`.
- Redirect URLs: `http://localhost:3000/auth/callback` and
  `https://mailsignature.com/auth/callback`.

Env vars (added to `.env.example`, and to `.env.local` for local dev):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Testing

Manual pass (no existing automated test covers this — `npm test` is
render-engine-only and unaffected):

1. Sign up with email/password → confirmation email arrives → clicking it
   logs in and lands on `/generator`.
2. Log in with an existing confirmed account.
3. Google OAuth round trip, new and returning user.
4. Visiting `/generator` while signed out redirects to `/login?next=/generator`;
   logging in from there lands back on `/generator`.
5. Sign out clears the session; `/generator` redirects to login again.
6. Wrong password / duplicate signup show inline errors, not a crash.

## Touched files

New:
- `lib/supabase/client.ts`, `lib/supabase/server.ts`
- `middleware.ts`
- `app/(auth)/layout.tsx`, `app/(auth)/login/page.tsx`,
  `app/(auth)/signup/page.tsx`
- `app/auth/callback/route.ts`
- sign-out server action

Changed:
- `components/ces/CesNav.tsx` — "Log in" link + signed-in/out toggle.
- `.env.example` — Supabase env vars documented.
- `app/generator/page.tsx` — metadata description currently says "no
  account needed"; update to drop that claim.
