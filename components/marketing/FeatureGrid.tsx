import {
  ChartBar, Copy, Cursor, Envelope, Image as ImageIcon, Layout, Lock, Palette,
  ShareNetwork, ShieldCheck, Swatches, Users,
} from "@phosphor-icons/react/dist/ssr";
import type { ClaimId } from "@/lib/marketing/claims";

const ICONS = {
  ChartBar, Copy, Cursor, Envelope, Image: ImageIcon, Layout, Lock, Palette,
  ShareNetwork, ShieldCheck, Swatches, Users,
};

export type PhosphorIconName = keyof typeof ICONS;

export type Feature = {
  title: string;
  body: string;
  icon: PhosphorIconName;
  claims: ClaimId[];
};

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => {
        const Icon = ICONS[feature.icon];
        return (
          <li key={feature.title} className="rounded-card border border-ink-200 bg-white p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-blue-brand-50 text-blue-brand-600">
              <Icon size={22} weight="duotone" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-semibold text-navy-900">{feature.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-600">{feature.body}</p>
          </li>
        );
      })}
    </ul>
  );
}
