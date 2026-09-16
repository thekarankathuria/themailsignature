/**
 * Generates every brand raster from the single supplied logo.
 *
 * The source is a square PNG with the artwork floating in white space, so each
 * output starts from a trimmed copy. The light ("knockout") variant needs to be
 * white ink on a *transparent* ground (so it can sit on navy or any dark
 * surface) — but the source PNG has no alpha channel, so a plain
 * `negate({ alpha: false })` inverts the white background to opaque black
 * instead of dropping it, producing a black box rather than a knockout. Instead
 * the trimmed art's luminance is used to synthesise an alpha mask (dark ink ->
 * opaque, white background -> transparent) and that mask is applied to a flat
 * white fill. Replace this whole approach if a proper vector original arrives.
 */
import { mkdirSync, copyFileSync } from "node:fs";
import sharp from "sharp";

const SRC = "public/brand/logo-source.png";
const OUT = "public/brand";
const NAVY = { r: 0x0b, g: 0x1f, b: 0x52 };

mkdirSync(OUT, { recursive: true });

const trimmed = await sharp(SRC).trim({ threshold: 12 }).toBuffer();
const { width: trimmedWidth, height: trimmedHeight } = await sharp(trimmed).metadata();

// Wordmark, 1x and 2x, on transparent-safe white.
await sharp(trimmed).resize({ width: 560 }).png({ compressionLevel: 9 })
  .toFile(`${OUT}/wordmark.png`);
await sharp(trimmed).resize({ width: 1120 }).png({ compressionLevel: 9 })
  .toFile(`${OUT}/wordmark@2x.png`);

// Knockout variant for navy/dark surfaces: white ink on a transparent ground,
// built from a luminance-derived alpha mask (see comment above).
const knockoutAlpha = await sharp(trimmed).greyscale().negate().raw().toBuffer();
const whiteFill = Buffer.alloc(trimmedWidth * trimmedHeight * 3, 255);
const knockout = await sharp(whiteFill, {
  raw: { width: trimmedWidth, height: trimmedHeight, channels: 3 },
})
  .joinChannel(knockoutAlpha, {
    raw: { width: trimmedWidth, height: trimmedHeight, channels: 1 },
  })
  .png()
  .toBuffer();
await sharp(knockout).resize({ width: 560 }).png({ compressionLevel: 9 })
  .toFile(`${OUT}/wordmark-light.png`);
await sharp(knockout).resize({ width: 1120 }).png({ compressionLevel: 9 })
  .toFile(`${OUT}/wordmark-light@2x.png`);

// Square mark: crop a generous region around the envelope and its "m"-shaped
// signature stroke, `.trim()` that region down to the actual ink, then pad it
// onto a square white canvas so nothing touches the edges.
//
// Fix round 1: a fixed guessed square here previously sliced the stroke off
// mid-line (right-edge ink measured at commit 15035df). The envelope begins
// right after "The" (a genuine white gap in the trimmed source at columns
// 246-254) and the stroke's second hump tapers to a natural point before it
// rises into the "S" of "Signature" -- past that point the ink is a
// continuous, un-terminated line into the lettering (no white gap separates
// them; confirmed by column-scanning the source), so any crop that includes
// part of it is a slice of the "S", not a distinct glyph. Envelope + the
// complete two-hump stroke was chosen as the mark over the envelope alone: it
// is more distinctive at 512px and, unlike the "S", it does have a genuine
// endpoint (a taper) to crop to.
const markGenerousLeft = Math.round(trimmedWidth * 0.221); // just past "The"
const markGenerousRight = Math.round(trimmedWidth * 0.451); // past the stroke's taper, short of the "S"
const markGenerous = await sharp(trimmed)
  .extract({
    left: markGenerousLeft,
    top: 0,
    width: markGenerousRight - markGenerousLeft,
    height: trimmedHeight,
  })
  .toBuffer();
const markHugged = await sharp(markGenerous).trim({ threshold: 12 }).toBuffer();

const MARK_PADDING = 0.08; // fraction of the 512px canvas kept empty on each side
const markInner = Math.round(512 * (1 - 2 * MARK_PADDING));
const markResized = await sharp(markHugged)
  .resize(markInner, markInner, { fit: "contain", background: "#ffffff" })
  .toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#ffffff" } })
  .composite([{ input: markResized, gravity: "centre" }])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/mark.png`);

for (const size of [192, 512]) {
  await sharp(`${OUT}/mark.png`).resize(size, size).png({ compressionLevel: 9 })
    .toFile(`${OUT}/icon-${size}.png`);
}
copyFileSync(`${OUT}/mark.png`, "app/icon.png");
copyFileSync(`${OUT}/icon-192.png`, "app/apple-icon.png");

// Open Graph card: wordmark centred on navy.
const ogLogo = await sharp(knockout).resize({ width: 760 }).toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: NAVY },
})
  .composite([{ input: ogLogo, gravity: "centre" }])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/og.png`);

console.log("Brand assets written to public/brand and app/.");
