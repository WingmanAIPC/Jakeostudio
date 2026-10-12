import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { SiApple, SiYoutube } from "react-icons/si";
import {
  TbArrowRight,
  TbArrowUpRight,
  TbChevronLeft,
  TbChevronRight,
  TbFileText,
  TbMail,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbVolume,
  TbVolumeOff,
  TbWorld,
} from "react-icons/tb";
import ClipLayer, { type ClipHandle, type LayerState } from "./ClipLayer";
import { ToolStackPill } from "../ToolStackPill";
import {
  SHOWCASE_SLIDES,
  clipDuration,
  clipPoster,
  planVisit,
  youtubeWatchUrl,
  type ShowcaseClip,
} from "../../lib/showcase";
import type { ProjectCta } from "../../lib/work";
import styles from "./showcase.module.css";

const SLIDES = SHOWCASE_SLIDES;
const N = SLIDES.length;

/** Must cover `.layer` opacity transition in showcase.module.css */
const LEAVING_HOLD_MS = 1150;
/** Start the crossfade this close to a clip's end */
const END_LEAD_S = 0.25;
/** Media hasn't produced a frame by now → hold the poster on a wall clock instead */
const START_TIMEOUT_MS = 6000;
/** Media stopped advancing mid-clip for this long → move on */
const STALL_TIMEOUT_MS = 9000;
/** Poster-only fallback never lingers longer than this */
const FALLBACK_MAX_S = 8;
const SWIPE_MIN_PX = 48;
const IDLE_MS = 2600;
/** Landscape: description condenses to eyebrow + title + CTAs after this long on a slide */
const CONDENSE_MS = 6500;
/** Phones: one-time "swipe or tap Next" coach mark */
const NAV_HINT_KEY = "jo_nav_hint_seen";
const NAV_HINT_DELAY_MS = 2500;
const NAV_HINT_VISIBLE_MS = 5000;

type Cursor = { slide: number; visit: number; clip: number };
type LayerDesc = { key: string; slide: number; clip: ShowcaseClip };

const pad = (n: number) => String(n).padStart(2, "0");

function layerKey(c: Cursor, clip: ShowcaseClip) {
  return `${SLIDES[c.slide].id}:${c.visit}:${c.clip}:${clip.id}`;
}

function describe(c: Cursor): LayerDesc {
  const clip = planVisit(SLIDES[c.slide], c.visit)[c.clip];
  return { key: layerKey(c, clip), slide: c.slide, clip };
}

function backdropFor(slideIdx: number, clip: ShowcaseClip) {
  // File posters are the first frame (often a solid fade-in colour); the slide thumb reads better blurred.
  return clip.kind === "file" ? SLIDES[slideIdx].thumb : clipPoster(clip);
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function prefersSmallMedia() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(orientation: portrait)").matches ||
    window.innerWidth < 900
  );
}

/* ───────────────────────────── CTA ───────────────────────────── */

function CtaIcon({ icon }: { icon: ProjectCta["icon"] }) {
  const cls = "h-[15px] w-[15px] shrink-0";
  switch (icon) {
    case "apple":
      return <SiApple className={cls} aria-hidden />;
    case "mail":
      return <TbMail className={cls} aria-hidden />;
    case "document":
      return <TbFileText className={cls} aria-hidden />;
    case "globe":
      return <TbWorld className={cls} aria-hidden />;
    case "play":
      return <TbPlayerPlayFilled className={cls} aria-hidden />;
    default:
      return null;
  }
}

function Cta({
  action,
  primary,
  tabIndex,
}: {
  action: ProjectCta;
  primary: boolean;
  tabIndex?: number;
}) {
  const cls = primary ? styles.ctaPrimary : styles.ctaSecondary;
  const inner = (
    <>
      <CtaIcon icon={action.icon} />
      <span>{action.label}</span>
      {action.external ? (
        <TbArrowUpRight className={`${styles.ctaArrow} h-4 w-4`} aria-hidden />
      ) : (
        <TbArrowRight className={`${styles.ctaArrow} h-4 w-4`} aria-hidden />
      )}
    </>
  );
  return action.external ? (
    <a
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      tabIndex={tabIndex}
    >
      {inner}
    </a>
  ) : (
    <Link href={action.href} className={cls} tabIndex={tabIndex}>
      {inner}
    </Link>
  );
}

/* ───────────────────────────── Hero ───────────────────────────── */

export default function ShowcaseHero({
  started = true,
  onFirstReady,
}: {
  /** False while the logo intro covers the page — media buffers but the clock holds. */
  started?: boolean;
  /** First clip can play (lets the intro leave as soon as the hero is ready). */
  onFirstReady?: () => void;
}) {
  const rootRef = useRef<HTMLElement>(null);
  /** visits[i] = how many times slide i has been entered (drives clip rotation) */
  const visitsRef = useRef<number[]>(SLIDES.map((_, i) => (i === 0 ? 1 : 0)));
  const [cursor, setCursor] = useState<Cursor>({ slide: 0, visit: 0, clip: 0 });
  const cursorRef = useRef(cursor);
  const [leaving, setLeaving] = useState<LayerDesc | null>(null);
  const leavingTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const [paused, setPaused] = useState(prefersReducedMotion);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(true);
  const [docVisible, setDocVisible] = useState(true);
  const [idle, setIdle] = useState(false);
  const [small] = useState(prefersSmallMedia);
  const [condensed, setCondensed] = useState(false);
  const [navHint, setNavHint] = useState(false);
  /** Current clip has produced frames — only then start warming the next one. */
  const [activeStartedKey, setActiveStartedKey] = useState<string | null>(null);

  const handlesRef = useRef(new Map<string, ClipHandle>());
  const refCallbacks = useRef(new Map<string, (h: ClipHandle | null) => void>());
  const failedRef = useRef(new Set<string>());
  const deskFills = useRef<(HTMLSpanElement | null)[]>([]);
  const mobFills = useRef<(HTMLSpanElement | null)[]>([]);
  const firstKeyRef = useRef<string | null>(null);
  const firstReadyFiredRef = useRef(false);
  const onFirstReadyRef = useRef(onFirstReady);
  onFirstReadyRef.current = onFirstReady;

  const active = describe(cursor);
  if (firstKeyRef.current === null) firstKeyRef.current = active.key;
  const plan = planVisit(SLIDES[cursor.slide], cursor.visit);
  const planned = plan.map(clipDuration);
  const offset = planned.slice(0, cursor.clip).reduce((a, b) => a + b, 0);
  const total = planned.reduce((a, b) => a + b, 0);
  const runnable = started && !paused && inView && docVisible;

  const nextCursor: Cursor =
    cursor.clip + 1 < plan.length
      ? { ...cursor, clip: cursor.clip + 1 }
      : (() => {
          const s = (cursor.slide + 1) % N;
          return { slide: s, visit: visitsRef.current[s], clip: 0 };
        })();
  const warm: LayerDesc | null =
    started && activeStartedKey === active.key ? describe(nextCursor) : null;

  /** Everything the rAF clock needs, refreshed every render. */
  const liveRef = useRef({
    key: active.key,
    slide: cursor.slide,
    planned: planned[cursor.clip],
    offset,
    total,
    runnable,
  });
  liveRef.current = {
    key: active.key,
    slide: cursor.slide,
    planned: planned[cursor.clip],
    offset,
    total,
    runnable,
  };

  /* ── navigation ── */

  const commit = useCallback((next: Cursor) => {
    const prev = cursorRef.current;
    setLeaving(describe(prev));
    if (leavingTimerRef.current) clearTimeout(leavingTimerRef.current);
    leavingTimerRef.current = setTimeout(() => setLeaving(null), LEAVING_HOLD_MS);
    cursorRef.current = next;
    setCursor(next);
  }, []);

  const enterSlide = useCallback(
    (s: number) => {
      const visit = visitsRef.current[s];
      visitsRef.current[s] = visit + 1;
      commit({ slide: s, visit, clip: 0 });
    },
    [commit],
  );

  const advance = useCallback(() => {
    const cur = cursorRef.current;
    const p = planVisit(SLIDES[cur.slide], cur.visit);
    if (cur.clip + 1 < p.length) commit({ ...cur, clip: cur.clip + 1 });
    else enterSlide((cur.slide + 1) % N);
  }, [commit, enterSlide]);

  const goToSlide = useCallback(
    (s: number) => {
      if (s !== cursorRef.current.slide) enterSlide(s);
    },
    [enterSlide],
  );
  const goNext = useCallback(
    () => enterSlide((cursorRef.current.slide + 1) % N),
    [enterSlide],
  );
  const goPrev = useCallback(
    () => enterSlide((cursorRef.current.slide - 1 + N) % N),
    [enterSlide],
  );

  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  useEffect(
    () => () => {
      if (leavingTimerRef.current) clearTimeout(leavingTimerRef.current);
    },
    [],
  );

  /* ── the single clock ── */

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const clock = {
      key: "",
      waitMs: 0,
      stallMs: 0,
      lastElapsed: -1,
      fallback: false,
      fbElapsed: 0,
      done: false,
      reported: false,
      frac: 0,
    };

    const paint = (slide: number, frac: number) => {
      for (let i = 0; i < N; i++) {
        const v = i < slide ? 1 : i > slide ? 0 : frac;
        const t = `scaleX(${v})`;
        const d = deskFills.current[i];
        const m = mobFills.current[i];
        if (d && d.style.transform !== t) d.style.transform = t;
        if (m && m.style.transform !== t) m.style.transform = t;
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(now - last, 100);
      last = now;
      const L = liveRef.current;

      if (clock.key !== L.key) {
        clock.key = L.key;
        clock.waitMs = 0;
        clock.stallMs = 0;
        clock.lastElapsed = -1;
        clock.fallback = false;
        clock.fbElapsed = 0;
        clock.done = false;
        clock.reported = false;
        clock.frac = 0;
      }

      if (L.runnable && !clock.done) {
        if (!clock.fallback && failedRef.current.has(L.key)) {
          clock.fallback = true;
          clock.fbElapsed = clock.waitMs / 1000;
        }
        const tl = clock.fallback
          ? null
          : (handlesRef.current.get(L.key)?.timeline() ?? null);
        let elapsed = 0;
        let duration = L.planned;

        if (clock.fallback) {
          clock.fbElapsed += dt / 1000;
          elapsed = clock.fbElapsed;
          duration = Math.min(L.planned, FALLBACK_MAX_S);
        } else if (!tl) {
          clock.waitMs += dt;
          if (clock.waitMs > START_TIMEOUT_MS) {
            clock.fallback = true;
            clock.fbElapsed = clock.waitMs / 1000;
          }
        } else {
          elapsed = tl.elapsed;
          duration = tl.duration;
          if (!clock.reported) {
            clock.reported = true;
            setActiveStartedKey(L.key);
          }
          if (elapsed > clock.lastElapsed + 1e-3) {
            clock.lastElapsed = elapsed;
            clock.stallMs = 0;
          } else {
            clock.stallMs += dt;
          }
        }

        clock.frac = duration > 0 ? Math.min(1, elapsed / duration) : 0;
        const finished =
          (clock.fallback || tl) && duration > 0 && elapsed >= duration - END_LEAD_S;
        if (finished || clock.stallMs > STALL_TIMEOUT_MS) {
          clock.done = true;
          advanceRef.current();
        }
      }

      const slideFrac =
        L.total > 0
          ? Math.min(1, (L.offset + clock.frac * L.planned) / L.total)
          : 0;
      paint(L.slide, slideFrac);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── copy condenses after a few seconds so the reel gets the frame ── */

  const slideVisitKey = `${cursor.slide}:${cursor.visit}`;
  useEffect(() => {
    setCondensed(false);
    if (!runnable) return;
    const t = setTimeout(() => setCondensed(true), CONDENSE_MS);
    return () => clearTimeout(t);
  }, [slideVisitKey, runnable]);

  /* ── phones: teach swipe / Next once, after the first clip is actually playing ── */

  const hintArmedRef = useRef(false);
  const hintTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    if (hintArmedRef.current || !started || activeStartedKey === null) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    try {
      if (window.localStorage.getItem(NAV_HINT_KEY)) return;
    } catch {
      return;
    }
    hintArmedRef.current = true;
    hintTimersRef.current.push(
      setTimeout(() => {
        setNavHint(true);
        try {
          window.localStorage.setItem(NAV_HINT_KEY, "1");
        } catch {
          /* private mode */
        }
      }, NAV_HINT_DELAY_MS),
      setTimeout(
        () => setNavHint(false),
        NAV_HINT_DELAY_MS + NAV_HINT_VISIBLE_MS,
      ),
    );
  }, [started, activeStartedKey]);
  useEffect(
    () => () => hintTimersRef.current.forEach(clearTimeout),
    [],
  );
  // Any navigation means the lesson landed.
  useEffect(() => {
    setNavHint(false);
  }, [cursor.slide]);

  /* ── environment: visibility, viewport, input ── */

  useEffect(() => {
    const onVis = () => setDocVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= 0.3),
      { threshold: [0, 0.3, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const inViewRef = useRef(inView);
  inViewRef.current = inView;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))
      )
        return;
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const wake = useCallback(() => {
    setIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIdle(true), IDLE_MS);
  }, []);
  useEffect(() => {
    wake();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [wake]);

  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    setNavHint(false);
    if (e.touches.length !== 1) return;
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchRef.current;
    touchRef.current = null;
    if (!s || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  /* ── layers ── */

  const refFor = (key: string) => {
    let cb = refCallbacks.current.get(key);
    if (!cb) {
      cb = (h: ClipHandle | null) => {
        if (h) handlesRef.current.set(key, h);
        else {
          handlesRef.current.delete(key);
          refCallbacks.current.delete(key);
        }
      };
      refCallbacks.current.set(key, cb);
    }
    return cb;
  };

  const layers: { d: LayerDesc; state: LayerState; z: number }[] = [];
  if (leaving && leaving.key !== active.key)
    layers.push({ d: leaving, state: "leaving", z: 2 });
  if (warm && warm.key !== active.key && warm.key !== leaving?.key)
    layers.push({ d: warm, state: "warm", z: 1 });
  layers.push({ d: active, state: "active", z: 3 });

  const activeSlide = SLIDES[cursor.slide];
  const nextSlide = SLIDES[(cursor.slide + 1) % N];
  const activeClip = active.clip;
  const showSound = !activeClip.silent;
  const activeYtUrl =
    activeClip.kind === "youtube" ? youtubeWatchUrl(activeClip) : null;
  const activeCaption =
    activeClip.label ??
    (activeClip.kind === "youtube" ? activeSlide.clipCaption : undefined);

  return (
    <section
      ref={rootRef}
      id="top"
      className={styles.root}
      data-idle={idle ? "" : undefined}
      data-condensed={condensed ? "" : undefined}
      aria-roledescription="carousel"
      aria-label="Featured work"
      onMouseMove={wake}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <h1 className="sr-only">
        Jake Owens — jakeostudio. Design, film, and software.
      </h1>

      <div className={styles.stage}>
        {layers.map(({ d, state, z }) => (
          <ClipLayer
            key={d.key}
            ref={refFor(d.key)}
            clip={d.clip}
            backdrop={backdropFor(d.slide, d.clip)}
            label={SLIDES[d.slide].title}
            z={z}
            state={state}
            playing={state === "active" && runnable}
            muted={muted}
            small={small}
            onReady={
              d.key === firstKeyRef.current
                ? () => {
                    if (firstReadyFiredRef.current) return;
                    firstReadyFiredRef.current = true;
                    onFirstReadyRef.current?.();
                  }
                : undefined
            }
            onFail={() => failedRef.current.add(d.key)}
          />
        ))}
      </div>

      <div className={styles.scrimTop} aria-hidden />
      <div className={styles.scrimCorner} aria-hidden />
      <div className={styles.scrimBottom} aria-hidden />
      <div className={styles.scrimRail} aria-hidden />

      <button
        type="button"
        className={`${styles.edge} ${styles.edgePrev}`}
        onClick={goPrev}
        aria-label="Previous project"
        tabIndex={-1}
      >
        <span className={styles.edgeGlyph}>
          <TbChevronLeft className="h-6 w-6" aria-hidden />
        </span>
      </button>
      <button
        type="button"
        className={`${styles.edge} ${styles.edgeNext}`}
        onClick={goNext}
        aria-label="Next project"
        tabIndex={-1}
      >
        <span className={styles.edgeGlyph}>
          <TbChevronRight className="h-6 w-6" aria-hidden />
        </span>
      </button>

      {/* Portrait: tap the framed video like a story — left = back, right = next */}
      <div className={styles.frameNav} aria-hidden>
        <button
          type="button"
          tabIndex={-1}
          className={styles.frameNavPrev}
          onClick={goPrev}
        >
          <span className={styles.frameNavGlyph}>
            <TbChevronLeft className="h-[18px] w-[18px]" />
          </span>
        </button>
        <button
          type="button"
          tabIndex={-1}
          className={styles.frameNavNext}
          onClick={goNext}
        >
          <span className={styles.frameNavGlyph}>
            <TbChevronRight className="h-[18px] w-[18px]" />
          </span>
        </button>
      </div>

      <div className={styles.bottom}>
        {/* ── Slide copy ── */}
        <div className={styles.panels} aria-live={paused ? "polite" : "off"}>
          {SLIDES.map((s, i) => {
            const isActive = i === cursor.slide;
            return (
              <div
                key={s.id}
                className={styles.info}
                data-active={isActive ? "" : undefined}
                data-condensed={isActive && condensed ? "" : undefined}
                aria-hidden={!isActive}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${N}: ${s.title}`}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
                  <div className="min-w-0 max-w-[48rem]">
                    <div
                      className={`${styles.reveal} ${styles.eyebrow}`}
                      style={{ "--i": 0 } as CSSProperties}
                    >
                      <span
                        className={styles.dot}
                        style={{
                          background: s.accent,
                          boxShadow: `0 0 14px ${s.accent}`,
                        }}
                        aria-hidden
                      />
                      <span>
                        {pad(i + 1)}
                        <span className="px-1 text-white/35">/</span>
                        <span className="text-white/45">{pad(N)}</span>
                      </span>
                      <span className={styles.rule} aria-hidden />
                      {s.categories.map((c) => (
                        <span key={c} className={styles.chip}>
                          {c}
                        </span>
                      ))}
                    </div>
                    <h2
                      className={`${styles.reveal} ${styles.title}`}
                      style={{ "--i": 1 } as CSSProperties}
                    >
                      {s.title}
                    </h2>
                    <div className={styles.more}>
                      <div className={styles.moreInner}>
                        <p
                          className={`${styles.reveal} ${styles.subtitle}`}
                          style={{ "--i": 2 } as CSSProperties}
                        >
                          {s.subtitle}
                        </p>
                        {s.tags.length > 0 ? (
                          <div
                            className={`${styles.reveal} ${styles.tags}`}
                            style={{ "--i": 3 } as CSSProperties}
                          >
                            {s.tags.map((t) => (
                              <ToolStackPill key={t} label={t} className={styles.tag} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {isActive && (activeCaption || activeYtUrl) ? (
                      <div key={active.key} className={styles.caption}>
                        {activeCaption ? (
                          <span>
                            Now showing{" "}
                            <span className="text-white/35">—</span>{" "}
                            <strong>{activeCaption}</strong>
                          </span>
                        ) : null}
                        {activeYtUrl ? (
                          <a
                            href={activeYtUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.ytLink}
                            aria-label={`Watch this ${
                              activeCaption?.toLowerCase() ?? "video"
                            } on YouTube (opens in a new tab)`}
                          >
                            <SiYoutube
                              className="h-[15px] w-[15px] text-[#FF0033]"
                              aria-hidden
                            />
                            <span>Watch on YouTube</span>
                            <TbArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <div
                    className={`${styles.reveal} ${styles.ctas} md:shrink-0 md:justify-end`}
                    style={{ "--i": 4 } as CSSProperties}
                  >
                    {s.cta.map((a, k) => (
                      <Cta
                        key={a.label}
                        action={a}
                        primary={k === 0}
                        tabIndex={isActive ? undefined : -1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Desktop rail ── */}
        <div
          className={`${styles.chrome} mt-[clamp(1.1rem,4.2vh,2.75rem)] hidden items-end gap-8 md:flex`}
        >
          <ol
            className="grid flex-1 gap-4"
            style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
            aria-label="Projects"
          >
            {SLIDES.map((s, i) => {
              const isActive = i === cursor.slide;
              return (
                <li key={s.id} className="relative min-w-0">
                  <button
                    type="button"
                    className={styles.railItem}
                    data-active={isActive ? "" : undefined}
                    onClick={() => goToSlide(i)}
                    aria-label={`${s.title}${isActive ? " (now playing)" : ""}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span className={styles.railLabel}>
                      <span className={styles.railNum}>{pad(i + 1)}</span>
                      <span className={`${styles.railName} truncate`}>
                        {s.short}
                      </span>
                    </span>
                    <span className={styles.railTrack}>
                      <span
                        ref={(el) => {
                          deskFills.current[i] = el;
                        }}
                        className={styles.railFill}
                        style={{
                          background: isActive
                            ? s.accent
                            : "rgba(255,255,255,0.6)",
                        }}
                      />
                    </span>
                    <span
                      className={`${styles.preview} ${
                        i >= N - 2 ? styles.previewEnd : styles.previewStart
                      }`}
                      aria-hidden
                    >
                      <img
                        src={s.thumb}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className={styles.previewImg}
                      />
                      <span className="flex flex-col gap-1 px-3.5 py-3">
                        <span className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                          {s.categories.join(" · ")}
                        </span>
                        <span className="text-sm font-medium normal-case tracking-normal text-white">
                          {s.title}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="flex shrink-0 items-center gap-2 pb-0.5">
            <button
              type="button"
              className={styles.iconBtn}
              onClick={goPrev}
              aria-label="Previous project"
            >
              <TbChevronLeft className="h-[18px] w-[18px]" aria-hidden />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              aria-pressed={paused}
            >
              {paused ? (
                <TbPlayerPlayFilled className="h-4 w-4" aria-hidden />
              ) : (
                <TbPlayerPauseFilled className="h-4 w-4" aria-hidden />
              )}
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={goNext}
              aria-label="Next project"
            >
              <TbChevronRight className="h-[18px] w-[18px]" aria-hidden />
            </button>
            {showSound ? (
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Turn sound on" : "Turn sound off"}
                aria-pressed={!muted}
              >
                {muted ? (
                  <TbVolumeOff className="h-[18px] w-[18px]" aria-hidden />
                ) : (
                  <TbVolume className="h-[18px] w-[18px]" aria-hidden />
                )}
              </button>
            ) : null}
          </div>
        </div>

        {/* ── Mobile rail ── */}
        <div className="mt-5 md:hidden">
          <div className="flex gap-1.5" aria-label="Projects" role="list">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="listitem"
                className="flex h-6 flex-1 items-center"
                onClick={() => goToSlide(i)}
                aria-label={s.title}
                aria-current={i === cursor.slide ? "step" : undefined}
              >
                <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                  <span
                    ref={(el) => {
                      mobFills.current[i] = el;
                    }}
                    className={styles.railFill}
                    style={{
                      background:
                        i === cursor.slide ? s.accent : "rgba(255,255,255,0.7)",
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
          <div className="relative mt-1.5 flex items-center justify-between gap-3">
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                aria-pressed={paused}
              >
                {paused ? (
                  <TbPlayerPlayFilled className="h-4 w-4" aria-hidden />
                ) : (
                  <TbPlayerPauseFilled className="h-4 w-4" aria-hidden />
                )}
              </button>
              {showSound ? (
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Turn sound on" : "Turn sound off"}
                  aria-pressed={!muted}
                >
                  {muted ? (
                    <TbVolumeOff className="h-[17px] w-[17px]" aria-hidden />
                  ) : (
                    <TbVolume className="h-[17px] w-[17px]" aria-hidden />
                  )}
                </button>
              ) : null}
            </div>
            <button
              type="button"
              className={styles.nextPill}
              onClick={goNext}
              aria-label={`Next project: ${nextSlide.title}`}
            >
              <span className={styles.nextPillLabel}>Next</span>
              <span className={styles.nextPillName}>{nextSlide.short}</span>
              <TbChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>
            {navHint ? (
              <div className={styles.navHint} role="status">
                Swipe, or tap <strong>Next</strong>, to see more work
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
