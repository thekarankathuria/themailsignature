"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

/**
 * `.integrations` — ported 1:1 from the Webflow original.
 *
 * The concentric-ring orbit graphic is NOT markup: the original ships a single empty
 * Webflow Lottie element inside `.crm-wrapper` whose JSON draws the rings and every app
 * icon (Gmail / Apple / Outlook / Windows / generic mail …). Webflow's runtime attributes
 * were `data-renderer="svg" data-autoplay="1" data-loop="0" data-loading="eager"`, so the
 * clone loads it eagerly on mount and plays it through once without looping.
 */
const CRM_LOTTIE = "/ces/lottie/6878863e78110d9d4f3fd665_Email-CRM-transperent-STATIC-3-.json";

function CrmLottie() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let animation: AnimationItem | null = null;
    let cancelled = false;

    void import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) return;
      animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: CRM_LOTTIE,
      });
    });

    return () => {
      cancelled = true;
      animation?.destroy();
      animation = null;
    };
  }, []);

  return <div ref={containerRef} />;
}

export function CesIntegrations() {
  return (
    <div className="integrations">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="integration-wrapper">
            <div className="hero_grid">
              <div className="section_header_container">
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
                      <div className="button-text">Integrations</div>
                    </div>
                  </div>
                  <div className="gradient-line theme-white-12"></div>
                </div>
                <div>
                  <div className="heading_block">
                    <h2 className="heading-style-h2 text-color">Works with ANY Email or CRM</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="spacer-xlarge"></div>
            <div className="crm-wrapper">
              <CrmLottie />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
