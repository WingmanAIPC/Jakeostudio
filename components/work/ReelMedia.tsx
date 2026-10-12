import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { loadYouTubeIframeApi } from "../../lib/youtube";
import {
  clipPoster,
  type FileClip,
  type YouTubeClip,
} from "../../lib/showcase";
import styles from "./reel.module.css";

/**
 * Media for the /work reel viewport. Unlike the landing hero's ClipLayer (which
 * plays each clip once and crossfades to the next), these loop, can be scrubbed,
 * and — for YouTube — keep a single player alive across clip changes.
 */

export type ReelTimeline = { elapsed: number; duration: number };

export interface ReelHandle {
  /** `null` until real frames are advancing; afterwards seconds played / seconds playable. */
  timeline(): ReelTimeline | null;
  /** Jump to `seconds` into the clip's playable timeline. */
  seekTo(seconds: number): void;
}

type MediaProps = {
  playing: boolean;
  muted: boolean;
};

/* ─────────────────────────── Self-hosted MP4 ─────────────────────────── */

export const FileReelMedia = forwardRef<
  ReelHandle,
  MediaProps & {
    clip: FileClip;
    /** Prefer the 720p encode */
    small: boolean;
    /** Loop in place (single-clip reels); otherwise the viewport advances at the end */
    loop: boolean;
  }
>(function FileReelMedia({ clip, small, loop, playing, muted }, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const [revealed, setRevealed] = useState(false);
  const src = small && clip.srcSmall ? clip.srcSmall : clip.src;

  useImperativeHandle(
    ref,
    () => ({
      timeline() {
        const v = videoRef.current;
        if (!v || !startedRef.current) return null;
        const fileDur =
          Number.isFinite(v.duration) && v.duration > 0 ? v.duration : clip.duration;
        const duration = Math.min(clip.duration, fileDur);
        return {
          elapsed: v.ended ? duration : Math.min(v.currentTime, duration),
          duration,
        };
      },
      seekTo(seconds: number) {
        const v = videoRef.current;
        if (!v) return;
        try {
          v.currentTime = Math.max(0, seconds);
        } catch {
          /* not seekable yet */
        }
        if (playingRef.current && (v.paused || v.ended)) v.play().catch(() => {});
      },
    }),
    [clip.duration],
  );

  // React does not reliably reflect `muted` before the first play() — set the property directly.
  useLayoutEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = muted || !!clip.silent;
  }, [muted, clip.silent]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => {
        // Unmuted playback can be refused without a gesture; fall back to muted.
        if (!v.muted) {
          v.muted = true;
          v.play().catch(() => {});
        }
      });
    } else {
      v.pause();
    }
  }, [playing]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const markStarted = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      setRevealed(true);
    };
    // Reveal on the first *presented* frame where supported — avoids a black flash.
    const rvfc = (
      v as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => number;
      }
    ).requestVideoFrameCallback;
    const onPlaying = () => {
      if (rvfc) rvfc.call(v, markStarted);
      else markStarted();
    };
    const onTime = () => {
      if (v.currentTime > 0.05) markStarted();
    };
    v.addEventListener("playing", onPlaying);
    v.addEventListener("timeupdate", onTime);
    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("timeupdate", onTime);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop={loop}
      playsInline
      preload="auto"
      disablePictureInPicture
      className={styles.fill}
      style={{ opacity: revealed ? 1 : 0 }}
    />
  );
});

/* ─────────────────────────────── YouTube ─────────────────────────────── */

const YT_PLAYING = 1;
/** Stop this far before the real end so YouTube's end screen never renders. */
const YT_TAIL_S = 1.2;
/** Dip-to-black when jumping between segments or looping */
const YT_VEIL_MS = 220;
/**
 * Touch browsers get YouTube's mobile player, which lays its title and a pause
 * button over the picture for a few seconds after every load, seek, or resume
 * (and for as long as it is paused). There, the poster stays up until that
 * chrome has cleared, and each segment runs this much longer to make up for it.
 */
const YT_TOUCH_CHROME_S = 4.4;

function hasTouchPlayerChrome() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches
  );
}

type YtPlayer = {
  destroy(): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(s: number, allowSeekAhead: boolean): void;
  loadVideoById(o: { videoId: string; startSeconds?: number }): void;
  cueVideoById(o: { videoId: string; startSeconds?: number }): void;
  mute(): void;
  unMute(): void;
  setVolume(v: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  unloadModule?(name: string): void;
};

type YtCtor = new (el: HTMLElement, opts: Record<string, unknown>) => unknown;

/** Muted playback makes YouTube switch auto-captions on; these reels are silent b-roll. */
function hideCaptions(p: YtPlayer) {
  try {
    p.unloadModule?.("captions");
    p.unloadModule?.("cc");
  } catch {
    /* module not loaded yet */
  }
}

/** YouTube returns a 120×90 grey placeholder (not an error) when maxres is missing. */
export function onPosterLoad(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.naturalWidth <= 120 && img.src.includes("maxresdefault")) {
    img.src = img.src.replace("maxresdefault", "hqdefault");
  }
}

export const YouTubeReelMedia = forwardRef<
  ReelHandle,
  MediaProps & { clip: YouTubeClip }
>(function YouTubeReelMedia({ clip, playing, muted }, ref) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const clipRef = useRef(clip);
  const playingRef = useRef(playing);
  const mutedRef = useRef(muted);
  clipRef.current = clip;
  playingRef.current = playing;
  mutedRef.current = muted || !!clip.silent;

  /** videoId the player currently holds */
  const loadedIdRef = useRef<string | null>(null);
  /** playVideo() has been issued for the loaded video */
  const kickedRef = useRef(false);
  const segIdxRef = useRef(0);
  const videoDurRef = useRef(0);
  /** Frames have advanced at least once for this clip */
  const everStartedRef = useRef(false);
  /** Frames are advancing in the current segment */
  const segStartedRef = useRef(false);
  const switchingRef = useRef(false);
  const lastTRef = useRef<number | null>(null);
  const lastTAtRef = useRef(0);
  const isPlayingStateRef = useRef(false);
  const endedRef = useRef(false);

  /** Touch only: the player's own chrome is (about to be) on screen */
  const touchRef = useRef(false);
  const chromePendingRef = useRef(false);
  const chromeUntilRef = useRef(0);
  const revealedRef = useRef(false);

  const [revealed, setRevealedState] = useState(false);
  const [veil, setVeil] = useState(false);
  const setRevealed = useCallback((v: boolean) => {
    if (revealedRef.current === v) return;
    revealedRef.current = v;
    setRevealedState(v);
  }, []);

  /** Call after anything that makes the mobile player show its chrome. */
  const coverChrome = useCallback(() => {
    if (!touchRef.current) return;
    chromePendingRef.current = true;
    setRevealed(false);
  }, [setRevealed]);

  const segEnd = useCallback((i: number) => {
    const s = clipRef.current.segments[i];
    const d = videoDurRef.current;
    const end = s.end + (touchRef.current ? YT_TOUCH_CHROME_S : 0);
    return d > 0 ? Math.max(s.start, Math.min(end, d - YT_TAIL_S)) : end;
  }, []);

  /** Start (or cue) `clipRef.current` from its first segment. */
  const loadClip = useCallback(
    (p: YtPlayer) => {
      const c = clipRef.current;
      const start = c.segments[0].start;
      try {
        if (mutedRef.current) p.mute();
        else {
          p.unMute();
          p.setVolume(100);
        }
        if (playingRef.current) {
          p.loadVideoById({ videoId: c.videoId, startSeconds: start });
          kickedRef.current = true;
        } else {
          p.cueVideoById({ videoId: c.videoId, startSeconds: start });
          kickedRef.current = false;
        }
        loadedIdRef.current = c.videoId;
        coverChrome();
      } catch {
        /* player torn down mid-call */
      }
    },
    [coverChrome],
  );

  const applyPlayback = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (mutedRef.current) p.mute();
      else {
        p.unMute();
        p.setVolume(100);
      }
      if (playingRef.current) {
        if (endedRef.current) return; // the viewport loops or advances from here
        if (!kickedRef.current) {
          kickedRef.current = true;
          p.seekTo(clipRef.current.segments[0].start, true);
        }
        p.playVideo();
      } else if (kickedRef.current) {
        p.pauseVideo();
      }
    } catch {
      /* player torn down mid-call */
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      timeline() {
        if (!everStartedRef.current) return null;
        const segs = clipRef.current.segments;
        const i = segIdxRef.current;
        let total = 0;
        let before = 0;
        for (let j = 0; j < segs.length; j++) {
          const len = segEnd(j) - segs[j].start;
          total += len;
          if (j < i) before += len;
        }
        total = Math.max(total, 0.1);
        if (endedRef.current) return { elapsed: total, duration: total };
        let within = 0;
        if (lastTRef.current !== null) {
          // YouTube only posts currentTime every ~250ms — interpolate so the scrubber glides.
          const drift =
            isPlayingStateRef.current && segStartedRef.current
              ? Math.min(0.5, (performance.now() - lastTAtRef.current) / 1000)
              : 0;
          within = Math.min(
            Math.max(lastTRef.current + drift - segs[i].start, 0),
            segEnd(i) - segs[i].start,
          );
        }
        return { elapsed: before + within, duration: total };
      },
      seekTo(seconds: number) {
        const p = playerRef.current;
        const segs = clipRef.current.segments;
        let i = 0;
        let rest = Math.max(0, seconds);
        while (i < segs.length - 1 && rest >= segEnd(i) - segs[i].start) {
          rest -= segEnd(i) - segs[i].start;
          i += 1;
        }
        const target = Math.max(
          segs[i].start,
          Math.min(segs[i].start + rest, segEnd(i) - 0.3),
        );
        segIdxRef.current = i;
        segStartedRef.current = false;
        endedRef.current = false;
        lastTRef.current = target;
        lastTAtRef.current = performance.now();
        if (!p) return;
        try {
          p.seekTo(target, true);
          if (playingRef.current) {
            kickedRef.current = true;
            p.playVideo();
          }
          coverChrome();
        } catch {
          /* ignore */
        }
      },
    }),
    [segEnd, coverChrome],
  );

  // One player for the life of the viewport.
  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    touchRef.current = hasTouchPlayerChrome();
    chromePendingRef.current = touchRef.current;
    void loadYouTubeIframeApi().then(() => {
      const YT = window.YT as { Player: YtCtor } | undefined;
      if (cancelled || !host || !YT?.Player) return;
      const first = clipRef.current;
      const mount = document.createElement("div");
      host.appendChild(mount);
      loadedIdRef.current = first.videoId;
      try {
        new YT.Player(mount, {
          videoId: first.videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            mute: 1,
            controls: 0,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            cc_load_policy: 0,
            start: Math.floor(first.segments[0].start),
            origin: window.location.origin,
          },
          events: {
            onReady: (e: { target: YtPlayer }) => {
              if (cancelled) return;
              playerRef.current = e.target;
              // The clip may have changed while the player was booting.
              if (loadedIdRef.current !== clipRef.current.videoId) loadClip(e.target);
              else applyPlayback();
            },
            onStateChange: (e: { data: number }) => {
              isPlayingStateRef.current = e.data === YT_PLAYING;
              if (e.data === YT_PLAYING && playerRef.current && mutedRef.current) {
                hideCaptions(playerRef.current);
              }
            },
          },
        });
      } catch {
        /* poster stays up */
      }
    });
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      if (host) host.innerHTML = "";
    };
  }, [applyPlayback, loadClip]);

  // Clip changed → reset tracking and swap the video inside the same player.
  // (Layout effect: must land before the viewport's next clock tick, which would
  // otherwise read the previous clip's "ended" and skip ahead.)
  const firstClipRef = useRef(true);
  useLayoutEffect(() => {
    if (firstClipRef.current) {
      firstClipRef.current = false;
      return;
    }
    segIdxRef.current = 0;
    segStartedRef.current = false;
    everStartedRef.current = false;
    endedRef.current = false;
    switchingRef.current = false;
    lastTRef.current = null;
    videoDurRef.current = 0;
    setRevealed(false);
    setVeil(false);
    const p = playerRef.current;
    if (p) loadClip(p);
  }, [clip.id, clip.videoId, loadClip, setRevealed]);

  useEffect(() => {
    // Paused or resuming: the mobile player puts its own UI up either way.
    if (kickedRef.current) coverChrome();
    applyPlayback();
  }, [playing, applyPlayback, coverChrome]);

  useEffect(() => {
    applyPlayback();
  }, [muted, applyPlayback]);

  // Watch frames + segment boundaries.
  useEffect(() => {
    let veilTimer: ReturnType<typeof setTimeout> | undefined;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p || switchingRef.current || endedRef.current) return;
      let t: number;
      let st: number;
      try {
        t = p.getCurrentTime();
        st = p.getPlayerState();
        if (!videoDurRef.current) videoDurRef.current = p.getDuration() || 0;
      } catch {
        return;
      }
      isPlayingStateRef.current = st === YT_PLAYING;
      const segs = clipRef.current.segments;
      const i = segIdxRef.current;
      const seg = segs[i];
      const inSegment = t >= seg.start - 0.25 && t <= segEnd(i) + 2;

      const prev = lastTRef.current;
      if (inSegment && (prev === null || t !== prev)) {
        lastTRef.current = t;
        lastTAtRef.current = performance.now();
      }
      const advancing = st === YT_PLAYING && prev !== null && t > prev && inSegment;

      if (advancing && !segStartedRef.current) {
        segStartedRef.current = true;
        everStartedRef.current = true;
        setVeil(false);
      }

      if (advancing && !revealedRef.current) {
        const now = performance.now();
        if (chromePendingRef.current) {
          // Frames are moving again: the chrome clears a few seconds from here.
          chromePendingRef.current = false;
          chromeUntilRef.current = now + YT_TOUCH_CHROME_S * 1000;
        }
        if (now >= chromeUntilRef.current) setRevealed(true);
      }

      if (!segStartedRef.current || t < segEnd(i) - 0.12) return;

      if (i < segs.length - 1) {
        // Cut to the next segment through a short dip to black.
        switchingRef.current = true;
        setVeil(true);
        veilTimer = setTimeout(() => {
          segIdxRef.current = i + 1;
          segStartedRef.current = false;
          lastTRef.current = null;
          try {
            p.seekTo(segs[i + 1].start, true);
            if (playingRef.current) p.playVideo();
            coverChrome();
          } catch {
            /* ignore */
          }
          switchingRef.current = false;
        }, YT_VEIL_MS);
      } else {
        // Report complete and dip to black; the viewport loops or advances from here.
        // (Not paused: pausing makes YouTube flash its own pause glyph over the next clip.)
        endedRef.current = true;
        setVeil(true);
      }
    }, 100);
    return () => {
      window.clearInterval(id);
      if (veilTimer) clearTimeout(veilTimer);
      switchingRef.current = false;
    };
  }, [segEnd, setRevealed, coverChrome]);

  return (
    <>
      {/* Oversized + cropped so YouTube's title bar and watermark fall outside the frame */}
      <div className={styles.ytCrop}>
        <div ref={hostRef} className={styles.ytHost} />
      </div>
      <div className={styles.veil} style={{ opacity: veil ? 1 : 0 }} aria-hidden />
      <img
        key={clip.id}
        src={clipPoster(clip)}
        alt=""
        onLoad={onPosterLoad}
        className={`${styles.fill} ${styles.ytPoster}`}
        style={{ opacity: revealed ? 0 : 1 }}
        decoding="async"
        draggable={false}
      />
    </>
  );
});
