"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

/**
 * Local replacement for Webflow's IX2-driven Lottie element.
 * The originals ship `data-autoplay="0" data-loop="0"` and are started by IX2 when the
 * element scrolls into view — here an IntersectionObserver plays each animation once.
 */
function LottieOnView({ src, className }: { src: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let animation: AnimationItem | null = null;
    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void import("lottie-web").then(({ default: lottie }) => {
          if (cancelled || !containerRef.current) return;
          animation = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            path: src,
          });
        });
      },
      // threshold 0 + a rootMargin, NOT a ratio: the container is 0px tall until
      // lottie-web renders into it, and a zero-height box can never satisfy a
      // ratio threshold — the observer would never fire and the card stays blank.
      { threshold: 0, rootMargin: "200px 0px" }
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      animation?.destroy();
      animation = null;
    };
  }, [src]);

  return <div ref={containerRef} className={className} />;
}

function TryForFreeChevron() {
  return (
    <div className="button-icon is-small-203 w-embed">
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
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

function TopUserExample({ lottieSrc }: { lottieSrc: string }) {
  return (
    <div className="top-user-example-wrapper">
      <div className="esign_example_hover-evan">
        <a
          href="/generator"
          className="try-for-free_btn--b is-small-30 w-inline-block"
        >
          <div className="button-border is-small-17">
            <div className="button-inner-2 is-small-165">
              <div className="text-block-303 is-small-75">Try For Free</div>
              <div className="button-icon-wrap is-small-83">
                <TryForFreeChevron />
              </div>
            </div>
          </div>
        </a>
      </div>
      <LottieOnView className="sign_example_lottie" src={lottieSrc} />
    </div>
  );
}

const TOP_USER_LOTTIES = [
  "/ces/lottie/685c276ec25c91a6a4ebbe38_Shopify.json",
  "/ces/lottie/685be141185681649a62f22d_Cisco.json",
  "/ces/lottie/685bdcdeef6aaa7c1ab35c32_Blue-tees.json",
  "/ces/lottie/68778bcf9068f06a04059a9f_Robinhood.json",
  "/ces/lottie/68778bcf9068f06a04059a9d_Webflow.json",
  "/ces/lottie/68778bcf9068f06a04059a9e_CES-1-.json",
];

export function CesTopUsers() {
  return (
    <section className="top_user_examples_evan">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="section-inner-wrap">
            <div className="hero_grid">
              <div className="section_header_container">
                <div className="chip-wrapper">
                  <div className="section-tag-block">
                    <div className="section-sub-inner-box different-6">
                      <div className="section-sub-tag-title different-7">
                        <div className="bullet-list-icon different-8">
                          <div className="html-code different-9 w-embed">
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
                        <div className="button-text different-10">
                          Active Users
                          <br />
                        </div>
                      </div>
                    </div>
                    <div className="gradient-line"></div>
                  </div>
                </div>
                <div>
                  <div className="heading_block">
                    <h2 className="heading-style-h2">
                      <span className="highlight_text">Top User</span> Examples
                    </h2>
                  </div>
                </div>
                <div className="paragraph_wrapper">
                  <p className="text-size-medium">
                    Top professionals are using Mail Signature to enhance their branding and
                    boost engagement!
                  </p>
                </div>
              </div>
            </div>
            <div className="spacer-xlarge"></div>
            <div className="top_user_grid-evan">
              {TOP_USER_LOTTIES.map((src) => (
                <TopUserExample key={src} lottieSrc={src} />
              ))}
            </div>
            <div className="spacer-xlarge"></div>
            <div className="div-block-547">
              <a
                href="/generator"
                className="try-for-free_btn--b w-inline-block"
              >
                <div className="button-border is-small-17">
                  <div className="button-inner-2">
                    <div className="text-button text-color">Get Started, Free</div>
                    <div className="button-icon-wrap is-small-83"></div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
