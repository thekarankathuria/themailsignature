const industries = [
  { name: "Real Estate Firms", blurb: "Signatures that enhance client trust." },
  { name: "Healthcare & Clinics", blurb: "Secure signatures for patient emails." },
  { name: "Finance & Banking", blurb: "Regulation-compliant signature formats." },
  { name: "Real Estate Firms", blurb: "Signatures that enhance client trust." },
  { name: "Real Estate Firms", blurb: "Signatures that enhance client trust." },
  { name: "Technology & SaaS", blurb: "Signatures that enhance client trust." },
];

export function CesBrowseIndustries() {
  return (
    <div className="supercharge-your-emails">
      <div className="padding-global">
        <div className="padding-section-medium">
          <div className="container-large">
            <div className="supercharge-main-wrapper">
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
                          <div className="button-text different-10">Industry</div>
                        </div>
                      </div>
                      <div className="gradient-line"></div>
                    </div>
                  </div>
                  <div>
                    <div className="heading_block">
                      <h2 className="heading-style-h2">
                        Built for Every <span className="highlight_text">Industry</span>
                      </h2>
                    </div>
                  </div>
                  <div className="paragraph_wrapper no-wrap">
                    <p className="text-size-medium">
                      Email signature solutions crafted for real-world business needs and
                      professional roles.
                    </p>
                  </div>
                </div>
              </div>
              <div className="spacer-xlarge"></div>
              <div className="div-block-598">
                <div className="div-block-601">
                  <div className="text-size-large _24px">INDUSRIES</div>
                  <div className="div-block-599">
                    {industries.map((industry, i) => (
                      <div className="div-block-600" key={i}>
                        <div className="tag-main-wrapper">
                          <div className="tag-border fix-width">
                            <div className="tag-text fixwidth p-12px">
                              <img
                                src="/ces/img/6971b497034e3ecf2a5176f5_company.png"
                                loading="lazy"
                                width="Auto"
                                alt="Simplified icon of a modern company building with multiple windows and an adjoining structure."
                                className="image-6"
                              />
                            </div>
                          </div>
                          <div className="gradient-line"></div>
                        </div>
                        <div className="div-block-602">
                          <div className="text-size-large black-color">
                            {industry.name}
                          </div>
                          <div className="text-size-small">{industry.blurb}</div>
                        </div>
                      </div>
                    ))}
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
