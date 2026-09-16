/**
 * Social icon artwork shared by the static and animated icon generators, so a
 * GIF's first frame is always the same drawing as the static PNG.
 */

/** Keep in step with SOCIALS in lib/signature/social.ts */
export const SLUGS = [
  "linkedin", "x", "instagram", "facebook", "youtube", "tiktok",
  "github", "dribbble", "behance", "medium", "threads", "pinterest",
  "whatsapp", "telegram", "discord", "slack", "twitch", "spotify",
  "reddit", "snapchat", "vimeo", "calendly",
];

export const CANVAS = 96; // 4x the largest display size, so icons stay crisp on retina
const TILE_GLYPH = 52;
const BARE_GLYPH = 78;

export const iconKey = (slug) => "si" + slug.charAt(0).toUpperCase() + slug.slice(1);

/** WCAG relative luminance, used to keep the glyph readable on light brands. */
function luminance(hex) {
  const channel = (v) => {
    const c = parseInt(v, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = channel(hex.slice(0, 2));
  const g = channel(hex.slice(2, 4));
  const b = channel(hex.slice(4, 6));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * One icon as SVG. `glyphTransform` (animation frames) moves only the glyph,
 * about the canvas centre, so the tile never clips.
 */
export function svg({ path, glyphSize, glyphFill, background, radius, stroke }, glyphTransform = "") {
  const scale = glyphSize / 24;
  const offset = (CANVAS - glyphSize) / 2;
  const c = CANVAS / 2;
  const bg = background
    ? `<rect x="0" y="0" width="${CANVAS}" height="${CANVAS}" rx="${radius}" fill="${background}"${
        stroke ? ` stroke="${stroke}" stroke-width="2"` : ""
      }/>`
    : "";
  const glyph = `<g transform="translate(${offset} ${offset}) scale(${scale})"><path d="${path}" fill="${glyphFill}"/></g>`;
  const moved = glyphTransform
    ? `<g transform="translate(${c} ${c}) ${glyphTransform} translate(${-c} ${-c})">${glyph}</g>`
    : glyph;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">${bg}${moved}</svg>`;
}

export function variants(icon) {
  const brand = "#" + icon.hex;
  // White glyphs vanish on Snapchat yellow, so light brands get a dark glyph.
  const onBrand = luminance(icon.hex) > 0.6 ? "#101215" : "#FFFFFF";

  return {
    color: { path: icon.path, glyphSize: TILE_GLYPH, glyphFill: onBrand, background: brand, radius: 22 },
    circle: { path: icon.path, glyphSize: TILE_GLYPH, glyphFill: onBrand, background: brand, radius: CANVAS / 2 },
    dark: { path: icon.path, glyphSize: TILE_GLYPH, glyphFill: "#FFFFFF", background: "#1A1D21", radius: 22 },
    light: { path: icon.path, glyphSize: TILE_GLYPH, glyphFill: "#1A1D21", background: "#FFFFFF", radius: 22, stroke: "#E1E4E8" },
    glyphDark: { path: icon.path, glyphSize: BARE_GLYPH, glyphFill: "#33383F", background: null, radius: 0 },
    glyphLight: { path: icon.path, glyphSize: BARE_GLYPH, glyphFill: "#FFFFFF", background: null, radius: 0 },
  };
}
