import React, { useEffect, useRef, useId, useState } from "react";

/** YouTube IFrame API `YT.PlayerState.PLAYING` */
const YT_PLAYING = 1;

export type YoutubeTimeSegment = { start: number; end: number };

declare global {
  interface Window {
    YT?: {
      Player: new (
        id: string | HTMLElement,
        options: Record<string, unknown>,
      ) => unknown;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YtPlayerInstance = {
  destroy: () => void;
  seekTo: (s: number, a: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
};

let ytApiPromise: Promise<void> | null = null;

export function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      try {
        prev?.();
      } finally {
        resolve();
      }
    };
    const existing = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const first = document.getElementsByTagName("script")[0];
      first.parentNode!.insertBefore(tag, first);
    }
  });
  return ytApiPromise;
}

function segmentTotalSeconds(segments: YoutubeTimeSegment[]): number {
  return segments.reduce((a, s) => a + Math.max(0, s.end - s.start), 0);
}

function segmentsKey(segments: YoutubeTimeSegment[]): string {
  return segments.map((s) => `${s.start}-${s.end}`).join("|");
}

/**
 * Muted background playback through ordered [start, end) time ranges; calls onComplete after the last segment.
 * Keeps a poster on top of the iframe until PLAYING (same idea as `YouTubeAutoplayBackground`), and briefly
 * restores it when seeking to the next segment so YouTube’s black buffer frame does not flash through.
 */
export default function YouTubeSegmentPlayer({
  videoId,
  segments,
  isActive,
  startDelayMs = 0,
  onComplete,
  onProgress,
  className,
  posterSrc,
}: {
  videoId: string;
  segments: YoutubeTimeSegment[];
  isActive: boolean;
  /** Wait after `isActive` before loading the player (lets poster / transition settle) */
  startDelayMs?: number;
  onComplete?: () => void;
  onProgress?: (fraction: number) => void;
  className?: string;
  /** Thumbnail over the iframe until playback starts; defaults to YouTube maxres poster for `videoId` */
  posterSrc?: string;
}) {
  const reactId = useId().replace(/:/g, "");
  const containerId = `ytseg-${reactId}`;
  const playerRef = useRef<YtPlayerInstance | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>();
  const segIndexRef = useRef(0);
  const mountedRef = useRef(true);
  const cycleCompleteRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);
  const [hidePoster, setHidePoster] = useState(false);

  const resolvedPoster =
    posterSrc ?? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  onCompleteRef.current = onComplete;
  onProgressRef.current = onProgress;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const segKey = segmentsKey(segments);

  useEffect(() => {
    if (!isActive || segments.length === 0) {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = undefined;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          /* ignore */
        }
        playerRef.current = null;
      }
      const elInactive = document.getElementById(containerId);
      if (elInactive) elInactive.innerHTML = "";
      cycleCompleteRef.current = false;
      onProgressRef.current?.(0);
      setHidePoster(false);
      return;
    }

    let cancelled = false;
    cycleCompleteRef.current = false;
    setHidePoster(false);

    const startSegment = (player: YtPlayerInstance, idx: number) => {
      const seg = segments[idx];
      if (!seg) return;
      segIndexRef.current = idx;
      setHidePoster(false);
      player.seekTo(seg.start, true);
      player.playVideo();
    };

    const tick = () => {
      const player = playerRef.current;
      if (!player || cancelled) return;
      const idx = segIndexRef.current;
      const seg = segments[idx];
      if (!seg) return;
      let t: number;
      try {
        t = player.getCurrentTime();
      } catch {
        return;
      }

      if (t >= seg.end - 0.25) {
        const next = idx + 1;
        if (next >= segments.length) {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = undefined;
          onProgressRef.current?.(1);
          if (!cycleCompleteRef.current) {
            cycleCompleteRef.current = true;
            onCompleteRef.current?.();
          }
          return;
        }
        startSegment(player, next);
        return;
      }

      const onProg = onProgressRef.current;
      if (onProg) {
        const total = segmentTotalSeconds(segments);
        if (total <= 0) return;
        let elapsed = 0;
        for (let j = 0; j < idx; j++) {
          const s = segments[j];
          elapsed += Math.max(0, s.end - s.start);
        }
        elapsed += Math.min(
          Math.max(t - seg.start, 0),
          Math.max(0, seg.end - seg.start),
        );
        onProg(Math.min(1, elapsed / total));
      }
    };

    const beginPlayback = async () => {
      await loadYouTubeIframeApi();
      if (cancelled || !mountedRef.current) return;
      if (!window.YT?.Player) return;

      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = "";

      try {
        new window.YT.Player(el, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            iv_load_policy: 3,
            disablekb: 1,
            origin:
              typeof window !== "undefined" ? window.location.origin : "",
          },
          events: {
            onReady: (e: { target: YtPlayerInstance }) => {
              if (cancelled || !mountedRef.current) return;
              playerRef.current = e.target;
              startSegment(e.target, 0);
              if (pollRef.current) clearInterval(pollRef.current);
              pollRef.current = setInterval(tick, 120);
            },
            onStateChange: (e: { data: number }) => {
              if (cancelled || !mountedRef.current) return;
              if (e.data === YT_PLAYING) {
                setHidePoster(true);
              }
            },
            onError: () => {
              if (cancelled) return;
              onCompleteRef.current?.();
            },
          },
        });
      } catch {
        onCompleteRef.current?.();
      }
    };

    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    if (startDelayMs > 0) {
      delayTimer = setTimeout(() => {
        delayTimer = undefined;
        if (cancelled || !mountedRef.current) return;
        void beginPlayback();
      }, startDelayMs);
    } else {
      void beginPlayback();
    }

    return () => {
      cancelled = true;
      if (delayTimer) clearTimeout(delayTimer);
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = undefined;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          /* ignore */
        }
        playerRef.current = null;
      }
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = "";
    };
  }, [isActive, videoId, segKey, containerId, startDelayMs]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden pointer-events-none ${
        className ?? ""
      }`}
    >
      <div id={containerId} className="absolute inset-0 z-0 h-full w-full" />
      <img
        src={resolvedPoster}
        alt=""
        className="absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-[700ms] ease-out pointer-events-none"
        style={{ opacity: hidePoster ? 0 : 1 }}
      />
    </div>
  );
}
