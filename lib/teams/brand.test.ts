// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createUser } from "@/lib/auth/users";
import { closeDb } from "@/lib/db";
import { EMPTY_KIT, readBrandKit, writeBrandKit } from "./brand";
import { createOrg } from "./store";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
});
afterEach(() => closeDb());

async function org() {
  const user = await createUser("owner@example.com", "a sensible passphrase");
  return createOrg({ name: "Northbeam", ownerId: user.id });
}

describe("the brand kit", () => {
  it("is empty until somebody fills it in", async () => {
    const { id } = await org();
    expect(readBrandKit(id)).toEqual(EMPTY_KIT);
  });

  it("round trips colours, fonts and images", async () => {
    const { id } = await org();
    writeBrandKit(id, {
      colors: ["#0B1F52", "#0050B8"],
      fonts: ["helvetica", "georgia"],
      logoUrl: "https://northbeam.example/logo.png",
      bannerUrl: "/u/" + "a".repeat(32) + ".png",
    });

    const kit = readBrandKit(id);
    expect(kit.colors).toEqual(["#0b1f52", "#0050b8"]);
    expect(kit.fonts).toEqual(["helvetica", "georgia"]);
    expect(kit.logoUrl).toBe("https://northbeam.example/logo.png");
    expect(kit.bannerUrl).toContain("/u/");
    expect(kit.updatedAt).toBeTruthy();
  });

  it("keeps only real hex colours, without repeats", async () => {
    const { id } = await org();
    writeBrandKit(id, { colors: ["#0B1F52", "not a colour", "#0b1f52", "red", "#GGGGGG", "#123abc"] });
    expect(readBrandKit(id).colors).toEqual(["#0b1f52", "#123abc"]);
  });

  it("keeps only fonts the engine knows", async () => {
    const { id } = await org();
    writeBrandKit(id, { fonts: ["helvetica", "comic-sans", "georgia"] as never });
    expect(readBrandKit(id).fonts).toEqual(["helvetica", "georgia"]);
  });

  it("refuses an image address the engine would not render", async () => {
    const { id } = await org();
    writeBrandKit(id, { logoUrl: "javascript:alert(1)", bannerUrl: "data:image/png;base64,AAAA" });
    const kit = readBrandKit(id);
    expect(kit.logoUrl).toBeNull();
    expect(kit.bannerUrl).toBeNull();
  });

  it("leaves untouched fields alone", async () => {
    const { id } = await org();
    writeBrandKit(id, { colors: ["#0b1f52"], logoUrl: "https://northbeam.example/logo.png" });
    writeBrandKit(id, { fonts: ["helvetica"] });

    const kit = readBrandKit(id);
    expect(kit.colors).toEqual(["#0b1f52"]);
    expect(kit.logoUrl).toBe("https://northbeam.example/logo.png");
    expect(kit.fonts).toEqual(["helvetica"]);
  });

  it("clears an image when it is set to empty", async () => {
    const { id } = await org();
    writeBrandKit(id, { logoUrl: "https://northbeam.example/logo.png" });
    writeBrandKit(id, { logoUrl: "" });
    expect(readBrandKit(id).logoUrl).toBeNull();
  });
});
