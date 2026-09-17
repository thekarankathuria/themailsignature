"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { safeNext } from "@/lib/safe-next";
import { currentSession, endSession, startSession } from "./current";
import * as service from "./service";

/**
 * Form-facing wrappers around the account service. Each returns a failure to
 * show in the form, or redirects on success. Next checks the Origin header
 * on every server action, which covers cross-site request forgery.
 */
export type ActionFailure = { ok: false; field: string; error: string };

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "unknown";
}

const str = (value: unknown, max = 500) => (typeof value === "string" ? value.slice(0, max) : "");

export async function signupAction(input: { email: string; password: string; next?: string }): Promise<ActionFailure> {
  const result = await service.register({ email: str(input.email), password: str(input.password), ip: await clientIp() });
  if (!result.ok) return result;
  await startSession(result.user.id);
  redirect(safeNext(input.next));
}

export async function loginAction(input: { email: string; password: string; next?: string }): Promise<ActionFailure> {
  const result = await service.authenticate({ email: str(input.email), password: str(input.password), ip: await clientIp() });
  if (!result.ok) return result;
  await startSession(result.user.id);
  redirect(safeNext(input.next));
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/");
}

export async function forgotPasswordAction(input: { email: string }): Promise<{ ok: true } | ActionFailure> {
  return service.requestReset({ email: str(input.email), ip: await clientIp() });
}

export async function resetPasswordAction(input: { token: string; password: string }): Promise<ActionFailure> {
  const result = await service.completeReset({ token: str(input.token), password: str(input.password) });
  if (!result.ok) return result;
  await startSession(result.user.id);
  redirect("/app/signatures?reset=1");
}

export async function resendVerificationAction(): Promise<{ ok: true } | ActionFailure> {
  const current = await currentSession();
  if (!current) return { ok: false, field: "form", error: "Your session has ended. Log in again." };
  return service.resendVerification(current.user.id);
}

export async function changePasswordAction(input: { current: string; next: string }): Promise<{ ok: true } | ActionFailure> {
  const current = await currentSession();
  if (!current) return { ok: false, field: "form", error: "Your session has ended. Log in again." };
  return service.changePassword({
    userId: current.user.id,
    current: str(input.current),
    next: str(input.next),
    keepSessionId: current.session.id,
  });
}

export async function deleteAccountAction(input: { password: string }): Promise<ActionFailure> {
  const current = await currentSession();
  if (!current) return { ok: false, field: "form", error: "Your session has ended. Log in again." };
  const result = await service.removeAccount({ userId: current.user.id, password: str(input.password) });
  if (!result.ok) return result;
  await endSession();
  redirect("/?account=deleted");
}
