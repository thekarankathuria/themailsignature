import { join, relative, resolve, isAbsolute } from "node:path";

/**
 * Where uploaded images live on this server.
 *
 * In development they go to public/u and Next serves them as static files.
 * In production UPLOAD_DIR points at a persistent volume outside the build
 * (for example /srv/themailsignature/uploads), so a redeploy never wipes an
 * image that sent mail still references; app/u/[file]/route.ts serves them.
 */
export function uploadDir(): string {
  const configured = process.env.UPLOAD_DIR?.trim();
  return configured ? resolve(configured) : join(process.cwd(), "public", "u");
}

/** True when uploads sit inside public/, where Next serves them itself. */
export function isPublicUploadDir(): boolean {
  const rel = relative(resolve(process.cwd(), "public"), uploadDir());
  return rel !== "" && !rel.startsWith("..") && !isAbsolute(rel);
}

const NAME = /^[0-9a-f]{32}\.(png|jpg|gif)$/;

/** Only content-addressed names are ever served, so paths cannot escape. */
export function safeUploadName(name: string): string | null {
  return NAME.test(name) ? name : null;
}

export const UPLOAD_CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
};
