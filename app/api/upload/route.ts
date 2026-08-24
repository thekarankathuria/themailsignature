import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isStoreFailure, storeImage } from "@/lib/storage/images";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Twenty uploads per IP per ten minutes. Checked before the session lookup,
 * because `getUser()` is itself a network round trip to Supabase and should
 * not be floodable by an unauthenticated caller.
 */
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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
  let contentType = "image/png";

  if (file.type === "image/gif") {
    // Left untouched so animation survives.
    ext = "gif";
    contentType = "image/gif";
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

  const stored = await storeImage({
    request,
    supabase,
    bytes: output,
    ext,
    contentType,
  });

  if (isStoreFailure(stored)) {
    console.error(`[upload] ${stored.error}`);
    return NextResponse.json(
      { error: "That image could not be stored. Please try again." },
      { status: stored.status },
    );
  }

  return NextResponse.json({ url: stored.url });
}
