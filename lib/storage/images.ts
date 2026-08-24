import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Where a signature image gets stored.
 *
 * A signature is markup pointing at an image on a server. Move that image and
 * every mail already sent goes blank, so the address a file gets here is a
 * promise that outlives any redeploy. Two consequences shape this module:
 *
 * 1. Names are content-addressed (sha256 of the *processed* bytes). An address
 *    can never be reused for different content, so "this object already exists"
 *    is success, not a conflict — the bytes are identical by construction.
 * 2. The local-disk driver cannot survive a serverless or container host, whose
 *    filesystem is wiped on every deploy. Supabase Storage is the durable
 *    driver; disk is the local-development fallback.
 *
 * The driver is chosen by configuration, so switching hosts never edits the
 * upload route.
 */

export type StoredImage = {
  url: string;
  driver: "supabase" | "disk";
  reused: boolean;
};

export type StoreFailure = { error: string; status: number };

/** Stable name for a set of bytes. 32 hex chars is ample against collision. */
export function contentAddress(bytes: Buffer, ext: string): string {
  return `${createHash("sha256").update(bytes).digest("hex").slice(0, 32)}.${ext}`;
}

/** The durable driver is active only when a bucket is named. */
export function storageBucket(): string | null {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || null;
}

export function isDurableStorageConfigured(): boolean {
  return storageBucket() !== null;
}

async function putToSupabase(
  supabase: SupabaseClient,
  bucket: string,
  name: string,
  bytes: Buffer,
  contentType: string,
): Promise<StoredImage | StoreFailure> {
  const { error } = await supabase.storage.from(bucket).upload(name, bytes, {
    contentType,
    // Immutable by construction: the name IS the hash of these bytes.
    cacheControl: "31536000",
    upsert: false,
  });

  // A duplicate means the identical bytes are already stored. That is the
  // content-addressed happy path, not an error.
  const duplicate =
    error &&
    (/exists/i.test(error.message) ||
      (error as { statusCode?: string }).statusCode === "409");

  if (error && !duplicate) {
    return { error: `Storage rejected the upload: ${error.message}`, status: 502 };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(name);
  return { url: data.publicUrl, driver: "supabase", reused: Boolean(duplicate) };
}

async function putToDisk(
  request: Request,
  name: string,
  bytes: Buffer,
): Promise<StoredImage | StoreFailure> {
  try {
    const dir = join(process.cwd(), "public", "u");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, name), bytes);
  } catch (cause) {
    return {
      error: cause instanceof Error ? cause.message : "Could not write the file.",
      status: 500,
    };
  }

  const base = process.env.NEXT_PUBLIC_ASSET_BASE || new URL(request.url).origin;
  return {
    url: `${base.replace(/\/$/, "")}/u/${name}`,
    driver: "disk",
    reused: false,
  };
}

export async function storeImage(input: {
  request: Request;
  supabase: SupabaseClient;
  bytes: Buffer;
  ext: string;
  contentType: string;
}): Promise<StoredImage | StoreFailure> {
  const name = contentAddress(input.bytes, input.ext);
  const bucket = storageBucket();

  return bucket
    ? putToSupabase(input.supabase, bucket, name, input.bytes, input.contentType)
    : putToDisk(input.request, name, input.bytes);
}

export function isStoreFailure(
  result: StoredImage | StoreFailure,
): result is StoreFailure {
  return "error" in result;
}
