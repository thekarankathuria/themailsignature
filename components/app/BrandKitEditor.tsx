"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveBrandKitAction } from "@/lib/teams/actions";
import type { BrandKit } from "@/lib/teams/brand";

const FONT_CHOICES: Array<{ key: string; label: string }> = [
  { key: "arial", label: "Arial" },
  { key: "helvetica", label: "Helvetica" },
  { key: "verdana", label: "Verdana" },
  { key: "tahoma", label: "Tahoma" },
  { key: "trebuchet", label: "Trebuchet MS" },
  { key: "georgia", label: "Georgia" },
  { key: "times", label: "Times New Roman" },
  { key: "garamond", label: "Garamond" },
  { key: "palatino", label: "Palatino" },
  { key: "courier", label: "Courier New" },
  { key: "system", label: "System default" },
];

const MAX_COLORS = 8;

/** Approved colours, fonts and images for the team. */
export function BrandKitEditor({ kit }: { kit: BrandKit }) {
  const router = useRouter();
  const [colors, setColors] = useState<string[]>(kit.colors);
  const [fonts, setFonts] = useState<string[]>(kit.fonts);
  const [logoUrl, setLogoUrl] = useState(kit.logoUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState(kit.bannerUrl ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function save() {
    setError("");
    setSaved(false);
    startTransition(async () => {
      const result = await saveBrandKitAction({ colors, fonts, logoUrl, bannerUrl });
      if (result.ok) {
        setSaved(true);
        router.refresh();
      } else setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-card border border-ink-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">Colours</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">
          Up to {MAX_COLORS} approved colours. They appear first in every colour picker in your team&rsquo;s editor.
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {colors.map((color, index) => (
            <li key={`${color}-${index}`} className="flex items-center gap-2 rounded-lg border border-ink-200 p-2">
              <input
                type="color"
                aria-label={`Colour ${index + 1}`}
                value={color}
                onChange={(event) =>
                  setColors(colors.map((existing, i) => (i === index ? event.target.value : existing)))
                }
                className="size-8 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              <code className="text-xs text-ink-600">{color}</code>
              <button
                type="button"
                aria-label={`Remove colour ${color}`}
                onClick={() => setColors(colors.filter((_, i) => i !== index))}
                className="text-ink-600 hover:text-red-700"
              >
                &times;
              </button>
            </li>
          ))}
          {colors.length < MAX_COLORS && (
            <li>
              <button
                type="button"
                onClick={() => setColors([...colors, "#0b1f52"])}
                className="rounded-lg border border-dashed border-ink-300 px-4 py-3 text-sm font-medium text-ink-600 hover:border-navy-900 hover:text-navy-900"
              >
                Add a colour
              </button>
            </li>
          )}
        </ul>
      </section>

      <section className="rounded-card border border-ink-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">Fonts</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">
          Only fonts that are installed on nearly every computer are offered, because a signature cannot carry a font
          with it.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {FONT_CHOICES.map((font) => (
            <li key={font.key}>
              <label className="flex items-center gap-2.5 text-sm text-navy-900">
                <input
                  type="checkbox"
                  checked={fonts.includes(font.key)}
                  onChange={(event) =>
                    setFonts(
                      event.target.checked ? [...fonts, font.key] : fonts.filter((existing) => existing !== font.key),
                    )
                  }
                  className="size-4"
                />
                {font.label}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-card border border-ink-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">Images</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">
          Paste an address, or upload one in the editor and copy the address it gives you. Images we host keep working
          in emails you sent months ago.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {[
            { label: "Company logo", value: logoUrl, set: setLogoUrl, name: "logoUrl" },
            { label: "Current banner", value: bannerUrl, set: setBannerUrl, name: "bannerUrl" },
          ].map((field) => (
            <label key={field.name} className="flex flex-col gap-1.5 text-sm font-medium text-navy-900">
              {field.label}
              <input
                name={field.name}
                value={field.value}
                onChange={(event) => field.set(event.target.value)}
                placeholder="https://"
                className="rounded-lg border border-ink-300 px-3 py-2 font-normal"
              />
              {field.value && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={field.value}
                  alt=""
                  className="mt-1 max-h-20 w-auto self-start rounded border border-ink-200 bg-white p-1"
                />
              )}
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={pending}
          onClick={save}
          className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save brand kit"}
        </button>
        {saved && !error && (
          <p role="status" className="text-sm text-navy-900">
            Brand kit saved.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
