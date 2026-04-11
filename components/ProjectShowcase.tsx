import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import Link from "next/link";
import YouTubeSegmentPlayer from "./YouTubeSegmentPlayer";
import YouTubeAutoplayBackground from "./YouTubeAutoplayBackground";
import {
  FEATURED_PROJECTS,
  CLOVERLEAF_THUMB_VIDEO_IDS,
  HIRE_SHOWCASE_CLIPS,
  hireClipTotalMs,
  biroAdminClipTotalMs,
  BIRO_ADMIN_SEGMENTS,
  BIRO_ADMIN_VIDEO_ID,
  BIRO_CAROUSEL_EMBED_DELAY_MS,
  BIRO_CUSTOMER_VIDEO_ID,
  getCloverleafShowcasePair,
  type FeaturedProject,
} from "../lib/work";

const DEFAULT_SLIDE_MS = 9000;
const TEXT_FADE_MS = 400;
const THUMBNAIL_ROTATE_MS = 3000;
/** Cloverleaf thumb + short YouTube preview per slot (before outro video) */
const CLOVERLEAF_PREVIEW_PHASE_MS = THUMBNAIL_ROTATE_MS * 2;
const WHITE_FLASH_IN_MS = 340;
const WHITE_FLASH_OUT_MS = 400;

/** Primary CTA — frosted glass + inner edge highlight (no outer glow) */
const ctaPrimaryClass =
  "group relative inline-flex items-center justify-center overflow-hidden px-6 py-3 rounded-2xl text-sm font-semibold tracking-wide text-white whitespace-nowrap transition-all duration-300 ease-out border border-white/50 bg-white/[0.14] backdrop-blur-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_1px_0_0_rgba(255,255,255,0.18)_inset] hover:border-white/85 hover:bg-white/[0.22] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_1px_0_0_rgba(255,255,255,0.22)_inset] hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40";

/** Secondary CTA — glass outline, no outer glow */
const ctaSecondaryClass =
  "inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium text-white whitespace-nowrap transition-all duration-300 border border-white/28 bg-black/25 backdrop-blur-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] hover:border-white/50 hover:bg-black/35 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40";

function AppleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

/** Muted autoplay previews use `YouTubeAutoplayBackground` (poster until PLAYING). Phase length: CLOVERLEAF_PREVIEW_PHASE_MS */

function ThumbsThenVideoBackground({
  project,
  isActive,
  onComplete,
  reportProgress,
}: {
  project: FeaturedProject;
  isActive: boolean;
  onComplete: () => void;
  reportProgress?: (fraction: number) => void;
}) {
  const thumbs = (project.thumbnails ?? []).slice(0, 2);
  const previewIds = (project.cloverleafPreviewVideoIds ?? []).slice(0, 2);
  const previewKey =
    previewIds.length >= 2 ? `${previewIds[0]}|${previewIds[1]}` : "";
  const useVideoPreview = previewIds.length >= 2;
  const outroSrc = project.videoSrc;
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [videoDurMs, setVideoDurMs] = useState(14_000);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isActiveRef = useRef(isActive);
  const sequenceStartRef = useRef(0);
  isActiveRef.current = isActive;

  /** Reset sequence when the slide becomes active or the preview pair changes — do not depend on a key that bumps after mount (that was remounting mid-sequence). */
  useLayoutEffect(() => {
    if (isActive) {
      sequenceStartRef.current = Date.now();
      setPhase(0);
    }
  }, [isActive, previewKey]);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || thumbs.length < 2 || !outroSrc) return;
    if (phase === 0) {
      const t = setTimeout(() => setPhase(1), CLOVERLEAF_PREVIEW_PHASE_MS);
      return () => clearTimeout(t);
    }
    if (phase === 1) {
      const t = setTimeout(() => setPhase(2), CLOVERLEAF_PREVIEW_PHASE_MS);
      return () => clearTimeout(t);
    }
  }, [isActive, phase, thumbs.length, outroSrc, previewKey]);

  useEffect(() => {
    if (!isActive || phase !== 2 || !videoRef.current) return;
    const v = videoRef.current;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [isActive, phase]);

  useEffect(() => {
    if (!isActive || !reportProgress) return;
    const totalMs = Math.max(CLOVERLEAF_PREVIEW_PHASE_MS * 2 + videoDurMs, 1);
    let frame: number;
    const tick = () => {
      const elapsed = Date.now() - sequenceStartRef.current;
      reportProgress(Math.min(1, elapsed / totalMs));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isActive, reportProgress, videoDurMs]);

  const handleEnded = () => {
    reportProgress?.(1);
    if (isActiveRef.current) onComplete();
  };

  if (thumbs.length < 2 || !outroSrc) return null;

  return (
    <>
      {thumbs.map((src, ti) => (
        <div
          key={`${src}-${ti}`}
          className="absolute inset-0 overflow-hidden transition-opacity duration-[650ms] ease-in-out"
          style={{ opacity: phase === ti ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          {useVideoPreview && phase === ti && isActive ? (
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
              <YouTubeAutoplayBackground
                key={previewIds[ti]}
                videoId={previewIds[ti]}
                posterSrc={src}
                isActive
                loop={false}
                embedDelayMs={0}
              />
            </div>
          ) : null}
        </div>
      ))}
      <video
        ref={videoRef}
        src={outroSrc}
        poster={project.backgroundImage}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) {
            setVideoDurMs(Math.max(d * 1000, 500));
          }
        }}
        onEnded={handleEnded}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[700ms] ease-in-out"
        style={{ opacity: phase === 2 ? 1 : 0 }}
      />
    </>
  );
}

function SlideBackground({
  project,
  isActive,
  onCloverleafComplete,
  reportCloverleafProgress,
  onSegmentComplete,
  reportSegmentProgress,
  cloverRemountKey,
}: {
  project: FeaturedProject;
  isActive: boolean;
  onCloverleafComplete?: () => void;
  reportCloverleafProgress?: (fraction: number) => void;
  /** Hire + Biro admin: fired after last YouTube segment */
  onSegmentComplete?: () => void;
  reportSegmentProgress?: (fraction: number) => void;
  /** Bumps when landing on Cloverleaf so thumb→outro sequence never replays on stale pairs */
  cloverRemountKey?: string | number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumbIndex, setThumbIndex] = useState(0);

  useEffect(() => {
    if (project.mediaType !== "video" || !videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive, project.mediaType]);

  useEffect(() => {
    if (project.mediaType !== "rotating-thumbnails" || !isActive) return;
    if (!project.thumbnails?.length) return;
    const interval = setInterval(() => {
      setThumbIndex((prev) => (prev + 1) % project.thumbnails!.length);
    }, THUMBNAIL_ROTATE_MS);
    return () => clearInterval(interval);
  }, [isActive, project.mediaType, project.thumbnails]);

  if (project.mediaType === "youtube" && project.youtubeVideoId) {
    const segmentStyle = {
      width: "177.78vh" as const,
      height: "100vh" as const,
      minWidth: "100vw" as const,
      minHeight: "56.25vw" as const,
      transform: "translate(-50%, -50%)",
    };
    const hasSegments =
      project.youtubeSegments && project.youtubeSegments.length > 0;

    return (
      <>
        {hasSegments ? (
          <>
            <img
              src={project.backgroundImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={segmentStyle}
            >
              <YouTubeSegmentPlayer
                videoId={project.youtubeVideoId}
                segments={project.youtubeSegments!}
                isActive={isActive}
                startDelayMs={project.youtubeSegmentStartDelayMs ?? 0}
                onComplete={onSegmentComplete}
                onProgress={reportSegmentProgress}
                className="h-full w-full"
                posterSrc={project.backgroundImage}
              />
            </div>
          </>
        ) : (
          <YouTubeAutoplayBackground
            posterSrc={project.backgroundImage}
            videoId={project.youtubeVideoId}
            isActive={isActive}
            startSeconds={project.youtubeStartSeconds ?? 0}
            loop={project.youtubeLoop !== false}
            embedDelayMs={project.youtubeEmbedDelayMs}
          />
        )}
      </>
    );
  }

  if (project.mediaType === "thumbs-then-video") {
    return (
      <ThumbsThenVideoBackground
        key={cloverRemountKey ?? "clover"}
        project={project}
        isActive={isActive}
        onComplete={() => onCloverleafComplete?.()}
        reportProgress={reportCloverleafProgress}
      />
    );
  }

  if (project.mediaType === "video" && project.videoSrc) {
    return (
      <video
        ref={videoRef}
        src={project.videoSrc}
        poster={project.backgroundImage}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    );
  }

  if (
    project.mediaType === "rotating-thumbnails" &&
    project.thumbnails?.length
  ) {
    return (
      <>
        {project.thumbnails.map((src, ti) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: ti === thumbIndex ? 1 : 0 }}
            loading="lazy"
          />
        ))}
      </>
    );
  }

  return (
    <img
      src={project.backgroundImage}
      alt=""
      className="h-full w-full object-cover"
    />
  );
}

const CLOVER_IDX = FEATURED_PROJECTS.findIndex((p) => p.slug === "cloverleaf");
const HIRE_IDX = FEATURED_PROJECTS.findIndex((p) => p.slug === "hire");
const BIRO_IDX = FEATURED_PROJECTS.findIndex((p) => p.slug === "biro-labels");

function initialCloverleafMedia() {
  const { thumbUrls, videoIds } = getCloverleafShowcasePair(0);
  return { visit: 0, thumbUrls, videoIds };
}

export default function ProjectShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  /** Single state object so thumb URLs and preview video ids never desync between renders. */
  const [cloverleaf, setCloverleaf] = useState(initialCloverleafMedia);
  const [hireSlot, setHireSlot] = useState(0);
  const [biroSlot, setBiroSlot] = useState(0);

  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef<number>();
  const activeIndexRef = useRef(0);
  const prevSlideRef = useRef<number | null>(null);
  const hireVisitRef = useRef(0);
  const biroVisitRef = useRef(0);
  const cloverleafProgressRef = useRef(0);
  const hireProgressRef = useRef(0);
  const biroProgressRef = useRef(0);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  const slideCount = FEATURED_PROJECTS.length;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  /** Rotate Cloverleaf pair + Hire clip when landing on each slide (before paint — avoids wrong frame). */
  useLayoutEffect(() => {
    const prev = prevSlideRef.current;
    if (
      activeIndex === CLOVER_IDX &&
      prev !== null &&
      prev !== CLOVER_IDX
    ) {
      const nPairs = Math.floor(CLOVERLEAF_THUMB_VIDEO_IDS.length / 2);
      if (nPairs >= 1) {
        setCloverleaf((b) => {
          const startPair = b.visit % nPairs;
          const next = getCloverleafShowcasePair(startPair);
          return {
            visit: b.visit + 1,
            thumbUrls: next.thumbUrls,
            videoIds: next.videoIds,
          };
        });
      }
    }
    if (activeIndex === HIRE_IDX && prev !== null && prev !== HIRE_IDX) {
      setHireSlot(hireVisitRef.current % HIRE_SHOWCASE_CLIPS.length);
      hireVisitRef.current += 1;
    }
    if (activeIndex === BIRO_IDX && prev !== null && prev !== BIRO_IDX) {
      setBiroSlot(biroVisitRef.current % 2);
      biroVisitRef.current += 1;
    }
    prevSlideRef.current = activeIndex;
  }, [activeIndex]);

  const mergedProject = useCallback(
    (i: number): FeaturedProject => {
      const p = FEATURED_PROJECTS[i];
      if (p.slug === "cloverleaf") {
        return {
          ...p,
          thumbnails: cloverleaf.thumbUrls,
          cloverleafPreviewVideoIds: cloverleaf.videoIds,
        };
      }
      if (p.slug === "hire") {
        const h = HIRE_SHOWCASE_CLIPS[hireSlot];
        return {
          ...p,
          youtubeVideoId: h.id,
          youtubeSegments: h.segments,
          youtubeSegmentStartDelayMs: h.startDelayMs,
          youtubeLoop: false,
          backgroundImage: `https://img.youtube.com/vi/${h.id}/maxresdefault.jpg`,
        };
      }
      if (p.slug === "biro-labels") {
        const admin = biroSlot % 2 === 1;
        if (admin) {
          return {
            ...p,
            youtubeVideoId: BIRO_ADMIN_VIDEO_ID,
            youtubeSegments: BIRO_ADMIN_SEGMENTS,
            youtubeSegmentStartDelayMs: BIRO_CAROUSEL_EMBED_DELAY_MS,
            youtubeEmbedDelayMs: undefined,
            youtubeLoop: false,
            backgroundImage: `https://img.youtube.com/vi/${BIRO_ADMIN_VIDEO_ID}/maxresdefault.jpg`,
          };
        }
        return {
          ...p,
          youtubeVideoId: BIRO_CUSTOMER_VIDEO_ID,
          youtubeSegments: undefined,
          youtubeSegmentStartDelayMs: undefined,
          youtubeEmbedDelayMs: BIRO_CAROUSEL_EMBED_DELAY_MS,
          youtubeLoop: true,
          backgroundImage: `https://img.youtube.com/vi/${BIRO_CUSTOMER_VIDEO_ID}/maxresdefault.jpg`,
        };
      }
      return p;
    },
    [cloverleaf, hireSlot, biroSlot],
  );

  const getDuration = useCallback((idx: number) => {
    const p = FEATURED_PROJECTS[idx];
    if (p?.slug === "cloverleaf") return Number.MAX_SAFE_INTEGER;
    if (p?.slug === "hire") {
      return hireClipTotalMs(HIRE_SHOWCASE_CLIPS[hireSlot]);
    }
    if (p?.slug === "biro-labels" && biroSlot % 2 === 1) {
      return biroAdminClipTotalMs();
    }
    return p?.slideDuration ?? DEFAULT_SLIDE_MS;
  }, [hireSlot, biroSlot]);

  const commitSlide = useCallback((index: number) => {
    setActiveIndex(index);
    startTimeRef.current = Date.now();
  }, []);

  const runSlideTransition = useCallback(
    (nextIndex: number) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      const overlay = flashOverlayRef.current;

      if (!overlay) {
        commitSlide(nextIndex);
        isTransitioningRef.current = false;
        return;
      }

      const onFlashInEnd = (e: TransitionEvent) => {
        if (e.propertyName !== "opacity") return;
        overlay.removeEventListener("transitionend", onFlashInEnd);
        commitSlide(nextIndex);
        requestAnimationFrame(() => {
          overlay.style.transition = `opacity ${WHITE_FLASH_OUT_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
          overlay.style.opacity = "0";
          const onFlashOutEnd = (ev: TransitionEvent) => {
            if (ev.propertyName !== "opacity") return;
            overlay.removeEventListener("transitionend", onFlashOutEnd);
            isTransitioningRef.current = false;
          };
          overlay.addEventListener("transitionend", onFlashOutEnd);
        });
      };

      overlay.style.transition = `opacity ${WHITE_FLASH_IN_MS}ms ease-in`;
      overlay.style.opacity = "1";
      overlay.addEventListener("transitionend", onFlashInEnd);
    },
    [commitSlide],
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioningRef.current) return;
      runSlideTransition(index);
    },
    [runSlideTransition],
  );

  const advanceCloverleaf = useCallback(() => {
    if (isTransitioningRef.current) return;
    const next = (activeIndexRef.current + 1) % slideCount;
    runSlideTransition(next);
  }, [runSlideTransition, slideCount]);

  const advanceHire = useCallback(() => {
    if (isTransitioningRef.current) return;
    const next = (activeIndexRef.current + 1) % slideCount;
    runSlideTransition(next);
  }, [runSlideTransition, slideCount]);

  const advanceBiro = useCallback(() => {
    if (isTransitioningRef.current) return;
    const next = (activeIndexRef.current + 1) % slideCount;
    runSlideTransition(next);
  }, [runSlideTransition, slideCount]);

  const prev = () => {
    if (isTransitioningRef.current) return;
    runSlideTransition((activeIndexRef.current - 1 + slideCount) % slideCount);
  };
  const next = () => {
    if (isTransitioningRef.current) return;
    runSlideTransition((activeIndexRef.current + 1) % slideCount);
  };

  // Auto-advance — Cloverleaf + Hire + Biro admin use media completion; others use timer
  useEffect(() => {
    const project = FEATURED_PROJECTS[activeIndex];
    const biroAdmin =
      project?.slug === "biro-labels" && biroSlot % 2 === 1;
    if (
      project?.slug === "cloverleaf" ||
      project?.slug === "hire" ||
      biroAdmin
    ) {
      if (timerRef.current) clearTimeout(timerRef.current);
      startTimeRef.current = Date.now();
      return;
    }
    startTimeRef.current = Date.now();
    const dur = project?.slideDuration ?? DEFAULT_SLIDE_MS;
    timerRef.current = setTimeout(() => {
      if (isTransitioningRef.current) return;
      runSlideTransition((activeIndexRef.current + 1) % slideCount);
    }, dur);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, biroSlot, slideCount, runSlideTransition]);

  const reportCloverleafProgress = useCallback((p: number) => {
    cloverleafProgressRef.current = p;
  }, []);

  const reportHireProgress = useCallback((p: number) => {
    hireProgressRef.current = p;
  }, []);

  const reportBiroProgress = useCallback((p: number) => {
    biroProgressRef.current = p;
  }, []);

  // Progress bar
  useEffect(() => {
    const update = () => {
      if (!progressRef.current) return;
      const slug = FEATURED_PROJECTS[activeIndex]?.slug;
      let progress: number;
      if (slug === "cloverleaf") {
        progress = cloverleafProgressRef.current;
      } else if (slug === "hire") {
        progress = hireProgressRef.current;
      } else if (slug === "biro-labels" && biroSlot % 2 === 1) {
        progress = biroProgressRef.current;
      } else {
        const dur = getDuration(activeIndex);
        if (dur === Number.MAX_SAFE_INTEGER) progress = 0;
        else {
          progress = Math.min(
            1,
            (Date.now() - startTimeRef.current) / dur,
          );
        }
      }
      progressRef.current.style.transform = `scaleX(${progress})`;
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeIndex, biroSlot, getDuration]);

  useEffect(() => {
    if (FEATURED_PROJECTS[activeIndex]?.slug !== "cloverleaf") {
      cloverleafProgressRef.current = 0;
    }
    if (FEATURED_PROJECTS[activeIndex]?.slug !== "hire") {
      hireProgressRef.current = 0;
    }
    if (
      FEATURED_PROJECTS[activeIndex]?.slug !== "biro-labels" ||
      biroSlot % 2 !== 1
    ) {
      biroProgressRef.current = 0;
    }
  }, [activeIndex, biroSlot]);

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh" }}
    >
      {FEATURED_PROJECTS.map((_, i) => {
        const merged = mergedProject(i);
        const slug = FEATURED_PROJECTS[i].slug;
        const segmentMode =
          !!merged.youtubeSegments && merged.youtubeSegments.length > 0;
        return (
          <div
            key={FEATURED_PROJECTS[i].slug}
            className="absolute inset-0"
            style={{
              opacity: i === activeIndex ? 1 : 0,
              zIndex: i === activeIndex ? 1 : 0,
              transition: "none",
            }}
            aria-hidden={i !== activeIndex}
          >
            <SlideBackground
              project={merged}
              isActive={i === activeIndex}
              onCloverleafComplete={
                slug === "cloverleaf" ? advanceCloverleaf : undefined
              }
              reportCloverleafProgress={
                slug === "cloverleaf" ? reportCloverleafProgress : undefined
              }
              onSegmentComplete={
                segmentMode && slug === "hire"
                  ? advanceHire
                  : segmentMode && slug === "biro-labels"
                    ? advanceBiro
                    : undefined
              }
              reportSegmentProgress={
                segmentMode && slug === "hire"
                  ? reportHireProgress
                  : segmentMode && slug === "biro-labels"
                    ? reportBiroProgress
                    : undefined
              }
              cloverRemountKey={
                slug === "cloverleaf"
                  ? cloverleaf.videoIds.join("|") || "clover"
                  : undefined
              }
            />
          </div>
        );
      })}

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.128) 42%, rgba(0,0,0,0.045) 72%, rgba(0,0,0,0.102) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.06) 0%, transparent 58%)",
        }}
      />

      <div
        ref={flashOverlayRef}
        className="pointer-events-none absolute inset-0 z-[100] bg-white"
        style={{ opacity: 0 }}
        aria-hidden
      />

      {FEATURED_PROJECTS.map((project, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={`text-${project.slug}`}
            className="absolute bottom-16 sm:bottom-20 md:bottom-28 left-0 right-0 z-[3] px-6 sm:px-8 md:px-16 lg:px-20"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(12px)",
              transitionProperty: "opacity, transform",
              transitionDuration: `${TEXT_FADE_MS}ms`,
              transitionTimingFunction: "ease-out",
              transitionDelay: isActive ? "400ms" : "0ms",
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="min-w-0">
                <h1
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-2 md:mb-3 tracking-tight max-w-4xl"
                  style={
                    project.titleFont
                      ? { fontFamily: project.titleFont }
                      : undefined
                  }
                >
                  {project.title}
                </h1>
                <p
                  className={
                    project.slug === "biro-labels"
                      ? "text-base md:text-lg text-zinc-200 mb-4 max-w-2xl md:max-w-none md:whitespace-nowrap leading-relaxed"
                      : "text-base md:text-lg text-zinc-200 mb-4 max-w-2xl leading-relaxed"
                  }
                >
                  {project.subtitle}
                </p>
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs text-zinc-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-row flex-wrap gap-3 shrink-0 md:items-end md:justify-end">
                {project.cta.map((action) =>
                  action.external ? (
                    <a
                      key={action.label}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={ctaSecondaryClass}
                    >
                      {action.icon === "apple" && <AppleIcon />}
                      {action.label}
                    </a>
                  ) : (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={ctaPrimaryClass}
                    >
                      <span
                        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/25 to-transparent opacity-70"
                        aria-hidden
                      />
                      <span className="relative">{action.label}</span>
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm border border-white/10 opacity-0 md:opacity-60 hover:opacity-100 hover:bg-black/60 transition-opacity"
        aria-label="Previous project"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm border border-white/10 opacity-0 md:opacity-60 hover:opacity-100 hover:bg-black/60 transition-opacity"
        aria-label="Next project"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-50 flex flex-col items-center gap-3 sm:gap-4 px-8">
        <div className="flex gap-2">
          {FEATURED_PROJECTS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="w-full max-w-xs h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-white/50 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
