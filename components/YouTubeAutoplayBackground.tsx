import React, { useEffect, useRef, useState, useId } from "react";
import { loadYouTubeIframeApi } from "./YouTubeSegmentPlayer";

/** YouTube IFrame API `YT.PlayerState.PLAYING` */
const YT_PLAYING = 1;

type YtBgPlayer = {
  destroy: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
};

/**
 * Muted cover-fit autoplay: keeps the poster visible until the player reports
 * PLAYING, avoiding the empty/black iframe while the embed buffers.
 */
export default function YouTubeAutoplayBackground({
  videoId,
  posterSrc,
  isActive,
  startSeconds = 0,
  loop = true,
  embedDelayMs = 0,
  fillContainer = false,
}: {
  videoId: string;
  posterSrc: string;
  isActive: boolean;
  startSeconds?: number;
  loop?: boolean;
  embedDelayMs?: number;
  /** When true, fills its container (for 16:9 wrappers). Default false = viewport-cover sizing. */
  fillContainer?: boolean;
}) {
  const reactId = useId().replace(/:/g, "");
  const containerId = `ytbg-${reactId}`;
  const playerRef = useRef<YtBgPlayer | null>(null);
  const mountedRef = useRef(true);
  const [hidePoster, setHidePoster] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      setHidePoster(false);
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
      return;
    }

    let cancelled = false;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;

    const beginPlayback = async () => {
      await loadYouTubeIframeApi();
      if (cancelled || !mountedRef.current) return;
      if (!window.YT?.Player) return;

      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = "";

      const playerVars: Record<string, string | number> = {
        autoplay: 1,
        mute: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        iv_load_policy: 3,
        disablekb: 1,
        origin: typeof window !== "undefined" ? window.location.origin : "",
      };
      if (loop) {
        playerVars.loop = 1;
        playerVars.playlist = videoId;
      }

      try {
        new window.YT.Player(el, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars,
          events: {
            onReady: (e: { target: YtBgPlayer }) => {
              if (cancelled || !mountedRef.current) return;
              playerRef.current = e.target;
              if (startSeconds > 0) {
                e.target.seekTo(startSeconds, true);
              }
              e.target.playVideo();
            },
            onStateChange: (e: { data: number }) => {
              if (cancelled || !mountedRef.current) return;
              if (e.data === YT_PLAYING) {
                setHidePoster(true);
              }
            },
          },
        });
      } catch {
        /* keep poster visible */
      }
    };

    if (embedDelayMs > 0) {
      delayTimer = setTimeout(() => {
        delayTimer = undefined;
        void beginPlayback();
      }, embedDelayMs);
    } else {
      void beginPlayback();
    }

    return () => {
      cancelled = true;
      if (delayTimer) clearTimeout(delayTimer);
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
  }, [isActive, videoId, containerId, startSeconds, loop, embedDelayMs]);

  const coverStyle = fillContainer
    ? undefined
    : {
        width: "177.78vh" as const,
        height: "100vh" as const,
        minWidth: "100vw" as const,
        minHeight: "56.25vw" as const,
        transform: "translate(-50%, -50%)" as const,
      };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={
          fillContainer
            ? "absolute inset-0 pointer-events-none"
            : "absolute top-1/2 left-1/2 pointer-events-none"
        }
        style={coverStyle}
      >
        <div id={containerId} className="h-full w-full" />
        <img
          src={posterSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[700ms] ease-out pointer-events-none z-[1]"
          style={{ opacity: hidePoster ? 0 : 1 }}
        />
      </div>
    </div>
  );
}
