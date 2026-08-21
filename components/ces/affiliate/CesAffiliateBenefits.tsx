const BENEFITS = [
  {
    icon: "/ces/img/689093f777aae2a0fd277d20_Icon.avif",
    title: "30% Recurring Commission",
    body: "Earn 30% commission on every customer you refer-month after month.",
  },
  {
    icon: "/ces/img/689093f7d051bc5b61896b52_Icon-1.avif",
    title: "Quick Payouts",
    body: "Receive your earnings promptly with our fast and reliable payout system.",
  },
  {
    icon: "/ces/img/6890943d428aae3dad5da690_Icon.avif",
    title: "No Limits on Earnings",
    body: "Refer as many users as you like—there’s no cap on your income.",
  },
  {
    icon: "/ces/img/689093f7542526804cce2c29_Icon-2.avif",
    title: "Real-Time Tracking",
    body: "View your affiliate performance with your own analytics dashboard.",
  },
];

export function CesAffiliateBenefits() {
  return (
    <div className="benefits_section">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="benefit-grid">
            <div className="benefit-text-wrapper">
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
                        Email Deliverability
                      </div>
                    </div>
                  </div>
                  <div className="gradient-line"></div>
                </div>
              </div>
              <div className="spacer-small"></div>
              <h2 className="heading-style-h1">
                Why <span className="highlight_text">Join Us</span>
              </h2>
              <div className="spacer-custom1 _10px"></div>
              <p className="text-size-regular">
                Earn more with the affiliate program that actually converts and pays on
                time.
              </p>
            </div>
            <div id="w-node-c97f05f1-0c0b-402c-365f-56a9d0e2154a-8c50f226">
              <div className="card-grid-benefit">
                {BENEFITS.map((b) => (
                  <div className="card-benefits" key={b.title}>
                    <div className="tag-main-wrapper">
                      <div className="tag-border fix-width">
                        <div className="tag-text fixwidth p-12px">
                          <img
                            src={b.icon}
                            loading="lazy"
                            alt=""
                            className="benefit-img"
                          />
                        </div>
                      </div>
                      <div className="gradient-line"></div>
                    </div>
                    <div className="spacer-medium"></div>
                    <h3 className="text-size-medium text-color">{b.title}</h3>
                    <div className="spacer-xsmall"></div>
                    <div className="text-size-small">{b.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
