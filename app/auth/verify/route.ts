import { NextResponse } from "next/server";
import { confirmEmail } from "@/lib/auth/service";
import { siteUrl } from "@/lib/env";

/** GET /auth/verify?token= — the link in the confirmation email. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const user = await confirmEmail(url.searchParams.get("token") ?? "");
  const target = new URL(user ? "/app/signatures?verified=1" : "/login?error=verify", siteUrl());
  return NextResponse.redirect(target, { status: 303 });
}
