import { Fragment } from "react";
import type { SolutionButton, SolutionRich } from "@/lib/ces/solutions";

/**
 * Pieces the Webflow original repeats verbatim in every `.section_hero` /
 * `.features-section` / `.core-feature-section` header, hoisted so the section components
 * stay readable. Nothing here holds copy — every string arrives from `lib/ces/solutions.ts`.
 */

/** Theme override 2: the original's blue ramp collapses to one flat `#EA4335`. */
export function ChipSpark() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2003_12337)">
        <path
          d="M13.3661 7.84124L6.36608 15.3412C6.29189 15.4204 6.19398 15.4733 6.0871 15.4919C5.98022 15.5106 5.87019 15.4939 5.77359 15.4445C5.677 15.3952 5.59909 15.3157 5.55162 15.2181C5.50415 15.1206 5.4897 15.0102 5.51045 14.9037L6.4267 10.3206L2.82483 8.96812C2.74747 8.93918 2.67849 8.89154 2.62404 8.82944C2.56959 8.76733 2.53138 8.69271 2.5128 8.61224C2.49423 8.53176 2.49589 8.44794 2.51761 8.36826C2.53934 8.28858 2.58047 8.21552 2.63733 8.15562L9.63733 0.655618C9.71151 0.576453 9.80942 0.523563 9.9163 0.504929C10.0232 0.486295 10.1332 0.502928 10.2298 0.552319C10.3264 0.60171 10.4043 0.681178 10.4518 0.778732C10.4992 0.876285 10.5137 0.986631 10.493 1.09312L9.5742 5.68124L13.1761 7.03187C13.2529 7.061 13.3213 7.10859 13.3753 7.17045C13.4293 7.2323 13.4673 7.30651 13.4858 7.38652C13.5044 7.46652 13.5029 7.54986 13.4816 7.62917C13.4603 7.70848 13.4197 7.78132 13.3636 7.84124H13.3661Z"
          fill="url(#paint0_linear_2003_12337)"
        ></path>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2003_12337"
          x1="2.5"
          y1="7.99843"
          x2="13.4987"
          y2="7.99843"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EA4335"></stop>
          <stop offset="1" stopColor="#EA4335"></stop>
        </linearGradient>
        <clipPath id="clip0_2003_12337">
          <rect width="16" height="16" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>
  );
}

export function ButtonChevron() {
  return (
    <div className="button-icon is-small-203 w-embed">
      <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2013_416)">
          <path
            d="M4.875 3.75L11.125 10L4.875 16.25"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M11.125 3.75L17.375 10L11.125 16.25"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
        <defs>
          <clipPath id="clip0_2013_416">
            <rect width="20" height="20" fill="white" transform="translate(0.5)"></rect>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

/**
 * `.section-tag-block` — the small pill above every section heading. The FAQ section swaps
 * the `different-*` modifier classes for `theme-white-*`, so the variant is a prop.
 */
export function SectionChip({
  label,
  variant = "different",
}: {
  label: SolutionRich[];
  variant?: "different" | "theme-white";
}) {
  const white = variant === "theme-white";
  return (
    <div className={white ? "section-tag-block theme-white-7" : "section-tag-block"}>
      <div className={white ? "section-sub-inner-box theme-white-8" : "section-sub-inner-box different-6"}>
        <div className={white ? "section-sub-tag-title theme-white-9" : "section-sub-tag-title different-7"}>
          <div className={white ? "bullet-list-icon theme-white-10" : "bullet-list-icon different-8"}>
            <div className={white ? "html-code theme-white-11 w-embed" : "html-code different-9 w-embed"}>
              <ChipSpark />
            </div>
          </div>
          <div className={white ? "button-text" : "button-text different-10"}>
            <Rich nodes={label} />
          </div>
        </div>
      </div>
      <div className={white ? "gradient-line theme-white-12" : "gradient-line"}></div>
    </div>
  );
}

/** `.chip-wrapper` + chip, the shape every section below the hero uses. */
export function SectionChipWrapper({ label }: { label: SolutionRich[] }) {
  return (
    <div className="chip-wrapper">
      <SectionChip label={label} />
    </div>
  );
}

/**
 * A heading is a flat run of text, `<span class="highlight-text">` fragments and `<br>`s.
 * Which word is highlighted, and whether the line breaks, differs on every page — so the
 * shape lives in the data and this only walks it.
 */
export function Rich({ nodes }: { nodes: SolutionRich[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (typeof node === "string") return <Fragment key={index}>{node}</Fragment>;
        if ("br" in node) return <br key={index} />;
        return (
          <span key={index} className={node.cls}>
            <Rich nodes={node.hl} />
          </span>
        );
      })}
    </>
  );
}

/**
 * `.try-for-free_btn--b` — one anchor shape, four call sites. `anchorClass`,
 * `innerClass` and `labelClass` carry the size modifiers each call site adds.
 */
export function TryButton({
  button,
  anchorClass = "try-for-free_btn--b w-inline-block",
  innerClass = "button-inner-2",
  labelClass = "text-button text-color",
}: {
  button: SolutionButton;
  anchorClass?: string;
  innerClass?: string;
  labelClass?: string;
}) {
  return (
    <a href={button.href} target="_blank" className={anchorClass}>
      <div className="button-border is-small-17">
        <div className={innerClass}>
          <div className={labelClass}>
            <Rich nodes={button.label} />
          </div>
          <div className="button-icon-wrap is-small-83">{button.chevron ? <ButtonChevron /> : null}</div>
        </div>
      </div>
    </a>
  );
}
