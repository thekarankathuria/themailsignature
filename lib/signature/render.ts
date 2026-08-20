import { FONT_STACKS, displayUrl, esc } from "./html";
import { contactLines, fullName } from "./parts";
import { RENDERERS } from "./templates";
import type { RenderContext, SignatureData, SignatureStyle } from "./types";

/**
 * Renders the signature to the HTML that goes on the clipboard.
 *
 * The outer div re-declares the font stack because several clients (Outlook
 * especially) inherit the composer's own font into anything that does not
 * set one, which is how signatures end up half Calibri.
 */
export function renderSignature(
  data: SignatureData,
  style: SignatureStyle,
  ctx: RenderContext,
): string {
  const renderer = RENDERERS[style.templateId] ?? RENDERERS.meridian;
  const body = renderer(data, style, ctx);
  return (
    `<div style="font-family:${FONT_STACKS[style.font]};font-size:${style.fontSize}px;color:${style.textColor};line-height:normal;">` +
    body +
    `</div>`
  );
}

/** Standalone document, for the .html download and for the source view. */
export function renderDocument(
  data: SignatureData,
  style: SignatureStyle,
  ctx: RenderContext,
): string {
  const name = fullName(data) || "Email signature";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(name)} signature</title>
</head>
<body style="margin:0;padding:24px;background:#ffffff;">
${renderSignature(data, style, ctx)}
</body>
</html>`;
}

/** Plain-text fallback, for clients that strip HTML entirely. */
export function renderPlainText(
  data: SignatureData,
  style: SignatureStyle,
): string {
  const lines: string[] = [];
  const name = fullName(data);
  if (name) lines.push(data.credentials.trim() ? `${name}, ${data.credentials.trim()}` : name);

  const role = [data.jobTitle, data.department].map((s) => s.trim()).filter(Boolean).join(" | ");
  const roleLine = [role, data.company.trim()].filter(Boolean).join(" at ");
  if (roleLine) lines.push(roleLine);

  if (lines.length) lines.push("");

  for (const line of contactLines(data, style)) {
    const text = line.html
      .replace(/<[^>]+>/g, "")
      .replace(/&#58;/g, ":")
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .trim();
    if (!text) continue;
    const label =
      { P: "Phone", M: "Mobile", E: "Email", W: "Web", A: "Address", B: "Booking" }[
        line.label
      ] ?? line.label;
    lines.push(`${label}: ${text}`);
  }

  if (data.website.trim() && !data.email.trim()) {
    lines.push(displayUrl(data.website));
  }
  if (data.tagline.trim()) lines.push("", data.tagline.trim());
  if (data.disclaimer.trim()) lines.push("", data.disclaimer.trim());
  if (data.greenFooter) {
    lines.push("", "Please consider the environment before printing this email.");
  }
  return lines.join("\n");
}

/** Rough pixel width, used to warn about signatures that will wrap on phones. */
export function estimateWidth(data: SignatureData, style: SignatureStyle): number {
  const longest = Math.max(
    fullName(data).length,
    data.jobTitle.length + data.company.length + 4,
    ...contactLines(data, style).map((l) => l.html.replace(/<[^>]+>/g, "").length),
  );
  const textWidth = longest * style.fontSize * 0.55;
  const media = data.photoUrl.trim()
    ? (data.photoSize || 92) + 36
    : data.logoUrl.trim()
      ? (data.logoWidth || 120) + 36
      : 0;
  const banner = data.bannerUrl.trim() ? data.bannerWidth || 420 : 0;
  return Math.round(Math.max(textWidth + media, banner));
}
