import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { uploadDir } from "./upload-dir";

/**
 * Where a signature image gets stored.
 *
 * A signature is markup pointing at an image on a server. Move that image and
 * every mail already sent goes blank, so the address a file gets here is a
 * promise that outlives any redeploy:
 *
 * 1. Names are content-addressed (sha256 of the processed bytes). An address
 *    can never be reused for different content, so writing a file that
 *    already exists is harmless: the bytes are identical by construction.
 * 2. Files live in UPLOAD_DIR, which on the server is a persistent volume
 *    outside the app (see lib/storage/upload-dir.ts and app/u/[file]).
 */
export type StoredImage = { url: string; name: string };
export type StoreFailure = { error: string; status: number };

/** Stable name for a set of bytes. 32 hex chars is ample against collision. */
export function contentAddress(bytes: Buffer, ext: string): string {
  return `${createHash("sha256").update(bytes).digest("hex").slice(0, 32)}.${ext}`;
}

export async function storeImage(input: {
  origin: string;
  bytes: Buffer;
  ext: string;
}): Promise<StoredImage | StoreFailure> {
  const name = contentAddress(input.bytes, input.ext);
  try {
    const dir = uploadDir();
    await mkdir(dir, { recursive: true });
    await writeFile(join(/*turbopackIgnore: true*/ dir, name), input.bytes);
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : "Could not write the file.", status: 500 };
  }
  const base = process.env.NEXT_PUBLIC_ASSET_BASE?.trim() || input.origin;
  return { url: `${base.replace(/\/$/, "")}/u/${name}`, name };
}

export function isStoreFailure(result: StoredImage | StoreFailure): result is StoreFailure {
  return "error" in result;
}
