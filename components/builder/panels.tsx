"use client";

import { FONT_LABELS } from "@/lib/signature/html";
import { ACCENT_PRESETS } from "@/lib/signature/defaults";
import { ICON_STYLE_LABELS, SOCIALS } from "@/lib/signature/social";
import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import type {
  Density,
  FontKey,
  IconStyle,
  PhotoShape,
  SignatureData,
  SignatureStyle,
  SocialKey,
} from "@/lib/signature/types";
import {
  ColorInput,
  Field,
  Segmented,
  Select,
  TextArea,
  TextInput,
  Toggle,
  cx,
} from "@/components/ui";
import { ImageField } from "./ImageField";

export interface PanelProps {
  data: SignatureData;
  set: (patch: Partial<SignatureData>) => void;
  style: SignatureStyle;
  setStyle: (patch: Partial<SignatureStyle>) => void;
}

const grid = "grid grid-cols-1 gap-3 sm:grid-cols-2";

export function DetailsPanel({ data, set }: PanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className={grid}>
        <TextInput label="First name" value={data.firstName} onChange={(v) => set({ firstName: v })} placeholder="Amara" />
        <TextInput label="Last name" value={data.lastName} onChange={(v) => set({ lastName: v })} placeholder="Okonkwo" />
        <TextInput label="Job title" value={data.jobTitle} onChange={(v) => set({ jobTitle: v })} placeholder="Head of Client Strategy" />
        <TextInput label="Department" value={data.department} onChange={(v) => set({ department: v })} placeholder="Growth" />
        <TextInput label="Credentials" hint="Shown after your name, for example CPA or MBA." value={data.credentials} onChange={(v) => set({ credentials: v })} placeholder="CPA" />
        <TextInput label="Pronouns" value={data.pronouns} onChange={(v) => set({ pronouns: v })} placeholder="she/her" />
      </div>

      <div className="border-t border-ink-200 pt-4 dark:border-ink-800">
        <div className={grid}>
          <TextInput label="Company" value={data.company} onChange={(v) => set({ company: v })} placeholder="Northbeam Studio" />
          <TextInput label="Website" value={data.website} onChange={(v) => set({ website: v })} placeholder="northbeam.studio" />
          <TextInput label="Email" type="email" value={data.email} onChange={(v) => set({ email: v })} placeholder="amara@northbeam.studio" />
          <TextInput label="Phone" value={data.phone} onChange={(v) => set({ phone: v })} placeholder="+1 (312) 847-1928" />
          <TextInput label="Mobile" value={data.mobile} onChange={(v) => set({ mobile: v })} placeholder="+1 (312) 604-7715" />
          <TextInput label="Address line 1" value={data.addressLine1} onChange={(v) => set({ addressLine1: v })} placeholder="412 W Superior St, Suite 300" />
          <TextInput label="Address line 2" value={data.addressLine2} onChange={(v) => set({ addressLine2: v })} placeholder="Chicago, IL 60654" />
        </div>
      </div>
    </div>
  );
}

export function GraphicsPanel({ data, set, style, setStyle }: PanelProps) {
  const omits = TEMPLATE_BY_ID[style.templateId]?.omits ?? [];

  return (
    <div className="flex flex-col gap-5">
      {omits.length ? (
        <p className="rounded-[10px] bg-ink-100 px-3 py-2 text-xs text-ink-600 dark:bg-ink-800 dark:text-ink-300">
          The {TEMPLATE_BY_ID[style.templateId]?.name} template is text only, so
          images below will not appear. Pick another template to use them.
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <ImageField
          label="Company logo"
          hint="Uploads are converted to PNG and hosted at a permanent URL."
          value={data.logoUrl}
          onChange={(v) => set({ logoUrl: v })}
          maxWidth={data.logoWidth || 132}
        />
        <div className={grid}>
          <Field label={`Logo width: ${data.logoWidth}px`}>
            {(id) => (
              <input id={id} type="range" min={60} max={280} step={4} value={data.logoWidth}
                onChange={(e) => set({ logoWidth: Number(e.target.value) })}
                className="mt-2 w-full accent-blue-brand-600 dark:accent-blue-brand-400" />
            )}
          </Field>
          <TextInput label="Logo links to" value={data.logoLink} onChange={(v) => set({ logoLink: v })} placeholder="Defaults to your website" />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-ink-200 pt-4 dark:border-ink-800">
        <ImageField label="Profile photo" value={data.photoUrl} onChange={(v) => set({ photoUrl: v })} maxWidth={data.photoSize || 92} previewHeight={48} />
        <div className={grid}>
          <Field label={`Photo size: ${data.photoSize}px`}>
            {(id) => (
              <input id={id} type="range" min={56} max={160} step={4} value={data.photoSize}
                onChange={(e) => set({ photoSize: Number(e.target.value) })}
                className="mt-2 w-full accent-blue-brand-600 dark:accent-blue-brand-400" />
            )}
          </Field>
          <Segmented<PhotoShape>
            label="Photo shape"
            value={style.photoShape}
            onChange={(v) => setStyle({ photoShape: v })}
            options={[
              { value: "square", label: "Square" },
              { value: "rounded", label: "Rounded" },
              { value: "circle", label: "Circle" },
            ]}
          />
        </div>
        {style.photoShape !== "square" ? (
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Classic Outlook for Windows ignores rounded corners and shows the
            photo square. Every other client rounds it.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-ink-200 pt-4 dark:border-ink-800">
        <ImageField label="Banner" hint="A promotional strip below the signature." value={data.bannerUrl} onChange={(v) => set({ bannerUrl: v })} maxWidth={data.bannerWidth || 440} previewHeight={40} />
        <div className={grid}>
          <Field label={`Banner width: ${data.bannerWidth}px`}>
            {(id) => (
              <input id={id} type="range" min={240} max={600} step={10} value={data.bannerWidth}
                onChange={(e) => set({ bannerWidth: Number(e.target.value) })}
                className="mt-2 w-full accent-blue-brand-600 dark:accent-blue-brand-400" />
            )}
          </Field>
          <TextInput label="Banner links to" value={data.bannerLink} onChange={(v) => set({ bannerLink: v })} placeholder="northbeam.studio/spring" />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-ink-200 pt-4 dark:border-ink-800">
        <div className={grid}>
          <TextInput label="Button text" value={data.ctaText} onChange={(v) => set({ ctaText: v })} placeholder="See our work" />
          <TextInput label="Button links to" value={data.ctaUrl} onChange={(v) => set({ ctaUrl: v })} placeholder="northbeam.studio/work" />
        </div>
        <p className="text-xs text-ink-500 dark:text-ink-400">
          The button takes your accent colour. Both fields are needed for it to appear.
        </p>
      </div>
    </div>
  );
}

export function StylePanel({ style, setStyle }: PanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className={grid}>
        <Select<FontKey>
          label="Font"
          hint="Only fonts installed on the reader's machine will render."
          value={style.font}
          onChange={(v) => setStyle({ font: v })}
          options={(Object.keys(FONT_LABELS) as FontKey[]).map((k) => ({ value: k, label: FONT_LABELS[k] }))}
        />
        <Field label={`Text size: ${style.fontSize}px`}>
          {(id) => (
            <input id={id} type="range" min={11} max={18} step={1} value={style.fontSize}
              onChange={(e) => setStyle({ fontSize: Number(e.target.value) })}
              className="mt-2 w-full accent-blue-brand-600 dark:accent-blue-brand-400" />
          )}
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 border-t border-ink-200 pt-4 sm:grid-cols-2 dark:border-ink-800">
        <ColorInput label="Accent" value={style.accent} onChange={(v) => setStyle({ accent: v, linkColor: v })} presets={ACCENT_PRESETS} />
        <ColorInput label="Name" value={style.nameColor} onChange={(v) => setStyle({ nameColor: v })} />
        <ColorInput label="Body text" value={style.textColor} onChange={(v) => setStyle({ textColor: v })} />
        <ColorInput label="Secondary text" value={style.mutedColor} onChange={(v) => setStyle({ mutedColor: v })} />
      </div>

      <div className="flex flex-col gap-4 border-t border-ink-200 pt-4 dark:border-ink-800">
        <div className={grid}>
          <Segmented<Density>
            label="Spacing"
            value={style.density}
            onChange={(v) => setStyle({ density: v })}
            options={[
              { value: "compact", label: "Tight" },
              { value: "cozy", label: "Normal" },
              { value: "roomy", label: "Airy" },
            ]}
          />
          <Select<IconStyle>
            label="Social icon style"
            value={style.iconStyle}
            onChange={(v) => setStyle({ iconStyle: v })}
            options={(Object.keys(ICON_STYLE_LABELS) as IconStyle[]).map((k) => ({ value: k, label: ICON_STYLE_LABELS[k] }))}
          />
        </div>
        <Field label={`Icon size: ${style.iconSize}px`}>
          {(id) => (
            <input id={id} type="range" min={16} max={32} step={2} value={style.iconSize}
              onChange={(e) => setStyle({ iconSize: Number(e.target.value) })}
              className="mt-1 w-full accent-blue-brand-600 dark:accent-blue-brand-400" />
          )}
        </Field>
      </div>

      <div className="flex flex-col divide-y divide-ink-200 border-t border-ink-200 pt-2 dark:divide-ink-800 dark:border-ink-800">
        <Toggle label="Divider" hint="The accent rule or line built into the template." checked={style.showDivider} onChange={(v) => setStyle({ showDivider: v })} />
        <Toggle label="Contact labels" hint="Prefixes each line with P, M, E, W or A." checked={style.showLabels} onChange={(v) => setStyle({ showLabels: v })} />
        <Toggle label="Uppercase name" checked={style.uppercaseName} onChange={(v) => setStyle({ uppercaseName: v })} />
      </div>
    </div>
  );
}

export function SocialPanel({ data, set }: PanelProps) {
  const count = Object.values(data.social).filter((v) => (v ?? "").trim()).length;

  function update(key: SocialKey, value: string) {
    set({ social: { ...data.social, [key]: value } });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className={cx("text-xs", count > 6 ? "text-amber-700 dark:text-amber-400" : "text-ink-500 dark:text-ink-400")}>
        {count === 0
          ? "Add a profile and its icon appears in the signature."
          : `${count} ${count === 1 ? "network" : "networks"} added.`}
        {count > 6 ? " More than six icons tends to crowd the signature." : ""}
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SOCIALS.map((s) => {
          const value = data.social[s.key] ?? "";
          return (
            <label key={s.key} className="flex items-center gap-2">
              <span className="sr-only">{s.label}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/i/social/${value.trim() ? "color" : "glyphDark"}/${s.slug}.png`}
                alt=""
                width={22}
                height={22}
                className={cx("h-[22px] w-[22px] shrink-0 rounded", !value.trim() && "opacity-35 dark:invert")}
              />
              <input
                value={value}
                onChange={(e) => update(s.key, e.target.value)}
                placeholder={s.placeholder}
                aria-label={s.label}
                className="w-full rounded-[10px] border border-ink-200 bg-white px-2.5 py-1.5 text-xs text-ink-900 placeholder:text-ink-500 hover:border-ink-300 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-100 dark:placeholder:text-ink-400"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function ExtrasPanel({ data, set }: PanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className={grid}>
        <TextInput label="Booking link" value={data.meetingUrl} onChange={(v) => set({ meetingUrl: v })} placeholder="cal.com/amara/20min" />
        <TextInput label="Booking link text" value={data.meetingLabel} onChange={(v) => set({ meetingLabel: v })} placeholder="Book a 20-minute call" />
      </div>
      <TextInput label="Tagline" hint="One italic line under the details." value={data.tagline} onChange={(v) => set({ tagline: v })} placeholder="Brand strategy for climate companies" />
      <TextArea label="Legal disclaimer" hint="Small print below the signature." value={data.disclaimer} onChange={(v) => set({ disclaimer: v })} placeholder="This email and any attachments are confidential." rows={3} />
      <div className="border-t border-ink-200 pt-2 dark:border-ink-800">
        <Toggle label="Environmental footer" hint="Adds the line about printing." checked={data.greenFooter} onChange={(v) => set({ greenFooter: v })} />
      </div>
    </div>
  );
}
