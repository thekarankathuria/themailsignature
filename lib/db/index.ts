import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { nowIso } from "./ids";
import { MIGRATIONS } from "./migrations";

/**
 * The application database: SQLite through Node's built-in driver.
 *
 * One connection per process, opened lazily. WAL lets reads continue while a
 * write is in progress, and foreign keys are off by default in SQLite, so they
 * are switched on for every connection. DATABASE_PATH=":memory:" gives tests a
 * throwaway database.
 */
let connection: DatabaseSync | null = null;

export function databasePath(): string {
  const configured = process.env.DATABASE_PATH?.trim();
  if (configured === ":memory:") return configured;
  return resolve(/*turbopackIgnore: true*/ configured || "data/app.db");
}

export function db(): DatabaseSync {
  if (connection) return connection;
  const path = databasePath();
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const conn = new DatabaseSync(path);
  conn.exec("pragma foreign_keys = on;");
  if (path !== ":memory:") {
    conn.exec("pragma journal_mode = wal; pragma synchronous = normal; pragma busy_timeout = 5000;");
  }
  migrate(conn);
  connection = conn;
  return conn;
}

export function closeDb(): void {
  connection?.close();
  connection = null;
}

function migrate(conn: DatabaseSync): void {
  conn.exec("create table if not exists schema_migrations (id text primary key, applied_at text not null);");
  const done = new Set(
    (conn.prepare("select id from schema_migrations").all() as Array<{ id: string }>).map((r) => r.id),
  );
  for (const migration of MIGRATIONS) {
    if (done.has(migration.id)) continue;
    conn.exec("begin");
    try {
      conn.exec(migration.sql);
      conn.prepare("insert into schema_migrations (id, applied_at) values (?, ?)").run(migration.id, nowIso());
      conn.exec("commit");
    } catch (error) {
      conn.exec("rollback");
      throw error;
    }
  }
}

/** Runs `fn` in a transaction, rolling back if it throws. */
export function transaction<T>(fn: () => T): T {
  const conn = db();
  conn.exec("begin");
  try {
    const result = fn();
    conn.exec("commit");
    return result;
  } catch (error) {
    conn.exec("rollback");
    throw error;
  }
}
