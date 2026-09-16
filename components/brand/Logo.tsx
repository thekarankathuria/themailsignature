import Link from "next/link";

/**
 * The brand lockup. Raster rather than inline SVG because the supplied logo is
 * a PNG; swap the `src` pair for an SVG if a vector original arrives — nothing
 * else needs to change.
 */
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
  return (
    <Link
      href={href}
      aria-label="TheMailSignature home"
      className={`inline-flex items-center ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/brand/${file}.png`}
        srcSet={tone === "light" ? undefined : "/brand/wordmark.png 1x, /brand/wordmark@2x.png 2x"}
        alt="TheMailSignature"
        style={{ height, width: "auto" }}
        decoding="async"
      />
    </Link>
  );
}
