import React, { useEffect, useRef, useState } from "react";
import { TbArrowUpRight } from "react-icons/tb";
import { useInView } from "../studio/Reveal";
import about from "./about.module.css";

/**
 * Small animated interface pieces that sit beside each chapter of the story.
 * All of them idle (no timers, no rAF) while off screen.
 */

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/* ───────────────────── 01 — the 48-hour render ───────────────────── */

const RENDER_SECONDS = 48 * 60 * 60;
const RENDER_FRAMES = 300; // 10 seconds at 30fps
const RENDER_RUN_MS = 7000;
const RENDER_HOLD_MS = 2600;

function clock(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function RenderWindow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const active = useInView(rootRef, { repeat: true, rootMargin: "0px" });

  useEffect(() => {
    if (!active || reducedMotion()) return;
    let raf = 0;
    const started = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = (now - started) % (RENDER_RUN_MS + RENDER_HOLD_MS);
      const p = Math.min(1, t / RENDER_RUN_MS);
      if (clockRef.current) clockRef.current.textContent = clock(p * RENDER_SECONDS);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
      if (frameRef.current) {
        frameRef.current.textContent = String(Math.floor(p * RENDER_FRAMES)).padStart(3, "0");
      }
      if (statusRef.current) {
        statusRef.current.textContent = p < 1 ? "Rendering" : "Done";
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div ref={rootRef} className={about.panel} aria-hidden>
      <div className={about.panelBar}>
        <span className={about.panelDots}>
          <i />
          <i />
          <i />
        </span>
        <span>intro_final.mov</span>
      </div>
      <div className={about.panelBody}>
        <div className={about.renderRow}>
          <span ref={clockRef} className={about.renderClock}>
            48:00:00
          </span>
          <span ref={statusRef} className={about.live}>
            Done
          </span>
        </div>
        <div className={about.renderBar}>
          <span ref={fillRef} className={about.renderFill} />
        </div>
        <div className={about.renderRow}>
          <span>
            Frame <span ref={frameRef} className={about.bright}>300</span> / {RENDER_FRAMES}
          </span>
          <span>10-second clip</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── 02 — the winning poster ───────────────────── */

export function PosterCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      className={about.poster}
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label="View Out of Sync, the poster that placed 1st of 44,000"
    >
      <span className={about.posterArt}>
        <img src="/archive/out-of-sync.jpg" alt="" loading="lazy" decoding="async" />
      </span>
      <span className={about.posterMeta}>
        <span>Adobe ACA US National Championship</span>
        <span className={about.posterRank}>
          1st
          <small>of 44,000 students</small>
        </span>
        <span className={about.posterOpen}>
          View &ldquo;Out of Sync&rdquo;
          <TbArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </span>
    </button>
  );
}

/* ───────────────────── 03 — calling cameras ───────────────────── */

/** The cut order a director might call — loops. */
const CUTS = [0, 2, 1, 2, 3, 0, 1, 3];
const CUT_MS = 1500;

export function Multiview() {
  const rootRef = useRef<HTMLDivElement>(null);
  const active = useInView(rootRef, { repeat: true, rootMargin: "0px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active || reducedMotion()) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % CUTS.length), CUT_MS);
    return () => window.clearInterval(id);
  }, [active]);

  const live = CUTS[step];

  return (
    <div ref={rootRef} className={about.panel} aria-hidden>
      <div className={about.panelBar}>
        <span className={about.live}>Live</span>
        <span>Technical director</span>
      </div>
      <div className={about.panelBody}>
        <div className={about.program}>
          <span className={about.programTag}>PGM</span>
          <span className={about.programTag2}>Take</span>
          <span key={step} className={about.programCam}>
            Cam {live + 1}
          </span>
        </div>
        <div className={about.multiview}>
          {[0, 1, 2, 3].map((n) => (
            <div
              key={n}
              className={about.cam}
              data-live={n === live ? "" : undefined}
            >
              <span className={about.camTally}>On air</span>
              <span className={about.camLabel}>Cam {n + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── 04 — thirteen EQ metrics ───────────────────── */

const AXES = 13;
/** Three made-up profiles the shape drifts between (0–1 per axis) — illustration only. */
const PROFILES = [
  [0.82, 0.55, 0.7, 0.92, 0.48, 0.66, 0.85, 0.4, 0.6, 0.78, 0.9, 0.52, 0.72],
  [0.5, 0.88, 0.62, 0.58, 0.9, 0.45, 0.6, 0.82, 0.74, 0.5, 0.64, 0.92, 0.48],
  [0.72, 0.66, 0.92, 0.5, 0.64, 0.86, 0.46, 0.7, 0.9, 0.62, 0.5, 0.74, 0.88],
];

/** Point on axis `i` at radius `r` (0–1). Rounded so server and client markup match exactly. */
function spoke(i: number, r: number): [string, string] {
  const a = (i / AXES) * Math.PI * 2 - Math.PI / 2;
  return [(50 + Math.cos(a) * r * 44).toFixed(2), (50 + Math.sin(a) * r * 44).toFixed(2)];
}

function ring(radii: number[]) {
  return radii.map((r, i) => spoke(i, r).join(",")).join(" ");
}

const even = (r: number) => Array.from({ length: AXES }, () => r);
const SHAPES = PROFILES.map(ring);

const METRICS = [
  "Directness",
  "Empathy",
  "Regulation",
  "Social energy",
  "Collaboration",
];

export function EqRadar() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(!reducedMotion()), []);

  return (
    <div className={about.panel} aria-hidden>
      <div className={about.panelBar}>
        <span className={about.bright}>EQ profile</span>
        <span>13 metrics</span>
      </div>
      <div className={`${about.panelBody} ${about.radarWrap}`}>
        <svg viewBox="0 0 100 100" className={about.radar}>
          {[1, 0.66, 0.33].map((r) => (
            <polygon key={r} points={ring(even(r))} className={about.radarGrid} />
          ))}
          {Array.from({ length: AXES }, (_, i) => {
            const [x, y] = spoke(i, 1);
            return (
              <line key={i} x1="50" y1="50" x2={x} y2={y} className={about.radarGrid} />
            );
          })}
          <polygon points={SHAPES[0]} className={about.radarShape}>
            {animate ? (
              <animate
                attributeName="points"
                dur="11s"
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;0.33;0.66;1"
                keySplines="0.6 0 0.4 1;0.6 0 0.4 1;0.6 0 0.4 1"
                values={[...SHAPES, SHAPES[0]].join(";")}
              />
            ) : null}
          </polygon>
        </svg>
        <ul className={about.radarList}>
          {METRICS.map((m, i) => (
            <li key={m}>
              <span>{pad(i + 1)}</span>
              <span className={about.bright}>{m}</span>
            </li>
          ))}
          <li>
            <span>+</span>
            <span>8 more</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
