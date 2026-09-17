import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { UPLOAD_CONTENT_TYPES, safeUploadName, uploadDir } from "@/lib/storage/upload-dir";

/**
 * GET /u/<hash>.<ext> — serves uploaded signature images from UPLOAD_DIR.
 *
 * When UPLOAD_DIR is inside public/ (development), Next serves the static
 * file first and this handler never runs. On the server, uploads live on a
 * persistent volume outside the build, and this is how mail clients fetch
 * them. Names are content hashes, so responses are cacheable forever.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const name = safeUploadName(file);
  if (!name) return new Response("Not found", { status: 404 });

  try {
    const bytes = await readFile(join(uploadDir(), name));
    const ext = name.slice(name.lastIndexOf(".") + 1);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": UPLOAD_CONTENT_TYPES[ext],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
