"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Panel } from "@/components/ui";
import { DetailsPanel, ExtrasPanel, GraphicsPanel, SocialPanel, StylePanel } from "@/components/builder/panels";
import { Preview, type PreviewBg, type PreviewWidth } from "@/components/builder/Preview";
import { TemplateGrid } from "@/components/builder/TemplateGrid";
import { estimateWidth, renderSignature } from "@/lib/signature/render";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";
import { saveTemplateAction } from "@/lib/teams/actions";
import { LOCK_GROUPS, type LockGroupId } from "@/lib/teams/locks";

/**
 * The company template: the same editor panels the members use, plus a lock
 * beside each group. Locking is enforced when a signature is rendered, so
 * these switches record an intention rather than guarding anything themselves.
 */
export function CompanyTemplateEditor({
  orgName,
  initial,
  assetBase,
}: {
  orgName: string;
  initial: { name: string; data: SignatureData; style: SignatureStyle; locked: LockGroupId[] };
  assetBase: string;
}) {
  const router = useRouter();
  const [data, setData] = useState(initial.data);
  const [style, setStyle] = useState(initial.style);
  const [locked, setLocked] = useState<LockGroupId[]>(initial.locked);
  const [previewBg, setPreviewBg] = useState<PreviewBg>("light");
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("desktop");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const set = (patch: Partial<SignatureData>) => {
    setData((current) => ({ ...current, ...patch }));
    setSaved(false);
  };
  const setStylePatch = (patch: Partial<SignatureStyle>) => {
    setStyle((current) => ({ ...current, ...patch }));
    setSaved(false);
  };
  const panelProps = { data, set, style, setStyle: setStylePatch };

  function toggleLock(id: LockGroupId, on: boolean) {
    setLocked((current) => (on ? [...current, id] : current.filter((existing) => existing !== id)));
    setSaved(false);
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <Panel title="Template">
          <TemplateGrid data={data} style={style} assetBase={assetBase} onSelect={(id) => setStylePatch({ templateId: id })} />
        </Panel>
        <Panel title="Company details">
          <DetailsPanel {...panelProps} />
        </Panel>
        <Panel title="Logo and images">
          <GraphicsPanel {...panelProps} />
        </Panel>
        <Panel title="Colours and type">
          <StylePanel {...panelProps} />
        </Panel>
        <Panel title="Social links">
          <SocialPanel {...panelProps} />
        </Panel>
        <Panel title="Disclaimer and extras">
          <ExtrasPanel {...panelProps} />
        </Panel>
      </div>

      <div className="flex w-full flex-col gap-4 lg:sticky lg:top-6 lg:w-[26rem] lg:shrink-0">
        <Panel title="Preview">
          <Preview
            html={renderSignature(data, style, { assetBase })}
            width={previewWidth}
            background={previewBg}
            onBackgroundChange={setPreviewBg}
            onWidthChange={setPreviewWidth}
            estimatedWidth={estimateWidth(data, style)}
          />
        </Panel>

        <section className="rounded-card border border-ink-200 bg-white p-5">
          <h2 className="font-semibold text-navy-900">What {orgName} members cannot change</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            A locked group is taken from this template every time a member&rsquo;s signature is copied, so changing it
            here changes everybody&rsquo;s signature. Anything unlocked is theirs to fill in.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {LOCK_GROUPS.map((group) => (
              <li key={group.id}>
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={locked.includes(group.id)}
                    onChange={(event) => toggleLock(group.id, event.target.checked)}
                    className="mt-0.5 size-4"
                  />
                  <span>
                    <span className="font-medium text-navy-900">{group.label}</span>
                    <span className="mt-0.5 block leading-relaxed text-ink-600">{group.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setError("");
              setSaved(false);
              startTransition(async () => {
                const result = await saveTemplateAction({ name: initial.name, data, style, locked });
                if (result.ok) {
                  setSaved(true);
                  router.refresh();
                } else setError(result.error);
              });
            }}
            className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {pending ? "Saving..." : "Save company template"}
          </button>
          {saved && !error && (
            <p role="status" className="text-sm text-navy-900">
              Saved. Every member&rsquo;s signature follows it from now on.
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
