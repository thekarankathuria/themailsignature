/**
 * Contact-line icons (npm run contact-icons).
 *
 * Mail clients cannot render inline SVG or icon fonts, so the small phone /
 * email / web / location marks some layouts use are PNGs. The drawings are
 * Phosphor's (MIT), the same family the site uses, rendered at 4x for retina.
 *
 *   public/i/contact/<ink|muted|light>/<kind>.png
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import {
  CalendarBlank,
  DeviceMobile,
  EnvelopeSimple,
  Globe,
  MapPin,
  Phone,
} from "@phosphor-icons/react/dist/ssr";

/** Keep in step with ContactKind in lib/signature/assets.ts */
const KINDS = {
  phone: Phone,
  mobile: DeviceMobile,
  email: EnvelopeSimple,
  web: Globe,
  address: MapPin,
  meeting: CalendarBlank,
};

/** Keep in step with ContactIconTone in lib/signature/types.ts */
const TONES = { ink: "#1E2126", muted: "#5F6570", light: "#E8EAED" };

let count = 0;
for (const [tone, color] of Object.entries(TONES)) {
  const dir = join("public", "i", "contact", tone);
  await mkdir(dir, { recursive: true });
  for (const [kind, Icon] of Object.entries(KINDS)) {
    const markup = renderToStaticMarkup(createElement(Icon, { size: 56, weight: "fill", color }));
    await sharp(Buffer.from(markup))
      .png({ compressionLevel: 9, palette: true })
      .toFile(join(dir, `${kind}.png`));
    count++;
  }
}
console.log(`Wrote ${count} contact icons.`);
