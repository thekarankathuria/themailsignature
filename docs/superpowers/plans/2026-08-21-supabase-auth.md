# Supabase Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add working Supabase authentication (email/password + Google OAuth)
to Mail Signature, gating `/generator` behind a session, as groundwork for a
future pro tier.

**Architecture:** `@supabase/ssr` clients (browser + server), a root
`proxy.ts` that refreshes the session and redirects unauthenticated visitors
away from `/generator`, Server Functions for email/password login/signup/
sign-out, and a `/auth/callback` Route Handler that exchanges the PKCE code
for both the Google OAuth redirect and the email-confirmation link.

**Tech Stack:** Next.js 16.3.1 (App Router), React 19, `@supabase/ssr` ^0.12,
`@supabase/supabase-js` ^2.112, Tailwind v4 (existing `components/ui.tsx`
primitives).

**Spec:** `docs/superpowers/specs/2026-08-21-supabase-auth-design.md`

## Global Constraints

- Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` (exported
  function name `proxy`, not `middleware`). Use `proxy.ts` at the project
  root — `middleware.ts` is deprecated in this version and must not be used.
- Use `@supabase/supabase-js` + `@supabase/ssr` — not the deprecated
  `@supabase/auth-helpers-nextjs`.
- No `profiles` table, no plan/role field, no billing integration. Auth only,
  per spec non-goals.
- Email/password signups require confirmation (`Confirm email` stays on in
  Supabase).
- Build the Google OAuth code path, but the Google provider's credentials
  are intentionally left unconfigured in Supabase for this pass — the button
  will error until credentials are added later. Do not block on this.
- Reuse the existing `components/ui.tsx` primitives (`TextInput`, `Field`,
  `Button`) for form fields — do not invent new styled input components.
- Auth pages live under `app/(auth)/` and import `globals.css` (the Tailwind
  boundary used by `app/generator/`), never `app/ces.css` (the cloned
  marketing site's stylesheet — mixing the two resets Tailwind's preflight
  into the cloned CSS, per the README).
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from
  Supabase dashboard → Settings → API). Never commit real values — only
  `.env.example` (empty) is tracked; real values go in the gitignored
  `.env.local`.
- This is an integration-heavy feature (external auth provider, cookies,
  redirects) with little pure logic to unit test. Per the spec's Testing
  section, verification per task is `npx tsc --noEmit` plus a manual check
  via `npm run dev`, not fabricated unit tests. The existing `npm test`
  (render-engine safety checks) is unrelated and must keep passing
  unmodified — run it once at the end to confirm no regression.
- Path alias `@/*` maps to the project root (see `tsconfig.json`); use it for
  all new imports, matching existing code.

---

### Task 1: Supabase client factories

**Files:**
- Modify: `package.json` (add `@supabase/ssr`, `@supabase/supabase-js`)
- Modify: `.env.example` (document the two env vars)
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

**Interfaces:**
- Produces: `createClient()` from `lib/supabase/client.ts` — browser
  Supabase client (`SupabaseClient`), for use in Client Components.
- Produces: `createClient()` (async) from `lib/supabase/server.ts` —
  `Promise<SupabaseClient>`, for use in Server Components, Route Handlers,
  and Server Functions. Reads/writes cookies via `next/headers`.

- [ ] **Step 1: Install the packages**

```bash
npm install @supabase/ssr@^0.12.4 @supabase/supabase-js@^2.112.3
```

- [ ] **Step 2: Document the env vars**

Add to `.env.example`, after the existing content:

```
# Supabase project credentials (Settings > API in the Supabase dashboard).
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 3: Write the browser client**

Create `lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 4: Write the server client**

Create `lib/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render, where cookies can't be
            // written. proxy.ts (Task 2) refreshes the session instead.
          }
        },
      },
    },
  );
}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .env.example lib/supabase/client.ts lib/supabase/server.ts
git commit -m "Add Supabase client factories"
```

---

### Task 2: Session refresh and route protection (`proxy.ts`)

**Files:**
- Create: `proxy.ts` (project root, alongside `app/`)

**Interfaces:**
- Consumes: nothing from other tasks (constructs its own `createServerClient`
  call directly — proxy files can't share request-scoped state with
  `lib/supabase/server.ts`, which is built for `next/headers`, not
  `NextRequest`).
- Produces: for any request under `/generator`, an authenticated
  `NextRequest` reaches the route, or the visitor is redirected to
  `/login?next=<original-path>`.

- [ ] **Step 1: Write `proxy.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/generator"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/generator/:path*"],
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/generator`.
Expected: redirected to `/login?next=%2Fgenerator` (the login page doesn't
exist yet — a 404 on `/login` at this point is fine, confirms the redirect
fired; Task 4 adds the page).

- [ ] **Step 4: Commit**

```bash
git add proxy.ts
git commit -m "Add proxy.ts to gate /generator behind a session"
```

---

### Task 3: Auth Server Functions

**Files:**
- Create: `lib/supabase/actions.ts`

**Interfaces:**
- Consumes: `createClient()` (async) from `lib/supabase/server.ts` (Task 1).
- Produces:
  - `login(input: { email: string; password: string; next?: string }): Promise<{ error: string } | never>` —
    redirects on success (never returns), returns `{ error }` on failure.
  - `signup(input: { email: string; password: string }): Promise<{ error: string } | { success: true }>`
  - `signOut(): Promise<never>` — always redirects to `/`.

- [ ] **Step 1: Write the actions**

Create `lib/supabase/actions.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(input: {
  email: string;
  password: string;
  next?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) return { error: error.message };

  redirect(input.next || "/generator");
}

export async function signup(input: { email: string; password: string }) {
  const supabase = await createClient();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${site}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  return { success: true as const };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/actions.ts
git commit -m "Add login/signup/sign-out Server Functions"
```

---

### Task 4: Login page

**Files:**
- Create: `app/(auth)/layout.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `components/auth/LoginForm.tsx`
- Create: `components/auth/GoogleButton.tsx`

**Interfaces:**
- Consumes: `login` from `lib/supabase/actions.ts` (Task 3); `createClient()`
  from `lib/supabase/client.ts` (Task 1); `TextInput`, `Button` from
  `components/ui.tsx`.
- Produces: `GoogleButton` component (props: `{ next?: string }`), reused by
  Task 5's signup page.

- [ ] **Step 1: Write the auth layout**

Create `app/(auth)/layout.tsx`:

```tsx
import "../globals.css";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 dark:bg-ink-950">
      <div className="w-full max-w-sm rounded-[14px] border border-ink-200 bg-white p-6 dark:border-ink-800 dark:bg-ink-900">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the Google button**

Create `components/auth/GoogleButton.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function GoogleButton({ next }: { next?: string }) {
  function handleClick() {
    const supabase = createClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (next) redirectTo.searchParams.set("next", next);

    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo.toString() },
    });
  }

  return (
    <Button type="button" variant="secondary" onClick={handleClick} className="w-full">
      Continue with Google
    </Button>
  );
}
```

- [ ] **Step 3: Write the login form**

Create `components/auth/LoginForm.tsx`:

```tsx
"use client";

import { useState, useTransition } from "react";
import { TextInput, Button } from "@/components/ui";
import { login } from "@/lib/supabase/actions";

export function LoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await login({ email, password, next });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextInput
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
      />
      <TextInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="********"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Write the login page**

Create `app/(auth)/login/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  alternates: { canonical: "/login" },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">
        Log in
      </h1>
      {error ? (
        <p className="text-sm text-red-600">
          Something went wrong signing you in, please try again.
        </p>
      ) : null}
      <GoogleButton next={next} />
      <div className="flex items-center gap-3 text-xs text-ink-400">
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
        or
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
      </div>
      <LoginForm next={next} />
      <p className="text-center text-sm text-ink-600 dark:text-ink-400">
        No account?{" "}
        <Link href="/signup" className="font-medium text-brand-600">
          Sign up
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/login`.
Expected: page renders the heading, Google button, email/password form and
the "Sign up" link, no console errors. (Submitting will fail without live
Supabase env vars — that's expected until Task 9.)

- [ ] **Step 7: Commit**

```bash
git add "app/(auth)/layout.tsx" "app/(auth)/login" components/auth/LoginForm.tsx components/auth/GoogleButton.tsx
git commit -m "Add login page"
```

---

### Task 5: Signup page

**Files:**
- Create: `app/(auth)/signup/page.tsx`
- Create: `components/auth/SignupForm.tsx`

**Interfaces:**
- Consumes: `signup` from `lib/supabase/actions.ts` (Task 3); `GoogleButton`
  from `components/auth/GoogleButton.tsx` (Task 4); `TextInput`, `Button`
  from `components/ui.tsx`.

- [ ] **Step 1: Write the signup form**

Create `components/auth/SignupForm.tsx`:

```tsx
"use client";

import { useState, useTransition } from "react";
import { TextInput, Button } from "@/components/ui";
import { signup } from "@/lib/supabase/actions";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signup({ email, password });
      if (result && "error" in result) setError(result.error);
      else setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <p className="text-sm text-ink-700 dark:text-ink-300">
        Check {email} for a confirmation link to finish creating your
        account.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextInput
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
      />
      <TextInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="At least 6 characters"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing up…" : "Sign up"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Write the signup page**

Create `app/(auth)/signup/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">
        Create your account
      </h1>
      <GoogleButton />
      <div className="flex items-center gap-3 text-xs text-ink-400">
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
        or
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
      </div>
      <SignupForm />
      <p className="text-center text-sm text-ink-600 dark:text-ink-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600">
          Log in
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/signup`.
Expected: page renders the heading, Google button, email/password form and
the "Log in" link, no console errors.

- [ ] **Step 5: Commit**

```bash
git add "app/(auth)/signup" components/auth/SignupForm.tsx
git commit -m "Add signup page"
```

---

### Task 6: Auth callback route

**Files:**
- Create: `app/auth/callback/route.ts`

**Interfaces:**
- Consumes: `createClient()` (async) from `lib/supabase/server.ts` (Task 1).
- Produces: `GET /auth/callback?code=...&next=...` — exchanges the code for
  a session, redirects to `next` (default `/generator`) on success, or to
  `/login?error=auth_failed` on failure.

- [ ] **Step 1: Write the route**

Create `app/auth/callback/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/generator";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/auth/callback` (no `code`
param).
Expected: redirected to `/login?error=auth_failed`, since there's no `code`.
Full success-path verification (real code exchange) happens in Task 9 once
live Supabase config is in place.

- [ ] **Step 4: Commit**

```bash
git add app/auth/callback/route.ts
git commit -m "Add auth callback route"
```

---

### Task 7: Nav auth state

**Files:**
- Modify: `components/ces/CesNav.tsx`

**Interfaces:**
- Consumes: `createClient()` from `lib/supabase/client.ts` (Task 1);
  `signOut` from `lib/supabase/actions.ts` (Task 3).

- [ ] **Step 1: Add auth-state tracking**

In `components/ces/CesNav.tsx`, add imports alongside the existing ones:

```tsx
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/supabase/actions";
```

Inside `export function CesNav()`, alongside the existing `useState`/`useRef`
declarations, add:

```tsx
const [authed, setAuthed] = useState(false);

useEffect(() => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
  const supabase = createClient();
  supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setAuthed(!!session?.user);
  });
  return () => subscription.unsubscribe();
}, []);
```

(The `NEXT_PUBLIC_SUPABASE_URL` guard keeps the nav from throwing while the
env vars aren't configured yet, e.g. before Task 9.)

- [ ] **Step 2: Replace the "Log in" link**

Find this block (currently around line 475):

```tsx
<a href="https://app.mailsignature.com/signin" target="_blank" className="white_cta_btn">
  <div className="button-border-b">
    <div className="button-text-wrap-b">
      <div className="text-button">
        Log in
        <br />
      </div>
    </div>
  </div>
</a>
```

Replace it with:

```tsx
{authed ? (
  <button type="button" onClick={() => signOut()} className="white_cta_btn">
    <div className="button-border-b">
      <div className="button-text-wrap-b">
        <div className="text-button">
          Log out
          <br />
        </div>
      </div>
    </div>
  </button>
) : (
  <Link href="/login" className="white_cta_btn">
    <div className="button-border-b">
      <div className="button-text-wrap-b">
        <div className="text-button">
          Log in
          <br />
        </div>
      </div>
    </div>
  </Link>
)}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/`.
Expected: nav renders normally, "Log in" button links to `/login`, no
console errors (the env-var guard means the auth-state effect no-ops until
Task 9's config is in place).

- [ ] **Step 5: Commit**

```bash
git add components/ces/CesNav.tsx
git commit -m "Wire nav Log in/Log out to Supabase session state"
```

---

### Task 8: Generator metadata + full build check

**Files:**
- Modify: `app/generator/page.tsx:6-7`

**Interfaces:**
- Consumes: nothing new.

- [ ] **Step 1: Update the metadata description**

In `app/generator/page.tsx`, change:

```tsx
  description:
    "Fill in your details, pick a template and copy a signature that works in Gmail, Outlook and Apple Mail. Free, no account needed.",
```

to:

```tsx
  description:
    "Fill in your details, pick a template and copy a signature that works in Gmail, Outlook and Apple Mail.",
```

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: builds successfully with no type or lint errors.

- [ ] **Step 3: Existing test suite**

Run: `npm test`
Expected: passes unchanged (render-engine safety checks, unrelated to auth).

- [ ] **Step 4: Commit**

```bash
git add app/generator/page.tsx
git commit -m "Drop the no-account claim from generator metadata"
```

---

### Task 9: Live Supabase config and end-to-end verification (manual)

Not a code task — do this once the Supabase MCP tools are available (session
restarted inside the project directory) or via the dashboard directly.

- [ ] **Step 1: Configure the Supabase project**
  - Enable the **Email** provider, with **Confirm email** on.
  - Set **Site URL** to `https://mailsignature.com`.
  - Add redirect URLs: `http://localhost:3000/auth/callback` and
    `https://mailsignature.com/auth/callback`.
  - Leave the **Google** provider disabled/unconfigured (per Global
    Constraints — deferred).

- [ ] **Step 2: Fill in local env vars**

Create `.env.local` (gitignored) with the real values from the Supabase
dashboard (Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://cjcexrdtggoluwemdxgf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

- [ ] **Step 3: Run the spec's manual test pass**

With `npm run dev` running, walk through
`docs/superpowers/specs/2026-08-21-supabase-auth-design.md`'s Testing
section:

1. Sign up with email/password → confirmation email arrives → clicking it
   logs in and lands on `/generator`.
2. Log in with an existing confirmed account.
3. Visiting `/generator` while signed out redirects to
   `/login?next=/generator`; logging in from there lands back on
   `/generator`.
4. Sign out clears the session; `/generator` redirects to login again.
5. Wrong password / duplicate signup show inline errors, not a crash.

(Skip the Google OAuth round trip — deferred per Global Constraints.)

- [ ] **Step 4: Record the outcome**

No commit needed unless a bug fix comes out of this pass — if it does,
follow the normal task-and-commit flow for the fix.
