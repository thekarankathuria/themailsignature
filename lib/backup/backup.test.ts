// @vitest-environment node
import { existsSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createUser, findUserByEmail } from "@/lib/auth/users";
import { closeDb, db } from "@/lib/db";
import { backupDatabase, backupUploads, prune } from "./index";

let workspace = "";

beforeEach(() => {
  workspace = mkdtempSync(join(tmpdir(), "tms-backup-"));
  vi.stubEnv("DATABASE_PATH", join(workspace, "app.db"));
  vi.stubEnv("UPLOAD_DIR", join(workspace, "uploads"));
  vi.stubEnv("BACKUP_DIR", join(workspace, "backups"));
});
afterEach(() => {
  closeDb();
  vi.unstubAllEnvs();
});

describe("backing up", () => {
  it("copies a database that is in use, and the copy opens and reads", async () => {
    await createUser("owner@example.com", "a sensible passphrase");
    // Leave the connection open, the way a running site would.
    expect(db().prepare("select count(*) as n from users").get()).toEqual({ n: 1 });

    const into = join(workspace, "backups", "run");
    mkdirSync(into, { recursive: true });
    const file = backupDatabase(into);

    expect(existsSync(file)).toBe(true);
    const restored = new DatabaseSync(file, { readOnly: true });
    try {
      expect(restored.prepare("select count(*) as n from users").get()).toEqual({ n: 1 });
      // The schema came too, not just the rows.
      expect(restored.prepare("select count(*) as n from schema_migrations").get()).toEqual({ n: 2 });
    } finally {
      restored.close();
    }
  });

  it("restores into a working database", async () => {
    await createUser("owner@example.com", "a sensible passphrase");
    const into = join(workspace, "backups", "run");
    mkdirSync(into, { recursive: true });
    const file = backupDatabase(into);
    closeDb();

    // Point the app at the backup and read it through the normal code path.
    vi.stubEnv("DATABASE_PATH", file);
    expect(findUserByEmail("owner@example.com")).not.toBeNull();
  });

  it("copies the uploaded images", () => {
    const uploads = join(workspace, "uploads");
    mkdirSync(uploads, { recursive: true });
    writeFileSync(join(uploads, `${"a".repeat(32)}.png`), "not really a png");

    const into = join(workspace, "backups", "run");
    mkdirSync(into, { recursive: true });
    expect(backupUploads(into)).toBe(1);
    expect(existsSync(join(into, "uploads", `${"a".repeat(32)}.png`))).toBe(true);
  });

  it("counts no images when nobody has uploaded one yet", () => {
    const into = join(workspace, "backups", "run");
    mkdirSync(into, { recursive: true });
    expect(backupUploads(into)).toBe(0);
  });

  it("keeps the newest backups and removes the rest", () => {
    const root = join(workspace, "backups");
    for (const name of ["2026-01-01", "2026-02-01", "2026-03-01", "2026-04-01"]) {
      mkdirSync(join(root, name), { recursive: true });
    }
    const removed = prune(2);

    expect(removed).toHaveLength(2);
    expect(readdirSync(root).sort()).toEqual(["2026-03-01", "2026-04-01"]);
  });
});
