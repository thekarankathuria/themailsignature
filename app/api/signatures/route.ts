import { NextResponse } from "next/server";
import { isResponse, jsonError, readJson, requireUser } from "@/lib/http/guard";
import { SignatureLimitError, createSignature, listSignatures } from "@/lib/signatures/store";

export const runtime = "nodejs";

/** GET /api/signatures - the signed-in user's saved signatures. */
export async function GET(request: Request) {
  const guard = requireUser(request);
  if (isResponse(guard)) return guard;
  return NextResponse.json({ signatures: listSignatures(guard.user.id) });
}

/** POST /api/signatures - save the signature currently in the editor. */
export async function POST(request: Request) {
  const guard = requireUser(request);
  if (isResponse(guard)) return guard;
  const body = await readJson(request);
  try {
    const signature = createSignature(guard.user.id, {
      name: body.name,
      data: body.data,
      style: body.style,
      designId: body.designId,
    });
    return NextResponse.json({ signature }, { status: 201 });
  } catch (error) {
    if (error instanceof SignatureLimitError) {
      return jsonError(402, "The Free plan keeps one saved signature. Upgrade to save more, or replace the one you have.", {
        code: "limit",
      });
    }
    throw error;
  }
}
