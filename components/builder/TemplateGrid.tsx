"use client";

import { useMemo } from "react";
import { renderSignature } from "@/lib/signature/render";
import { TEMPLATES } from "@/lib/signature/templates";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";
import { cx } from "@/components/ui";

/** Thumbnails are the real renderer at 40%, so what you pick is what you get. */
const THUMB_SCALE = 0.4;
const THUMB_WIDTH = 560;

export function TemplateGrid({
  data,
  style,
  assetBase,
  onSelect,
}: {
  data: SignatureData;
  style: SignatureStyle;
  assetBase: string;
  onSelect: (id: string) => void;
}) {
  const previews = useMemo(
    () =>
      TEMPLATES.map((t) => ({
        ...t,
        html: renderSignature(data, { ...style, templateId: t.id }, { assetBase }),
      })),
    [data, style, assetBase],
  );

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {previews.map((t) => {
        const active = t.id === style.templateId;
        return (
          <button
            key={t.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(t.id)}
            className={cx(
              "group flex flex-col overflow-hidden rounded-[14px] border text-left transition-colors",
              active
                ? "border-brand-600 ring-1 ring-brand-600"
                : "border-ink-200 hover:border-ink-300 dark:border-ink-800 dark:hover:border-ink-700",
            )}
          >
            <span className="block h-[120px] overflow-hidden bg-white p-3">
              <span
                className="sig-thumb block"
                style={{ width: THUMB_WIDTH, transform: `scale(${THUMB_SCALE})` }}
                dangerouslySetInnerHTML={{ __html: t.html }}
              />
            </span>
            <span className="flex min-h-[62px] flex-col gap-0.5 border-t border-ink-200 bg-ink-50 px-3 py-2 dark:border-ink-800 dark:bg-ink-900">
              <span
                className={cx(
                  "text-xs font-semibold",
                  active ? "text-brand-700 dark:text-brand-300" : "text-ink-900 dark:text-ink-100",
                )}
              >
                {t.name}
              </span>
              <span className="text-[11px] leading-snug text-ink-500 dark:text-ink-400">
                {t.blurb}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
