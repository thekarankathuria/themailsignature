/**
 * Imports supplied headshots for the sample signatures (npm run headshots).
 *
 *   npm run headshots -- headshots/man.png headshots/woman.png
 *
 * Without arguments it looks for the two files in `headshots/`. Each is
 * cropped to a square, resized to the 184px the sample avatars use, and
 * written over the generated monogram for one sample person. Re-running
 * `npm run samples` would put the monograms back, so this runs after it.
 *
 * Only two people get a photograph. Using the same two faces across forty
 * sample signatures would look worse than the monograms, not better.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import sharp from "sharp";

const OUT = "public/samples";
const SIZE = 184;

/**
 * Who gets a photograph. These two are the most seen: the homepage hero and
 * the preview beside it.
 */
const ASSIGNMENTS = [
  { arg: 0, default: "headshots/man.png", personKey: "tpl-stack", describes: "Lucas Moreau, the second homepage preview" },
  { arg: 1, default: "headshots/woman.png", personKey: "tpl-meridian", describes: "Amara Okafor, the homepage hero signature" },
];

const CREDITS = `${OUT}/CREDITS.md`;

async function main() {
  const args = process.argv.slice(2);
  const missing = [];
  const done = [];

  for (const assignment of ASSIGNMENTS) {
    const source = args[assignment.arg] ?? assignment.default;
    if (!existsSync(source)) {
      missing.push(source);
      continue;
    }

    const target = `${OUT}/${assignment.personKey}-avatar.png`;
    await sharp(source)
      // A headshot is usually framed with the face high, so a centre crop of
      // the square keeps the eyes where they belong.
      .resize(SIZE, SIZE, { fit: "cover", position: "top" })
      .png({ compressionLevel: 9 })
      .toFile(target);

    done.push({ ...assignment, source, target });
    console.log(`wrote ${target}  (${assignment.describes}) from ${basename(source)}`);
  }

  if (missing.length) {
    console.error(`\nNot found:\n${missing.map((m) => `  ${m}`).join("\n")}`);
    console.error("\nPut the two headshots at those paths, or pass them as arguments.");
    if (!done.length) process.exit(1);
  }

  writeCredits(done);
}

/** Provenance, so a later reader knows where a face came from. */
function writeCredits(done) {
  if (!done.length) return;
  const existing = existsSync(CREDITS) ? readFileSync(CREDITS, "utf8") : "";
  const header = `# Sample image credits

The people in the sample signatures are fictional. Their names, companies and
contact details are invented, and every domain is a reserved \`.example\` one.

Most sample avatars are generated monograms (\`npm run samples\`). The two
photographs below were supplied by the site owner, who confirmed they may be
used this way. If they were ever replaced with stock photography of real
models, note that pairing a real face with an invented name and job title is
the implied-endorsement case most stock licences exclude.

`;
  const rows = done
    .map((d) => `- \`${basename(d.target)}\` — supplied by the site owner, used for ${d.describes}.`)
    .join("\n");

  const body = existing.includes("# Sample image credits") ? existing.split("## Photographs")[0] : header;
  writeFileSync(CREDITS, `${body}## Photographs\n\n${rows}\n`, "utf8");
  console.log(`\nRecorded provenance in ${CREDITS}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
