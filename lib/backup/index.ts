/**
 * Backing up the database and the uploaded images.
 *
 * The database is copied with SQLite's own online copy, so it is safe to run
 * against a live site: a plain file copy of a database being written to can
 * produce a file that will not open. Uploads are copied alongside it, because
 * a signature whose images are gone is not a restored signature.
 *
 * `scripts/backup.ts` is the command; this is the part worth testing.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { databasePath } from "@/lib/db";
import { uploadDir } from "@/lib/storage/upload-dir";

export const KEEP_DEFAULT = 14;

function keepCount(): number {
  return Number(process.env.BACKUP_KEEP ?? KEEP_DEFAULT);
}

export function backupRoot(): string {
  return resolve(process.env.BACKUP_DIR?.trim() || "backups");
}

/** One folder per run, named so they sort in the order they were taken. */
export function stampedDir(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dir = join(backupRoot(), stamp);
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function backupDatabase(into: string): string {
  const source = databasePath();
  if (source === ":memory:") throw new Error("There is no database file to back up.");
  if (!existsSync(source)) throw new Error(`No database at ${source}. Has the site ever run?`);

  const target = join(into, "database.sqlite");
  // VACUUM INTO takes a consistent copy of a database that is in use, and
  // compacts it on the way out.
  const conn = new DatabaseSync(source, { readOnly: true });
  try {
    conn.exec(`vacuum into '${target.replace(/'/g, "''")}'`);
  } finally {
    conn.close();
  }
  return target;
}

export function backupUploads(into: string): number {
  const source = uploadDir();
  if (!existsSync(source)) return 0;
  const target = join(into, "uploads");
  cpSync(source, target, { recursive: true });
  return readdirSync(target).length;
}

/** Keeps the newest `KEEP` backups and removes the rest. */
export function prune(keep = keepCount()): string[] {
  const root = backupRoot();
  if (!existsSync(root)) return [];
  const dirs = readdirSync(root)
    .map((name) => join(root, name))
    .filter((path) => statSync(path).isDirectory())
    .sort();
  const remove = dirs.slice(0, Math.max(0, dirs.length - keep));
  for (const dir of remove) rmSync(dir, { recursive: true, force: true });
  return remove;
}
