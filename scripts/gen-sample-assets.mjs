/**
 * Generates the fictional logos, avatars and campaign banner used by the
 * example signatures on the marketing site. Monograms only: no photographs,
 * so no real person's likeness ever appears in a sample.
 */
import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const OUT = "public/samples";
mkdirSync(OUT, { recursive: true });
const people = JSON.parse(readFileSync("lib/marketing/sample-people.json", "utf8"));

/** An opaque pale tint, so avatars read on dark cards as well as light ones. */
const tint = (hex, amount) =>
  "#" +
  [1, 3, 5]
    .map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * amount + 255 * (1 - amount)).toString(16).padStart(2, "0"))
    .join("");

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const FILLER = new Set(["and", "of", "the", "llp", "inc", "ltd"]);
const initials = (words) =>
  words
    .filter((w) => w && !FILLER.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");

for (const p of people) {
  const companyWords = p.company.replace(/[^A-Za-z ]/g, " ").split(/\s+/).filter(Boolean);
  const mark = initials(companyWords);
  const shortName = companyWords.filter((w) => !FILLER.has(w.toLowerCase())).slice(0, 2).join(" ");

  // Arial averages ~0.6em per character; shrink long names to fit the 178px text area.
  const nameSize = Math.min(22, Math.floor(178 / (shortName.length * 0.6)));

  const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="264" height="88">
    <rect x="4" y="12" width="64" height="64" rx="14" fill="${p.accent}"/>
    <text x="36" y="54" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700"
      fill="#fff" text-anchor="middle">${escapeXml(mark)}</text>
    <text x="82" y="52" font-family="Arial, Helvetica, sans-serif" font-size="${nameSize}" font-weight="700"
      fill="#1E2126">${escapeXml(shortName)}</text>
  </svg>`;
  await sharp(Buffer.from(logo)).png({ compressionLevel: 9 }).toFile(`${OUT}/${p.key}-logo.png`);

  const avatar = `<svg xmlns="http://www.w3.org/2000/svg" width="184" height="184">
    <rect width="184" height="184" fill="${tint(p.accent, 0.16)}"/>
    <text x="92" y="112" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700"
      fill="${p.accent}" text-anchor="middle">${escapeXml(initials([p.firstName, p.lastName]))}</text>
  </svg>`;
  await sharp(Buffer.from(avatar)).png({ compressionLevel: 9 }).toFile(`${OUT}/${p.key}-avatar.png`);
}

const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="176">
  <rect width="880" height="176" fill="#0B1F52"/>
  <rect x="0" y="0" width="12" height="176" fill="#3A82E4"/>
  <text x="48" y="78" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" fill="#fff">Spring product webinar</text>
  <text x="48" y="122" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#D0E2FB">Save your seat for April 24</text>
</svg>`;
await sharp(Buffer.from(banner)).png({ compressionLevel: 9 }).toFile(`${OUT}/banner.png`);

console.log(`Generated ${people.length * 2 + 1} sample images in ${OUT}.`);
