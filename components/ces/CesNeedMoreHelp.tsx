/**
 * `.need_more_help` — ported 1:1 from the Webflow original (contact-us.html).
 *
 * Shared by /contact-us, /support and /tutorials: all three render the identical subtree,
 * so it lives here rather than being duplicated per page.
 *
 * Theme: the chip's SVG gradient stops are flattened to the flat accent (#EA4335); the
 * original ramped #26B7FF → #1D4AFE.
 */
export function CesNeedMoreHelp() {
  return (
    <div className="need_more_help">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="text-wrapper-need-more-help">
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
                              <g clipPath="url(#clip0_2003_12337_nmh)">
                                <path
                                  d="M13.3661 7.84124L6.36608 15.3412C6.29189 15.4204 6.19398 15.4733 6.0871 15.4919C5.98022 15.5106 5.87019 15.4939 5.77359 15.4445C5.677 15.3952 5.59909 15.3157 5.55162 15.2181C5.50415 15.1206 5.4897 15.0102 5.51045 14.9037L6.4267 10.3206L2.82483 8.96812C2.74747 8.93918 2.67849 8.89154 2.62404 8.82944C2.56959 8.76733 2.53138 8.69271 2.5128 8.61224C2.49423 8.53176 2.49589 8.44794 2.51761 8.36826C2.53934 8.28858 2.58047 8.21552 2.63733 8.15562L9.63733 0.655618C9.71151 0.576453 9.80942 0.523563 9.9163 0.504929C10.0232 0.486295 10.1332 0.502928 10.2298 0.552319C10.3264 0.60171 10.4043 0.681178 10.4518 0.778732C10.4992 0.876285 10.5137 0.986631 10.493 1.09312L9.5742 5.68124L13.1761 7.03187C13.2529 7.061 13.3213 7.10859 13.3753 7.17045C13.4293 7.2323 13.4673 7.30651 13.4858 7.38652C13.5044 7.46652 13.5029 7.54986 13.4816 7.62917C13.4603 7.70848 13.4197 7.78132 13.3636 7.84124H13.3661Z"
                                  fill="url(#paint0_linear_2003_12337_nmh)"
                                ></path>
                              </g>
                              <defs>
                                <linearGradient
                                  id="paint0_linear_2003_12337_nmh"
                                  x1="2.5"
                                  y1="7.99843"
                                  x2="13.4987"
                                  y2="7.99843"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#EA4335"></stop>
                                  <stop offset="1" stopColor="#EA4335"></stop>
                                </linearGradient>
                                <clipPath id="clip0_2003_12337_nmh">
                                  <rect width="16" height="16" fill="white"></rect>
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </div>
                        <div className="button-text">
                          Resources
                          <br />
                        </div>
                      </div>
                    </div>
                    <div className="gradient-line theme-white-12"></div>
                  </div>
                </div>
                <div>
                  <div className="heading_block">
                    <h2 className="heading-style-h2 text-color">Need More Help?</h2>
                  </div>
                </div>
                <div className="paragraph_wrapper">
                  <p className="text-size-medium">
                    We&#8217;re here to support you Monday through Friday, 8am&#8211;5pm PT.
                  </p>
                </div>
              </div>
            </div>
            <div className="spacer-xlarge"></div>
            <div className="card-wrapper">
              <a href="/support" className="section-tag-block-wrap tutorial w-inline-block">
                <div className="section-sub-inner-box theme-white-8 tutorial">
                  <div>
                    <div className="bullet-list-icon theme-white-10">
                      <div className="html-code theme-white-11 w-embed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-arrow-up-right"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className="card-text-wrapper">
                      <img
                        width="32"
                        height="32"
                        alt=""
                        src="/ces/img/688c576e168b233039a06720_Icon.webp"
                        loading="lazy"
                      />
                      <div className="text-wrap">
                        <div className="text-size-medium _20px white">Contact Support</div>
                        <div className="text-size-regular">
                          We are available Mon-Fri, 8am-5pm PT.
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="gradient-line theme-white-12"></div>
              </a>
              <a href="/about" className="section-tag-block-wrap tutorial w-inline-block">
                <div className="section-sub-inner-box theme-white-8 tutorial">
                  <div>
                    <div className="bullet-list-icon theme-white-10">
                      <div className="html-code theme-white-11 w-embed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-arrow-up-right"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className="card-text-wrapper">
                      <img
                        width="32"
                        height="32"
                        alt=""
                        src="/ces/img/688c576e168b233039a0671e_Icon.svg"
                        loading="lazy"
                      />
                      <div className="text-wrap">
                        <div className="text-size-medium _20px white">About Us</div>
                        <div className="text-size-regular">
                          We are available Mon-Fri, 8am-5pm PT.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="gradient-line theme-white-12"></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
