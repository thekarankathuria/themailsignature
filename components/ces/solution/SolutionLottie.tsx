"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

/**
 * Webflow drove these `.sign_example_lottie` elements with its IX2 runtime, which does not
 * exist here. The saved markup states the intent in data attributes and BEHAVIORS.md §4
 * confirms it:
 *
 * - hero (`data-autoplay="1" data-loop="1"`)  → start immediately, loop forever
 * - top-user cards (`data-autoplay="0" data-loop="0"`) → play once on scroll-into-view
 *
 * `lottie-web` is imported lazily so the ~250 KB player never lands in the initial bundle,
 * and the top-user animations only fetch their JSON once the card is actually near the fold.
 */
export function SolutionLottie({
  src,
  className,
  mode,
}: {
  src: string;
  className?: string;
  mode: "loop" | "on-view";
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !src) return;

    let animation: AnimationItem | null = null;
    let cancelled = false;

    const start = () => {
      void import("lottie-web").then(({ default: lottie }) => {
        if (cancelled || !containerRef.current) return;
        animation = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: mode === "loop",
          autoplay: true,
          path: src,
        });
      });
    };

    if (mode === "loop") {
      start();
      return () => {
        cancelled = true;
        animation?.destroy();
        animation = null;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        start();
      },
      { threshold: 0.2 }
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      animation?.destroy();
      animation = null;
    };
  }, [src, mode]);

  return <div ref={containerRef} className={className} />;
}
