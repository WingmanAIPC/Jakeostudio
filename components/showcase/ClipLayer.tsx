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
  type ShowcaseClip,
  type YouTubeClip,
} from "../../lib/showcase";
import styles from "./showcase.module.css";

/**
 * warm    — mounted under everything at opacity 0 so media buffers before its turn
 * active  — on top, fading in, playing
 * leaving — directly under the new active layer, fully opaque, still playing,
 *           until the incoming layer has finished fading in (then unmounted)
 */
export type LayerState = "warm" | "active" | "leaving";

export type ClipTimeline = { elapsed: number; duration: number };

export interface ClipHandle {
  /** `null` until real frames are advancing; afterwards seconds played / seconds playable. */
  timeline(): ClipTimeline | null;
}

type MediaProps = {
  state: LayerState;
  /** Active, not paused, page visible, hero on screen */
  playing: boolean;
  muted: boolean;
  /** Prefer the 720p encode */
  small: boolean;
  onReady?: () => void;
  onFail?: () => void;
};

/* ─────────────────────────── Self-hosted MP4 ─────────────────────────── */

const FileClipMedia = forwardRef<ClipHandle, MediaProps & { clip: FileClip }>(
  function FileClipMedia(
    { clip, state, playing, muted, small, onReady, onFail },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const startedRef = useRef(false);
    const onReadyRef = useRef(onReady);
    const onFailRef = useRef(onFail);
    onReadyRef.current = onReady;
    onFailRef.current = onFail;
    const [revealed, setRevealed] = useState(false);
    const src = small && clip.srcSmall ? clip.srcSmall : clip.src;

    useImperativeHandle(
      ref,
      () => ({
        timeline() {
          const v = videoRef.current;
          if (!v || !startedRef.current) return null;
          const fileDur =
            Number.isFinite(v.duration) && v.duration > 0
              ? v.duration
              : clip.duration;
          return {
            elapsed: v.ended ? fileDur : v.currentTime,
            duration: Math.min(clip.duration, fileDur),
          };
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
      if (!v || state === "leaving") return;
      if (playing) {
        v.play().catch(() => {
          // Unmuted autoplay can be refused after a navigation; retry muted.
          // A second refusal (e.g. iOS Low Power Mode) is handled by the
          // stage's wall-clock fallback, which keeps the poster up.
          if (!v.muted) {
            v.muted = true;
            v.play().catch(() => {});
          }
        });
      } else {
        v.pause();
      }
    }, [playing, state]);

    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;
      const markStarted = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        setRevealed(true);
      };
      // Reveal on the first *presented* frame where supported — avoids a black
      // frame on browsers that clear the poster before decoding.
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
      const onCanPlay = () => onReadyRef.current?.();
      const onError = () => onFailRef.current?.();
      v.addEventListener("playing", onPlaying);
      v.addEventListener("timeupdate", onTime);
      v.addEventListener("canplay", onCanPlay);
      v.addEventListener("error", onError);
      if (v.readyState >= 3) onReadyRef.current?.();
      return () => {
        v.removeEventListener("playing", onPlaying);
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("canplay", onCanPlay);
        v.removeEventListener("error", onError);
      };
    }, []);

    return (
      <>
        <img
          src={clip.poster}
          alt=""
          className={styles.fill}
          decoding="async"
          draggable={false}
        />
        <video
          ref={videoRef}
          src={src}
          poster={clip.poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className={styles.fill}
          style={{ opacity: revealed ? 1 : 0 }}
        />
      </>
    );
  },
);

/* ─────────────────────────────── YouTube ─────────────────────────────── */

const YT_ENDED = 0;
const YT_PLAYING = 1;
/** Stop this far before the real end so YouTube's end screen never renders. */
const YT_TAIL_S = 1.2;
/** Dip-to-black between segments of one clip */
const YT_VEIL_MS = 220;

type YtPlayer = {
  destroy(): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(s: number, allowSeekAhead: boolean): void;
  mute(): void;
  unMute(): void;
  setVolume(v: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
};

type YtCtor = new (
  el: HTMLElement,
  opts: Record<string, unknown>,
) => unknown;

/** YouTube returns a 120×90 grey placeholder (not an error) when maxres is missing. */
function onPosterLoad(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.naturalWidth <= 120 && img.src.includes("maxresdefault")) {
    img.src = img.src.replace("maxresdefault", "hqdefault");
  }
}

const YouTubeClipMedia = forwardRef<
  ClipHandle,
  MediaProps & { clip: YouTubeClip }
>(function YouTubeClipMedia(
  { clip, state, playing, muted, onReady, onFail },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const stateRef = useRef(state);
  const playingRef = useRef(playing);
  const mutedRef = useRef(muted);
  const onReadyRef = useRef(onReady);
  const onFailRef = useRef(onFail);
  stateRef.current = state;
  playingRef.current = playing;
  mutedRef.current = muted || !!clip.silent;
  onReadyRef.current = onReady;
  onFailRef.current = onFail;

  const segs = clip.segments;
  const segIdxRef = useRef(0);
  const videoDurRef = useRef(0);
  /** Frames have advanced at least once (clip has visibly started) */
  const everStartedRef = useRef(false);
  /** Frames are advancing in the current segment */
  const segStartedRef = useRef(false);
  const kickedRef = useRef(false);
  const switchingRef = useRef(false);
  const lastTRef = useRef<number | null>(null);
  const lastTAtRef = useRef(0);
  const isPlayingStateRef = useRef(false);
  const endedRef = useRef(false);

  const [revealed, setRevealed] = useState(false);
  const [veil, setVeil] = useState(false);

  const segEnd = useCallback(
    (i: number) => {
      const s = segs[i];
      const d = videoDurRef.current;
      return d > 0 ? Math.max(s.start, Math.min(s.end, d - YT_TAIL_S)) : s.end;
    },
    [segs],
  );

  useImperativeHandle(
    ref,
    () => ({
      timeline() {
        if (!everStartedRef.current) return null;
        const i = segIdxRef.current;
        let total = 0;
        let before = 0;
        for (let j = 0; j < segs.length; j++) {
          const len = segEnd(j) - segs[j].start;
          total += len;
          if (j < i) before += len;
        }
        if (endedRef.current) return { elapsed: total, duration: total };
        let within = 0;
        if (segStartedRef.current && lastTRef.current !== null) {
          // YouTube only posts currentTime every ~250ms — interpolate so the rail glides.
          const drift = isPlayingStateRef.current
            ? Math.min(0.5, (performance.now() - lastTAtRef.current) / 1000)
            : 0;
          within = Math.min(
            Math.max(lastTRef.current + drift - segs[i].start, 0),
            segEnd(i) - segs[i].start,
          );
        }
        return { elapsed: before + within, duration: Math.max(total, 0.1) };
      },
    }),
    [segs, segEnd],
  );

  const applyPlayback = useCallback(() => {
    const p = playerRef.current;
    if (!p || stateRef.current === "leaving") return;
    try {
      if (mutedRef.current) p.mute();
      else {
        p.unMute();
        p.setVolume(100);
      }
      if (playingRef.current) {
        if (!kickedRef.current) {
          kickedRef.current = true;
          p.seekTo(segs[0].start, true);
        }
        p.playVideo();
      } else if (kickedRef.current) {
        p.pauseVideo();
      }
    } catch {
      /* player torn down mid-call */
    }
  }, [segs]);

  // Create the player once per layer instance.
  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    void loadYouTubeIframeApi().then(() => {
      const YT = window.YT as { Player: YtCtor } | undefined;
      if (cancelled || !host || !YT?.Player) return;
      const mount = document.createElement("div");
      host.appendChild(mount);
      try {
        new YT.Player(mount, {
          videoId: clip.videoId,
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
            start: Math.floor(segs[0].start),
            origin: window.location.origin,
          },
          events: {
            onReady: (e: { target: YtPlayer }) => {
              if (cancelled) return;
              playerRef.current = e.target;
              try {
                videoDurRef.current = e.target.getDuration() || 0;
              } catch {
                /* ignore */
              }
              onReadyRef.current?.();
              applyPlayback();
            },
            onStateChange: (e: { data: number }) => {
              isPlayingStateRef.current = e.data === YT_PLAYING;
              // Shouldn't happen (we stop short of the end), but if it does, report complete.
              if (e.data === YT_ENDED && !cancelled && everStartedRef.current) {
                endedRef.current = true;
              }
            },
            onError: () => {
              if (!cancelled) onFailRef.current?.();
            },
          },
        });
      } catch {
        onFailRef.current?.();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clip.videoId]);

  useEffect(() => {
    applyPlayback();
  }, [playing, muted, state, applyPlayback]);

  // Watch frames + segment boundaries while on screen.
  useEffect(() => {
    if (state === "warm") return;
    let veilTimer: ReturnType<typeof setTimeout> | undefined;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
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
      const i = segIdxRef.current;
      const seg = segs[i];
      if (switchingRef.current) return;

      const prev = lastTRef.current;
      if (prev === null || t !== prev) {
        lastTRef.current = t;
        lastTAtRef.current = performance.now();
      }
      const advancing =
        st === YT_PLAYING &&
        prev !== null &&
        t > prev &&
        t >= seg.start - 0.25 &&
        t <= segEnd(i) + 2;

      if (advancing && !segStartedRef.current) {
        segStartedRef.current = true;
        everStartedRef.current = true;
        setRevealed(true);
        setVeil(false);
      }

      if (
        stateRef.current === "active" &&
        segStartedRef.current &&
        i < segs.length - 1 &&
        t >= segEnd(i) - 0.12
      ) {
        switchingRef.current = true;
        setVeil(true);
        veilTimer = setTimeout(() => {
          segIdxRef.current = i + 1;
          segStartedRef.current = false;
          lastTRef.current = null;
          try {
            p.seekTo(segs[i + 1].start, true);
            if (playingRef.current) p.playVideo();
          } catch {
            /* ignore */
          }
          switchingRef.current = false;
        }, YT_VEIL_MS);
      }

      // A leaving layer keeps playing under the crossfade — but never into the end screen.
      if (
        stateRef.current === "leaving" &&
        videoDurRef.current > 0 &&
        t >= videoDurRef.current - 0.6
      ) {
        try {
          p.pauseVideo();
        } catch {
          /* ignore */
        }
      }
    }, 100);
    return () => {
      window.clearInterval(id);
      if (veilTimer) clearTimeout(veilTimer);
      switchingRef.current = false;
    };
  }, [state, segs, segEnd]);

  const poster = clipPoster(clip);

  return (
    <>
      {/* Oversized + cropped so YouTube's title bar and watermark fall outside the frame */}
      <div className={styles.ytCrop}>
        <div ref={hostRef} className={styles.ytHost} />
      </div>
      <div
        className={styles.veil}
        style={{ opacity: veil ? 1 : 0 }}
        aria-hidden
      />
      <img
        src={poster}
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

/* ─────────────────────────────── Layer ─────────────────────────────── */

export interface ClipLayerProps extends MediaProps {
  clip: ShowcaseClip;
  /** Blurred fill behind the framed video in portrait */
  backdrop: string;
  z: number;
  label: string;
}

const ClipLayer = forwardRef<ClipHandle, ClipLayerProps>(function ClipLayer(
  { clip, backdrop, z, label, state, ...media },
  ref,
) {
  // A layer mounted straight into "active" needs one painted frame at opacity 0
  // before the transition can run.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);

  const shown = state === "leaving" || (state === "active" && entered);

  return (
    <div
      className={styles.layer}
      data-state={state}
      data-shown={shown ? "" : undefined}
      style={{ zIndex: z }}
      aria-hidden={state !== "active"}
      aria-label={state === "active" ? label : undefined}
    >
      <img
        src={backdrop}
        alt=""
        className={styles.backdrop}
        decoding="async"
        draggable={false}
      />
      <div className={styles.settle}>
        <div className={styles.mediaBox}>
          {clip.kind === "file" ? (
            <FileClipMedia ref={ref} clip={clip} state={state} {...media} />
          ) : (
            <YouTubeClipMedia ref={ref} clip={clip} state={state} {...media} />
          )}
        </div>
      </div>
    </div>
  );
});

export default ClipLayer;
