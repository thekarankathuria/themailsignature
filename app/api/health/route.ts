import { NextResponse } from "next/server";
import { existsSync, mkdirSync } from "node:fs";
import { db } from "@/lib/db";
import { outboxDir } from "@/lib/mail";
import { uploadDir } from "@/lib/storage/upload-dir";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health - one URL for an uptime monitor to watch.
 *
 * It answers 503 when a dependency is actually broken, so a monitor can tell
 * "the process is up" from "the process is up and can serve people". It names
 * what is wrong but never where: no paths, no versions, nothing that helps
 * somebody probing the server.
 */
export async function GET() {
  const checks: Record<string, "ok" | "failing"> = {};

  try {
    db().prepare("select count(*) as n from schema_migrations").get();
    checks.database = "ok";
  } catch {
    checks.database = "failing";
  }

  // Mail has somewhere to go: a provider key, or a writable outbox.
  checks.mail = process.env.RESEND_API_KEY?.trim() || existsSync(outboxDir()) ? "ok" : "failing";

  // Uploads have somewhere to live. The directory is created on first use, so
  // its absence is normal; what matters is whether we could write there, which
  // is what the upload path itself does.
  try {
    mkdirSync(/*turbopackIgnore: true*/ uploadDir(), { recursive: true });
    checks.uploads = "ok";
  } catch {
    checks.uploads = "failing";
  }

  const healthy = Object.values(checks).every((value) => value === "ok");
  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checks, time: new Date().toISOString() },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
