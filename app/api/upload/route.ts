import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Images in a signature have to live at an absolute URL forever, because the
 * markup is copied into mail that outlives any redeploy. Files are stored
 * content-addressed so a given image always resolves to the same path and no
 * path is ever reused for different bytes.
 *
 * Backed by the local filesystem here. Swapping this for object storage means
 * changing only the write and the returned base URL.
 */
export async function POST(request: Request) {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
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

  if (file.type === "image/gif") {
    // Left untouched so animation survives.
    output = input;
    ext = "gif";
  } else {
    try {
      const image = sharp(input, { failOn: "error" });
      const meta = await image.metadata();
      if (!meta.width) throw new Error("unreadable");

      // Outlook cannot display WebP or AVIF, so everything else becomes PNG.
      let pipeline = image;
      if (meta.width > maxWidth * 2) {
        pipeline = pipeline.resize({ width: maxWidth * 2, withoutEnlargement: true });
      }
      output = await pipeline.png({ compressionLevel: 9 }).toBuffer();
      ext = "png";
    } catch {
      return NextResponse.json(
        { error: "That file could not be read as an image." },
        { status: 415 },
      );
    }
  }

  const hash = createHash("sha256").update(output).digest("hex").slice(0, 32);
  const dir = join(process.cwd(), "public", "u");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${hash}.${ext}`), output);

  const origin = process.env.NEXT_PUBLIC_ASSET_BASE || new URL(request.url).origin;
  return NextResponse.json({ url: `${origin.replace(/\/$/, "")}/u/${hash}.${ext}` });
}
