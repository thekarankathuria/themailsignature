import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/current";
import { safeNext } from "@/lib/safe-next";

/** True when the visitor came from the editor to copy or save a signature. */
export function fromEditor(next?: string): boolean {
  return Boolean(next && next.startsWith("/editor"));
}

/** Signed-in visitors skip the auth pages and go where they were headed. */
export async function redirectIfSignedIn(next?: string): Promise<void> {
  if (await currentUser()) redirect(safeNext(next ?? "/app/signatures"));
}

export function EditorNotice() {
  return (
    <p className="mb-6 rounded-lg bg-blue-brand-50 px-4 py-3 text-sm leading-relaxed text-navy-900">
      Your signature is saved in this browser. Log in or create a free account and we will take you straight back to it.
    </p>
  );
}
