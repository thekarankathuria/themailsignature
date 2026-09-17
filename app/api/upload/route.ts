import { NextResponse } from "next/server";
import sharp from "sharp";
import { currentUser } from "@/lib/auth/current";
import { canUpload } from "@/lib/billing/entitlements";
import { planFor } from "@/lib/billing/plans";
import { db } from "@/lib/db";
import { nowIso } from "@/lib/db/ids";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isStoreFailure, storeImage } from "@/lib/storage/images";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;

/** Twenty uploads per IP per ten minutes, checked before any other work. */
const LIMIT = { limit: 20, windowMs: 10 * 60 * 1000 };

/**
 * POST /api/upload — hosting for the images embedded in a signature.
 *
 * Normalisation happens here; *where* the bytes land is `lib/storage/images.ts`,
 * because that choice is a deployment concern the route should not encode.
 *
 * WebP and AVIF become PNG because Outlook cannot display either. GIFs pass
 * through untouched so animation survives.
 */
export async function POST(request: Request) {
  const throttle = rateLimit(clientKey(request, "upload"), LIMIT);
  if (!throttle.ok) {
    return NextResponse.json(
      { error: "Too many uploads. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(throttle.retryAfterSeconds) } },
    );
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Log in to upload images." }, { status: 401 });
  }
  if (!canUpload(planFor(user.id))) {
    return NextResponse.json(
      { error: "Uploading and hosting images is part of Pro. You can still paste a link to an image hosted anywhere.", code: "upgrade" },
      { status: 403 },
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That image is over 4 MB. Try a smaller one." },
      { status: 413 },
    );
  }

  const input = Buffer.from(await file.arrayBuffer());
  const maxWidth = Number(form?.get("maxWidth") ?? 600) || 600;

  let output = input;
  let ext = "png";

  if (file.type === "image/gif") {
    // Left untouched so animation survives.
    ext = "gif";
  } else {
    try {
      const image = sharp(input, { failOn: "error" });
      const meta = await image.metadata();
      if (!meta.width) throw new Error("unreadable");

      let pipeline = image;
      if (meta.width > maxWidth * 2) {
        pipeline = pipeline.resize({ width: maxWidth * 2, withoutEnlargement: true });
      }
      output = await pipeline.png({ compressionLevel: 9 }).toBuffer();
    } catch {
      return NextResponse.json(
        { error: "That file could not be read as an image." },
        { status: 415 },
      );
    }
  }

  const stored = await storeImage({ origin: new URL(request.url).origin, bytes: output, ext });

  if (isStoreFailure(stored)) {
    console.error(`[upload] ${stored.error}`);
    return NextResponse.json(
      { error: "That image could not be stored. Please try again." },
      { status: stored.status },
    );
  }

  // Remember who uploaded what, so deleting an account can remove its files.
  db()
    .prepare("insert or ignore into uploads (user_id, name, created_at) values (?, ?, ?)")
    .run(user.id, stored.name, nowIso());

  return NextResponse.json({ url: stored.url });
}
