import React, { useEffect, useState, useCallback } from "react";
import { SITE_LOGO_WORDMARK_SRC } from "../lib/siteNav";

const STORAGE_KEY = "jo_intro_seen";
/** ~50% slower than original 1500ms */
const FADE_IN_MS = 2250;
const HOLD_MS = 1000;
/** ~2× original 600ms, eased out */
const FADE_OUT_MS = 1200;

export function shouldShowIntro(): boolean {
  if (typeof window === "undefined") return false;
  return !sessionStorage.getItem(STORAGE_KEY);
}

export default function LogoIntro({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const exitTimer = setTimeout(
      () => setExiting(true),
      FADE_IN_MS + HOLD_MS,
    );
    const doneTimer = setTimeout(finish, FADE_IN_MS + HOLD_MS + FADE_OUT_MS);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [finish]);

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center bg-black transition-opacity ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      style={{
        transitionDuration: `${FADE_OUT_MS}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <style jsx>{`
        @keyframes logoReveal {
          0% {
            opacity: 0;
            transform: scale(0.97);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .intro-logo-wrap {
          animation: logoReveal ${FADE_IN_MS}ms cubic-bezier(0.33, 1, 0.68, 1) forwards;
        }
      `}</style>
      {/*
        Wordmark is wide — a square box forces object-contain to shrink it to a short strip,
        which makes the mark look broken/overlapping. Size by max-width and let height follow.
      */}
      <div className="intro-logo-wrap px-6">
        <img
          src={SITE_LOGO_WORDMARK_SRC}
          alt="jakeostudio"
          className="w-auto max-w-[min(62vw,20rem)] sm:max-w-[min(88vw,34rem)] h-auto max-h-[min(27vh,8rem)] sm:max-h-[min(42vh,14rem)] object-contain object-center select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
