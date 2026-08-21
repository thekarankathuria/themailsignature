"use client";

import { useCallback, useRef, useState } from "react";

const LOOPER_MP4 = "/ces/video/LOOPER_4x5_Office_102--zoom_RF-25-copy.mp4";
const MAIN_MP4 = "/ces/video/4x5_Office_102--zoom_RF-25.mp4";
const PLAY_ICON = "/ces/img/6809a11fa598aea4689e2b0f_play_white.webp";

/**
 * React port of the `.about-video` embed: a muted autoplay looper sits on top
 * until the "Play Video" pill is clicked, at which point the real clip takes
 * over with native controls. When the clip ends, the looper and the pill come
 * back — exactly what the original inline script did.
 */
function AboutHeroVideo() {
  const looperRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    setPlaying(true);
    void mainRef.current?.play();
  }, []);

  const handleEnded = useCallback(() => {
    setPlaying(false);
  }, []);

  return (
    <div
      className="simple-video-wrapper"
      style={{ position: "relative", width: "100%", maxWidth: "700px", margin: "auto" }}
    >
      <video
        ref={looperRef}
        id="looperVideo"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        src={LOOPER_MP4}
        style={{
          width: "100%",
          height: "auto",
          display: playing ? "none" : "block",
        }}
      />
      <video
        ref={mainRef}
        id="mainVideo"
        controls
        playsInline
        preload="metadata"
        src={MAIN_MP4}
        onEnded={handleEnded}
        style={{
          width: "100%",
          height: "auto",
          display: playing ? "block" : "none",
        }}
      />
      <button
        id="playBtn"
        type="button"
        onClick={handlePlay}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "30px",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(8px)",
          color: "white",
          cursor: "pointer",
          zIndex: 2,
          display: playing ? "none" : "inline-flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        <img src={PLAY_ICON} alt="Play" style={{ width: "14px", height: "14px" }} />
        <span style={{ fontSize: "15px" }}>Play Video</span>
      </button>
    </div>
  );
}

export function CesAboutHero() {
  return (
    <div className="section_hero">
      <div className="container-large">
        <div className="hero-grid-relative">
          <div className="hero_grid">
            <div className="about-grid">
              <div className="about-hero-text-wrapper">
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
                            <g clipPath="url(#clip0_2003_12337_about_hero)">
                              <path
                                d="M13.3661 7.84124L6.36608 15.3412C6.29189 15.4204 6.19398 15.4733 6.0871 15.4919C5.98022 15.5106 5.87019 15.4939 5.77359 15.4445C5.677 15.3952 5.59909 15.3157 5.55162 15.2181C5.50415 15.1206 5.4897 15.0102 5.51045 14.9037L6.4267 10.3206L2.82483 8.96812C2.74747 8.93918 2.67849 8.89154 2.62404 8.82944C2.56959 8.76733 2.53138 8.69271 2.5128 8.61224C2.49423 8.53176 2.49589 8.44794 2.51761 8.36826C2.53934 8.28858 2.58047 8.21552 2.63733 8.15562L9.63733 0.655618C9.71151 0.576453 9.80942 0.523563 9.9163 0.504929C10.0232 0.486295 10.1332 0.502928 10.2298 0.552319C10.3264 0.60171 10.4043 0.681178 10.4518 0.778732C10.4992 0.876285 10.5137 0.986631 10.493 1.09312L9.5742 5.68124L13.1761 7.03187C13.2529 7.061 13.3213 7.10859 13.3753 7.17045C13.4293 7.2323 13.4673 7.30651 13.4858 7.38652C13.5044 7.46652 13.5029 7.54986 13.4816 7.62917C13.4603 7.70848 13.4197 7.78132 13.3636 7.84124H13.3661Z"
                                fill="url(#paint0_linear_2003_12337_about_hero)"
                              />
                            </g>
                            <defs>
                              <linearGradient
                                id="paint0_linear_2003_12337_about_hero"
                                x1="2.5"
                                y1="7.99843"
                                x2="13.4987"
                                y2="7.99843"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#EA4335" />
                                <stop offset="1" stopColor="#EA4335" />
                              </linearGradient>
                              <clipPath id="clip0_2003_12337_about_hero">
                                <rect width="16" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div className="button-text different-10">
                        For Real Estate Professionals
                      </div>
                    </div>
                  </div>
                  <div className="gradient-line"></div>
                </div>
                <div className="spacer-custom1"></div>
                <div>
                  <div className="heading_block text-align-left avout">
                    <h1 className="heading">More About</h1>
                    <img
                      src="/ces/brand/mail-heading-icon.svg"
                      alt=""
                      width="Auto"
                      className="image-3"
                    />
                  </div>
                  <div className="heading_block text-align-left">
                    <h2 className="heading home-hero highlight_text about">
                      Mail Signature
                    </h2>
                  </div>
                </div>
                <div className="spacer-custom1"></div>
                <p className="text-size-medium text-align-left">
                  Mail Signature is a next-generation animated interactive email
                  signature designed to increase your email response rate, social
                  media,and website traffic engagement, as well as help you standout
                  from the competition.
                </p>
                <div className="spacer-custom1 _40px"></div>
                <div className="button-wrapper">
                  <a href="/contact-us" className="try-for-free_btn--b w-inline-block">
                    <div className="button-border is-small-17">
                      <div className="button-inner-2">
                        <div className="text-button text-color">Contact Us</div>
                        <div className="button-icon-wrap is-small-83"></div>
                      </div>
                    </div>
                  </a>
                  <a
                    href="/generator"
                    className="white_cta_btn"
                  >
                    <div className="button-border-b">
                      <div className="button-text-wrap-b">
                        <div className="text-button">Get Started</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <div className="video-wrapper-about">
                <div className="about-video w-embed w-script">
                  <AboutHeroVideo />
                </div>
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
    </div>
  );
}
