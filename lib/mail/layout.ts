import { siteUrl } from "@/lib/env";
import { COMPANY } from "@/lib/marketing/company";
import { esc } from "@/lib/signature/html";

/**
 * The shared shell for every email: table layout and inline styles, the same
 * constraints as the signatures, because these land in the same clients.
 */
const FONT = "Helvetica, Arial, sans-serif";
const NAVY = "#0B1F52";
const BLUE = "#0050B8";
const INK = "#23272D";
const MUTED = "#5F6570";

export type Block =
  | { kind: "p"; text: string }
  | { kind: "button"; label: string; url: string }
  | { kind: "small"; text: string }
  | { kind: "rows"; rows: Array<[string, string]> };

export type EmailContent = {
  subject: string;
  preheader: string;
  heading: string;
  blocks: Block[];
};

function renderBlock(block: Block): string {
  switch (block.kind) {
    case "p":
      return `<tr><td style="padding:0 0 16px;font-family:${FONT};font-size:16px;line-height:24px;color:${INK};">${esc(block.text)}</td></tr>`;
    case "small":
      return `<tr><td style="padding:0 0 12px;font-family:${FONT};font-size:13px;line-height:20px;color:${MUTED};">${esc(block.text)}</td></tr>`;
    case "button":
      return (
        `<tr><td style="padding:8px 0 24px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
        `<td bgcolor="${BLUE}" style="background-color:${BLUE};border-radius:8px;">` +
        `<a href="${esc(block.url)}" style="display:inline-block;padding:13px 24px;font-family:${FONT};font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;">${esc(block.label)}</a>` +
        `</td></tr></table></td></tr>`
      );
    case "rows":
      return (
        `<tr><td style="padding:0 0 20px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">` +
        block.rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:8px 0;border-bottom:1px solid #E6E8EC;font-family:${FONT};font-size:14px;color:${MUTED};">${esc(label)}</td>` +
              `<td align="right" style="padding:8px 0;border-bottom:1px solid #E6E8EC;font-family:${FONT};font-size:14px;color:${INK};font-weight:700;">${esc(value)}</td></tr>`,
          )
          .join("") +
        `</table></td></tr>`
      );
  }
}

function blockText(block: Block): string {
  switch (block.kind) {
    case "p":
    case "small":
      return block.text;
    case "button":
      return `${block.label}: ${block.url}`;
    case "rows":
      return block.rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  }
}

export function renderEmail(content: EmailContent): { subject: string; html: string; text: string } {
  const site = siteUrl();
  const footerAddress = COMPANY.address.startsWith("[") ? "" : ` ${esc(COMPANY.address)}`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(content.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(content.preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#F3F4F6" style="background-color:#F3F4F6;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:100%;max-width:560px;border-collapse:collapse;">
<tr><td bgcolor="${NAVY}" style="background-color:${NAVY};padding:22px 32px;border-radius:12px 12px 0 0;">
<a href="${esc(site)}" style="text-decoration:none;"><img src="${esc(site)}/brand/wordmark-light@2x.png" width="150" alt="TheMailSignature" style="display:block;border:0;width:150px;height:auto;"></a>
</td></tr>
<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:32px;border-radius:0 0 12px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
<tr><td style="padding:0 0 16px;font-family:${FONT};font-size:24px;line-height:30px;font-weight:700;color:${NAVY};">${esc(content.heading)}</td></tr>
${content.blocks.map(renderBlock).join("\n")}
</table>
</td></tr>
<tr><td style="padding:20px 32px;font-family:${FONT};font-size:12px;line-height:18px;color:${MUTED};text-align:center;">
${esc(COMPANY.name)}.${footerAddress}<br>
You are receiving this because of an action on your account at <a href="${esc(site)}" style="color:${MUTED};">${esc(site.replace(/^https?:\/\//, ""))}</a>.
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [content.heading, "", ...content.blocks.map(blockText), "", `${COMPANY.name}: ${site}`].join("\n");
  return { subject: content.subject, html, text };
}
