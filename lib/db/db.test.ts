// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { closeDb, db, transaction } from "./index";
import { newId } from "./ids";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
});
afterEach(() => closeDb());

describe("database", () => {
  it("applies migrations once and records them", () => {
    const first = db();
    const tables = first
      .prepare("select name from sqlite_master where type = 'table' order by name")
      .all()
      .map((r) => (r as unknown as { name: string }).name);
    expect(tables).toEqual(
      expect.arrayContaining(["users", "sessions", "auth_tokens", "signatures", "subscriptions", "billing_events", "uploads", "schema_migrations"]),
    );
    const applied = first.prepare("select count(*) as n from schema_migrations").get() as { n: number };
    expect(applied.n).toBeGreaterThan(0);
    expect(db()).toBe(first);
  });

  it("enforces foreign keys and cascades deletes", () => {
    const conn = db();
    const now = new Date().toISOString();
    const userId = newId();
    conn.prepare("insert into users (id, email, password_hash, created_at, updated_at) values (?, ?, ?, ?, ?)").run(userId, "a@example.com", "x", now, now);
    conn.prepare("insert into signatures (id, user_id, name, data, style, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?)").run(newId(), userId, "Mine", "{}", "{}", now, now);
    expect(() =>
      conn.prepare("insert into signatures (id, user_id, name, data, style, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?)").run(newId(), "missing", "x", "{}", "{}", now, now),
    ).toThrow();
    conn.prepare("delete from users where id = ?").run(userId);
    const left = conn.prepare("select count(*) as n from signatures").get() as { n: number };
    expect(left.n).toBe(0);
  });

  it("makes emails unique regardless of case", () => {
    const conn = db();
    const now = new Date().toISOString();
    conn.prepare("insert into users (id, email, password_hash, created_at, updated_at) values (?, ?, ?, ?, ?)").run(newId(), "Case@Example.com", "x", now, now);
    expect(() =>
      conn.prepare("insert into users (id, email, password_hash, created_at, updated_at) values (?, ?, ?, ?, ?)").run(newId(), "case@example.com", "x", now, now),
    ).toThrow();
  });

  it("lets transactions nest, rolling the whole thing back", () => {
    const conn = db();
    const now = new Date().toISOString();
    const insert = (email: string) =>
      conn
        .prepare("insert into users (id, email, password_hash, created_at, updated_at) values (?, ?, ?, ?, ?)")
        .run(newId(), email, "x", now, now);

    transaction(() => {
      insert("outer@example.com");
      transaction(() => insert("inner@example.com"));
    });
    expect(conn.prepare("select count(*) as n from users").get()).toEqual({ n: 2 });

    expect(() =>
      transaction(() => {
        insert("third@example.com");
        transaction(() => insert("outer@example.com"));
      }),
    ).toThrow();
    // The inner failure rolls back the outer write too.
    expect(conn.prepare("select count(*) as n from users").get()).toEqual({ n: 2 });
  });

  it("creates 32-character hex ids", () => {
    expect(newId()).toMatch(/^[0-9a-f]{32}$/);
    expect(newId()).not.toBe(newId());
  });
});
