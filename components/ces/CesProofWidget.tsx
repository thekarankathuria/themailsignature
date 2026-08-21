"use client";

import { useEffect, useState, type CSSProperties } from "react";

type ProofEntry = {
  name: string;
  item: string;
  time: string;
  img: string;
};

const FEED: ProofEntry[] = [
  {
    name: "Chris from Los Angeles, CA",
    item: "Pro Plan",
    time: "2 minutes ago",
    img: "/ces/img/685513e5ad04fd93054046ce_Chris_Signature.png",
  },
  {
    name: "Evan from Austin, TX",
    item: "Pro Plan",
    time: "12 minutes ago",
    img: "/ces/img/685513e5ad7adafc1fb9ae05_Evan_signature.png",
  },
  {
    name: "Logan from Miami, FL",
    item: "Pro Plan",
    time: "8 minutes ago",
    img: "/ces/img/685513e507e63d4ce0220052_Logan_signature.png",
  },
  {
    name: "George from Seattle, WA",
    item: "Enterprise Plan",
    time: "20 minutes ago",
    img: "/ces/img/685513e52a3612f44f4cb57f_George_signature.png",
  },
  {
    name: "Clarity from New York, NY",
    item: "Enterprise Plan",
    time: "27 minutes ago",
    img: "/ces/img/685513e4a84e0335c32cfa6e_Clarity_signature.png",
  },
];

const BADGE = "/ces/img/64bc0888639b1ab025f4bc2e_verification_500px_00053.webp";
const DELAYS = [5000, 8000, 8000, 12000, 7000];
const VIS_DUR = 5500;
const FADE_DUR = 600;

/** "in" = mounted but not yet faded in, "shown" = visible, "out" = fading away. */
type Phase = "in" | "shown" | "out";

const wrapStyle: CSSProperties = {
  position: "fixed",
  bottom: "20px",
  left: "20px",
  maxWidth: "320px",
  width: "auto",
  fontFamily: "inherit",
  zIndex: 9999,
};

const cardStyle: CSSProperties = {
  position: "relative",
  backdropFilter: "blur(8px)",
  background: "rgba(255,255,255,0.9)",
  border: "1px solid #fbbc04",
  borderRadius: "12px",
  boxShadow: "none",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 44px 12px 12px",
  transition: `opacity ${FADE_DUR}ms ease-out, transform ${FADE_DUR}ms ease-out`,
  overflow: "hidden",
};

const thumbStyle: CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "8px",
  objectFit: "cover",
  flexShrink: 0,
};

const bodyStyle: CSSProperties = { flex: 1 };

const nameStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "14px",
  fontWeight: 500,
  color: "#333",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const badgeStyle: CSSProperties = { width: "14px" };

const itemStyle: CSSProperties = {
  fontSize: "13px",
  color: "#666",
  marginTop: "8px",
};

const timeWrapStyle: CSSProperties = { marginTop: "4px" };

const timePillStyle: CSSProperties = {
  display: "inline-block",
  padding: "2px 6px",
  borderRadius: "8px",
  background: "#ea4335",
  color: "white",
  fontSize: "12px",
};

const timePlainStyle: CSSProperties = { fontSize: "12px", color: "#999" };

const closeStyle: CSSProperties = {
  position: "absolute",
  top: "8px",
  right: "8px",
  background: "rgba(0,0,0,0.1)",
  border: "none",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  fontSize: "16px",
  color: "#fff",
  lineHeight: "24px",
  textAlign: "center",
  cursor: "pointer",
};

export function CesProofWidget() {
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("in");

  // Drives the whole schedule: first card after DELAYS[0], each card visible
  // VIS_DUR, fading FADE_DUR either side, then DELAYS[i] before the next one.
  useEffect(() => {
    if (dismissed) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let i = 0;

    const showNext = () => {
      if (i >= FEED.length) return;
      setIndex(i);
      setPhase("in");

      timers.push(
        setTimeout(() => {
          setPhase("out");
          timers.push(
            setTimeout(() => {
              setIndex(null);
              i++;
              timers.push(setTimeout(showNext, DELAYS[i] ?? 0));
            }, FADE_DUR),
          );
        }, VIS_DUR),
      );
    };

    timers.push(setTimeout(showNext, DELAYS[0]));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [dismissed]);

  // Flip to the visible phase on the frame after the card is committed, so the
  // opacity/transform transition actually runs instead of being coalesced.
  useEffect(() => {
    if (index === null) return;
    const raf = requestAnimationFrame(() => setPhase("shown"));
    return () => cancelAnimationFrame(raf);
  }, [index]);

  if (dismissed) return null;

  const entry = index === null ? null : FEED[index];
  const isBadge = index === 0 || index === 2;
  const timeText = entry ? (isBadge ? "Just now" : entry.time) : "";

  return (
    <div id="proofWidget" style={wrapStyle}>
      {entry ? (
        <div
          className="proofCard"
          style={{
            ...cardStyle,
            opacity: phase === "shown" ? 1 : 0,
            transform:
              phase === "shown"
                ? "translateY(0)"
                : phase === "in"
                  ? "translateY(6px)"
                  : "translateY(-6px)",
          }}
        >
          <img src={entry.img} alt="" style={thumbStyle} />
          <div style={bodyStyle}>
            <div style={nameStyle}>
              {entry.name}
              <img src={BADGE} alt="" style={badgeStyle} />
            </div>
            <div style={itemStyle}>Purchased {entry.item}</div>
            <div style={timeWrapStyle}>
              {isBadge ? (
                <span style={timePillStyle}>{timeText}</span>
              ) : (
                <span style={timePlainStyle}>{timeText}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="closeCard"
            aria-label="Close"
            style={closeStyle}
            onClick={() => setDismissed(true)}
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}
