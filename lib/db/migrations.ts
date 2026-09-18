/**
 * Schema migrations, applied in order and recorded in schema_migrations.
 * Never edit a released migration; add a new one.
 */
export const MIGRATIONS: Array<{ id: string; sql: string }> = [
  {
    id: "001_init",
    sql: `
      create table users (
        id text primary key,
        email text not null collate nocase unique,
        password_hash text not null,
        email_verified_at text,
        created_at text not null,
        updated_at text not null
      );

      create table sessions (
        id text primary key,
        user_id text not null references users(id) on delete cascade,
        token_hash text not null unique,
        expires_at text not null,
        created_at text not null,
        last_seen_at text not null,
        user_agent text
      );
      create index sessions_user on sessions(user_id);

      create table auth_tokens (
        id text primary key,
        user_id text not null references users(id) on delete cascade,
        kind text not null check (kind in ('verify', 'reset')),
        token_hash text not null unique,
        expires_at text not null,
        used_at text
      );
      create index auth_tokens_user on auth_tokens(user_id, kind);

      create table signatures (
        id text primary key,
        user_id text not null references users(id) on delete cascade,
        name text not null,
        data text not null,
        style text not null,
        design_id text,
        created_at text not null,
        updated_at text not null
      );
      create index signatures_user on signatures(user_id, updated_at);

      create table subscriptions (
        id text primary key,
        user_id text not null unique references users(id) on delete cascade,
        plan text not null check (plan in ('free', 'pro', 'business')),
        status text not null check (status in ('active', 'canceled', 'past_due')),
        interval text not null check (interval in ('month', 'year')),
        seats integer not null default 1,
        provider text not null,
        provider_ref text,
        current_period_end text,
        cancel_at_period_end integer not null default 0,
        created_at text not null,
        updated_at text not null
      );

      create table billing_events (
        id text primary key,
        provider text not null,
        provider_event_id text not null,
        type text not null,
        payload text not null,
        received_at text not null,
        unique (provider, provider_event_id)
      );

      create table uploads (
        user_id text not null references users(id) on delete cascade,
        name text not null,
        created_at text not null,
        primary key (user_id, name)
      );
    `,
  },
  {
    id: "002_teams",
    sql: `
      create table organizations (
        id text primary key,
        name text not null,
        analytics_enabled integer not null default 0,
        created_at text not null,
        updated_at text not null
      );

      -- unique(user_id) is the rule "one organization per person", kept here
      -- rather than in application code so two concurrent invitation accepts
      -- cannot leave someone in two organizations on two plans.
      create table memberships (
        id text primary key,
        org_id text not null references organizations(id) on delete cascade,
        user_id text not null unique references users(id) on delete cascade,
        role text not null check (role in ('owner', 'admin', 'member')),
        created_at text not null
      );
      create index memberships_org on memberships(org_id);

      create table invitations (
        id text primary key,
        org_id text not null references organizations(id) on delete cascade,
        email text not null collate nocase,
        role text not null check (role in ('admin', 'member')),
        token_hash text not null unique,
        invited_by text references users(id) on delete set null,
        expires_at text not null,
        accepted_at text,
        revoked_at text,
        created_at text not null
      );
      create index invitations_org on invitations(org_id, email);

      create table org_templates (
        org_id text primary key references organizations(id) on delete cascade,
        name text not null,
        data text not null,
        style text not null,
        locked text not null,
        updated_at text not null
      );

      create table brand_kits (
        org_id text primary key references organizations(id) on delete cascade,
        colors text not null,
        fonts text not null,
        logo_url text,
        banner_url text,
        updated_at text not null
      );

      create table tracked_links (
        id text primary key,
        org_id text not null references organizations(id) on delete cascade,
        signature_id text not null references signatures(id) on delete cascade,
        kind text not null,
        label text,
        url text not null,
        created_at text not null,
        unique (signature_id, kind, url)
      );
      create index tracked_links_org on tracked_links(org_id);

      -- A click record is a link, a day and a count: no address, no user
      -- agent, no recipient, nothing that identifies a reader.
      create table link_clicks (
        link_id text not null references tracked_links(id) on delete cascade,
        day text not null,
        clicks integer not null default 0,
        primary key (link_id, day)
      );

      alter table subscriptions add column org_id text references organizations(id) on delete cascade;
      create unique index subscriptions_org on subscriptions(org_id);

      alter table signatures add column org_template_id text references organizations(id) on delete set null;
    `,
  },
];
