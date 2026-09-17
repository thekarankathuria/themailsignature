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
];
