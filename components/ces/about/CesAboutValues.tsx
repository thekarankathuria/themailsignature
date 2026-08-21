"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

const CORE_VALUES_LOTTIE =
  "/ces/lottie/688b45d2eeff0d4ff07cab0d_Our-Core-Values-1.json";

/**
 * The centre graphic of `.our_core_value` is a Webflow Lottie element
 * (`data-renderer="svg" data-autoplay="1" data-loop="1" data-loading="eager"`),
 * so it loads on mount and loops forever.
 */
function CoreValuesLottie() {
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
        loop: true,
        autoplay: true,
        path: CORE_VALUES_LOTTIE,
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

export function CesAboutValues() {
  return (
    <div className="our_core_value">
      <div className="padding-section-medium">
        <div className="container-large">
          <div>
            <div className="our-core-val-ue-wrapper">
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
                                <g clipPath="url(#clip0_2003_12337_about_values)">
                                  <path
                                    d="M13.3661 7.84124L6.36608 15.3412C6.29189 15.4204 6.19398 15.4733 6.0871 15.4919C5.98022 15.5106 5.87019 15.4939 5.77359 15.4445C5.677 15.3952 5.59909 15.3157 5.55162 15.2181C5.50415 15.1206 5.4897 15.0102 5.51045 14.9037L6.4267 10.3206L2.82483 8.96812C2.74747 8.93918 2.67849 8.89154 2.62404 8.82944C2.56959 8.76733 2.53138 8.69271 2.5128 8.61224C2.49423 8.53176 2.49589 8.44794 2.51761 8.36826C2.53934 8.28858 2.58047 8.21552 2.63733 8.15562L9.63733 0.655618C9.71151 0.576453 9.80942 0.523563 9.9163 0.504929C10.0232 0.486295 10.1332 0.502928 10.2298 0.552319C10.3264 0.60171 10.4043 0.681178 10.4518 0.778732C10.4992 0.876285 10.5137 0.986631 10.493 1.09312L9.5742 5.68124L13.1761 7.03187C13.2529 7.061 13.3213 7.10859 13.3753 7.17045C13.4293 7.2323 13.4673 7.30651 13.4858 7.38652C13.5044 7.46652 13.5029 7.54986 13.4816 7.62917C13.4603 7.70848 13.4197 7.78132 13.3636 7.84124H13.3661Z"
                                    fill="url(#paint0_linear_2003_12337_about_values)"
                                  />
                                </g>
                                <defs>
                                  <linearGradient
                                    id="paint0_linear_2003_12337_about_values"
                                    x1="2.5"
                                    y1="7.99843"
                                    x2="13.4987"
                                    y2="7.99843"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stopColor="#EA4335" />
                                    <stop offset="1" stopColor="#EA4335" />
                                  </linearGradient>
                                  <clipPath id="clip0_2003_12337_about_values">
                                    <rect width="16" height="16" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                          </div>
                          <div className="button-text different-10">
                            Our Core Values
                            <br />
                          </div>
                        </div>
                      </div>
                      <div className="gradient-line"></div>
                    </div>
                  </div>
                  <div>
                    <div className="heading_block">
                      <h2 className="heading-style-h2">Our Core Values</h2>
                    </div>
                  </div>
                  <div className="paragraph_wrapper">
                    <p className="text-size-medium">What Drives Us Every Day</p>
                  </div>
                </div>
              </div>
              <div className="spacer-xlarge"></div>
              <div>
                <div className="value-wrapper">
                  <div className="value-content">
                    <div className="first-feid">
                      <div
                        id="w-node-c8c535c7-c5fb-d3e9-9409-b90bb7eb6367-cfbfa113"
                        className="card-1"
                      >
                        <div className="section-tag-block-7">
                          <div className="section-sub-inner-box fix-width">
                            <div className="section-sub-tag-title fixwidth">
                              <img
                                loading="lazy"
                                src="/ces/img/6822f44adb2fc11578885c21_Icon.svg"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="gradient-line"></div>
                        </div>
                        <div className="text-container-21">
                          <div className="title-style-40">Creativity</div>
                          <div className="description-26">
                            We push the boundaries of design and technology to
                            deliver bold, memorable solutions.
                          </div>
                        </div>
                      </div>
                      <img
                        loading="lazy"
                        src="/ces/img/68245fa573c1cd82d1d69cd5_Line-44.png"
                        alt=""
                        className="image-339"
                      />
                      <div
                        id="w-node-c8c535c7-c5fb-d3e9-9409-b90bb7eb6373-cfbfa113"
                        className="card-1"
                      >
                        <div className="section-tag-block-7">
                          <div className="section-sub-inner-box fix-width">
                            <div className="section-sub-tag-title fixwidth">
                              <img
                                loading="lazy"
                                src="/ces/img/6822f44a11c870b77f904e62_Icon.svg"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="gradient-line"></div>
                        </div>
                        <div className="text-container-21">
                          <div className="title-style-40">Simplicity</div>
                          <div className="description-26">
                            We make powerful innovation accessible and easy to use
                            for everyone.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      id="w-node-c8c535c7-c5fb-d3e9-9409-b90bb7eb637e-cfbfa113"
                      className="lottie-wrapper"
                    >
                      <CoreValuesLottie />
                    </div>
                    <div className="first-feid">
                      <div
                        id="w-node-c8c535c7-c5fb-d3e9-9409-b90bb7eb6381-cfbfa113"
                        className="card-1"
                      >
                        <div className="section-tag-block-7">
                          <div className="section-sub-inner-box fix-width">
                            <div className="section-sub-tag-title fixwidth">
                              <img
                                loading="lazy"
                                src="/ces/img/6822f44ac5493ccdcf07dabf_Icon.svg"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="gradient-line"></div>
                        </div>
                        <div className="text-container-21">
                          <div className="title-style-40">Impact</div>
                          <div className="description-26">
                            Every tool we build is focused on driving real,
                            measurable results for our users.
                          </div>
                        </div>
                      </div>
                      <div
                        id="w-node-c8c535c7-c5fb-d3e9-9409-b90bb7eb638c-cfbfa113"
                        className="div-block-551"
                      >
                        <div className="card-1">
                          <div className="section-tag-block-7">
                            <div className="section-sub-inner-box fix-width">
                              <div className="section-sub-tag-title fixwidth">
                                <img
                                  loading="lazy"
                                  src="/ces/img/6822f44a3bcd6524e8e4eab7_Icon.svg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="gradient-line"></div>
                          </div>
                          <div className="text-container-21">
                            <div className="title-style-40">Excellence</div>
                            <div className="description-26">
                              We strive for perfection in every detail, ensuring
                              top-quality outcomes.
                            </div>
                          </div>
                        </div>
                      </div>
                      <img
                        width="Auto"
                        loading="lazy"
                        alt=""
                        src="/ces/img/682460962770f51ab95fd270_Line-2.png"
                        className="image-341"
                      />
                    </div>
                    <img
                      width="70"
                      loading="lazy"
                      alt=""
                      src="/ces/img/6838443d13f78d2ac74c6411_Frame-1707479377.png"
                      className="image-340"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
