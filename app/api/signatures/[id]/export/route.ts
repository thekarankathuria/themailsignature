import { NextResponse } from "next/server";
import { canExport, proFeatures, withFreeFooter } from "@/lib/billing/entitlements";
import { planFor } from "@/lib/billing/plans";
import { siteUrl } from "@/lib/env";
import { isResponse, jsonError, requireUser } from "@/lib/http/guard";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { renderDocument, renderPlainText, renderSignature } from "@/lib/signature/render";
import { getSignature } from "@/lib/signatures/store";
import { trackLinks } from "@/lib/teams/links";
import { findOrg } from "@/lib/teams/store";
import { withCompanyTemplate } from "@/lib/teams/template";

export const runtime = "nodejs";

/**
 * GET /api/signatures/:id/export - the HTML that goes on the clipboard.
 *
 * Rendering happens here, not in the browser, so the Free plan's credit line
 * and the Pro-feature rules cannot be edited away in client state.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = requireUser(request);
  if (isResponse(guard)) return guard;

  const throttle = rateLimit(clientKey(request, `export:${guard.user.id}`), { limit: 60, windowMs: 10 * 60 * 1000 });
  if (!throttle.ok) {
    return jsonError(429, "Too many exports. Try again shortly.");
  }

  const { id } = await params;
  const signature = getSignature(guard.user.id, id);
  if (!signature) return jsonError(404, "That signature does not exist.");

  // The company template is applied here, not in the editor, so a member who
  // writes a locked value straight to the API still sends the company's.
  const { data, style } = withCompanyTemplate(signature);

  const plan = planFor(guard.user.id);
  const features = proFeatures(data, style);
  if (!canExport(plan, features)) {
    return jsonError(402, "This signature uses Pro features. Upgrade to copy it, or switch to the free options.", {
      code: "upgrade",
      features,
    });
  }

  // Absolute URLs: icons have to load from the recipient's mail client.
  const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE?.trim() || siteUrl();
  const ctx = { assetBase };
  const rendered = renderSignature(data, style, ctx);
  // Teams that asked for click counts get their outbound links sent through
  // /l/<id>. Nothing else about the email changes.
  const org = signature.orgTemplateId ? findOrg(signature.orgTemplateId) : null;
  const body =
    org?.analyticsEnabled ? trackLinks(rendered, { orgId: org.id, signatureId: signature.id }) : rendered;

  const html = plan === "free" ? withFreeFooter(body, style, siteUrl()) : body;
  const document = renderDocument(data, style, ctx).replace(rendered, body);

  return NextResponse.json({
    html,
    document: plan === "free" ? document.replace(body, html) : document,
    text: renderPlainText(data, style),
    plan,
    features,
  });
}
