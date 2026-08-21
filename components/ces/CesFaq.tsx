"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * `.faq` — ported 1:1 from the Webflow original.
 *
 * Interaction (BEHAVIORS.md §7): click-driven accordion, items open independently so more
 * than one can be open at a time, and the `+` glyph rotates into an `×`.
 *
 * The extracted stylesheet defines `.faq6_answer { overflow: hidden }` and nothing else —
 * there is no open-state class to mirror, because Webflow IX2 drove the panel height and
 * the icon rotation with inline styles at runtime. This clone does the same thing from
 * React: the panel height is animated between `0` and the measured `scrollHeight`, then
 * released to `auto` once the transition settles so late-loading content (the Loom embed in
 * the first answer) cannot end up clipped.
 */

const ACCORDION_MS = 350;

function FaqAccordion({ question, children }: { question: string; children: ReactNode }) {
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
        <div className="text-size-medium white-bold">{question}</div>
        <div className="faq6_icon-wrapper">
          <div
            className="icon-embed-small w-embed"
            style={{
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
              transition: `transform ${ACCORDION_MS}ms ease`,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
      >
        {children}
      </div>
    </div>
  );
}

export function CesFaq() {
  return (
    <div id="FAQ" className="faq">
      <div className="padding-section-medium">
        <div className="container-large">
          <div>
            <div className="hero_grid">
              <div className="section_header_container">
                <div className="chip-wrapper">
                  <div className="section-tag-block theme-white-7">
                    <div className="section-sub-inner-box theme-white-8">
                      <div className="section-sub-tag-title theme-white-9">
                        <div className="bullet-list-icon theme-white-10">
                          <div className="html-code theme-white-11 w-embed">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
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
                          </div>
                        </div>
                        <div className="button-text">FAQs</div>
                      </div>
                    </div>
                    <div className="gradient-line theme-white-12"></div>
                  </div>
                </div>
                <div className="heading_block">
                  <h2 className="heading-style-h2 text-color">Works with ANY Email or CRM</h2>
                </div>
                <p className="text-size-medium">
                  Mail Signature Works with any email, browser, and email client.
                </p>
              </div>
            </div>
            <div className="spacer-xlarge"></div>
            <div className="faq6_content">
              <div className="faq6_list">
                <div className="faq6_list-grid">
                  <FaqAccordion question="📩 Does this effect email deliverability?">
                    <div className="margin-bottom margin-small">
                      <div className="max-width-large">
                        <p className="margin-top-2">
                          <strong className="bold-text-4">Not at all!</strong> Mail
                          Signature&#39;s unique technology is designed to keep your email
                          deliverability intact. By serving your email signature&#39;s animation
                          from our secure servers, we avoid adding heavy elements to your emails.
                          This reduces the chance of your email being marked as spam or being
                          blocked by email service providers. With Mail Signature, you can{" "}
                          <strong>feel confident</strong> that your emails will reach their
                          destination with your animated signature intact.
                          <br />
                        </p>
                        <div style={{ paddingTop: "75%" }} className="faq_loom w-video w-embed">
                          <iframe
                            className="embedly-embed"
                            src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2F4bcbb9f51c574e7d96ad8f241c4ead5a&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2F4bcbb9f51c574e7d96ad8f241c4ead5a%3Fsid%3Df05ba12a-fb59-4bd8-9e4e-dac62f976523&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2F4bcbb9f51c574e7d96ad8f241c4ead5a-b1a38be5d767f695.gif&type=text%2Fhtml&schema=loom"
                            width="940"
                            height="705"
                            scrolling="no"
                            allowFullScreen
                            title="Live Deliverability Test Using Mail Signature!"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </FaqAccordion>

                  <FaqAccordion question="🖥 Does this work Gmail and Outlook?">
                    <div className="margin-bottom margin-small">
                      <div className="max-width-large">
                        <p className="margin-top-2">
                          <span className="bold-text-4">
                            <strong>Certainly!</strong>
                          </span>{" "}
                          Mail Signature is engineered to work with ALL CRMs and Email Clients,
                          ensuring a seamless and universal user experience. Our advanced technology
                          allows for optimal display and animation of email signatures across all
                          platforms. Just follow our simple installation instructions, and your
                          email signature will be ready to impress, regardless of your chosen CRM or
                          email client!
                        </p>
                      </div>
                    </div>
                  </FaqAccordion>

                  <FaqAccordion question="🖥 Does this work with other emails and CRMS">
                    <div className="margin-bottom margin-small">
                      <div className="max-width-large">
                        <p className="margin-top-2">
                          <span className="bold-text-4">
                            <strong>YES</strong>
                          </span>{" "}
                          Mail Signature is engineered to work with{" "}
                          <span className="bold-text-4">
                            <strong>ALL CRMs and Email Clients</strong>
                          </span>
                          , ensuring a seamless and universal user experience.
                        </p>
                      </div>
                    </div>
                  </FaqAccordion>

                  <FaqAccordion question="💰 Is there a Free Trial on Paid Plan?">
                    <div className="margin-bottom margin-small">
                      <div className="max-width-large">
                        <p className="margin-top-2">
                          <strong>Yes</strong>, Mail Signature provides a{" "}
                          <strong>7-day risk-free trial on all paid accounts.</strong>
                        </p>
                      </div>
                    </div>
                  </FaqAccordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
