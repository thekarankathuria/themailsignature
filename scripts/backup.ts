/**
 * Backs up the database and the uploaded images (npm run backup).
 *
 *   BACKUP_DIR=/srv/backups npm run backup
 *
 * To restore: stop the site, put database.sqlite back at DATABASE_PATH and the
 * uploads back at UPLOAD_DIR, start it, and check /api/health.
 */
import { statSync } from "node:fs";
import { backupDatabase, backupUploads, prune, stampedDir, KEEP_DEFAULT } from "../lib/backup";

const keep = Number(process.env.BACKUP_KEEP ?? KEEP_DEFAULT);

function main(): void {
  const into = stampedDir();
  const database = backupDatabase(into);
  const images = backupUploads(into);
  const removed = prune(keep);

  console.log(`Database  ${database} (${(statSync(database).size / 1024).toFixed(0)} KB)`);
  console.log(`Uploads   ${images} file${images === 1 ? "" : "s"}`);
  if (removed.length) {
    console.log(`Removed   ${removed.length} backup${removed.length === 1 ? "" : "s"} over the limit of ${keep}`);
  }
  console.log(`\nBacked up to ${into}.`);
  console.log("Restore: stop the site, put database.sqlite at DATABASE_PATH and uploads at UPLOAD_DIR, start, check /api/health.");
}

main();
