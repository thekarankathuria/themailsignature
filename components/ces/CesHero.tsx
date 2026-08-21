const videoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
} as const;

export function CesHero() {
  return (
    <section className="section_hero">
      <div className="container-large">
        <div className="hero-grid-relative padding-top">
          <div className="hero_grid">
            <div className="spacer-xlarge hide"></div>
            <div className="hero_tag-block">
              <div className="hero_tag-border">
                <div className="gradient-line"></div>
                <div className="hero_tag_inner-box">
                  <div className="bullet_list-icon">
                    <div className="tag_icon w-embed">
                      <svg
                        width="16"
                        height="16"
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
                  <div className="highlight-text text-size-small">Supercharge</div>
                </div>
              </div>
              <div className="text-size-xsmall">Your Email Signature</div>
            </div>
            <div className="hero_content">
              <div>
                {/*
                  The hero's two heading lines keep their original classes — the styling is
                  entirely class-driven — but the tags are swapped so the keyword-bearing
                  line is the page's single <h1>. The `heading_block` line already had the
                  highlight span, so carrying "Email Signature Generator" into it is a
                  two-word edit.
                */}
                <h2 className="heading home-hero">Standout In Every Inbox!{" "}</h2>
                <div className="heading_block">
                  <img
                    src="/ces/brand/mail-heading-icon.svg"
                    alt=""
                    width="Auto"
                    className="image-3"
                  />
                  {/*
                    "Email Signature Generator" is wider than the original phrase, so it no
                    longer fits this heading column at the inherited 64px. The fit is handled
                    in `app/ces-extra.css` (`.section_hero .heading_block .heading`), which
                    pins the line to `nowrap` and scales the type to the viewport.
                  */}
                  <h1 className="heading">
                    {/*
                      `.heading` is a flex container, so the span and the trailing word are
                      separate anonymous flex items and the ordinary space between them is
                      stripped — it renders "SignatureGenerator". A non-breaking space is not
                      collapsible whitespace, so it survives. (The same clone-wide quirk still
                      affects `CesVideoTutorials`, which is left verbatim.)
                    */}
                    <span className="highlight_text">Email Signature</span>&nbsp;Generator
                  </h1>
                </div>
              </div>
              <div className="paragraph_wrapper">
                <p className="text-size-medium hero-paragraph">
                  Boost replies, drive traffic, and stand out — all through your email
                  signature.
                </p>
              </div>
            </div>
            <div className="button-wrapper">
              <a
                href="/generator"
                className="try-for-free_btn--b w-inline-block"
              >
                <div className="button-border is-small-17">
                  <div className="button-inner-2">
                    <div className="text-button text-color">Get Started, FREE!</div>
                    <div className="button-icon-wrap is-small-83"></div>
                  </div>
                </div>
              </a>
              <a href="#" className="lightbox-link w-inline-block w-lightbox">
                <div className="white_cta_btn">
                  <div className="button-border-b">
                    <div className="button-text-wrap-b">
                      <div className="text-button">See how it Works</div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className="rating">
              <div className="rating-wrapper">
                <img
                  src="/ces/img/687738c763e7beb14e6cd4a5_image-139.webp"
                  loading="lazy"
                  alt=""
                  className="icon"
                />
                <div className="icon-wraper">
                  <img
                    src="/ces/img/68773524697af41d4e3c1837_Star-2.svg"
                    loading="lazy"
                    alt=""
                    className="star-icon"
                  />
                  <img
                    src="/ces/img/68773524697af41d4e3c1837_Star-2.svg"
                    loading="lazy"
                    alt=""
                    className="star-icon"
                  />
                  <img
                    src="/ces/img/68773524697af41d4e3c1837_Star-2.svg"
                    loading="lazy"
                    alt=""
                    className="star-icon"
                  />
                  <img
                    src="/ces/img/68773524697af41d4e3c1837_Star-2.svg"
                    loading="lazy"
                    alt=""
                    className="star-icon"
                  />
                  <img
                    src="/ces/img/68773524697af41d4e3c1837_Star-2.svg"
                    loading="lazy"
                    alt=""
                    className="star-icon"
                  />
                </div>
                <div className="text-block">5.0</div>
              </div>
              <div className="line"></div>
              <div className="rating-wrapper">
                <img
                  src="/ces/img/68773524ac361105eed76019_image.svg"
                  loading="lazy"
                  alt=""
                  className="icon"
                />
                <div className="icon-wraper">
                  <img
                    src="/ces/img/68773524697af41d4e3c1837_Star-2.svg"
                    loading="lazy"
                    alt=""
                    className="star-icon"
                  />
                  <img
                    src="/ces/img/68773524697af41d4e3c1837_Star-2.svg"
                    loading="lazy"
                    alt=""
                    className="star-icon"
                  />
                  <img
                    src="/ces/img/68773524697af41d4e3c1837_Star-2.svg"
                    loading="lazy"
                    alt=""
                    className="star-icon"
                  />
                  <img
                    src="/ces/img/68773524697af41d4e3c1837_Star-2.svg"
                    loading="lazy"
                    alt=""
                    className="star-icon"
                  />
                  <img
                    src="/ces/img/68773524697af41d4e3c1837_Star-2.svg"
                    loading="lazy"
                    alt=""
                    className="star-icon"
                  />
                </div>
                <div className="text-block">5.0</div>
              </div>
            </div>
          </div>
          <div className="background-image">
            <img
              src="/ces/img/68773a27596c118e17e98b6e_Hero-bg.webp"
              loading="lazy"
              sizes="(max-width: 2882px) 100vw, 2882px"
              srcSet="/ces/img/68773a27596c118e17e98b6e_Hero-bg-p-500.png 500w, /ces/img/68773a27596c118e17e98b6e_Hero-bg-p-800.png 800w, /ces/img/68773a27596c118e17e98b6e_Hero-bg-p-1080.png 1080w, /ces/img/68773a27596c118e17e98b6e_Hero-bg-p-1600.png 1600w, /ces/img/68773a27596c118e17e98b6e_Hero-bg.webp 2882w"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="hero_animation_container">
        <div className="hero_animation_wrapper">
          <div className="hero_animation_container desktop">
            <div className="hero_code_embed desktop w-embed">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/ces/img/688b08728ce7fc254301009e_Signature-Container.avif"
                style={videoStyle}
              >
                <source
                  src="/ces/video/22RF_10-06-26-updated-hero-animation.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
          <div className="hero_animation_container mobile">
            <div className="hero_code_embed mobile w-embed">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster=""
                style={videoStyle}
              >
                <source
                  src="/ces/video/22RF_10-06-26-updated-hero-animation.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
