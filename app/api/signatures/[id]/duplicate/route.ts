import { NextResponse } from "next/server";
import { isResponse, jsonError, requireUser } from "@/lib/http/guard";
import { SignatureLimitError, duplicateSignature } from "@/lib/signatures/store";

export const runtime = "nodejs";

/** POST /api/signatures/:id/duplicate */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = requireUser(request);
  if (isResponse(guard)) return guard;
  const { id } = await params;
  try {
    const signature = duplicateSignature(guard.user.id, id);
    return signature ? NextResponse.json({ signature }, { status: 201 }) : jsonError(404, "That signature does not exist.");
  } catch (error) {
    if (error instanceof SignatureLimitError) {
      return jsonError(402, "The Free plan keeps one saved signature. Upgrade to save more.", { code: "limit" });
    }
    throw error;
  }
}
