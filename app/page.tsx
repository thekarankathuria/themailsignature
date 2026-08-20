import {
  ArrowRight,
  CalendarBlank,
  CirclesFour,
  ImageSquare,
  MoonStars,
  Table,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { Reveal } from "@/components/site/Reveal";
import { CLIENTS } from "@/lib/signature/clients";
import { renderSignature } from "@/lib/signature/render";
import { SOCIALS } from "@/lib/signature/social";
import { HERO_SHOWCASE, SHOWCASE } from "@/lib/showcase";

const CTX = { assetBase: "" };

const FAQ = [
  {
    q: "Do I need an account?",
    a: "No. The builder runs in your browser, your details are saved locally, and nothing is emailed to you before you can use it.",
  },
  {
    q: "Why does my signature look different in Outlook?",
    a: "Outlook for Windows renders mail through Word, which ignores most modern CSS. Every template here is built from nested tables with inline styles, which is the only layout method Word handles reliably.",
  },
  {
    q: "Where are my logo and photo stored?",
    a: "Uploaded images are hosted for you and served from a fixed address derived from the file itself. That address never changes, so signatures you sent years ago keep loading.",
  },
  {
    q: "Can I paste the HTML instead?",
    a: "Yes. Copy HTML source gives you the markup, which is what Proton Mail, Front and HubSpot expect. For Gmail, Outlook and Apple Mail use Copy signature, which puts the rendered signature on your clipboard.",
  },
  {
    q: "Will it work in dark mode?",
    a: "Mail clients recolour signatures in dark mode in ways nobody fully controls. The preview has a dark background toggle so you can see what disappears before you commit to it.",
  },
  {
    q: "How wide should a signature be?",
    a: "Under 600 pixels. Past that it wraps awkwardly on phones. The builder estimates the width as you type and warns you when you cross the line.",
  },
];

const BENTO = [
  {
    icon: Table,
    title: "Tables, not flexbox",
    body: "Nested tables and inline styles, the way Word's rendering engine expects. No stylesheet to strip, no classes to lose.",
  },
  {
    icon: ImageSquare,
    title: "Images hosted for you",
    body: "Upload a logo and it is converted, resized and given a permanent address.",
  },
  {
    icon: CirclesFour,
    title: `${SOCIALS.length} social networks`,
    body: "Six icon styles, from full brand colour to a quiet monochrome glyph.",
  },
  {
    icon: MoonStars,
    title: "Dark mode preview",
    body: "See what vanishes against a dark background before you send it.",
  },
  {
    icon: CalendarBlank,
    title: "Booking links and banners",
    body: "Add a scheduling link, a campaign banner and a button that inherits your accent.",
  },
];

const STEPS = [
  {
    verb: "Fill in",
    body: "Name, role, company, phone, address, social profiles. Everything is optional, so a two-line signature is as easy as a full one.",
  },
  {
    verb: "Style it",
    body: "Eight templates, ten mail-safe fonts, your own colours and three spacing settings. The preview updates as you type.",
  },
  {
    verb: "Paste it",
    body: `Pick your mail app from the ${CLIENTS.length} we cover and follow the steps. Most people are done in under a minute.`,
  },
];

export default function HomePage() {
  const heroHtml = renderSignature(
    HERO_SHOWCASE.data,
    HERO_SHOWCASE.style,
    CTX,
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="min-h-[100dvh] bg-ink-50 dark:bg-ink-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Nav />

      {/* Hero: asymmetric split, copy left, real renderer output right */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 pt-14 pb-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div className="flex flex-col items-start">
          <h1 className="max-w-[17ch] text-[2.1rem] leading-[1.1] font-semibold tracking-tight text-ink-900 md:text-[2.75rem] lg:text-[3.05rem] lg:leading-[1.08] dark:text-white">
            Email signatures that don&rsquo;t break in Outlook.
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-600 dark:text-ink-300">
            Pick a template, fill in your details, paste it into your mail app.
            No account, no subscription, no watermark.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 rounded-[10px] bg-brand-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700 active:translate-y-px"
            >
              Build my signature
              <ArrowRight size={16} weight="bold" aria-hidden />
            </Link>
            <Link
              href="#templates"
              className="inline-flex items-center rounded-[10px] border border-ink-300 px-5 py-3 text-sm font-medium text-ink-800 transition-colors hover:border-ink-400 hover:bg-white dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-900"
            >
              See the templates
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-[14px] border border-ink-200 bg-white p-7 shadow-[0_18px_50px_-24px_rgba(23,25,30,0.35)] dark:border-ink-800">
            <div
              className="sig-surface"
              dangerouslySetInnerHTML={{ __html: heroHtml }}
            />
          </div>
          <pre className="overflow-x-auto rounded-[14px] border border-ink-200 bg-ink-900 px-4 py-3 font-mono text-[11px] leading-relaxed text-ink-300 dark:border-ink-800">
            <code>{`<table cellpadding="0" cellspacing="0" border="0"
  style="border-collapse:collapse;">`}</code>
          </pre>
        </div>
      </section>

      {/* Compatibility band */}
      <section
        id="clients"
        className="scroll-mt-20 border-y border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-5 py-8 sm:px-8">
          <p className="text-sm text-ink-600 dark:text-ink-400">
            Install steps written for {CLIENTS.length} mail apps
          </p>
          <ul className="flex flex-wrap gap-2">
            {CLIENTS.map((c) => (
              <li key={c.id}>
                <Link
                  href="/generator"
                  className="inline-block rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-ink-400 hover:text-ink-900 dark:border-ink-800 dark:text-ink-300 dark:hover:border-ink-600 dark:hover:text-ink-100"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Templates: horizontal scroll-snap gallery */}
      <section id="templates" className="mx-auto max-w-[1200px] scroll-mt-20 px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="max-w-[16ch] text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl dark:text-white">
            Eight templates, one renderer
          </h2>
          <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-ink-600 dark:text-ink-400">
            Each one is a different arrangement of the same tested parts, so
            switching template never costs you compatibility.
          </p>
        </Reveal>

        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
          {SHOWCASE.map((s) => (
            <figure
              key={s.id}
              className="w-[min(88vw,460px)] shrink-0 snap-start overflow-hidden rounded-[14px] border border-ink-200 bg-white dark:border-ink-800"
            >
              <div
                className="sig-surface min-h-[188px] overflow-x-auto p-6"
                dangerouslySetInnerHTML={{
                  __html: renderSignature(s.data, s.style, CTX),
                }}
              />
              <figcaption className="border-t border-ink-200 px-6 py-3 text-xs font-medium text-ink-600 dark:border-ink-800 dark:text-ink-400">
                {s.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Bento: 5 cells, exactly filled across two rows */}
      <section
        id="features"
        className="scroll-mt-20 border-t border-ink-200 bg-white py-20 dark:border-ink-800 dark:bg-ink-900"
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-[18ch] text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl dark:text-white">
              What keeps them from falling apart
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {BENTO.map((cell, i) => {
              const Icon = cell.icon;
              const featured = i === 0;
              const tinted = i === 1;
              return (
                <Reveal
                  key={cell.title}
                  delay={i * 0.05}
                  className={featured ? "md:col-span-2" : ""}
                >
                  <div
                    className={[
                      "flex h-full flex-col gap-3 rounded-[14px] p-6",
                      featured
                        ? "bg-ink-900 text-white dark:bg-ink-950"
                        : tinted
                          ? "bg-brand-50 dark:bg-brand-950/50"
                          : "border border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-950",
                    ].join(" ")}
                  >
                    <Icon
                      size={22}
                      weight="duotone"
                      aria-hidden
                      className={
                        featured ? "text-brand-300" : "text-brand-700 dark:text-brand-300"
                      }
                    />
                    <h3
                      className={[
                        "text-base font-semibold",
                        featured ? "text-white" : "text-ink-900 dark:text-ink-100",
                      ].join(" ")}
                    >
                      {cell.title}
                    </h3>
                    <p
                      className={[
                        "text-sm leading-relaxed",
                        featured ? "text-ink-300" : "text-ink-600 dark:text-ink-400",
                      ].join(" ")}
                    >
                      {cell.body}
                    </p>
                    {featured ? (
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                        {SOCIALS.slice(0, 12).map((s) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={s.key}
                            src={`/i/social/color/${s.slug}.png`}
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded"
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statement: the promise that differentiates the product */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        <Reveal className="mx-auto max-w-[38ch] text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink-900 md:text-[2.6rem] md:leading-[1.15] dark:text-white">
            Your images will still load in 2030.
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-base leading-relaxed text-ink-600 dark:text-ink-400">
            A signature is markup that points at a picture on someone else&rsquo;s
            server. Move that picture and every email you have ever sent goes
            blank. Here, each upload is stored under an address derived from the
            file itself, so the address can never be reused or relocated.
          </p>
        </Reveal>
      </section>

      {/* How it works: stacked verbs, hairline separated */}
      <section className="border-t border-ink-200 bg-white py-20 dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.verb} delay={i * 0.06}>
              <div
                className={[
                  "grid gap-4 py-8 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-16",
                  i > 0 ? "border-t border-ink-200 dark:border-ink-800" : "",
                ].join(" ")}
              >
                <h3 className="text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl dark:text-white">
                  {step.verb}
                </h3>
                <p className="max-w-[58ch] text-base leading-relaxed text-ink-600 dark:text-ink-400">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-[1200px] scroll-mt-20 px-5 py-20 sm:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl dark:text-white">
          Questions
        </h2>
        <div className="mt-8 max-w-[70ch]">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group border-b border-ink-200 py-5 dark:border-ink-800"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink-900 marker:content-none dark:text-ink-100">
                {item.q}
                <span
                  aria-hidden
                  className="shrink-0 text-xl leading-none text-ink-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="border-t border-ink-200 bg-ink-900 dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-[20ch] text-2xl font-semibold tracking-tight text-white md:text-3xl">
            A better signature is about a minute away.
          </h2>
          <Link
            href="/generator"
            className="inline-flex shrink-0 items-center gap-2 rounded-[10px] bg-brand-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-400 active:translate-y-px"
          >
            Build my signature
            <ArrowRight size={16} weight="bold" aria-hidden />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
