# Business tier: teams, company template, brand kit, click counts — design

Date: 2026-09-17
Status: approved (standing mandate: complete the project locally; all three
plans are live at launch)
Parent spec: `2026-09-15-themailsignature-production-design.md` (Phase 5)
Builds on: `2026-09-17-local-platform-design.md`

## 1. Goal

A company buys the Business plan, invites its people, and every signature in
the company looks the same where it matters. An admin sets the layout, logo,
colours and disclaimer once and locks them. Members fill in their own name,
role and contact details and install the result. When the admin changes a
locked part, every member's signature changes with it. Admins can see how
often signature links are clicked, without a tracking pixel in anyone's email.

Everything runs locally: the plan is granted by the existing test checkout,
invitations arrive in the local outbox. Stripe and hosted email connect later
behind the interfaces that already exist.

## 2. What the marketing site already promises

These sentences are live on `/teams` and `/pricing`, so the build has to match
them exactly:

- "Choose the layout, logo, colours and disclaimer once. Admins can lock any of
  them so members only fill in their own name, role and contact details."
- "Keep approved colours, fonts, the company logo and the current banner in one
  place."
- "Invite teammates by email, add or remove seats as the team changes, and
  decide who is an owner, admin or member."
- "See how often signature links and banners are clicked. Clicks are counted
  when someone follows a link; no tracking pixels are added to your emails."
- "Changes to the company template apply to every member's signature."
- Business is $4 per seat per month, $38 per seat per year, minimum 3 seats,
  and includes everything in Pro for every seat.

Claims `team-invites`, `company-template`, `brand-kit`, `click-analytics` and
`roles` move from `shipsIn: 5` to shipped when this lands.

## 3. Decisions

| Question | Decision |
|---|---|
| Orgs per user | One. A user belongs to at most one organization, so "which plan does this person have" has a single answer and the workspace needs no org switcher. |
| Who owns the subscription | The organization. `subscriptions.org_id` is set for Business; the owner manages it. Pro and Free subscriptions stay per-user, exactly as today. |
| Effective plan | `planFor(userId)` returns `business` when the user has a membership in an org whose subscription is active; otherwise it returns their own plan. A member never pays and never sees checkout. |
| Seats | `subscriptions.seats`, minimum 3. A seat is used by a membership **or** a pending invitation, so a seat cannot be double-booked by inviting ten people to three seats. Inviting past the limit fails with a message naming the number of seats. |
| Roles | `owner` (billing, seats, delete the org, everything below), `admin` (invite, remove, change roles below owner, brand kit, company template), `member` (use the template and brand kit). The last owner cannot be removed or demoted. |
| Invitations | Single-use token, SHA-256 hashed like every other token, 7-day expiry, bound to the invited email address. Accepting while signed in as a different address is refused: a forwarded invitation cannot quietly add a stranger. |
| Locking | Admins lock **groups**, not arbitrary field paths: layout, brand (colours and fonts), logo, banner, company details, disclaimer, social links. A group is a sentence an admin can understand and a rule the server can enforce. |
| How locking is enforced | Not by disabling inputs. The locked groups are merged in from the company template every time the server renders a member's signature, so the stored member record is irrelevant and no API call can bypass it. The editor disables the inputs too, but only so the UI does not lie. |
| Click counting | At export, each outbound link in an org signature is replaced with `/l/<id>`, a row that stores the real target. The route looks the target up, re-validates it, redirects, and increments a daily counter. Nothing is written into the email except an ordinary link, which is why the "no tracking pixels" claim survives. |
| What a click record holds | The link id, the day, and a count. No IP address, no user agent, no recipient, no cookie. Aggregates only, so there is nothing to leak and nothing to explain in the privacy policy beyond one paragraph. |
| Analytics opt-in | Per organization, default off, with the switch on the team page and the consequence spelled out next to it. |

## 4. Data model

New tables, in the style of the existing ones (16-byte hex ids, parameterised
SQL, `ON DELETE CASCADE` from the parent):

```
organizations(id, name, created_at, updated_at,
              analytics_enabled integer not null default 0)

memberships(id, org_id -> organizations, user_id -> users,
            role text check (role in ('owner','admin','member')),
            created_at, unique(org_id, user_id), unique(user_id))

invitations(id, org_id -> organizations, email, role, token_hash unique,
            invited_by -> users, expires_at, accepted_at, revoked_at, created_at)

org_templates(org_id primary key -> organizations, name,
              data json, style json, locked json, updated_at)

brand_kits(org_id primary key -> organizations,
           colors json, fonts json, logo_url, banner_url, updated_at)

tracked_links(id, org_id -> organizations, signature_id -> signatures,
              kind, label, url, created_at,
              unique(signature_id, kind, url))

link_clicks(link_id -> tracked_links, day text, clicks integer not null,
            primary key (link_id, day))
```

Changes to existing tables:

- `subscriptions` gains `org_id` (nullable, unique, references organizations).
  The existing per-user rows are untouched.
- `signatures` gains `org_template_id` (nullable, references organizations,
  because there is one template per org). When set, the render merges the
  locked groups in.

`unique(user_id)` on `memberships` is what enforces "one org per user" at the
database level rather than in application code.

## 5. Behaviour

### 5.1 Buying Business

`/signup?plan=business` → account → `/checkout?plan=business&seats=3`. The test
checkout asks for a company name and a seat count (minimum 3), creates the
organization, the membership with role `owner`, and a subscription row with
`org_id` and `seats`. The owner lands on `/app/team` with the invite form and
an empty company template.

### 5.2 Inviting and joining

1. An owner or admin enters an email and a role. A seat must be free.
2. `lib/mail` sends the invitation: who invited them, the company name, and a
   link to `/invite/<token>`.
3. `/invite/<token>` shows the company name and the role. Signed out, it offers
   "Create account" and "Log in", both returning to the same link. Signed in
   with the invited address, "Join <company>" creates the membership, marks the
   invitation accepted, and sends a short welcome that links to the template.
4. Signed in as a different address, the page says so and offers to sign out.
5. Expired, revoked or already-accepted tokens get their own message, never a
   stack trace, and never reveal the company name.

### 5.3 The company template

`/app/team/template` is the builder in company mode: the same editor, plus a
lock toggle beside each group. Saving writes `org_templates`. A member's
editor loads the template as the starting point, shows the locked groups as
read-only with "Locked by <company>", and lets them edit everything else.

At render time — preview, copy, download, export, every path — the server
merges the template's locked groups over the member's own values. Changing the
company logo therefore changes every member's signature the next time it is
copied, with no migration and no per-member write.

### 5.4 Brand kit

`/app/team/brand` stores approved colours, fonts, a logo and a banner. In the
editor for org members, the colour and font pickers show the brand kit first
and the logo and banner are one click away. It is a convenience, not a
control; the company template is the control.

### 5.5 Click counts

With analytics on, export replaces each outbound `http(s)` link with
`/l/<id>`. `/l/<id>` looks up the row, re-validates the stored URL through the
same allow-list the render engine uses, responds `302`, and increments
`link_clicks` for today. Requests that announce themselves as prefetches
(`Sec-Purpose: prefetch`, `Purpose: prefetch`) and `HEAD` requests redirect
without counting. `/app/team/analytics` shows clicks per link and per member
for the last 30 days, and says plainly that the numbers count link follows.

Turning analytics off stops the rewriting. Links already in sent emails keep
working — the route always redirects, whether or not it counts.

### 5.6 Leaving

- Removing a member deletes the membership. Their signatures stay theirs, lose
  the template link, and fall back to their own plan.
- An owner who deletes their account must first transfer ownership or delete
  the organization; the settings page says which.
- Deleting the organization cancels the subscription, removes memberships and
  the template, and leaves every member's signature intact on the Free plan.

## 6. Security

- Every team route and action resolves the caller's membership server-side and
  checks the role. The client never states its own role.
- Invitation tokens are hashed, single-use, expiring, and bound to an email.
- `/l/<id>` is the one route that redirects to a stored address. The address is
  written only by the export path, re-validated on the way out, and restricted
  to `http(s)`, so it cannot become an open redirect.
- Locked groups are enforced at render, not in the browser.
- A member cannot read another member's signature; admins see the team's
  signature names and click counts, not the personal contact details inside
  other people's signatures.
- Rate limits: invitations 20 per hour per org, invitation acceptance 10 per
  hour per IP.

## 7. Testing

- Unit: seat arithmetic with pending invitations, role guard, invitation
  lifecycle (accept, expire, revoke, wrong address), the locked-group merge,
  the tracked-link rewrite and its URL validation.
- Route: team endpoints return 403 for a member and 200 for an admin; `/l/<id>`
  redirects, counts once, and refuses a non-`http(s)` row; export merges locked
  groups for a member.
- Flow: extend `scripts/check-flow.ts` with a Business walk-through — buy with
  three seats, invite, accept, lock the logo, confirm the member's export
  carries the company logo, follow a tracked link, see the count.

## 8. Out of scope

Real payments (Stripe connects at go-live), SCIM or directory sync, per-member
signature approval workflows, more than one organization per user, and
analytics beyond click counts.
