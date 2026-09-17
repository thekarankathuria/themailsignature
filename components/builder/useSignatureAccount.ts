"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlanId } from "@/lib/billing/plans";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";
import {
  createSignature,
  exportSignature,
  firstSignatureId,
  readUiState,
  saveUiState,
  updateSignature,
  type ExportResult,
} from "./editor-session";

/**
 * Keeps the editor in step with the signed-in account: it claims the draft
 * after login, autosaves while editing, and asks the server for the export.
 *
 * Signed-out editing carries on exactly as before, in localStorage only.
 */
export type SaveState = "idle" | "saving" | "saved" | "limit" | "error";

const AUTOSAVE_MS = 1500;

export function useSignatureAccount({
  signedIn,
  plan,
  initialSignatureId,
  resume,
  data,
  style,
  designId,
}: {
  signedIn: boolean;
  plan: PlanId;
  initialSignatureId?: string;
  resume: boolean;
  data: SignatureData;
  style: SignatureStyle;
  designId?: string;
}) {
  const [signatureId, setSignatureId] = useState<string | undefined>(initialSignatureId);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string>("");
  const claimed = useRef(false);
  const latest = useRef({ data, style, designId });
  useEffect(() => {
    latest.current = { data, style, designId };
  }, [data, style, designId]);

  /** After login, save the draft that was made while signed out. */
  useEffect(() => {
    if (!signedIn || claimed.current) return;
    claimed.current = true;
    if (initialSignatureId) {
      saveUiState({ ...readUiState(), signatureId: initialSignatureId });
      return;
    }
    const stored = readUiState().signatureId;
    const target = stored ?? undefined;

    (async () => {
      setSaveState("saving");
      const payload = { data: latest.current.data, style: latest.current.style, designId: latest.current.designId };
      const result = target ? await updateSignature(target, payload) : await createSignature(payload);
      if (result.ok) {
        setSignatureId(result.id);
        saveUiState({ ...readUiState(), signatureId: result.id });
        setSaveState("saved");
        return;
      }
      if (result.code === "limit") {
        // The Free plan keeps one signature: reuse it rather than refusing.
        const existing = await firstSignatureId();
        if (existing) {
          const replaced = await updateSignature(existing, payload);
          if (replaced.ok) {
            setSignatureId(existing);
            saveUiState({ ...readUiState(), signatureId: existing });
            setSaveState("saved");
            return;
          }
        }
        setSaveState("limit");
        setSaveError(result.error);
        return;
      }
      setSaveState("error");
      setSaveError(result.error);
    })();
  }, [signedIn, initialSignatureId, resume]);

  /** Autosave, debounced, once a signature exists. */
  useEffect(() => {
    if (!signedIn || !signatureId) return;
    const timer = window.setTimeout(async () => {
      setSaveState("saving");
      const result = await updateSignature(signatureId, { data, style, designId });
      setSaveState(result.ok ? "saved" : "error");
      if (!result.ok) setSaveError(result.error);
    }, AUTOSAVE_MS);
    return () => window.clearTimeout(timer);
  }, [signedIn, signatureId, data, style, designId]);

  /** Server-rendered export, with the Free footer and plan rules applied. */
  const requestExport = useCallback(async (): Promise<ExportResult> => {
    if (!signatureId) {
      const result = await createSignature({ data: latest.current.data, style: latest.current.style, designId: latest.current.designId });
      if (!result.ok) return { ok: false, code: "error", error: result.error };
      setSignatureId(result.id);
      return exportSignature(result.id);
    }
    // Make sure the server has the newest edits before it renders.
    await updateSignature(signatureId, { data: latest.current.data, style: latest.current.style, designId: latest.current.designId });
    return exportSignature(signatureId);
  }, [signatureId]);

  return { signatureId, saveState, saveError, requestExport, plan, signedIn };
}
