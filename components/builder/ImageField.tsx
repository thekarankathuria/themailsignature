"use client";

import { Trash, UploadSimple } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { Button, Field, cx } from "@/components/ui";

type Status = "idle" | "uploading" | "error";

export function ImageField({
  label,
  hint,
  value,
  onChange,
  maxWidth = 600,
  previewHeight = 56,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  maxWidth?: number;
  previewHeight?: number;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setStatus("uploading");
    setError("");
    const body = new FormData();
    body.append("file", file);
    body.append("maxWidth", String(maxWidth));
    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      onChange(json.url);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <div className="flex flex-col gap-2">
          {value ? (
            <div className="flex items-center gap-3 rounded-[10px] border border-ink-200 bg-ink-50 p-2 dark:border-ink-800 dark:bg-ink-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt=""
                style={{ height: previewHeight }}
                className="w-auto max-w-[60%] rounded object-contain"
              />
              <button
                type="button"
                onClick={() => onChange("")}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-ink-600 hover:bg-ink-200 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
              >
                <Trash size={14} aria-hidden />
                Remove
              </button>
            </div>
          ) : null}

          <div className="flex gap-2">
            <input
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste an image link (hosted anywhere)"
              className={cx(
                "w-full rounded-[10px] border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900",
                "placeholder:text-ink-500 hover:border-ink-300 dark:border-ink-800 dark:bg-ink-900",
                "dark:text-ink-100 dark:placeholder:text-ink-400",
              )}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={status === "uploading"}
              onClick={() => inputRef.current?.click()}
              className="shrink-0 px-3"
              title="Upload and host on TheMailSignature (Pro and Business)"
            >
              <UploadSimple size={15} aria-hidden />
              {status === "uploading" ? "Uploading" : "Upload"}
              <span className="rounded-full bg-blue-brand-50 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-blue-brand-700 dark:bg-blue-brand-950 dark:text-blue-brand-200">
                Pro
              </span>
            </Button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
          />

          {status === "error" ? (
            <p role="alert" className="text-xs text-red-700 dark:text-red-400">
              {error}
            </p>
          ) : null}
        </div>
      )}
    </Field>
  );
}
