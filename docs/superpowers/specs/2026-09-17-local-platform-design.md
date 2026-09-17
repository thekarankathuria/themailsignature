# Local platform: accounts, saved signatures, plans — design

Date: 2026-09-17
Status: approved (user: "create it", build everything locally, go live at the end)
Parent spec: `2026-09-15-themailsignature-production-design.md` (Phases 3 and 4)

## 1. Goal

Anyone can build a signature without an account. Copying, downloading or
installing it asks them to sign in; the draft, template and editor step
survive the sign-in, the signature is saved to their account, and a free user
who used Pro features is asked to upgrade. Everything runs locally: database,
accounts, email and a simulated checkout. Hosted services (Supabase or other,
Resend, Stripe) are connected at the end behind the same interfaces.

## 2. Decisions

| Question | Decision |
|---|---|
| Database | SQLite through Node's built-in `node:sqlite` (Node 24), file at `DATABASE_PATH` (default `data/app.db`, gitignored), WAL mode, SQL migrations in `lib/db/migrations/`. Works unchanged on a single VPS; backups use SQLite's online backup. |
| Accounts | Own email + password auth: scrypt hashes, 256-bit session tokens stored as SHA-256 hashes, `tms_session` cookie (HttpOnly, SameSite=Lax, Secure in production), 30-day sliding expiry. Email verification and password reset use single-use hashed tokens (24 h / 1 h). Supabase code is removed; `lib/auth` is the only entry point, so a hosted provider can replace it later. |
| Email | `lib/mail` with two transports: `outbox` (development: writes each message to `data/outbox/` and lists them at `/dev/outbox`, which 404s in production) and `resend` (when `RESEND_API_KEY` is set). Templates are table-based HTML plus plain text, built with the signature engine's primitives. |
| Payments | `lib/billing` provider interface (`createCheckout`, `cancel`, `resume`, `changePlan`, `handleEvent`). The `local` provider simulates checkout on `/checkout` with a clearly labelled test page. Stripe is added later behind the same interface. |
| Entitlements | `lib/billing/entitlements.ts` is the single answer to "may this user use X". The editor shows it live; the server enforces it on copy/export, uploads and saved signatures. |
| Free footer link | Added by the server when it renders the copy/export HTML for a free user, so it cannot be removed client-side. |
| Headshots | Stock photos for now (license-compatible sources, recorded in `public/samples/CREDITS.md`); `check:launch` lists them until they are confirmed or replaced. |

## 3. Flow

1. `/editor` is public. The proxy no longer gates it; it gates `/app/*` only.
2. While editing, a bar above the preview lists Pro features in use
   ("Uses Pro: designer layout, animated icons") with "Switch to free options"
   (swaps to the nearest free layout and turns off Pro-only options).
3. Copy, Download, and the install steps call `requireAccount()` on the client.
   Signed out: the UI state (tab, email client, template) is written to
   `localStorage` (`tms.editor.ui`), and a dialog offers "Create free account"
   and "Log in", both linking with `next=/editor?resume=1`.
4. After sign-in, `/editor?resume=1` restores the UI state, saves the draft to
   the account (creating a signature, or updating the one in `?id=`), and
   removes `resume` from the URL. Nothing the user typed is lost.
5. Signed in: the editor autosaves (debounced 1.5 s) to the current signature.
   Copy/Download fetch server-rendered HTML from `/api/signatures/:id/export`,
   which applies entitlements. If the signature uses Pro features and the
   plan is Free, the export returns 402 and the editor shows the upgrade
   panel (upgrade, or switch to free options). The signature stays saved and
   editable.
6. `/app/signatures` lists saved signatures with previews: open, rename,
   duplicate, delete. `/app/billing` shows the plan and lets the user upgrade,
   cancel or resume. `/app/settings` changes the password, resends
   verification and deletes the account.

## 4. Data model

```
users(id, email unique, password_hash, email_verified_at, created_at, updated_at)
sessions(id, user_id, token_hash unique, expires_at, created_at, last_seen_at, user_agent)
auth_tokens(id, user_id, kind: verify|reset, token_hash unique, expires_at, used_at)
signatures(id, user_id, name, data json, style json, design_id, created_at, updated_at)
subscriptions(id, user_id unique, plan: free|pro|business, status: active|canceled|past_due,
              interval: month|year, seats, provider, provider_ref, current_period_end,
              cancel_at_period_end, created_at, updated_at)
billing_events(id, provider, provider_event_id unique, type, payload json, received_at)
uploads(user_id, name, created_at, primary key (user_id, name))
```

All ids are random 16-byte hex strings. Every query is parameterised.

## 5. Security

- Passwords: 10+ characters, checked against a small built-in list of common
  passwords; scrypt (N=2^15, r=8, p=1, 32-byte key, 16-byte salt).
- Login and reset-request responses never reveal whether an email exists.
- Rate limits (existing limiter): login 10 per 10 min per IP+email, signup 5 per
  hour per IP, reset 5 per hour per IP, export 60 per 10 min per user.
- Server actions rely on Next's Origin check; JSON routes check `Origin`
  against the site origin and require a session.
- Session rotation on login and password change; all sessions revoked on
  password reset and account deletion.
- Security headers stay; a Content-Security-Policy is added in launch
  hardening.

## 6. Testing

Unit tests for password hashing, tokens, sessions, entitlements, the free
footer, export gating, the UI-state round trip and the draft claim; route
tests for export and upload gating; a node script that walks the full flow
(signup, verify via outbox, save, export as Free with Pro features = 402,
upgrade via local checkout, export = 200).

## 7. Out of scope here

Teams and the Business admin (Phase 5), CSP, Docker and monitoring (Phase 6),
real payments and hosted email (at go-live).
