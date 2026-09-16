/**
 * Visual review sheet for every signature layout (npm run review:layouts).
 *
 * Writes .review/layouts.html: each layout rendered with a rich sample at
 * full width and inside a 360px phone-width frame, so layout changes can be
 * checked by eye before they ship. Images load from BASE_URL (default the
 * local dev server), so run `npm run dev` first.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { sampleSignature } from "../lib/marketing/samples";
import { renderSignature } from "../lib/signature/render";
import { TEMPLATES } from "../lib/signature/templates";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const OUT = ".review";
const only = process.argv[2]?.split(",");

function render(templateId: string, variant: "plain" | "rich"): string {
  const { data, style } = sampleSignature("tpl-meridian", templateId);
  const richData = {
    ...data,
    photoUrl: `${BASE}${data.photoUrl}`,
    logoUrl: `${BASE}${data.logoUrl}`,
    sideText: variant === "rich" ? "People\nIdeas\nProgress" : "",
    tagline: variant === "rich" ? "Building brighter brands together" : data.tagline,
    department: variant === "rich" ? "Strategy / Design / What's Next" : data.department,
    social: { linkedin: "https://www.linkedin.com/", instagram: "https://www.instagram.com/", x: "https://x.com/" },
  };
  return renderSignature(richData, style, { assetBase: BASE });
}

const sections = TEMPLATES.filter((t) => !only || only.includes(t.id))
  .map(
    (t) => `
  <section>
    <h2>${t.name} <small>${t.id} / ${t.tier} / ${t.tags.join(", ")}</small></h2>
    <div class="row">
      <div class="frame wide">${render(t.id, "rich")}</div>
      <div class="frame phone">${render(t.id, "rich")}</div>
    </div>
    <div class="row"><div class="frame wide">${render(t.id, "plain")}</div></div>
  </section>`,
  )
  .join("\n");

mkdirSync(OUT, { recursive: true });
const file = join(OUT, "layouts.html");
writeFileSync(
  file,
  `<!doctype html><html><head><meta charset="utf-8"><title>Layout review</title>
<style>
body{margin:0;padding:32px;background:#eceef1;font-family:system-ui,sans-serif;color:#17191e}
section{margin:0 0 40px}
h2{font-size:15px;margin:0 0 10px}
small{font-weight:400;color:#6c737f;margin-left:8px}
.row{display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;margin-bottom:12px}
.frame{background:#fff;padding:24px;border-radius:12px;overflow:hidden}
.wide{width:640px}
.phone{width:360px;overflow-x:auto}
</style></head><body>${sections}</body></html>`,
);
console.log(`Wrote ${file} with ${TEMPLATES.length} layouts.`);
