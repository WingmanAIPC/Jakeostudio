import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  TbMaximize,
  TbMinimize,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbVolume,
  TbVolumeOff,
} from "react-icons/tb";
import {
  clipDuration,
  clipPoster,
  type ShowcaseClip,
} from "../../lib/showcase";
import { useInView } from "../studio/Reveal";
import {
  FileReelMedia,
  YouTubeReelMedia,
  onPosterLoad,
  type ReelHandle,
} from "./ReelMedia";
import styles from "./reel.module.css";

/** Start the loop / next clip this close to a clip's end */
const END_LEAD_S = 0.2;
/** Multi-clip reels skip a clip that hasn't produced a frame by now */
const START_TIMEOUT_MS = 9000;
/** Minimum gap between seeks while dragging the scrubber */
const SEEK_THROTTLE_MS = 120;
/** Keep showing the dragged position this long after a seek (the player reports late) */
const SCRUB_HOLD_MS = 450;

/* ───────────────────── One reel with sound at a time ───────────────────── */

type SoundState = { owner: string | null; setOwner: (id: string | null) => void };
const SoundContext = createContext<SoundState>({ owner: null, setOwner: () => {} });

export function ReelSoundProvider({ children }: { children: React.ReactNode }) {
  const [owner, setOwner] = useState<string | null>(null);
  const value = useMemo(() => ({ owner, setOwner }), [owner]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

/* ───────────────────────────── helpers ───────────────────────────── */

const pad = (n: number) => String(n).padStart(2, "0");

function timecode(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

function stripThumb(clip: ShowcaseClip) {
  return clip.kind === "youtube"
    ? `https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`
    : (clip.thumb ?? clip.poster);
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

/* ───────────────────────────── Viewport ───────────────────────────── */

export default function ReelViewport({
  id,
  title,
  accent,
  thumb,
  clips,
}: {
  /** Stable id — claims the page's single sound slot */
  id: string;
  title: string;
  accent: string;
  /** Representative frame shown until the first clip plays */
  thumb: string;
  clips: ShowcaseClip[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLOListElement>(null);
  const handleRef = useRef<ReelHandle>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef<HTMLSpanElement>(null);
  const endRef = useRef<HTMLSpanElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);

  /** Close enough to the screen to start loading media (latches) */
  const near = useInView(rootRef, { rootMargin: "70% 0px 70% 0px" });
  const [visible, setVisible] = useState(false);
  const [docVisible, setDocVisible] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [clipIdx, setClipIdx] = useState(0);
  const [small] = useState(prefersSmallMedia);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { owner, setOwner } = useContext(SoundContext);

  const clip = clips[clipIdx];
  const multi = clips.length > 1;
  const muted = owner !== id;
  const playing = near && visible && docVisible && !userPaused;
  /** Single self-hosted clip: let the <video> loop itself (seamless) */
  const nativeLoop = !multi && clip.kind === "file";
  const clipKey = `${clipIdx}:${clip.id}`;

  /* ── environment ── */

  useEffect(() => {
    if (prefersReducedMotion()) setUserPaused(true);
    setCanFullscreen(
      typeof document !== "undefined" &&
        !!document.fullscreenEnabled &&
        typeof document.documentElement.requestFullscreen === "function",
    );
    const onVis = () => setDocVisible(document.visibilityState === "visible");
    onVis();
    const onFs = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio >= 0.45),
      { threshold: [0, 0.2, 0.45, 0.7, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sound never follows you down the page.
  useEffect(() => {
    if (!visible && owner === id) setOwner(null);
  }, [visible, owner, id, setOwner]);

  /* ── the clock: paints the transport, loops or advances at the end ── */

  /** Everything the rAF clock needs, refreshed every render. */
  const live = {
    key: clipKey,
    playing,
    multi,
    nativeLoop,
    planned: clipDuration(clip),
    count: clips.length,
  };
  const liveRef = useRef(live);
  liveRef.current = live;

  const scrubRef = useRef({ frac: 0, until: 0, duration: 0 });

  useEffect(() => {
    if (!near) return;
    let raf = 0;
    let last = performance.now();
    const st = { key: "", done: false, waitMs: 0, text: "", endText: "" };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(now - last, 100);
      last = now;
      const L = liveRef.current;
      if (st.key !== L.key) {
        st.key = L.key;
        st.done = false;
        st.waitMs = 0;
      }

      const tl = handleRef.current?.timeline() ?? null;
      const duration = tl ? tl.duration : L.planned;
      const elapsed = tl ? tl.elapsed : 0;
      scrubRef.current.duration = duration;

      const holding = now < scrubRef.current.until;
      const frac = holding
        ? scrubRef.current.frac
        : duration > 0
          ? Math.min(1, elapsed / duration)
          : 0;

      if (fillRef.current) fillRef.current.style.transform = `scaleX(${frac})`;
      if (knobRef.current) knobRef.current.style.left = `${frac * 100}%`;
      const text = timecode(holding ? frac * duration : elapsed);
      if (text !== st.text && elapsedRef.current) {
        st.text = text;
        elapsedRef.current.textContent = text;
      }
      const endText = timecode(duration);
      if (endText !== st.endText && endRef.current) {
        st.endText = endText;
        endRef.current.textContent = endText;
      }
      if (!holding && rangeRef.current) {
        const v = String(Math.round(frac * 1000));
        if (rangeRef.current.value !== v) rangeRef.current.value = v;
      }

      if (!L.playing) return;
      const next = () => setClipIdx((i) => (i + 1) % L.count);
      if (!tl) {
        st.waitMs += dt;
        if (L.multi && !st.done && st.waitMs > START_TIMEOUT_MS) {
          st.done = true;
          next();
        }
        return;
      }
      if (L.nativeLoop || holding) return;
      if (!st.done && elapsed >= duration - END_LEAD_S) {
        st.done = true;
        if (L.multi) next();
        else handleRef.current?.seekTo(0);
      } else if (st.done && elapsed < duration - 1) {
        st.done = false;
      }
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [near]);

  /* ── controls ── */

  const seekTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSeekRef = useRef(0);
  const pendingSeekRef = useRef<number | null>(null);

  const flushSeek = useCallback(() => {
    const s = pendingSeekRef.current;
    if (s === null) return;
    pendingSeekRef.current = null;
    lastSeekRef.current = performance.now();
    handleRef.current?.seekTo(s);
  }, []);

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frac = Number(e.currentTarget.value) / 1000;
    const sc = scrubRef.current;
    sc.frac = frac;
    sc.until = performance.now() + SCRUB_HOLD_MS;
    // Stop short of the very end so a drag to the right edge doesn't instantly loop.
    pendingSeekRef.current = Math.min(frac * sc.duration, Math.max(0, sc.duration - 0.6));
    const wait = SEEK_THROTTLE_MS - (performance.now() - lastSeekRef.current);
    if (seekTimerRef.current) clearTimeout(seekTimerRef.current);
    if (wait <= 0) flushSeek();
    else seekTimerRef.current = setTimeout(flushSeek, wait);
  };

  useEffect(
    () => () => {
      if (seekTimerRef.current) clearTimeout(seekTimerRef.current);
    },
    [],
  );

  const togglePlay = () => setUserPaused((p) => !p);
  const toggleSound = () => {
    if (muted) {
      setOwner(id);
      setUserPaused(false);
    } else {
      setOwner(null);
    }
  };
  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen().catch(() => {});
  };

  const selectClip = (i: number) => {
    setClipIdx(i);
    setUserPaused(false);
  };

  // Keep the active clip's thumbnail in view inside the strip (never scrolls the page).
  useEffect(() => {
    const strip = stripRef.current;
    const item = strip?.children[clipIdx] as HTMLElement | undefined;
    if (!strip || !item) return;
    const left = item.offsetLeft - (strip.clientWidth - item.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [clipIdx]);

  const placeholder =
    clip.kind === "youtube" ? clipPoster(clip) : clipIdx === 0 ? thumb : clip.poster;

  return (
    <div
      ref={rootRef}
      className={styles.viewport}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div className={styles.frameWrap}>
        <span className={`${styles.bracket} ${styles.bracketTL}`} aria-hidden />
        <span className={`${styles.bracket} ${styles.bracketTR}`} aria-hidden />
        <span className={`${styles.bracket} ${styles.bracketBL}`} aria-hidden />
        <span className={`${styles.bracket} ${styles.bracketBR}`} aria-hidden />

        {/* Click is a pointer convenience; the transport's play button is the labelled control. */}
        <div
          ref={frameRef}
          className={styles.frame}
          data-paused={userPaused ? "" : undefined}
          onClick={togglePlay}
        >
          <img
            key={placeholder}
            src={placeholder}
            alt={`${title} reel`}
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={clip.kind === "youtube" ? onPosterLoad : undefined}
            className={`${styles.fill} ${styles.placeholder} ${
              clip.kind === "youtube" ? styles.ytPoster : ""
            }`}
          />
          {near ? (
            clip.kind === "file" ? (
              <FileReelMedia
                key={clip.id}
                ref={handleRef}
                clip={clip}
                small={small}
                loop={nativeLoop}
                playing={playing}
                muted={muted}
              />
            ) : (
              <YouTubeReelMedia
                ref={handleRef}
                clip={clip}
                playing={playing}
                muted={muted}
              />
            )
          ) : null}
          <span className={styles.scan} aria-hidden />
          <span className={styles.pausedShade} aria-hidden />
          <span className={styles.center} aria-hidden>
            <TbPlayerPlayFilled className="ml-0.5 h-7 w-7" />
          </span>
        </div>
      </div>

      <div className={styles.bar}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={togglePlay}
          aria-label={userPaused ? `Play ${title} reel` : `Pause ${title} reel`}
        >
          {userPaused ? (
            <TbPlayerPlayFilled className="h-[15px] w-[15px]" aria-hidden />
          ) : (
            <TbPlayerPauseFilled className="h-[15px] w-[15px]" aria-hidden />
          )}
        </button>
        <span ref={elapsedRef} className={styles.time}>
          00:00
        </span>
        <div className={styles.scrub}>
          <span className={styles.track} aria-hidden>
            <span ref={fillRef} className={styles.trackFill} />
          </span>
          <span ref={knobRef} className={styles.knob} aria-hidden />
          <input
            ref={rangeRef}
            type="range"
            min={0}
            max={1000}
            step={1}
            defaultValue={0}
            onChange={onScrub}
            className={styles.range}
            aria-label={`Seek ${title} reel`}
          />
        </div>
        <span ref={endRef} className={styles.timeEnd}>
          {timecode(clipDuration(clip))}
        </span>
        {clip.label ? <span className={styles.clipLabel}>{clip.label}</span> : null}
        {!clip.silent ? (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleSound}
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
        {canFullscreen ? (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
          >
            {isFullscreen ? (
              <TbMinimize className="h-[17px] w-[17px]" aria-hidden />
            ) : (
              <TbMaximize className="h-[17px] w-[17px]" aria-hidden />
            )}
          </button>
        ) : null}
      </div>

      {multi ? (
        <ol ref={stripRef} className={styles.strip} aria-label={`${title} clips`}>
          {clips.map((c, i) => (
            <li key={c.id} className="flex-none">
              <button
                type="button"
                className={styles.stripItem}
                onClick={() => selectClip(i)}
                aria-current={i === clipIdx ? "true" : undefined}
                aria-label={c.label ?? `Clip ${i + 1} of ${clips.length}`}
              >
                <span className={styles.stripThumb}>
                  <img src={stripThumb(c)} alt="" loading="lazy" decoding="async" />
                  <span className={styles.stripNum}>{pad(i + 1)}</span>
                </span>
                {c.label ? <span className={styles.stripLabel}>{c.label}</span> : null}
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
