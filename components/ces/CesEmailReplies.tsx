"use client";

import { useEffect, useRef } from "react";

const CLICKUP_LOTTIE =
  "/ces/lottie/6864cbe0637c5f167d7f554d_ClickUP-final-update-1.json";

/**
 * Local replacement for the Webflow `data-animation-type="lottie"` embed that
 * sits inside the right-hand email card. The original carries
 * `data-autoplay="1" data-loop="1" data-renderer="svg"`, so it plays
 * immediately and loops forever.
 */
function ClickUpLottie() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let destroyed = false;
    let anim: { destroy: () => void } | null = null;

    void (async () => {
      const lottie = (await import("lottie-web")).default;
      if (destroyed || !hostRef.current) return;
      anim = lottie.loadAnimation({
        container: hostRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: CLICKUP_LOTTIE,
      });
    })();

    return () => {
      destroyed = true;
      anim?.destroy();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-animation-type="lottie"
      data-src={CLICKUP_LOTTIE}
      data-loop="1"
      data-direction="1"
      data-autoplay="1"
      data-renderer="svg"
      data-duration="0"
      data-loading="eager"
    />
  );
}

export function CesEmailReplies() {
  return (
    <div className="email-replies">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="email-replies-wrapper">
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
                                />
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
                                  <stop stopColor="#EA4335" />
                                  <stop offset="1" stopColor="#EA4335" />
                                </linearGradient>
                                <clipPath id="clip0_2003_12337">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </div>
                        <div className="button-text different-10">
                          2x Your Replies
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
                      The Email That Wins More{" "}
                      <span className="highlight_text">Replies</span>
                    </h2>
                  </div>
                </div>
                <div className="paragraph_wrapper">
                  <p className="text-size-medium">
                    Discover the subject lines and email formats that drive higher
                    engagement and boost response rates.
                  </p>
                </div>
              </div>
            </div>
            <div className="spacer-xxlarge"></div>
            <div className="email-list">
              <div className="email-wins-left-item">
                <div className="email-wins-left-top">
                  <div className="email-signature-info">
                    <div className="email-author-image">
                      <img
                        alt="User Icon"
                        src="/ces/img/6877942d5e8e546274df7d25_User-Icon.svg"
                        className="image"
                      />
                    </div>
                    <div className="left-item-info">
                      <div className="left-item-email-title">
                        Mail Signature
                      </div>
                      <div className="left-item-email-to">
                        to:{" "}
                        <a
                          href="mailto:evannicolini@example.com"
                          className="__cf_email__"
                        >
                          evannicolini@example.com
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="left-replay-icon-box">
                    <img
                      alt="Reply Icon"
                      src="/ces/img/6877942d5e8e546274df7d27_reply-2.svg"
                      className="replay-icon-1"
                    />
                    <img
                      alt="Delete Icon"
                      src="/ces/img/6877942d5e8e546274df7d26_reply-1.svg"
                      className="replay-icon-1"
                    />
                  </div>
                </div>
                <div className="left-email-massage-box">
                  <div className="text-email">Hey Zach,</div>
                  <div className="massage-line"></div>
                  <div className="massage-line _2"></div>
                </div>
                <div className="left-email-deatils">
                  <div className="text-email">Best,</div>
                  <div className="left-evan-nicolini-block">
                    <div className="name-text">Zeb Evans</div>
                    <ul role="list" className="list-2 w-list-unstyled">
                      <li className="list-item">CEO -Founder</li>
                      <li className="list-item">Click Up</li>
                      <li className="list-item">www.clickup.com</li>
                      <li className="list-item">
                        <a
                          href="mailto:click@mailsignature.com"
                          className="__cf_email__"
                        >
                          click@mailsignature.com
                        </a>
                      </li>
                      <li className="list-item">
                        Website, Instagram, , LinkedIn, Facebook, Youtube
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="left-bittom-block">
                  <div className="toggle-text">
                    <div className="toggle-button">
                      <img
                        alt="Switch Icon"
                        src="/ces/img/6877942d5e8e546274df7d28_Toggle.svg"
                        className="image"
                      />
                    </div>
                    <div className="ces-toggle_text">Mail Signature</div>
                  </div>
                  <div className="footer-action-block">
                    <a href="#" className="footer-action-button w-inline-block">
                      <img
                        width="10"
                        src="/ces/img/6877942d5e8e546274df7d29_delete-1.svg"
                        alt="Reply Icon"
                        className="action-icon"
                      />
                      <div className="text">Reply</div>
                    </a>
                    <a href="#" className="footer-action-button w-inline-block">
                      <img
                        alt="Delete Icon"
                        src="/ces/img/6877942d5e8e546274df7d2a_delete-1-1-.svg"
                        className="action-icon"
                      />
                      <div className="text">Delete</div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="hero-littie-line-wrper">
                <div className="email-wins-left-item">
                  <div className="email-wins-right-top">
                    <div className="email-signature-info">
                      <div className="email-author-image">
                        <img
                          alt="User Icon"
                          src="/ces/img/6877942d5e8e546274df7d2d_User-Avatar.webp"
                          className="image"
                        />
                      </div>
                      <div className="left-item-info">
                        <div className="left-item-email-title">
                          Mail Signature
                        </div>
                        <div className="left-item-email-to">
                          to:{" "}
                          <a
                            href="mailto:evannicolini@example.com"
                            className="__cf_email__"
                          >
                            evannicolini@example.com
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="right-replay-icon-box">
                      <img
                        alt="Reply Icon"
                        src="/ces/img/6877942d5e8e546274df7d27_reply-2.svg"
                        className="right-replay-icon-1"
                      />
                      <img
                        alt="Delete Icon"
                        src="/ces/img/6877942d5e8e546274df7d26_reply-1.svg"
                        className="right-replay-icon-2"
                      />
                    </div>
                  </div>
                  <div className="left-email-massage-box">
                    <div className="text-email">Hey Zach,</div>
                    <div className="massage-line"></div>
                    <div className="massage-line _2"></div>
                  </div>
                  <div className="right-email-deatils">
                    <div className="text-email">Best,</div>
                    <div className="left-evan-nicolini-block border">
                      <ClickUpLottie />
                    </div>
                  </div>
                  <div className="left-bittom-block">
                    <div className="toggle-text">
                      <div className="toggle-button">
                        <img
                          alt="Switch Icon"
                          src="/ces/img/6877942d5e8e546274df7d2b_Toggle-2-.svg"
                          className="image"
                        />
                      </div>
                      <div className="ces-toggle_text">Mail Signature</div>
                    </div>
                    <div className="footer-action-block">
                      <a href="#" className="footer-action-button w-inline-block">
                        <img
                          width="10"
                          src="/ces/img/6877942d5e8e546274df7d29_delete-1.svg"
                          alt="Reply Icon"
                          className="action-icon"
                        />
                        <div className="text">Reply</div>
                      </a>
                      <a href="#" className="footer-action-button w-inline-block">
                        <img
                          alt="Delete Icon"
                          src="/ces/img/6877942d5e8e546274df7d2a_delete-1-1-.svg"
                          className="action-icon"
                        />
                        <div className="text">Delete</div>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="email-line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
