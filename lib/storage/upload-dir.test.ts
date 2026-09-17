import { afterEach, describe, expect, it, vi } from "vitest";
import { join, resolve } from "node:path";
import { isPublicUploadDir, safeUploadName, uploadDir } from "./upload-dir";

afterEach(() => vi.unstubAllEnvs());

describe("upload dir", () => {
  it("defaults to public/u", () => {
    vi.stubEnv("UPLOAD_DIR", "");
    expect(uploadDir()).toBe(join(process.cwd(), "public", "u"));
    expect(isPublicUploadDir()).toBe(true);
  });
  it("honours UPLOAD_DIR", () => {
    vi.stubEnv("UPLOAD_DIR", "/srv/uploads");
    expect(uploadDir()).toBe(resolve("/srv/uploads"));
    expect(isPublicUploadDir()).toBe(false);
  });
  it("only accepts content-addressed names", () => {
    expect(safeUploadName("0123456789abcdef0123456789abcdef.png")).toBe("0123456789abcdef0123456789abcdef.png");
    expect(safeUploadName("../etc/passwd")).toBeNull();
    expect(safeUploadName("0123456789abcdef0123456789abcdef.svg")).toBeNull();
  });
});
