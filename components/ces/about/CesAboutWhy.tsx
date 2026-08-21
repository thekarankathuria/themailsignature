"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

const SHOPIFY_LOTTIE = "/ces/lottie/685c276ec25c91a6a4ebbe38_Shopify.json";
const CLICKUP_LOTTIE = "/ces/lottie/685c09cf65a7b94eefa03dea_ClickUp-Final.json";

/**
 * Webflow Lottie element inside `.lottie-scroller-wraper`. Both animations were
 * `data-autoplay="1" data-loop="1" data-renderer="svg" data-loading="eager"`, so
 * they load on mount and loop forever.
 */
function LottieBox({ path }: { path: string }) {
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
        path,
      });
    });

    return () => {
      cancelled = true;
      animation?.destroy();
      animation = null;
    };
  }, [path]);

  return <div ref={containerRef} className="lottie-animation-78" />;
}

export function CesAboutWhy() {
  return (
    <div className="why_choose_us">
      <div className="padding-section-medium">
        <div className="container-large">
          <div>
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
                              <g clipPath="url(#clip0_2003_12337_about_why)">
                                <path
                                  d="M13.3661 7.84124L6.36608 15.3412C6.29189 15.4204 6.19398 15.4733 6.0871 15.4919C5.98022 15.5106 5.87019 15.4939 5.77359 15.4445C5.677 15.3952 5.59909 15.3157 5.55162 15.2181C5.50415 15.1206 5.4897 15.0102 5.51045 14.9037L6.4267 10.3206L2.82483 8.96812C2.74747 8.93918 2.67849 8.89154 2.62404 8.82944C2.56959 8.76733 2.53138 8.69271 2.5128 8.61224C2.49423 8.53176 2.49589 8.44794 2.51761 8.36826C2.53934 8.28858 2.58047 8.21552 2.63733 8.15562L9.63733 0.655618C9.71151 0.576453 9.80942 0.523563 9.9163 0.504929C10.0232 0.486295 10.1332 0.502928 10.2298 0.552319C10.3264 0.60171 10.4043 0.681178 10.4518 0.778732C10.4992 0.876285 10.5137 0.986631 10.493 1.09312L9.5742 5.68124L13.1761 7.03187C13.2529 7.061 13.3213 7.10859 13.3753 7.17045C13.4293 7.2323 13.4673 7.30651 13.4858 7.38652C13.5044 7.46652 13.5029 7.54986 13.4816 7.62917C13.4603 7.70848 13.4197 7.78132 13.3636 7.84124H13.3661Z"
                                  fill="url(#paint0_linear_2003_12337_about_why)"
                                />
                              </g>
                              <defs>
                                <linearGradient
                                  id="paint0_linear_2003_12337_about_why"
                                  x1="2.5"
                                  y1="7.99843"
                                  x2="13.4987"
                                  y2="7.99843"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#EA4335" />
                                  <stop offset="1" stopColor="#EA4335" />
                                </linearGradient>
                                <clipPath id="clip0_2003_12337_about_why">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </div>
                        <div className="button-text different-10">Why Us</div>
                      </div>
                    </div>
                    <div className="gradient-line"></div>
                  </div>
                </div>
                <div>
                  <div className="heading_block">
                    <h2 className="heading-style-h2">
                      Why to <span className="highlight_text">Choose Us</span>
                    </h2>
                  </div>
                </div>
                <div className="paragraph_wrapper">
                  <p className="text-size-medium">
                    Guiding Principles that Shape Our Vision
                  </p>
                </div>
              </div>
            </div>
            <div className="spacer-xlarge"></div>
            <div className="grid-why-chosse-us">
              <div className="card-grid">
                <div className="card-grid-wrapper">
                  <div className="why-chosse-us-card">
                    <div className="tag-main-wrapper">
                      <div className="tag-border fix-width">
                        <div className="tag-text fixwidth p-12px">
                          <img
                            src="/ces/img/688b1a569ffd057cde8ec424_Icon.avif"
                            loading="lazy"
                            width="24"
                            alt=""
                            className="card-icon"
                          />
                        </div>
                      </div>
                      <div className="gradient-line"></div>
                    </div>
                    <div className="spacer-medium"></div>
                    <h3 className="heading-style-h5 meduim">
                      Unmatched Customization
                    </h3>
                    <div className="spacer-custom1 _8px"></div>
                    <p className="text-size-small">
                      We craft solutions tailored to your unique brand, ensuring you
                      stand out with every interaction—perfect for businesses of any
                      size.
                    </p>
                  </div>
                  <div className="why-chosse-us-card">
                    <div className="tag-main-wrapper">
                      <div className="tag-border fix-width">
                        <div className="tag-text fixwidth p-12px">
                          <img
                            src="/ces/img/688b1a565ad588b050500bbe_Icon-1.avif"
                            loading="lazy"
                            width="24"
                            alt=""
                            className="card-icon"
                          />
                        </div>
                      </div>
                      <div className="gradient-line"></div>
                    </div>
                    <div className="spacer-medium"></div>
                    <h3 className="heading-style-h5 meduim">
                      Proven Engagement Boost
                    </h3>
                    <div className="spacer-custom1 _8px"></div>
                    <p className="text-size-small">
                      Our innovative tools are designed to increase clicks,
                      responses, and connections, driving real results you can
                      measure.
                    </p>
                  </div>
                  <div className="why-chosse-us-card">
                    <div className="tag-main-wrapper">
                      <div className="tag-border fix-width">
                        <div className="tag-text fixwidth p-12px">
                          <img
                            src="/ces/img/688b1a56afcec33df73d875c_Icon-2.avif"
                            loading="lazy"
                            width="24"
                            alt=""
                            className="card-icon"
                          />
                        </div>
                      </div>
                      <div className="gradient-line"></div>
                    </div>
                    <div className="spacer-medium"></div>
                    <h3 className="heading-style-h5 meduim">
                      Cutting-Edge Creativity
                    </h3>
                    <div className="spacer-custom1 _8px"></div>
                    <p className="text-size-small">
                      From dynamic animations to interactive designs, we deliver
                      next-gen features that keep you ahead of the competition.
                    </p>
                  </div>
                </div>
              </div>
              <div className="div-block-549">
                <div className="card-2">
                  <img
                    width="Auto"
                    sizes="(max-width: 900px) 100vw, 900px"
                    alt=""
                    src="/ces/img/688b1e356420f1907bcd8a2f_bg-Card-why-choose-us.avif"
                    loading="lazy"
                    srcSet="/ces/img/688b1e356420f1907bcd8a2f_bg-Card-why-choose-us-p-500.png 500w, /ces/img/688b1e356420f1907bcd8a2f_bg-Card-why-choose-us-p-800.png 800w, /ces/img/688b1e356420f1907bcd8a2f_bg-Card-why-choose-us.avif 900w"
                    className="card-bg-img"
                  />
                  <div className="header-style-3">
                    <div className="section-tag-block-5 about">
                      <div className="section-sub-inner-box fix-width about">
                        <div className="section-sub-tag-title fixwidth about icon">
                          <img
                            loading="lazy"
                            src="/ces/img/6822f44aeac1067db82c3c6d_Logo-Mark.svg"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="gradient-line"></div>
                    </div>
                  </div>
                  <div className="lottie-slider">
                    <div className="lottie-scroller-wraper">
                      <div className="lottie-holder">
                        <LottieBox path={SHOPIFY_LOTTIE} />
                        <LottieBox path={CLICKUP_LOTTIE} />
                      </div>
                    </div>
                    <div className="l-side-gradiant"></div>
                    <div className="r-side-gradiant"></div>
                  </div>
                  <div className="content-style-9">
                    <div className="title-style-39">
                      <img
                        width="Auto"
                        height="Auto"
                        alt=""
                        src="/ces/img/688b1bd00dacb2b7b3086873_Frame-1707479366.webp"
                        loading="lazy"
                        srcSet="/ces/img/688b1bd00dacb2b7b3086873_Frame-1707479366.webp 500w, /ces/img/688b1bd00dacb2b7b3086873_Frame-1707479366.webp 800w, /ces/img/688b1bd00dacb2b7b3086873_Frame-1707479366.webp 1080w"
                        sizes="(max-width: 1080px) 100vw, 1080px"
                        className="happy-clinet"
                      />
                    </div>
                    <div className="crad-wrapper">
                      <div className="top-card">
                        <div className="card">
                          <div className="title-style-29">50,000+</div>
                          <div className="title-style-34">Signature Created</div>
                        </div>
                        <div className="card">
                          <div className="title-style-29">2x</div>
                          <div className="title-style-34">Reply Rate</div>
                        </div>
                      </div>
                      <div className="bottom-card">
                        <div className="card">
                          <div className="title-style-29">3x</div>
                          <div className="title-style-34">Link Clicks</div>
                        </div>
                        <div className="card">
                          <div className="title-style-29">100%</div>
                          <div className="title-style-34">Social Credibilty</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-grid">
                <div className="card-grid-wrapper">
                  <div className="why-chosse-us-card">
                    <div className="tag-main-wrapper">
                      <div className="tag-border fix-width">
                        <div className="tag-text fixwidth p-12px">
                          <img
                            src="/ces/img/688b1a562be3545c6886cb77_Icon-3.avif"
                            loading="lazy"
                            width="24"
                            alt=""
                            className="card-icon"
                          />
                        </div>
                      </div>
                      <div className="gradient-line"></div>
                    </div>
                    <div className="spacer-medium"></div>
                    <h3 className="heading-style-h5 meduim">Trusted by Thousands</h3>
                    <div className="spacer-custom1 _8px"></div>
                    <p className="text-size-small">
                      Join a community of satisfied clients—from startups to
                      enterprises—who rely on us to elevate their presence and
                      performance.
                    </p>
                  </div>
                  <div className="why-chosse-us-card">
                    <div className="tag-main-wrapper">
                      <div className="tag-border fix-width">
                        <div className="tag-text fixwidth p-12px">
                          <img
                            src="/ces/img/688b1a56497f5bbf4bb5fe79_Icon-4.avif"
                            loading="lazy"
                            width="24"
                            alt=""
                            className="card-icon"
                          />
                        </div>
                      </div>
                      <div className="gradient-line"></div>
                    </div>
                    <div className="spacer-medium"></div>
                    <h3 className="heading-style-h5 meduim">Seamless Simplicity</h3>
                    <div className="spacer-custom1 _8px"></div>
                    <p className="text-size-small">
                      Get started effortlessly with user-friendly solutions that save
                      you time and let you focus on what matters most—your business.
                    </p>
                  </div>
                  <div className="why-chosse-us-card">
                    <div className="tag-main-wrapper">
                      <div className="tag-border fix-width">
                        <div className="tag-text fixwidth p-12px">
                          <img
                            src="/ces/img/688b1a56c602373898e570ca_Icon-5.avif"
                            loading="lazy"
                            width="24"
                            alt=""
                            className="card-icon"
                          />
                        </div>
                      </div>
                      <div className="gradient-line"></div>
                    </div>
                    <div className="spacer-medium"></div>
                    <h3 className="heading-style-h5 meduim">
                      Results-Driven Impact
                    </h3>
                    <div className="spacer-custom1 _8px"></div>
                    <p className="text-size-small">
                      We don’t just create—we optimize for success, turning every
                      opportunity into a chance to grow your reach and revenue.
                    </p>
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
