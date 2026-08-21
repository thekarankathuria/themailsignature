/**
 * `.features` — ported 1:1 from the Webflow original.
 *
 * The eight cards live in a six-column grid (`.feature-content`); their placement comes
 * from `#w-node-…-00732d1f { grid-area: … }` rules in `app/ces.css`, so the `id` on every
 * `.feature-content-wraper` is load-bearing and must be kept verbatim:
 *   row 1 → 3 cards, row 2 → 2 wide cards, row 3 → 3 cards.
 */

type FeatureCard = {
  id: string;
  src: string;
  /** Only the "Verification Badge" card ships a responsive srcset in the original. */
  sizes?: string;
  srcSet?: string;
  /** The "Pro Templates" card's <img> carries no class in the original. */
  imgClassName?: string;
  title: string;
  body: string;
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: "w-node-_4f1c0da7-7854-f352-11b2-4f32b0a2c7db-00732d1f",
    src: "/ces/img/6889fb5416d63248bb2a4e4e_Card-Graphic-Container.avif",
    imgClassName: "feature-card-img",
    title: "AI Logo Animation",
    body: "Make your logo stand out with smooth, AI-powered animations.",
  },
  {
    id: "w-node-_4f1c0da7-7854-f352-11b2-4f32b0a2c7e4-00732d1f",
    src: "/ces/img/6889fb54b529a36294246a69_Card-Graphic-Container-5.avif",
    imgClassName: "feature-card-img",
    title: "Active Directory Sync",
    body: "Seamlessly sync employee details for effortless signature management.",
  },
  {
    id: "w-node-_4f1c0da7-7854-f352-11b2-4f32b0a2c7ed-00732d1f",
    src: "/ces/img/6889fb548c22dc424ed5c435_Card-Graphic-Container-6.avif",
    imgClassName: "feature-card-img",
    title: "Interactive Design",
    body: "Engaging elements that enhance email visibility and interaction.",
  },
  {
    id: "w-node-_4f1c0da7-7854-f352-11b2-4f32b0a2c7f6-00732d1f",
    src: "/ces/img/6889fb54f952fc04b165b7b2_Card-Graphic-Container-3.avif",
    imgClassName: "feature-card-img",
    title: "Mobile Responsiveness",
    body: "Perfectly optimized signatures for all screen sizes and devices.",
  },
  {
    id: "w-node-_4f1c0da7-7854-f352-11b2-4f32b0a2c7ff-00732d1f",
    src: "/ces/img/6889fb541217d7d12ace44ea_Card-Graphic-Container-4.avif",
    sizes: "(max-width: 882px) 100vw, 882px",
    srcSet:
      "/ces/img/6889fb541217d7d12ace44ea_Card-Graphic-Container-4-p-500.png 500w, /ces/img/6889fb541217d7d12ace44ea_Card-Graphic-Container-4.avif 882w",
    imgClassName: "feature-card-img",
    title: "Verification Badge",
    body: "Build trust with a verified email signature that adds credibility.",
  },
  {
    id: "w-node-_4f1c0da7-7854-f352-11b2-4f32b0a2c808-00732d1f",
    src: "/ces/img/6889fb54a2b1de5d692dabb6_Card-Graphic-Container-2.avif",
    imgClassName: "feature-card-img",
    title: "Bulk Create Signatures",
    body: "Easily generate multiple signatures for your entire team in one go.",
  },
  {
    id: "w-node-ab6fd7b0-a29c-2d19-b253-1a2834390dd9-00732d1f",
    src: "/ces/img/6889fb54985be2706adc9933_Graphic.avif",
    imgClassName: "feature-card-img",
    title: "Server Hosting",
    body: "Secure and reliable hosting to keep your signatures live 24/7.",
  },
  {
    id: "w-node-c222b315-fca4-7667-0e90-0eefc6526e54-00732d1f",
    src: "/ces/img/6889fb54b26d8eef50111586_Card-Graphic-Container-1.avif",
    title: "Pro Templates",
    body: "Access professionally designed signature templates for a polished look.",
  },
];

export function CesFeatures() {
  return (
    <div id="Features" className="features">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="features-wrapper">
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
                        <div className="button-text">Highlight Features</div>
                      </div>
                    </div>
                    <div className="gradient-line theme-white-12"></div>
                  </div>
                </div>
                <div>
                  <div className="heading_block">
                    <h2 className="heading-style-h2 text-color">Features</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="spacer-xxlarge"></div>
            <div className="features-card-wrapper">
              <div className="feature-content">
                {FEATURE_CARDS.map((card) => (
                  <div key={card.id} id={card.id} className="feature-content-wraper">
                    <img
                      src={card.src}
                      loading="lazy"
                      sizes={card.sizes}
                      srcSet={card.srcSet}
                      alt=""
                      className={card.imgClassName}
                    />
                    <div className="content-wrapper">
                      <div className="text-wrapper deliverability-section">
                        <div className="text-size-medium text-weight-semibold text-align-center text-color-alternate">
                          {card.title}
                        </div>
                        <div className="spacer-custom1 _10px"></div>
                        <div className="text-size-small text-align-center">{card.body}</div>
                      </div>
                    </div>
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
