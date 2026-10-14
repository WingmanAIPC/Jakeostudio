import React, { useCallback, useEffect, useRef, useState } from "react";
import { SITE_LOGO_WORDMARK_SRC } from "../lib/siteNav";
import styles from "./intro.module.css";

const STORAGE_KEY = "jo_intro_seen";
/** Choreography length before the intro is allowed to leave */
const MIN_MS = 2400;
/** Leave even if the hero's first video still isn't ready */
const MAX_MS = 4600;
/** Shutter travel (must cover the CSS transition + delay) */
const EXIT_MS = 1300;

export function shouldShowIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Once-per-session logo intro. The hero mounts underneath while this plays so
 * its first video buffers; the intro waits (up to MAX_MS) for `ready`, then
 * parts like a shutter onto the already-playing slideshow.
 */
export default function LogoIntro({
  ready = false,
  onReveal,
  onComplete,
}: {
  /** Hero's first clip can play */
  ready?: boolean;
  /** Shutter starts opening — start hero playback now */
  onReveal?: () => void;
  /** Fully gone — unmount */
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const [minElapsed, setMinElapsed] = useState(false);
  /** After the empty bar has painted, so the width transition has a start frame. */
  const [armed, setArmed] = useState(false);
  const exitingRef = useRef(false);
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);
  onRevealRef.current = onReveal;
  onCompleteRef.current = onComplete;

  const exit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode */
    }
    setPhase("exit");
    onRevealRef.current?.();
    window.setTimeout(
      () => onCompleteRef.current(),
      reducedMotion() ? 550 : EXIT_MS,
    );
  }, []);

  useEffect(() => {
    // Two frames so the 0-width bar is painted before the target width changes.
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setArmed(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, []);

  useEffect(() => {
    const rm = reducedMotion();
    const minT = window.setTimeout(() => setMinElapsed(true), rm ? 900 : MIN_MS);
    const maxT = window.setTimeout(exit, rm ? 2500 : MAX_MS);
    return () => {
      clearTimeout(minT);
      clearTimeout(maxT);
    };
  }, [exit]);

  useEffect(() => {
    if (minElapsed && ready) exit();
  }, [minElapsed, ready, exit]);

  // Any intent to get to the content skips straight to the reveal.
  useEffect(() => {
    const skip = () => exit();
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
  }, [exit]);

  return (
    <div
      className={styles.root}
      data-phase={phase}
      data-armed={armed ? "" : undefined}
      data-ready={ready ? "" : undefined}
      onClick={exit}
      role="presentation"
    >
      <div className={styles.shutterTop} />
      <div className={styles.shutterBottom} />

      <div className={styles.content}>
        <div
          className={styles.mark}
          style={
            {
              "--logo": `url("${SITE_LOGO_WORDMARK_SRC}")`,
            } as React.CSSProperties
          }
        >
          <img
            src={SITE_LOGO_WORDMARK_SRC}
            alt="jakeostudio"
            className={styles.markImg}
            draggable={false}
          />
          <span className={styles.sheen} aria-hidden />
          <svg
            className={styles.glint}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 0c.6 6.9 5.1 11.4 12 12-6.9.6-11.4 5.1-12 12-.6-6.9-5.1-11.4-12-12C6.9 11.4 11.4 6.9 12 0z" />
          </svg>
        </div>
        <div className={styles.tagline} aria-hidden>
          <span>Design</span>
          <i />
          <span>Film</span>
          <i />
          <span>Software</span>
        </div>
      </div>

      <div className={styles.loader} aria-hidden>
        <span className={styles.loaderFill} />
      </div>

      <button
        type="button"
        className={styles.skip}
        onClick={(e) => {
          e.stopPropagation();
          exit();
        }}
      >
        Skip
      </button>
    </div>
  );
}
