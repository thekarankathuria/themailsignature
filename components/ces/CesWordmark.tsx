/**
 * Mail Signature wordmark.
 *
 * The cloned original shipped its logo as hand-drawn SVG letterform paths, which
 * cannot be re-lettered. This sets the name as real text in the site face instead,
 * matching the original lockup: a square mark holding three stacked mail rules,
 * then two lines of letter-spaced uppercase.
 *
 * `tone` picks the palette — "dark" for the white page, "light" if it is ever
 * placed back on a dark surface.
 */
export function CesWordmark({
  tone = "dark",
  size = 32,
}: {
  tone?: "dark" | "light";
  size?: number;
}) {
  const ink = tone === "dark" ? "#030712" : "#ffffff";
  const markFill = tone === "dark" ? "#030712" : "#ffffff";
  const ruleFill = tone === "dark" ? "#ffffff" : "#030712";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="3" fill={markFill} />
        <rect x="7" y="10" width="18" height="2.6" rx="1.3" fill={ruleFill} />
        <rect x="7" y="15" width="18" height="2.6" rx="1.3" fill={ruleFill} />
        <rect x="7" y="20" width="12" height="2.6" rx="1.3" fill={ruleFill} />
      </svg>
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          color: ink,
          fontFamily: "Switzer, Inter, sans-serif",
        }}
      >
        <span style={{ fontSize: size * 0.5, fontWeight: 600, letterSpacing: "0.18em" }}>
          MAIL
        </span>
        <span style={{ fontSize: size * 0.28, fontWeight: 500, letterSpacing: "0.26em" }}>
          SIGNATURE
        </span>
      </span>

    </span>
  );
}
