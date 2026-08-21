"use client";

import { useEffect, useRef, useState } from "react";
import type { SolutionFaq as SolutionFaqData, SolutionFaqItem } from "@/lib/ces/solutions";
import { Rich, SectionChip } from "./parts";

/**
 * `.faq` — click-driven accordion (BEHAVIORS.md §7). Items open independently, so more than
 * one can be open at a time, and the `+` glyph rotates into an `×`.
 *
 * The stylesheet only gives `.faq6_answer { overflow: hidden }` — Webflow IX2 drove the
 * panel height and the icon rotation with inline styles at runtime, so this does the same
 * from React: animate between `0` and the measured `scrollHeight`, then release to `auto`
 * once the transition settles so the late-loading Loom embed in the first answer cannot end
 * up clipped.
 *
 * The answers keep the original's inline `<strong>` / `<span>` emphasis and that embed, so
 * they travel as HTML in `lib/ces/solutions.ts` and are injected rather than re-authored —
 * the template holds no copy.
 */

const ACCORDION_MS = 350;

function FaqAccordion({ item }: { item: SolutionFaqItem }) {
  const [open, setOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const el = answerRef.current;
    if (!el) return;

    // Skip the first pass: the panel already renders closed, so animating on mount would
    // flash every answer open and shut.
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (open) {
      el.style.height = `${el.scrollHeight}px`;
      const onEnd = (event: TransitionEvent) => {
        if (event.propertyName !== "height" || event.target !== el) return;
        el.style.height = "auto";
      };
      el.addEventListener("transitionend", onEnd);
      return () => el.removeEventListener("transitionend", onEnd);
    }

    // Closing: height is `auto`, which cannot be transitioned from. Pin it to the measured
    // pixel height, force a reflow so the browser records that as the start value, then 0.
    el.style.height = `${el.scrollHeight}px`;
    void el.offsetHeight;
    el.style.height = "0px";
  }, [open]);

  const toggle = () => setOpen((value) => !value);

  return (
    <div className="faq6_accordion">
      <div
        className="faq6_question"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          toggle();
        }}
      >
        <div className="text-size-medium white-bold">{item.question}</div>
        <div className="faq6_icon-wrapper">
          <div
            className="icon-embed-small w-embed"
            style={{
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
              transition: `transform ${ACCORDION_MS}ms ease`,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M25.3333 15.667V16.3336C25.3333 16.7018 25.0349 17.0003 24.6667 17.0003H17V24.667C17 25.0351 16.7015 25.3336 16.3333 25.3336H15.6667C15.2985 25.3336 15 25.0351 15 24.667V17.0003H7.3333C6.96511 17.0003 6.66663 16.7018 6.66663 16.3336V15.667C6.66663 15.2988 6.96511 15.0003 7.3333 15.0003H15V7.33365C15 6.96546 15.2985 6.66699 15.6667 6.66699H16.3333C16.7015 6.66699 17 6.96546 17 7.33365V15.0003H24.6667C25.0349 15.0003 25.3333 15.2988 25.3333 15.667Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <div
        ref={answerRef}
        className="faq6_answer"
        style={{ height: 0, transition: `height ${ACCORDION_MS}ms ease` }}
        dangerouslySetInnerHTML={{ __html: item.answerHtml }}
      />
    </div>
  );
}

export function SolutionFaq({ faq }: { faq: SolutionFaqData }) {
  return (
    <div id="FAQ" className="faq">
      <div className="padding-section-medium">
        <div className="container-large">
          <div>
            <div className="hero_grid">
              <div className="section_header_container">
                <div className="chip-wrapper">
                  <SectionChip label={faq.eyebrow} variant="theme-white" />
                </div>
                <div className="heading_block">
                  <h2 className={faq.h2Class}>
                    <Rich nodes={faq.heading} />
                  </h2>
                </div>
                <p className="text-size-medium">{faq.paragraph}</p>
              </div>
            </div>
            <div className="spacer-xlarge"></div>
            <div className="faq6_content">
              <div className="faq6_list">
                <div className="faq6_list-grid">
                  {faq.items.map((item) => (
                    <FaqAccordion key={item.question} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
