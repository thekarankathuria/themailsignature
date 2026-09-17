# Local Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Each task is TDD: failing test, implementation, green `npm test` / `tsc` / `lint` / `next build`, one commit.

**Goal:** Replace Supabase with a local database, accounts and email; open the editor; gate copying behind sign-in with the draft preserved; save signatures to accounts; add plans, entitlements and a simulated checkout.

**Spec:** `docs/superpowers/specs/2026-09-17-local-platform-design.md`

**Stack notes:** Node 24 `node:sqlite` (`DatabaseSync`), Next 16 (async `cookies()`, `params`, `searchParams`), server actions for forms, JSON route handlers for the editor. Keep `lib/signature/**` behaviour unchanged except where a task says so.

## Global Constraints

- No Supabase imports remain (`grep -r supabase app components lib proxy.ts` returns only docs/comments explaining history).
- All SQL parameterised; ids from `randomBytes(16).toString("hex")`.
- Tokens and session secrets are only ever stored hashed (SHA-256).
- Every user-facing string: no em dashes, no unverifiable claims (check-marketing rules).
- `data/` is gitignored.

## Tasks

1. **Database layer** — `lib/db/index.ts` (`db()` singleton, WAL, foreign keys on, `migrate()`), `lib/db/migrations/001_init.sql` (tables from the spec), `lib/db/ids.ts`. Test with an in-memory database (`DATABASE_PATH=:memory:`): migrations apply once, are idempotent, foreign keys cascade.
2. **Passwords, tokens, sessions** — `lib/auth/password.ts` (`hashPassword`, `verifyPassword`, `passwordProblem`), `lib/auth/tokens.ts` (`newToken`, `hashToken`), `lib/auth/sessions.ts` (`createSession`, `readSession`, `revokeSession`, `revokeAllSessions`), `lib/auth/users.ts` (`createUser`, `findUserByEmail`, `findUserById`, `setPassword`, `markVerified`, `deleteUser`), `lib/auth/current.ts` (`currentUser()` reading the cookie via `next/headers`). Unit tests for each.
3. **Mail** — `lib/mail/index.ts` (`sendMail({ to, subject, html, text })`, transports `outbox`/`resend`), `lib/mail/layout.ts` (branded table email shell), `lib/mail/templates.ts` (`verifyEmail`, `welcome`, `resetPassword`, `passwordChanged`, `accountDeleted`, `subscriptionStarted`, `subscriptionCanceled`), `app/dev/outbox` pages (404 in production). Tests: outbox writes, templates escape input and include plain text.
4. **Auth flows** — server actions in `lib/auth/actions.ts`: `signup`, `login`, `logout`, `requestPasswordReset`, `resetPassword`, `resendVerification`, `changePassword`, `deleteAccount`; routes `app/auth/verify/route.ts`; pages `(auth)/login`, `(auth)/signup`, `(auth)/forgot-password`, `(auth)/reset-password`; rewrite `LoginForm`/`SignupForm`, remove Google button, remove `lib/supabase`, `app/auth/callback`, Supabase env and packages. `proxy.ts` gates `/app/*` by cookie presence (full check happens in the layout). `npm run seed` creates the test accounts (`thekarankathuria@gmail.com` as Pro, `free@themailsignature.test` as Free) and writes their passwords to `.env.local`. Tests: action behaviour against an in-memory DB, rate limiting, safeNext on every redirect.
5. **Uploads on the local stack** — upload route uses `currentUser()`, requires the Pro entitlement, records `uploads` rows; storage keeps the disk driver only (Supabase driver removed). Tests: 401 signed out, 403 on Free, 200 on Pro.
6. **Entitlements and plans** — `lib/billing/plans.ts` (`planFor(userId)`), `lib/billing/entitlements.ts` (`proFeatures(data, style)`, `canExport(plan, features)`, `freeFooter`), `lib/billing/local.ts` provider + `lib/billing/index.ts`. Tests for every Pro feature and the footer.
7. **Signatures API** — `app/api/signatures/route.ts` (POST create), `app/api/signatures/[id]/route.ts` (GET, PATCH, DELETE), `app/api/signatures/[id]/export/route.ts` (GET html/plain/document; 402 with the feature list when not entitled; footer for Free). Origin check + session + ownership. Tests for each status code.
8. **Editor flow** — public editor; `ProBar` (features in use, switch to free options), `AccountGate` dialog, UI-state persistence (`tms.editor.ui`), resume-and-claim on `?resume=1`, autosave with status indicator, export via API, `UpgradePanel` on 402, `?id=` opens a saved signature. Component tests for the gate, the Pro bar and the upgrade panel; unit tests for UI-state and `nearestFreeLayout`.
9. **Workspace** — `app/app/layout.tsx` (sidebar: Signatures, Billing, Settings; header with account menu), `/app/signatures` (list, open, rename, duplicate, delete), `/app/billing` (plan, upgrade, cancel, resume), `/app/settings` (password, verification, delete account), `/checkout` (local test checkout). Site header shows "Log in" or "My signatures".
10. **End-to-end check** — `scripts/check-flow.ts` walks the whole flow over HTTP against a running server; README, `.env.example`, claims (`SHIPPED_THROUGH_PHASE = 3`), memory.
