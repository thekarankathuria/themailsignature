# Business Tier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Each task is TDD: failing test, implementation, green `npm test` / `tsc` / `lint` / `next build`, one commit.

**Goal:** Ship the Business plan: organizations, invitations, roles, seats, a shared brand kit, an admin-locked company template that applies to every member's signature, and click counts without tracking pixels.

**Spec:** `docs/superpowers/specs/2026-09-17-business-tier-design.md`

**Stack notes:** Same as the local platform — Node 24 `node:sqlite`, Next 16 (async `cookies()`, `params`, `searchParams`), server actions for forms, JSON route handlers for anything the editor calls. Reuse `lib/auth/tokens.ts` for invitations rather than inventing a second token scheme.

## Global Constraints

- One organization per user, enforced by `unique(user_id)` on `memberships`.
- Roles are resolved server-side on every team route and action. The client never states its own role.
- Locked groups are merged in at render; never rely on a disabled input.
- `/l/<id>` redirects only to a stored `http(s)` URL, re-validated on the way out.
- Click records hold a link id, a day and a count. No IP, user agent, recipient or cookie.
- Every user-facing string: no em dashes, no unverifiable claims (check-marketing rules).
- All SQL parameterised; ids from `randomBytes(16).toString("hex")`.

## Tasks

1. **Schema and team data layer** — `lib/db/migrations/002_teams.sql` (the seven tables and the two column additions from spec §4), `lib/teams/store.ts` (`createOrg`, `findOrgForUser`, `membersOf`, `roleOf`, `setRole`, `removeMember`, `renameOrg`, `setAnalyticsEnabled`, `deleteOrg`), `lib/teams/seats.ts` (`seatUsage(orgId)` counting memberships plus live invitations, `seatsAvailable`). Tests against `DATABASE_PATH=:memory:`: migration is idempotent, cascades delete memberships and invitations, a user cannot join two orgs, seat usage counts pending invitations and ignores revoked and expired ones.

2. **Plan resolution through membership** — extend `lib/billing/plans.ts` so `planFor(userId)` returns `business` when the user has a membership in an org with an active subscription, and `subscriptionFor` reports the org subscription for members. `lib/billing/entitlements.ts`: business gets every Pro feature. Tests: member of an active org is business, member of a canceled org falls back to their own plan, a personal Pro subscription still wins over no membership.

3. **Roles guard** — `lib/teams/guard.ts`: `requireMembership(userId)`, `requireRole(userId, roles)` returning `{ org, membership }` or a typed refusal; `canManageMembers`, `canManageBilling`, `canEditTemplate`. The last-owner rule lives here (`assertNotLastOwner`). Tests for every role against every capability, and for the last-owner refusal on both remove and demote.

4. **Invitations** — `lib/teams/invitations.ts` (`invite`, `listInvitations`, `revoke`, `peekInvitation`, `acceptInvitation`) on `lib/auth/tokens.ts`; `lib/mail/templates.ts` gains `teamInvite` and `joinedTeam`. Rate limits from spec §6. Tests: accept creates the membership once, a second accept fails, expiry and revocation fail with their own reasons, accepting as the wrong address fails, inviting with no free seat fails naming the seat count.

5. **Buying Business** — `/checkout?plan=business` asks for a company name and seats (minimum 3) and calls `lib/billing/local.ts` `grantBusiness(userId, { name, seats })`, which creates the org, the owner membership and the subscription in one transaction. `/app/billing` for an owner shows seats, price per seat and a seat control; for a member it shows the plan and who to ask. Tests: checkout creates all three rows, seats below the minimum are refused, a member cannot change billing.

6. **Team workspace** — `/app/team` (members, roles, remove, invite form, seat usage, pending invitations, analytics switch), `/invite/[token]` (accept, sign in, wrong address, expired), `components/app/TeamMembers.tsx`, `InviteForm.tsx`, `InviteAccept.tsx`. Server actions in `lib/teams/actions.ts`, each one behind `requireRole`. Workspace nav shows Team only for org members. Component tests for the member list and the invite form; route tests for the actions' refusals.

7. **Brand kit** — `lib/teams/brand.ts` (`readBrandKit`, `writeBrandKit`), `/app/team/brand`, and editor wiring so colour and font pickers offer the kit first and the logo and banner are one click away. Uploads go through the existing Pro-gated upload route. Tests: round trip, colours validated as hex, member cannot write.

8. **Company template and locked groups** — `lib/teams/template.ts` (`readTemplate`, `writeTemplate`), `lib/teams/locks.ts` (`LOCK_GROUPS` with the seven groups from the spec and the fields each covers, `applyLocks(member, template, locked)`), `/app/team/template` (the builder in company mode with a lock toggle per group). `applyLocks` runs in `app/api/signatures/[id]/export/route.ts` and in the editor preview path. Tests: each group replaces exactly its own fields and nothing else, an unlocked group leaves the member's value alone, a member's API write cannot change a locked value in the rendered output, and changing the template changes the member's export with no write to their row.

9. **Click counts** — `lib/teams/links.ts` (`trackLinks(html, { orgId, signatureId })` rewriting outbound links to `/l/<id>`, reusing the engine's URL validation; `recordClick`, `clicksFor`), `app/l/[id]/route.ts` (302, count once, skip prefetch and HEAD), `/app/team/analytics` (30 days, per link and per member). Rewriting happens only when the org has analytics on. Tests: a rewritten link resolves to the original target, a non-http row is refused, prefetch and HEAD do not count, counts group by day, and analytics off leaves the HTML untouched.

10. **Claims, copy and the flow check** — move `team-invites`, `company-template`, `brand-kit`, `click-analytics` and `roles` to shipped (`SHIPPED_THROUGH_PHASE = 5` once Phase 4 is real, or per-claim `shipsIn` if billing is still open), add the privacy paragraph about click counts to `/legal/privacy`, extend `scripts/check-flow.ts` with the Business walk-through from spec §7, and update `README.md`. Full verification: `npm test && npx tsc --noEmit && npm run lint && npx next build`, then `check:routes` and `check:flow` against a running server.
