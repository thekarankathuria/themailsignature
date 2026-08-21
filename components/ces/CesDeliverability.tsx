"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LIVE_TEST_MP4 =
  "/ces/video/68765933b481b51000732c9d-68efc39352a99bb7a4bc63e0_Live-Deliverability-Test-Using-Custom-EsignatureLooper-transcode.mp4";
const LIVE_TEST_WEBM =
  "/ces/video/68765933b481b51000732c9d-68efc39352a99bb7a4bc63e0_Live-Deliverability-Test-Using-Custom-EsignatureLooper-transcode.webm";
const LIVE_TEST_POSTER =
  "/ces/img/68765933b481b51000732c9d-68efc39352a99bb7a4bc63e0_Live-Deliverability-Test-Using-Custom-EsignatureLooper-poster-00001.jpg";

const PLAY_ICON = "/ces/img/6809a11fa598aea4689e2b0f_play_white.png";
const PAUSE_ICON = "/ces/img/6809a1252ebc096b0e82bfc4_pause_white.png";
const CLOSE_ICON = "/ces/img/5e39e41652d07f4cd9154ce5_black-x-icon.png";
const WAVEFORM = "/ces/img/680967e2f3cbb541d3d79ce0_waveform_audio-msg.png";

/** Hard-coded clip length used by the original countdown (inline-12.js). */
const TOTAL_SECONDS = 170;

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * React port of the `#videoWidget` embed + `inline-12.js`:
 * two stacked <video>s (`#bgVideo` loops behind, `#customVideo` is the real
 * clip), a play/pause button that swaps its icon, a timestamp counting DOWN
 * from 170s, and a close button that fades the wrapper out over 0.4s.
 */
function LiveTestVideoWidget({ onClosed }: { onClosed: () => void }) {
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [stamp, setStamp] = useState(() => fmt(TOTAL_SECONDS));
  const [closing, setClosing] = useState(false);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const handleTimeUpdate = useCallback(() => {
    const main = mainVideoRef.current;
    if (!main) return;
    setStamp(fmt(Math.max(0, TOTAL_SECONDS - Math.floor(main.currentTime))));
  }, []);

  const handlePlayPause = useCallback(() => {
    const main = mainVideoRef.current;
    if (!main) return;
    if (main.paused) {
      setStarted(true);
      void main.play();
      setPlaying(true);
    } else {
      main.pause();
      setPlaying(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    bgVideoRef.current?.pause();
    mainVideoRef.current?.pause();
    setClosing(true);
    closeTimer.current = setTimeout(onClosed, 400);
  }, [onClosed]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
        background: "rgba(0,0,0,0.75)",
        transition: "opacity 0.4s ease",
        opacity: closing ? 0 : 1,
      }}
    >
      <div
        id="videoWidget"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "960px",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          boxSizing: "border-box",
          padding: "5px",
          borderRadius: "15px",
          background: "#000",
        }}
      >
        {/* Top left name block */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            zIndex: 3,
            padding: "8px 12px",
            borderRadius: "10px",
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(8px)",
            color: "white",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            lineHeight: 1.2,
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 600 }}>Evan Nicolini</div>
          <div style={{ fontSize: "11px", opacity: 0.8 }}>Founder</div>
        </div>

        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "32px",
            height: "32px",
            border: "none",
            borderRadius: "50%",
            background:
              "#ea4335, rgba(0,122,255,0.2))",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 3,
          }}
        >
          <img
            src={CLOSE_ICON}
            alt="close"
            style={{ width: "20px", height: "20px", filter: "invert(1)" }}
          />
        </button>

        <video
          ref={bgVideoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={LIVE_TEST_POSTER}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            display: started ? "none" : "block",
          }}
        >
          <source src={LIVE_TEST_MP4} type="video/mp4" />
          <source src={LIVE_TEST_WEBM} type="video/webm" />
        </video>

        <video
          ref={mainVideoRef}
          preload="auto"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
            display: started ? "block" : "none",
          }}
        >
          <source src={LIVE_TEST_MP4} type="video/mp4" />
          <source src={LIVE_TEST_WEBM} type="video/webm" />
        </video>

        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            right: "10px",
            height: "48px",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            padding: "0 5px",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.01)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            zIndex: 2,
            gap: "12px",
            boxSizing: "border-box",
          }}
        >
          <div
            role="button"
            tabIndex={0}
            aria-label={playing ? "Pause" : "Play"}
            onClick={handlePlayPause}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handlePlayPause();
              }
            }}
            style={{
              width: "32px",
              height: "32px",
              background: "#007AFF",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <img
              src={playing ? PAUSE_ICON : PLAY_ICON}
              alt={playing ? "pause" : "play"}
              style={{ width: "12px", height: "12px" }}
            />
          </div>
          <img
            src={WAVEFORM}
            alt="waveform"
            style={{ height: "28px", width: "100%", objectFit: "contain" }}
          />
          <div
            style={{
              fontSize: "12px",
              color: "white",
              background: "rgba(255,255,255,0.15)",
              padding: "0 13px",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            {stamp}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CesDeliverability() {
  const [playerOpen, setPlayerOpen] = useState(false);

  return (
    <div id="deliverability" className="deliverability">
      <div className="bg-image">
        <img
          src="/ces/img/6889e2599d75a87197266283_BG.avif"
          loading="lazy"
          sizes="(max-width: 2160px) 100vw, 2160px"
          srcSet="/ces/img/6889e2599d75a87197266283_BG-p-500.png 500w, /ces/img/6889e2599d75a87197266283_BG-p-800.png 800w, /ces/img/6889e2599d75a87197266283_BG-p-1080.png 1080w, /ces/img/6889e2599d75a87197266283_BG-p-1600.png 1600w, /ces/img/6889e2599d75a87197266283_BG.avif 2160w"
          alt=""
          className="deliveribility-bg-image"
        />
      </div>
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="email-deliverabity-wrapper">
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
                              <g clipPath="url(#clip0_2003_12337_deliverability)">
                                <path
                                  d="M13.3661 7.84124L6.36608 15.3412C6.29189 15.4204 6.19398 15.4733 6.0871 15.4919C5.98022 15.5106 5.87019 15.4939 5.77359 15.4445C5.677 15.3952 5.59909 15.3157 5.55162 15.2181C5.50415 15.1206 5.4897 15.0102 5.51045 14.9037L6.4267 10.3206L2.82483 8.96812C2.74747 8.93918 2.67849 8.89154 2.62404 8.82944C2.56959 8.76733 2.53138 8.69271 2.5128 8.61224C2.49423 8.53176 2.49589 8.44794 2.51761 8.36826C2.53934 8.28858 2.58047 8.21552 2.63733 8.15562L9.63733 0.655618C9.71151 0.576453 9.80942 0.523563 9.9163 0.504929C10.0232 0.486295 10.1332 0.502928 10.2298 0.552319C10.3264 0.60171 10.4043 0.681178 10.4518 0.778732C10.4992 0.876285 10.5137 0.986631 10.493 1.09312L9.5742 5.68124L13.1761 7.03187C13.2529 7.061 13.3213 7.10859 13.3753 7.17045C13.4293 7.2323 13.4673 7.30651 13.4858 7.38652C13.5044 7.46652 13.5029 7.54986 13.4816 7.62917C13.4603 7.70848 13.4197 7.78132 13.3636 7.84124H13.3661Z"
                                  fill="url(#paint0_linear_2003_12337_deliverability)"
                                />
                              </g>
                              <defs>
                                <linearGradient
                                  id="paint0_linear_2003_12337_deliverability"
                                  x1="2.5"
                                  y1="7.99843"
                                  x2="13.4987"
                                  y2="7.99843"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#EA4335" />
                                  <stop offset="1" stopColor="#EA4335" />
                                </linearGradient>
                                <clipPath id="clip0_2003_12337_deliverability">
                                  <rect width="16" height="16" fill="white" />
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
                <div className="heading_block">
                  <h2 className="heading-style-h2">
                    Optimized for{" "}
                    <span className="highlight_text">Perfect Deliverability</span>
                  </h2>
                </div>
                <div className="paragraph_wrapper">
                  <p className="text-size-medium">
                    Built with clean code and secure hosting to ensure every email
                    gets through.
                  </p>
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPlayerOpen(true);
                  }}
                  className="lightbox-link loom-video w-inline-block w-lightbox"
                >
                  <div className="white_cta_btn">
                    <div className="button-border-b">
                      <div className="button-text-wrap-b reduce-padding">
                        <div className="div-block-582">
                          <div className="btn_bg_video">
                            <div
                              data-poster-url={LIVE_TEST_POSTER}
                              data-video-urls={`${LIVE_TEST_MP4},${LIVE_TEST_WEBM}`}
                              data-autoplay="true"
                              data-loop="true"
                              className="background-video w-background-video w-background-video-atom"
                            >
                              <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                data-object-fit="cover"
                                style={{
                                  backgroundImage: `url(${LIVE_TEST_POSTER})`,
                                }}
                              >
                                <source src={LIVE_TEST_MP4} />
                                <source src={LIVE_TEST_WEBM} />
                              </video>
                            </div>
                          </div>
                          <div className="div-block-581">
                            <div className="button_arrow-2 w-embed">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_3180_9430)">
                                  <path
                                    d="M12.668 8C12.6683 8.1567 12.6288 8.31083 12.5531 8.44741C12.4774 8.58398 12.3682 8.69835 12.2361 8.77939L4.04979 13.8641C3.91177 13.95 3.75369 13.9968 3.59188 13.9998C3.43006 14.0029 3.27039 13.962 3.12933 13.8814C2.98962 13.8021 2.87324 13.6865 2.79215 13.5463C2.71107 13.4062 2.6682 13.2467 2.66797 13.0842V2.91582C2.6682 2.7533 2.71107 2.59378 2.79215 2.45365C2.87324 2.31353 2.98962 2.19786 3.12933 2.11855C3.27039 2.03799 3.43006 1.99712 3.59188 2.00016C3.75369 2.0032 3.91177 2.05005 4.04979 2.13586L12.2361 7.22061C12.3682 7.30165 12.4774 7.41602 12.5531 7.55259C12.6288 7.68917 12.6683 7.8433 12.668 8Z"
                                    fill="#030712"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_3180_9430">
                                    <rect width="16" height="16" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <div className="text-button">Watch Live Test</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="spacer-xxlarge"></div>
            <div className="img-contant">
              <div className="img-wraper">
                <img
                  src="/ces/img/6889e09e907a1a3f0ab45902_Card-Graphic-Container-3.avif"
                  loading="lazy"
                  alt=""
                  className="deliverability-img"
                />
                <div className="content-wrapper">
                  <div className="text-wrapper deliverability-section">
                    <div className="text-size-medium text-weight-semibold text-align-center">
                      Unchanged Email Content
                    </div>
                    <div className="spacer-custom1 _10px"></div>
                    <div className="text-size-small text-align-center">
                      We never alter your email body content, ensuring it passes
                      through filters without issues.
                    </div>
                  </div>
                </div>
              </div>
              <div className="img-wraper">
                <img
                  src="/ces/img/6889e09e8c4c7b8ad6f356b4_Card-Graphic-Container-2.avif"
                  loading="lazy"
                  sizes="(max-width: 594px) 100vw, 594px"
                  srcSet="/ces/img/6889e09e8c4c7b8ad6f356b4_Card-Graphic-Container-2-p-500.png 500w, /ces/img/6889e09e8c4c7b8ad6f356b4_Card-Graphic-Container-2.avif 594w"
                  alt=""
                  className="deliverability-img"
                />
                <div className="content-wrapper">
                  <div className="text-wrapper deliverability-section">
                    <div className="text-size-medium text-weight-semibold text-align-center">
                      Trusted Domain Hosting
                    </div>
                    <div className="spacer-custom1 _10px"></div>
                    <div className="text-size-small text-align-center">
                      Images and assets are securely hosted on high-trust domains
                      to ensure deliverability.
                    </div>
                  </div>
                </div>
              </div>
              <div className="img-wraper">
                <img
                  src="/ces/img/6889e09e08e11998a7c5da5d_Card-Graphic-Container-1.avif"
                  loading="lazy"
                  alt=""
                  className="deliverability-img"
                />
                <div className="content-wrapper">
                  <div className="text-wrapper deliverability-section">
                    <div className="text-size-medium text-weight-semibold text-align-center">
                      No Flagged Code
                    </div>
                    <div className="spacer-custom1 _10px"></div>
                    <div className="text-size-small text-align-center">
                      Our signatures are built with clean, standard
                      HTML/CSS—nothing that will trigger spam filters.
                    </div>
                  </div>
                </div>
              </div>
              <div className="img-wraper">
                <img
                  src="/ces/img/6889e140d508965b9193798e_Card-Graphic-Container1.avif"
                  loading="lazy"
                  alt=""
                  className="deliverability-img"
                />
                <div className="content-wrapper">
                  <div className="text-wrapper deliverability-section">
                    <div className="text-size-medium text-weight-semibold text-align-center">
                      No Tracking Pixels
                    </div>
                    <div className="spacer-custom1 _10px"></div>
                    <div className="text-size-small text-align-center">
                      We don’t use any tracking pixels that could flag your email
                      or harm your reputation.
                    </div>
                  </div>
                </div>
              </div>
              <div className="img-wraper">
                <img
                  src="/ces/img/6889e09e216bbf489295c998_Card-Graphic-Container-4.avif"
                  loading="lazy"
                  sizes="(max-width: 584px) 100vw, 584px"
                  srcSet="/ces/img/6889e09e216bbf489295c998_Card-Graphic-Container-4-p-500.png 500w, /ces/img/6889e09e216bbf489295c998_Card-Graphic-Container-4.avif 584w"
                  alt=""
                  className="deliverability-img"
                />
                <div className="content-wrapper">
                  <div className="text-wrapper deliverability-section">
                    <div className="text-size-medium text-weight-semibold text-align-center">
                      Inbox Provider Tested
                    </div>
                    <div className="spacer-custom1 _10px"></div>
                    <div className="text-size-small text-align-center">
                      Tested across Gmail, Outlook, Yahoo, and more to ensure your
                      emails always land in the inbox.
                    </div>
                  </div>
                </div>
              </div>
              <div className="img-wraper">
                <img
                  src="/ces/img/6889e09eff8308a29e3f249a_Card-Graphic-Container.avif"
                  loading="lazy"
                  sizes="(max-width: 584px) 100vw, 584px"
                  srcSet="/ces/img/6889e09eff8308a29e3f249a_Card-Graphic-Container-p-500.png 500w, /ces/img/6889e09eff8308a29e3f249a_Card-Graphic-Container.avif 584w"
                  alt=""
                  className="deliverability-img"
                />
                <div className="content-wrapper">
                  <div className="text-wrapper deliverability-section">
                    <div className="text-size-medium text-weight-semibold text-align-center">
                      Secure Asset Delivery
                    </div>
                    <div className="spacer-custom1 _10px"></div>
                    <div className="text-size-small text-align-center">
                      All assets are securely delivered via trusted,
                      high-deliverability CDNs for safe and reliable access.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {playerOpen && (
        <LiveTestVideoWidget onClosed={() => setPlayerOpen(false)} />
      )}
    </div>
  );
}
