"use client";

import { Warning } from "@phosphor-icons/react";
import { Segmented, cx } from "@/components/ui";

export type PreviewBg = "light" | "dark";
export type PreviewWidth = "desktop" | "mobile";

export function Preview({
  html,
  width,
  background,
  onBackgroundChange,
  onWidthChange,
  estimatedWidth,
}: {
  html: string;
  width: PreviewWidth;
  background: PreviewBg;
  onBackgroundChange: (v: PreviewBg) => void;
  onWidthChange: (v: PreviewWidth) => void;
  estimatedWidth: number;
}) {
  const tooWide = estimatedWidth > 600;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink-900 dark:text-ink-100">Preview</h2>
        <div className="flex flex-wrap gap-2">
          <Segmented<PreviewWidth>
            value={width}
            onChange={onWidthChange}
            options={[
              { value: "desktop", label: "Desktop" },
              { value: "mobile", label: "Phone" },
            ]}
          />
          <Segmented<PreviewBg>
            value={background}
            onChange={onBackgroundChange}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </div>
      </div>

      <div
        className={cx(
          "overflow-auto rounded-[14px] border p-5 transition-colors",
          background === "light"
            ? "border-ink-200 bg-white dark:border-ink-800"
            : "border-ink-800 bg-[#1b1d21]",
        )}
      >
        <div
          className="sig-surface mx-auto"
          style={{ maxWidth: width === "mobile" ? 360 : "none" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {background === "dark" ? (
        <p className="text-xs text-ink-500 dark:text-ink-400">
          Outlook and Apple Mail recolour signatures in dark mode. If any text
          disappears here, lighten it or drop the dark template.
        </p>
      ) : null}

      {tooWide ? (
        <p className="flex items-start gap-2 rounded-[10px] bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <Warning size={15} weight="fill" aria-hidden className="mt-px shrink-0" />
          <span>
            Roughly {estimatedWidth}px wide. Anything past 600px wraps awkwardly
            on phones. Shorten a line, or narrow the logo or banner.
          </span>
        </p>
      ) : null}
    </div>
  );
}
