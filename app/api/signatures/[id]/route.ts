import { NextResponse } from "next/server";
import { isResponse, jsonError, readJson, requireUser } from "@/lib/http/guard";
import { deleteSignature, getSignature, updateSignature } from "@/lib/signatures/store";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const guard = requireUser(request);
  if (isResponse(guard)) return guard;
  const { id } = await params;
  const signature = getSignature(guard.user.id, id);
  return signature ? NextResponse.json({ signature }) : jsonError(404, "That signature does not exist.");
}

export async function PATCH(request: Request, { params }: Context) {
  const guard = requireUser(request);
  if (isResponse(guard)) return guard;
  const { id } = await params;
  const body = await readJson(request);
  const signature = updateSignature(guard.user.id, id, {
    name: body.name,
    data: body.data,
    style: body.style,
    designId: body.designId,
  });
  return signature ? NextResponse.json({ signature }) : jsonError(404, "That signature does not exist.");
}

export async function DELETE(request: Request, { params }: Context) {
  const guard = requireUser(request);
  if (isResponse(guard)) return guard;
  const { id } = await params;
  return deleteSignature(guard.user.id, id)
    ? new NextResponse(null, { status: 204 })
    : jsonError(404, "That signature does not exist.");
}
