"use client";

import { CloudCheck, CloudSlash, CloudArrowUp } from "@phosphor-icons/react";
import type { SaveState } from "./useSignatureAccount";

/** Quiet confirmation that edits are being saved to the account. */
export function SaveStatus({ state, error }: { state: SaveState; error: string }) {
  if (state === "idle") return null;
  const failed = state === "error" || state === "limit";
  const Icon = failed ? CloudSlash : state === "saved" ? CloudCheck : CloudArrowUp;
  const label = failed ? error || "Not saved" : state === "saved" ? "Saved" : "Saving";

  return (
    <span
      role="status"
      title={label}
      className={
        failed
          ? "flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-300"
          : "flex items-center gap-1.5 text-xs font-medium text-ink-500 dark:text-ink-400"
      }
    >
      <Icon size={15} aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}
