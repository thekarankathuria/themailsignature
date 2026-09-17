import type { SignatureData, SignatureStyle } from "@/lib/signature/types";

/**
 * The bits of editor state that have to survive a trip to the login page, and
 * the calls that save a signature to an account.
 *
 * The draft itself already lives in localStorage (see Builder). This adds the
 * surrounding context: which email client was selected and which signature is
 * open, so the editor looks untouched when the user comes back signed in.
 */
const UI_KEY = "tms.editor.ui";

export type EditorUiState = { clientId?: string; signatureId?: string };

export function saveUiState(state: EditorUiState): void {
  try {
    localStorage.setItem(UI_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked; the draft still works, it just will not be restored.
  }
}

export function readUiState(): EditorUiState {
  try {
    const raw = localStorage.getItem(UI_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as EditorUiState;
    return {
      clientId: typeof parsed.clientId === "string" ? parsed.clientId : undefined,
      signatureId: typeof parsed.signatureId === "string" ? parsed.signatureId : undefined,
    };
  } catch {
    return {};
  }
}

export function clearUiState(): void {
  try {
    localStorage.removeItem(UI_KEY);
  } catch {
    // Nothing to do.
  }
}

/** Where to send someone who needs an account before they can continue. */
export function authHref(kind: "signup" | "login", search: string): string {
  const params = new URLSearchParams(search);
  params.set("resume", "1");
  const next = `/editor?${params.toString()}`;
  return `/${kind}?next=${encodeURIComponent(next)}`;
}

export type ExportPayload = { html: string; document: string; text: string };
export type ProFeature = { id: string; label: string };
export type ExportResult =
  | { ok: true; payload: ExportPayload }
  | { ok: false; code: "upgrade"; features: ProFeature[]; error: string }
  | { ok: false; code: "error"; error: string };

type SaveOk = { ok: true; id: string };
type SaveFail = { ok: false; code: "limit" | "error"; error: string };

const json = { "Content-Type": "application/json" };

export async function createSignature(input: {
  data: SignatureData;
  style: SignatureStyle;
  designId?: string;
}): Promise<SaveOk | SaveFail> {
  try {
    const response = await fetch("/api/signatures", { method: "POST", headers: json, body: JSON.stringify(input) });
    const body = await response.json().catch(() => ({}));
    if (response.ok) return { ok: true, id: body.signature.id as string };
    return { ok: false, code: body.code === "limit" ? "limit" : "error", error: body.error ?? "That could not be saved." };
  } catch {
    return { ok: false, code: "error", error: "That could not be saved. Check your connection." };
  }
}

export async function updateSignature(
  id: string,
  input: { data: SignatureData; style: SignatureStyle; designId?: string },
): Promise<SaveOk | SaveFail> {
  try {
    const response = await fetch(`/api/signatures/${id}`, { method: "PATCH", headers: json, body: JSON.stringify(input) });
    if (response.ok) return { ok: true, id };
    const body = await response.json().catch(() => ({}));
    return { ok: false, code: "error", error: body.error ?? "That could not be saved." };
  } catch {
    return { ok: false, code: "error", error: "That could not be saved. Check your connection." };
  }
}

export async function firstSignatureId(): Promise<string | null> {
  try {
    const response = await fetch("/api/signatures");
    if (!response.ok) return null;
    const body = await response.json();
    return body.signatures?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

export async function exportSignature(id: string): Promise<ExportResult> {
  try {
    const response = await fetch(`/api/signatures/${id}/export`);
    const body = await response.json().catch(() => ({}));
    if (response.ok) return { ok: true, payload: body as ExportPayload };
    if (response.status === 402) {
      return { ok: false, code: "upgrade", features: body.features ?? [], error: body.error ?? "" };
    }
    return { ok: false, code: "error", error: body.error ?? "That could not be prepared." };
  } catch {
    return { ok: false, code: "error", error: "That could not be prepared. Check your connection." };
  }
}
