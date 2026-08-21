"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * Original behaviour (docs/research/raw/js/inline-15.js):
 *   $('.slider-nav').slick({
 *     slidesToShow: 1, arrows: false, slidesToScroll: 1, focusOnSelect: true,
 *     infinite: false, centerMode: true, centerPadding: '15%',
 *     responsive: [ 991 -> '8%', 767 -> '5%', 557 -> '0%' ]
 *   });
 *   .tab-link[data-slide] -> slickGoTo(n-1);  afterChange -> re-sync .active
 * Reimplemented below with one shared index. No slick, no jQuery.
 * ------------------------------------------------------------------ */

const TAB_NAMES = ["Signature Manager", "Visual Editor", "Analytics"] as const;

type Slide = {
  copy: string;
  src: string;
  sizes: string;
  srcSet: string;
};

const SLIDES: Slide[] = [
  {
    copy: "Easily create, organize, and deploy professional email signatures for your entire team from one centralized dashboard.",
    src: "/ces/img/687a494898789cdaceb2013e_Dashboard.webp",
    sizes: "100vw",
    srcSet:
      "/ces/img/687a494898789cdaceb2013e_Dashboard.webp 500w, /ces/img/687a494898789cdaceb2013e_Dashboard.webp 800w, /ces/img/687a494898789cdaceb2013e_Dashboard.webp 1080w, /ces/img/687a494898789cdaceb2013e_Dashboard.webp 1600w, /ces/img/687a494898789cdaceb2013e_Dashboard.webp 2000w, /ces/img/687a494898789cdaceb2013e_Dashboard.webp 2600w, /ces/img/687a494898789cdaceb2013e_Dashboard.webp 3200w, /ces/img/687a494898789cdaceb2013e_Dashboard.webp 3456w",
  },
  {
    copy: "Design stunning signatures without writing a single line of code using our intuitive drag-and-drop editor.",
    src: "/ces/img/687a494898789cdaceb2012e_Editor-2025_4k.webp",
    sizes: "(max-width: 1919px) 100vw, 1600px",
    srcSet:
      "/ces/img/687a494898789cdaceb2012e_Editor-2025_4k.webp 500w, /ces/img/687a494898789cdaceb2012e_Editor-2025_4k.webp 800w, /ces/img/687a494898789cdaceb2012e_Editor-2025_4k.webp 1080w, /ces/img/687a494898789cdaceb2012e_Editor-2025_4k.webp 1600w, /ces/img/687a494898789cdaceb2012e_Editor-2025_4k.webp 2000w, /ces/img/687a494898789cdaceb2012e_Editor-2025_4k.webp 2600w, /ces/img/687a494898789cdaceb2012e_Editor-2025_4k.webp 3200w, /ces/img/687a494898789cdaceb2012e_Editor-2025_4k.webp 3456w",
  },
  {
    copy: "Track performance like never before. Our real-time analytics show impressions, clicks, and engagement across your entire team.",
    src: "/ces/img/687a494898789cdaceb2011e_Design.webp",
    sizes: "(max-width: 3456px) 100vw, 3456px",
    srcSet:
      "/ces/img/687a494898789cdaceb2011e_Design-p-500.webp 500w, /ces/img/687a494898789cdaceb2011e_Design-p-800.webp 800w, /ces/img/687a494898789cdaceb2011e_Design-p-1080.webp 1080w, /ces/img/687a494898789cdaceb2011e_Design-p-1600.webp 1600w, /ces/img/687a494898789cdaceb2011e_Design-p-2000.webp 2000w, /ces/img/687a494898789cdaceb2011e_Design-p-2600.webp 2600w, /ces/img/687a494898789cdaceb2011e_Design-p-3200.webp 3200w, /ces/img/687a494898789cdaceb2011e_Design.webp 3456w",
  },
];

/* slick's centerPadding, resolved per breakpoint (non-mobile-first). */
function centerPaddingFor(width: number): string {
  if (width <= 557) return "0%";
  if (width <= 767) return "5%";
  if (width <= 991) return "8%";
  return "15%";
}

const ACTIVE_TAB_CSS = `.tab-link.active{ color: #fff; background-image: url('/ces/img/6809fd1313286a3535235f87_bg-button.png'); background-position: 0 0; background-repeat: no-repeat; background-size: auto; }`;

const DRAG_THRESHOLD = 45;

function PlatformTabIcon() {
  return (
    <div className="platform-tab-icon w-embed">
      <svg
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.2359 12.33C16.3102 12.4589 16.3303 12.6121 16.292 12.7558C16.2536 12.8996 16.1599 13.0223 16.0312 13.0971L9.28125 17.0346C9.19524 17.0848 9.09746 17.1112 8.99789 17.1112C8.89832 17.1112 8.80054 17.0848 8.71453 17.0346L1.96453 13.0971C1.83775 13.0209 1.74608 12.8979 1.70937 12.7546C1.67265 12.6113 1.69385 12.4594 1.76836 12.3316C1.84287 12.2038 1.96471 12.1106 2.1075 12.072C2.25028 12.0334 2.40252 12.0526 2.53125 12.1254L9 15.8977L15.4687 12.1254C15.5977 12.0511 15.7508 12.0309 15.8946 12.0693C16.0383 12.1076 16.1611 12.2014 16.2359 12.33ZM15.4687 8.75041L9 12.5227L2.53125 8.75041C2.40317 8.68664 2.25561 8.67408 2.11859 8.71527C1.98157 8.75646 1.8654 8.84832 1.79372 8.97215C1.72204 9.09597 1.70024 9.24246 1.73276 9.38179C1.76528 9.52112 1.84967 9.64283 1.96875 9.72213L8.71875 13.6596C8.80476 13.7098 8.90254 13.7362 9.00211 13.7362C9.10167 13.7362 9.19946 13.7098 9.28547 13.6596L16.0355 9.72213C16.1003 9.68545 16.1572 9.63626 16.2029 9.57741C16.2485 9.51856 16.2821 9.45123 16.3015 9.37932C16.3209 9.30741 16.3259 9.23236 16.3161 9.15852C16.3063 9.08468 16.2819 9.01352 16.2444 8.94917C16.2069 8.88483 16.1569 8.82858 16.0975 8.78368C16.038 8.73879 15.9703 8.70615 15.8981 8.68766C15.826 8.66917 15.7508 8.6652 15.6771 8.67597C15.6034 8.68674 15.5326 8.71205 15.4687 8.75041ZM1.6875 5.86127C1.68772 5.76275 1.71382 5.66602 1.76318 5.58075C1.81254 5.49548 1.88343 5.42467 1.96875 5.37541L8.71875 1.43791C8.80476 1.38776 8.90254 1.36133 9.00211 1.36133C9.10167 1.36133 9.19946 1.38776 9.28547 1.43791L16.0355 5.37541C16.1204 5.42495 16.1908 5.49588 16.2398 5.58113C16.2887 5.66638 16.3145 5.76297 16.3145 5.86127C16.3145 5.95958 16.2887 6.05617 16.2398 6.14142C16.1908 6.22667 16.1204 6.29759 16.0355 6.34713L9.28547 10.2846C9.19946 10.3348 9.10167 10.3612 9.00211 10.3612C8.90254 10.3612 8.80476 10.3348 8.71875 10.2846L1.96875 6.34713C1.88343 6.29787 1.81254 6.22706 1.76318 6.1418C1.71382 6.05653 1.68772 5.95979 1.6875 5.86127ZM3.36656 5.86127L9 9.14768L14.6334 5.86127L9 2.57487L3.36656 5.86127Z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );
}

export function CesOurPlatform() {
  const [index, setIndex] = useState(0);
  const [centerPadding, setCenterPadding] = useState("15%");
  const [dragDx, setDragDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const pointerId = useRef<number | null>(null);

  /* Responsive centerPadding — matches slick's `responsive` array. */
  useEffect(() => {
    const sync = () => setCenterPadding(centerPaddingFor(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  /* infinite: false — clamp, never wrap. */
  const goTo = useCallback((next: number) => {
    setIndex(Math.min(SLIDES.length - 1, Math.max(0, next)));
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerId.current = event.pointerId;
    startX.current = event.clientX;
    setDragging(true);
    setDragDx(0);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || pointerId.current !== event.pointerId) return;
    setDragDx(event.clientX - startX.current);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== event.pointerId) return;
    pointerId.current = null;
    setDragging(false);
    if (dragDx <= -DRAG_THRESHOLD) goTo(index + 1);
    else if (dragDx >= DRAG_THRESHOLD) goTo(index - 1);
    setDragDx(0);
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, slide: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goTo(slide);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  return (
    <div className="our-platform">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="our-paltform-wrapper">
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
                        <div className="button-text">Our Product</div>
                      </div>
                    </div>
                    <div className="gradient-line theme-white-12"></div>
                  </div>
                </div>
                <div className="heading_block">
                  <h2 className="heading-style-h2 text-color">Our Platform</h2>
                </div>
              </div>
            </div>
            <div className="spacer-medium"></div>
            <div className="tab-wrapper">
              <div className="platform-tabs-wrap">
                <div className="platform-tabs">
                  <div className="tabs-menu" role="tablist" aria-label="Our Platform">
                    {TAB_NAMES.map((name, i) => (
                      <div
                        key={name}
                        data-slide={i + 1}
                        className={i === index ? "tab-link active" : "tab-link"}
                        id={`platform-tab-${i + 1}`}
                        role="tab"
                        aria-selected={i === index}
                        aria-controls={`platform-pane-${i + 1}`}
                        tabIndex={i === index ? 0 : -1}
                        onClick={() => goTo(i)}
                        onKeyDown={(event) => onTabKeyDown(event, i)}
                      >
                        <div className="platform-tab-text">
                          <PlatformTabIcon />
                          <div className="tab-name">{name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="spacer-custom1"></div>
                  <div className="slider-nav">
                    <div
                      style={{
                        width: "100%",
                        overflow: "hidden",
                        paddingLeft: centerPadding,
                        paddingRight: centerPadding,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          touchAction: "pan-y",
                          cursor: dragging ? "grabbing" : "grab",
                          transform: `translateX(calc(${-index * 100}% + ${dragDx}px))`,
                          transition: dragging
                            ? "none"
                            : "transform .5s cubic-bezier(.65,.05,.36,1)",
                        }}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                      >
                        {SLIDES.map((slide, i) => (
                          <div
                            key={slide.src}
                            className={i === index ? "tab-pane is-active" : "tab-pane"}
                            id={`platform-pane-${i + 1}`}
                            role="tabpanel"
                            aria-labelledby={`platform-tab-${i + 1}`}
                            style={{ flex: "0 0 100%", maxWidth: "100%" }}
                          >
                            <div className="platform-tab-inner">
                              <div className="text-size-regular platform">{slide.copy}</div>
                              <div className="img-wrapper-tab">
                                <img
                                  className="platform-tab-image"
                                  src={slide.src}
                                  alt="Platform Tab Image"
                                  aria-hidden="true"
                                  sizes={slide.sizes}
                                  loading="lazy"
                                  srcSet={slide.srcSet}
                                  draggable={false}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-embed">
                    <style>{ACTIVE_TAB_CSS}</style>
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
