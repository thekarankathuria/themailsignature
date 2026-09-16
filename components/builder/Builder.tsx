"use client";

import { ArrowCounterClockwise } from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Button, Panel } from "@/components/ui";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Logo } from "@/components/brand/Logo";
import {
  DEFAULT_DATA,
  DEFAULT_STYLE,
  EMPTY_DATA,
  STORAGE_KEY,
} from "@/lib/signature/defaults";
import {
  estimateWidth,
  renderDocument,
  renderPlainText,
  renderSignature,
} from "@/lib/signature/render";
import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";
import { ExportPanel } from "./ExportPanel";
import { Preview, type PreviewBg, type PreviewWidth } from "./Preview";
import { TemplateGrid } from "./TemplateGrid";
import {
  DetailsPanel,
  ExtrasPanel,
  GraphicsPanel,
  SocialPanel,
  StylePanel,
} from "./panels";

interface Saved {
  data: SignatureData;
  style: SignatureStyle;
}

function load(): Saved {
  const fallback: Saved = { data: DEFAULT_DATA, style: DEFAULT_STYLE };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Saved>;
    if (!parsed.data || !parsed.style) return fallback;
    // Merge over the defaults so signatures saved by an older build still open.
    return {
      data: { ...DEFAULT_DATA, ...parsed.data, social: parsed.data.social ?? {} },
      style: { ...DEFAULT_STYLE, ...parsed.style },
    };
  } catch {
    return fallback;
  }
}

const noopSubscribe = () => () => {};

/**
 * True only after hydration. The server and the first client render both see
 * false, so restoring a saved signature never causes a hydration mismatch and
 * never needs a setState inside an effect.
 */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function Builder() {
  const mounted = useIsClient();
  const initial = useMemo(() => load(), []);
  const [data, setData] = useState<SignatureData>(initial.data);
  const [style, setStyleState] = useState<SignatureStyle>(initial.style);
  const [clientId, setClientId] = useState("gmail");
  const [previewBg, setPreviewBg] = useState<PreviewBg>("light");
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("desktop");

  // Icons need absolute URLs once the signature leaves the page, so the
  // renderer is handed a real origin rather than a relative path.
  const assetBase = useMemo(
    () =>
      process.env.NEXT_PUBLIC_ASSET_BASE ||
      (typeof window === "undefined" ? "" : window.location.origin),
    [],
  );

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, style }));
    } catch {
      // Storage full or blocked; the session still works, it just will not persist.
    }
  }, [data, style, mounted]);

  const set = useCallback(
    (patch: Partial<SignatureData>) => setData((d) => ({ ...d, ...patch })),
    [],
  );
  const setStyle = useCallback(
    (patch: Partial<SignatureStyle>) => setStyleState((s) => ({ ...s, ...patch })),
    [],
  );

  const selectTemplate = useCallback((id: string) => {
    setStyleState((s) => ({ ...s, ...(TEMPLATE_BY_ID[id]?.styleHints ?? {}), templateId: id }));
  }, []);

  const ctx = useMemo(() => ({ assetBase }), [assetBase]);

  const html = useMemo(
    () => (mounted ? renderSignature(data, style, ctx) : ""),
    [data, style, ctx, mounted],
  );
  const source = useMemo(
    () => (mounted ? renderDocument(data, style, ctx) : ""),
    [data, style, ctx, mounted],
  );
  const plain = useMemo(() => renderPlainText(data, style), [data, style]);
  const width = useMemo(() => estimateWidth(data, style), [data, style]);

  const fileName =
    [data.firstName, data.lastName]
      .filter(Boolean)
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") || "email-signature";

  const panelProps = { data, set, style, setStyle };

  return (
    <div className="min-h-[100dvh] bg-ink-50 dark:bg-ink-950">
      <header className="sticky top-0 z-30 border-b border-ink-200 bg-ink-50/85 backdrop-blur dark:border-ink-800 dark:bg-ink-950/85">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Logo />
          <span className="hidden text-sm text-ink-500 sm:inline dark:text-ink-400">
            Signature builder
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setData(EMPTY_DATA);
                setStyleState(DEFAULT_STYLE);
              }}
            >
              <ArrowCounterClockwise size={15} aria-hidden />
              Start over
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-3">
          <Panel title="Template" summary={TEMPLATE_BY_ID[style.templateId]?.name} defaultOpen>
            {mounted ? (
              <TemplateGrid
                data={data}
                style={style}
                assetBase={assetBase}
                onSelect={selectTemplate}
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[168px] animate-pulse rounded-[14px] bg-ink-100 dark:bg-ink-800"
                  />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Your details" summary="Name, role and contact" defaultOpen>
            <DetailsPanel {...panelProps} />
          </Panel>

          <Panel title="Logo, photo and banner" summary="Images and the button">
            <GraphicsPanel {...panelProps} />
          </Panel>

          <Panel title="Style" summary="Font, colours and spacing">
            <StylePanel {...panelProps} />
          </Panel>

          <Panel title="Social profiles" summary="22 networks">
            <SocialPanel {...panelProps} />
          </Panel>

          <Panel title="Extras" summary="Booking link, tagline and disclaimer">
            <ExtrasPanel {...panelProps} />
          </Panel>

          <p className="px-1 pb-2 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
            Your details are saved in this browser only. Uploaded images are
            hosted so mail clients can load them, and their addresses never change.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-22">
          <div className="rounded-[14px] border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
            {mounted ? (
              <Preview
                html={html}
                width={previewWidth}
                background={previewBg}
                onBackgroundChange={setPreviewBg}
                onWidthChange={setPreviewWidth}
                estimatedWidth={width}
              />
            ) : (
              <div className="h-[220px] animate-pulse rounded-[10px] bg-ink-100 dark:bg-ink-800" />
            )}
          </div>

          <div className="rounded-[14px] border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
            <ExportPanel
              html={html}
              source={source}
              plain={plain}
              clientId={clientId}
              onClientChange={setClientId}
              fileName={fileName}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
