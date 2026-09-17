"use client";

import { Check, Copy, CodeSimple, DownloadSimple, TextT } from "@phosphor-icons/react";
import { useState } from "react";
import { CLIENTS, CLIENT_BY_ID, CLIENT_GROUPS } from "@/lib/signature/clients";
import { copyRichHtml, copyText, downloadFile } from "@/lib/clipboard";
import { Button, cx } from "@/components/ui";
import type { ExportPayload, ExportResult, ProFeature } from "./editor-session";

type Copied = null | "rich" | "source" | "plain";

export function ExportPanel({
  clientId,
  onClientChange,
  fileName,
  signedIn,
  onRequireAccount,
  onExport,
  onUpgradeNeeded,
}: {
  clientId: string;
  onClientChange: (id: string) => void;
  fileName: string;
  /** Signed-out visitors are asked to create an account before copying. */
  signedIn: boolean;
  onRequireAccount: () => void;
  /** Asks the server for the finished signature, with plan rules applied. */
  onExport: () => Promise<ExportResult>;
  onUpgradeNeeded: (features: ProFeature[]) => void;
}) {
  const [copied, setCopied] = useState<Copied>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const client = CLIENT_BY_ID[clientId] ?? CLIENTS[0];

  async function run(kind: Exclude<Copied, null>, apply: (payload: ExportPayload) => Promise<boolean> | boolean) {
    if (!signedIn) {
      onRequireAccount();
      return;
    }
    setBusy(true);
    setError("");
    setFailed(false);
    const result = await onExport();
    setBusy(false);
    if (!result.ok) {
      if (result.code === "upgrade") onUpgradeNeeded(result.features);
      else setError(result.error);
      return;
    }
    const ok = await apply(result.payload);
    setFailed(!ok);
    if (ok) {
      setCopied(kind);
      window.setTimeout(() => setCopied((c) => (c === kind ? null : c)), 2200);
    }
  }

  const label = (kind: Exclude<Copied, null>, idle: string) =>
    copied === kind ? "Copied" : idle;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-ink-600 dark:text-ink-300">
          Where are you using it?
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CLIENT_GROUPS.flatMap((group) =>
            CLIENTS.filter((c) => c.group === group),
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === clientId}
              onClick={() => onClientChange(c.id)}
              className={cx(
                "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                c.id === clientId
                  ? "border-ink-900 bg-ink-900 text-white dark:border-ink-100 dark:bg-ink-100 dark:text-ink-950"
                  : "border-ink-200 text-ink-600 hover:border-ink-300 hover:text-ink-900 dark:border-ink-800 dark:text-ink-400 dark:hover:text-ink-100",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => run("rich", (payload) => copyRichHtml(payload.html, payload.text))}>
          {copied === "rich" ? <Check size={16} weight="bold" aria-hidden /> : <Copy size={16} aria-hidden />}
          {busy ? "Preparing" : label("rich", "Copy signature")}
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => run("source", (payload) => copyText(payload.document))}>
          {copied === "source" ? <Check size={16} weight="bold" aria-hidden /> : <CodeSimple size={16} aria-hidden />}
          {label("source", "Copy HTML source")}
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => run("plain", (payload) => copyText(payload.text))}>
          {copied === "plain" ? <Check size={16} weight="bold" aria-hidden /> : <TextT size={16} aria-hidden />}
          {label("plain", "Copy plain text")}
        </Button>
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() =>
            run("source", (payload) => {
              downloadFile(`${fileName}.html`, payload.document, "text/html");
              return true;
            })
          }
        >
          <DownloadSimple size={16} aria-hidden />
          Download .html
        </Button>
      </div>

      {error ? (
        <p role="alert" className="rounded-[10px] bg-red-50 px-3 py-2 text-xs text-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}

      {failed ? (
        <p role="alert" className="rounded-[10px] bg-red-50 px-3 py-2 text-xs text-red-800 dark:bg-red-950/40 dark:text-red-300">
          Your browser blocked the copy. Use Copy HTML source instead, or allow
          clipboard access for this site.
        </p>
      ) : null}

      <div className="rounded-[14px] border border-ink-200 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-950">
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-100">
          Installing in {client.name}
        </h3>
        {client.note ? (
          <p className="mt-1.5 text-xs leading-relaxed text-ink-600 dark:text-ink-400">
            {client.note}
          </p>
        ) : null}
        <ol className="mt-3 flex flex-col gap-2">
          {client.steps.map((step, i) => (
            <li key={step} className="flex gap-2.5 text-xs leading-relaxed text-ink-700 dark:text-ink-300">
              <span
                aria-hidden
                className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-[9px] font-bold text-white dark:bg-ink-100 dark:text-ink-950"
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
