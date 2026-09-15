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

// Square mark: the envelope glyph sits in the left-centre third of the lockup.
const markSide = trimmedHeight;
const markLeft = Math.round(trimmedWidth * 0.22);
await sharp(trimmed)
  .extract({ left: markLeft, top: 0, width: markSide, height: markSide })
  .resize(512, 512, { fit: "contain", background: "#ffffff" })
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
