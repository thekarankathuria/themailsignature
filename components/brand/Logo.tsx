import Link from "next/link";

/**
 * The brand lockup. Raster rather than inline SVG because the supplied logo is
 * a PNG; swap the `src` pair for an SVG if a vector original arrives — nothing
 * else needs to change.
 *
 * Intrinsic size: the 1x wordmark files are 560x128 for both tones (measured
 * from public/brand/wordmark.png and wordmark-light.png — see
 * scripts/gen-brand-assets.mjs). `width`/`height` attributes are derived from
 * that fixed aspect ratio and the requested render `height` so the browser can
 * reserve the correct box before the image loads, instead of only constraining
 * height via CSS and letting width collapse to 0 until decode completes.
 */
const WORDMARK_ASSET_WIDTH = 560;
const WORDMARK_ASSET_HEIGHT = 128;
const WORDMARK_ASPECT_RATIO = WORDMARK_ASSET_WIDTH / WORDMARK_ASSET_HEIGHT;

export function Logo({
  tone = "dark",
  href = "/",
  className = "",
  height = 28,
}: {
  tone?: "dark" | "light";
  href?: string;
  className?: string;
  height?: number;
}) {
  const file = tone === "light" ? "wordmark-light" : "wordmark";
  const width = Math.round(height * WORDMARK_ASPECT_RATIO);
  return (
    <Link
      href={href}
      aria-label="TheMailSignature home"
      className={`inline-flex items-center ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/brand/${file}.png`}
        srcSet={`/brand/${file}.png 1x, /brand/${file}@2x.png 2x`}
        alt="TheMailSignature"
        width={width}
        height={height}
        style={{ height, width: "auto" }}
        decoding="async"
      />
    </Link>
  );
}
