import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  TbCompass,
  TbCpu,
  TbLayout2,
  TbMovie,
  TbPalette,
  TbTerminal2,
} from "react-icons/tb";
import { ToolStackPill } from "./ToolStackPill";
import YouTubeSegmentPlayer from "./YouTubeSegmentPlayer";
import YouTubeAutoplayBackground from "./YouTubeAutoplayBackground";
import {
  FEATURED_PROJECTS,
  CLOVERLEAF_THUMB_VIDEO_IDS,
  HIRE_DEFAULT_HEADLINE,
  HIRE_HEADLINE_CROSSFADE_MS,
  HIRE_HEADLINE_CYCLE_MS,
  HIRE_SHOWCASE_CLIPS,
  hireClipTotalMs,
  biroAdminClipTotalMs,
  BIRO_ADMIN_SEGMENTS,
  BIRO_ADMIN_VIDEO_ID,
  BIRO_CAROUSEL_EMBED_DELAY_MS,
  BIRO_CUSTOMER_VIDEO_ID,
  getCloverleafShowcasePair,
  type FeaturedProject,
  type HireShowcaseClip,
  type ProjectCta,
  type ProjectCtaIcon,
} from "../lib/work";

const DEFAULT_SLIDE_MS = 9000;
const TEXT_FADE_MS = 800;
const THUMBNAIL_ROTATE_MS = 3000;
/** Cloverleaf thumb + short YouTube preview per slot (before outro video) */
const CLOVERLEAF_PREVIEW_PHASE_MS = THUMBNAIL_ROTATE_MS * 2;
const WHITE_FLASH_IN_MS = 340;
const WHITE_FLASH_OUT_MS = 400;
const SHOWCASE_SWIPE_MIN_PX = 56;

/** Primary CTA — frosted glass + inner edge highlight (no outer glow) */
const ctaPrimaryClass =
  "group relative inline-flex items-center justify-center overflow-hidden px-6 py-3 rounded-2xl text-sm font-semibold tracking-wide text-white whitespace-nowrap transition-all duration-300 ease-out border border-white/50 bg-white/[0.14] backdrop-blur-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_1px_0_0_rgba(255,255,255,0.18)_inset] hover:border-white/85 hover:bg-white/[0.22] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_1px_0_0_rgba(255,255,255,0.22)_inset] hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40";

/** Secondary CTA — glass outline, no outer glow */
const ctaSecondaryClass =
  "inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium text-white whitespace-nowrap transition-all duration-300 border border-white/28 bg-black/25 backdrop-blur-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] hover:border-white/50 hover:bg-black/35 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40";

/** Mobile showcase — minimal underlined text links */
const mobileHeroLinkClass =
  "text-sm text-white underline underline-offset-[5px] decoration-white/35 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm";

/** Mobile meta grid: skip CTAs that duplicate the Live link (same URL as `caseStudyMeta.live`). */
function mobileCaseStudySecondaryCtas(project: FeaturedProject): ProjectCta[] {
  const liveHref = project.caseStudyMeta?.live?.href;
  if (!liveHref) return project.cta;
  return project.cta.filter((a) => a.href !== liveHref);
}

function mobileCtaLabel(action: ProjectCta): string {
  switch (action.label) {
    case "View Case Study":
      return "Read case study →";
    case "Get in Touch":
      return "Get in touch →";
    case "Download Resume":
      return "Download resume →";
    case "Watch Playlist":
      return "Watch playlist →";
    case "Visit Site":
      return "Visit site →";
    case "App Store":
      return "App Store →";
    default:
      return `${action.label} →`;
  }
}

function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function ShowcaseCtaIconByType({
  icon,
  className = "h-4 w-4 shrink-0 opacity-90",
}: {
  icon: ProjectCtaIcon;
  className?: string;
}) {
  const c = className;
  switch (icon) {
    case "apple":
      return <AppleIcon className={c} />;
    case "mail":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      );
    case "document":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case "play":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      );
    case "globe":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      );
    default:
      return null;
  }
}

function ShowcaseCtaTrailingIcon({ action }: { action: ProjectCta }) {
  if (!action.icon) return null;
  return <ShowcaseCtaIconByType icon={action.icon} />;
}

const hireRoleIconMap: Record<string, IconType> = {
  "Product & UX": TbLayout2,
  "Creative direction": TbCompass,
  "Motion & video": TbMovie,
  "AI development": TbCpu,
  "Full-stack web": TbTerminal2,
  "Brand systems": TbPalette,
};

/** Trailing icon for hire slide 2×3 role labels (Tabler — clearer at small sizes). */
function HireRoleEndIcon({ label }: { label: string }) {
  const Icon = hireRoleIconMap[label];
  if (!Icon) return null;
  return (
    <Icon
      className="h-4 w-4 shrink-0 text-zinc-400 opacity-95"
      aria-hidden
    />
  );
}

/** Stacked titles so layout height follows the longer line without jump. */
function HireShowcaseHeadline({
  clip,
  showProjectTitle,
  variant,
}: {
  clip: HireShowcaseClip;
  showProjectTitle: boolean;
  variant: "desktop" | "mobile";
}) {
  const className =
    variant === "mobile"
      ? "text-[1.5rem] font-bold tracking-tight text-white"
      : "text-6xl lg:text-7xl font-bold mb-3 tracking-tight max-w-4xl";
  const Tag = variant === "mobile" ? "h2" : "h1";
  return (
    <div className="grid min-w-0 [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:min-w-0">
      <Tag
        className={`${className} transition-opacity`}
        style={{
          opacity: showProjectTitle ? 0 : 1,
          transitionDuration: `${HIRE_HEADLINE_CROSSFADE_MS}ms`,
          transitionTimingFunction: "ease-out",
        }}
      >
        {HIRE_DEFAULT_HEADLINE}
      </Tag>
      <Tag
        className={`${className} transition-opacity`}
        style={{
          opacity: showProjectTitle ? 1 : 0,
          transitionDuration: `${HIRE_HEADLINE_CROSSFADE_MS}ms`,
          transitionTimingFunction: "ease-out",
        }}
      >
        {clip.headlineTitle}
      </Tag>
    </div>
  );
}

function isCaseStudyCta(action: ProjectCta) {
  return action.label === "View Case Study";
}

function MobileCtaRow({
  action,
  className = "",
}: {
  action: ProjectCta;
  className?: string;
}) {
  const cls = `${mobileHeroLinkClass} inline-flex items-center gap-2 ${className}`.trim();
  const inner = (
    <>
      <span>{mobileCtaLabel(action)}</span>
      <ShowcaseCtaTrailingIcon action={action} />
    </>
  );
  return action.external ? (
    <a href={action.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={action.href} className={cls}>
      {inner}
    </Link>
  );
}

/** Expanding pill on the active index only (matches pre–sliding-indicator look). */
function FeaturedProjectDots({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="flex w-full justify-center gap-2 py-1"
      role="tablist"
      aria-label="Featured projects"
    >
      {FEATURED_PROJECTS.map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          onClick={() => onSelect(i)}
          className={`h-2 shrink-0 cursor-pointer rounded-full transition-[width,background-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
            i === activeIndex
              ? "w-8 bg-white"
              : "w-2 bg-white/30 hover:bg-white/50"
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

/** Muted autoplay previews use `YouTubeAutoplayBackground` (poster until PLAYING). Phase length: CLOVERLEAF_PREVIEW_PHASE_MS */

function ThumbsThenVideoBackground({
  project,
  isActive,
  onComplete,
  reportProgress,
  fillContainer = false,
}: {
  project: FeaturedProject;
  isActive: boolean;
  onComplete: () => void;
  reportProgress?: (fraction: number) => void;
  fillContainer?: boolean;
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
                fillContainer={fillContainer}
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
  fillContainer = false,
  onCloverleafComplete,
  reportCloverleafProgress,
  onSegmentComplete,
  reportSegmentProgress,
  cloverRemountKey,
}: {
  project: FeaturedProject;
  isActive: boolean;
  /** When true, YouTube/segment players fill their container (for 16:9 mobile wrappers). */
  fillContainer?: boolean;
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
              className={
                fillContainer
                  ? "absolute inset-0 pointer-events-none"
                  : "absolute top-1/2 left-1/2 pointer-events-none"
              }
              style={fillContainer ? undefined : segmentStyle}
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
            fillContainer={fillContainer}
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
        fillContainer={fillContainer}
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
  /** Toggles on `HIRE_HEADLINE_CYCLE_MS` while on hire: false = default headline, true = clip `headlineTitle`. */
  const [hireShowProjectHeadline, setHireShowProjectHeadline] = useState(false);
  const [biroSlot, setBiroSlot] = useState(0);

  const progressRef = useRef<HTMLDivElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
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
  const mobileFlashRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const heroTouchStartRef = useRef<{ x: number; y: number } | null>(null);

  const slideCount = FEATURED_PROJECTS.length;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex !== HIRE_IDX) {
      setHireShowProjectHeadline(false);
      return;
    }
    setHireShowProjectHeadline(false);
    const id = window.setInterval(() => {
      setHireShowProjectHeadline((prev) => !prev);
    }, HIRE_HEADLINE_CYCLE_MS);
    return () => clearInterval(id);
  }, [activeIndex, hireSlot]);

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
      const mobileOverlay = mobileFlashRef.current;
      /** Listen on the overlay that is actually visible — desktop flash is `hidden` on narrow viewports. */
      const narrow =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 767px)").matches;
      const primary = narrow
        ? (mobileOverlay ?? overlay)
        : (overlay ?? mobileOverlay);

      if (!primary) {
        commitSlide(nextIndex);
        isTransitioningRef.current = false;
        return;
      }

      const applyFlash = (el: HTMLDivElement | null, props: Partial<CSSStyleDeclaration>) => {
        if (el) Object.assign(el.style, props);
      };

      const onFlashInEnd = (e: TransitionEvent) => {
        if (e.propertyName !== "opacity") return;
        primary.removeEventListener("transitionend", onFlashInEnd);
        commitSlide(nextIndex);
        requestAnimationFrame(() => {
          const outT = `opacity ${WHITE_FLASH_OUT_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
          applyFlash(overlay, { transition: outT, opacity: "0" });
          applyFlash(mobileOverlay, { transition: outT, opacity: "0" });
          const onFlashOutEnd = (ev: TransitionEvent) => {
            if (ev.propertyName !== "opacity") return;
            primary.removeEventListener("transitionend", onFlashOutEnd);
            isTransitioningRef.current = false;
          };
          primary.addEventListener("transitionend", onFlashOutEnd);
        });
      };

      const inT = `opacity ${WHITE_FLASH_IN_MS}ms ease-in`;
      applyFlash(overlay, { transition: inT, opacity: "1" });
      applyFlash(mobileOverlay, { transition: inT, opacity: "1" });
      primary.addEventListener("transitionend", onFlashInEnd);
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

  const onHeroTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    heroTouchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const onHeroTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = heroTouchStartRef.current;
      heroTouchStartRef.current = null;
      if (!start || e.changedTouches.length !== 1) return;
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;
      const dx = x - start.x;
      const dy = y - start.y;
      if (
        Math.abs(dx) < SHOWCASE_SWIPE_MIN_PX ||
        Math.abs(dx) < Math.abs(dy)
      ) {
        return;
      }
      if (isTransitioningRef.current) return;
      if (dx < 0) {
        runSlideTransition((activeIndexRef.current + 1) % slideCount);
      } else {
        runSlideTransition(
          (activeIndexRef.current - 1 + slideCount) % slideCount,
        );
      }
    },
    [runSlideTransition, slideCount],
  );

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

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const reportCloverleafProgress = useCallback((p: number) => {
    cloverleafProgressRef.current = p;
  }, []);

  const reportHireProgress = useCallback((p: number) => {
    hireProgressRef.current = p;
  }, []);

  const reportBiroProgress = useCallback((p: number) => {
    biroProgressRef.current = p;
  }, []);

  // Progress bar — updates both desktop and mobile progress indicators
  useEffect(() => {
    const update = () => {
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
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${progress})`;
      if (mobileProgressRef.current)
        mobileProgressRef.current.style.transform = `scaleX(${progress})`;
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
      className="relative w-full md:overflow-hidden md:[height:100svh]"
    >
      {/* Desktop flash — fixed, covers full viewport, hidden on mobile */}
      <div
        ref={flashOverlayRef}
        className="pointer-events-none fixed inset-0 z-[500] bg-white hidden md:block"
        style={{ opacity: 0 }}
        aria-hidden
      />

      {/* Mobile hero wrapper — md:contents removes this box on desktop so
          md:absolute md:inset-0 on the video div still anchors to <section>. */}
      <div className="relative overflow-hidden md:contents">
      {/* ─── Shared video area ──────────────────────────────────────────
          Mobile:  relative + aspect-video (in normal flow, edge-to-edge)
          Desktop: absolute inset-0 (covers full 100svh section)
          The aspectRatio style is ignored on desktop because inset:0 wins.
      ─────────────────────────────────────────────────────────────────── */}
      <div
        className="mt-14 md:mt-0 relative w-full overflow-hidden md:absolute md:inset-0 touch-pan-y"
        style={{ aspectRatio: "16/9" }}
        onTouchStart={onHeroTouchStart}
        onTouchEnd={onHeroTouchEnd}
      >
        {/* Mobile transition flash — only covers the 16:9 video (not the page below). */}
        <div
          ref={mobileFlashRef}
          className="pointer-events-none absolute inset-0 z-[500] bg-white md:hidden"
          style={{ opacity: 0 }}
          aria-hidden
        />
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
                fillContainer={isMobile}
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
        {/* Gradient overlays — live inside video area, appear over video on both layouts */}
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
      </div>

      {/* Mobile: slide dots + timer bar directly under the video (YouTube-style) */}
      <div
        className="md:hidden bg-black px-4 pt-3 pb-2 flex flex-col gap-2 touch-pan-y"
        onTouchStart={onHeroTouchStart}
        onTouchEnd={onHeroTouchEnd}
      >
        <FeaturedProjectDots activeIndex={activeIndex} onSelect={goToSlide} />
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            ref={mobileProgressRef}
            className="h-full bg-white/50 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      {/* ─── Mobile info area (hidden on desktop) — case-study style + hire grid
          Active slide is in normal flow (height = content). Inactive layers are
          absolute so they don’t force a tall min-height gap above the next section.
      ─────────────────────────────────────────────────────────────────── */}
      <div className="relative bg-black md:hidden overflow-hidden pb-6">
        {FEATURED_PROJECTS.map((project, i) => {
          const isActive = i === activeIndex;
          const body =
            project.heroBlurb ||
            project.description ||
            project.subtitle;
          const meta = project.caseStudyMeta;
          const hireRoles = (project.hireMobileRoles ?? []).slice(0, 6);

          return (
            <div
              key={`mtext-${project.slug}`}
              className={`flex flex-col px-5 pt-3 gap-6 ${
                isActive
                  ? "relative z-[1]"
                  : "pointer-events-none absolute left-0 right-0 top-0 z-0"
              }`}
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(12px)",
                transitionProperty: "opacity, transform",
                transitionDuration: `${TEXT_FADE_MS}ms`,
                transitionTimingFunction: "ease-out",
                transitionDelay: isActive ? "400ms" : "0ms",
                pointerEvents: isActive ? "auto" : "none",
              }}
              aria-hidden={!isActive}
            >
              {project.slug === "hire" ? (
                <>
                  <HireShowcaseHeadline
                    clip={HIRE_SHOWCASE_CLIPS[hireSlot]}
                    showProjectTitle={hireShowProjectHeadline}
                    variant="mobile"
                  />
                  <p
                    className="text-[15px] text-zinc-300 leading-relaxed whitespace-pre-line"
                    style={{ textWrap: "balance" }}
                  >
                    {project.subtitle}
                  </p>
                  {hireRoles.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left">
                      {hireRoles.map((label) => (
                        <span
                          key={label}
                          className="flex w-full min-w-0 items-center justify-between gap-2 text-sm text-zinc-200 leading-snug"
                        >
                          <span className="min-w-0">{label}</span>
                          <HireRoleEndIcon label={label} />
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col gap-3 items-start">
                    <Link href="/work" className={mobileHeroLinkClass}>
                      Dive deeper →
                    </Link>
                    {project.cta.map((action) => (
                      <MobileCtaRow key={action.label} action={action} />
                    ))}
                  </div>
                  <div className="flex justify-start">
                    <img
                      src="/jakeostudiowhite.png"
                      alt="Jakeo Studio"
                      className="w-full max-w-[min(65%,200px)] h-auto object-contain object-left opacity-90"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2
                    className="text-[1.5rem] font-bold tracking-tight text-white"
                    style={
                      project.titleFont
                        ? { fontFamily: project.titleFont }
                        : undefined
                    }
                  >
                    {project.title}
                  </h2>
                  <p className="text-[15px] text-zinc-200 leading-relaxed">
                    {body}
                  </p>
                  {meta ? (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-left items-start">
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                          Role
                        </div>
                        <p className="text-sm text-white mt-1.5 leading-snug">
                          {meta.role}
                        </p>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                          Timeline
                        </div>
                        <p className="text-sm text-white mt-1.5 leading-snug">
                          {meta.timeline}
                        </p>
                      </div>
                      <div className="flex flex-col items-start">
                        {meta.live ? (
                          <>
                            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                              Live
                            </div>
                            {meta.live.external ? (
                              <a
                                href={meta.live.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${mobileHeroLinkClass} mt-1.5 inline-flex items-center gap-2 text-left`}
                              >
                                {meta.live.label}
                                {meta.live.icon ? (
                                  <ShowcaseCtaIconByType icon={meta.live.icon} />
                                ) : null}
                              </a>
                            ) : (
                              <Link
                                href={meta.live.href}
                                className={`${mobileHeroLinkClass} mt-1.5 inline-flex items-center gap-2 text-left`}
                              >
                                {meta.live.label}
                                {meta.live.icon ? (
                                  <ShowcaseCtaIconByType icon={meta.live.icon} />
                                ) : null}
                              </Link>
                            )}
                          </>
                        ) : null}
                      </div>
                      <div className="flex flex-col items-start">
                        {meta.live ? (
                          <>
                            <div
                              className="text-[11px] font-medium uppercase tracking-wider text-transparent select-none"
                              aria-hidden
                            >
                              Live
                            </div>
                            <div className="mt-1.5 flex flex-col gap-3 items-start w-full">
                              {mobileCaseStudySecondaryCtas(project).map(
                                (action) => (
                                  <MobileCtaRow
                                    key={action.label}
                                    action={action}
                                    className="block w-full text-left"
                                  />
                                ),
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col gap-3 items-start w-full">
                            {project.cta.map((action) => (
                              <MobileCtaRow
                                key={action.label}
                                action={action}
                                className="block w-full text-left"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <ToolStackPill key={tag} label={tag} />
                      ))}
                    </div>
                  )}
                  {!meta ? (
                    <div className="flex flex-col gap-3 items-start pb-2">
                      {project.cta.map((action) => (
                        <MobileCtaRow key={action.label} action={action} />
                      ))}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
      </div>{/* end mobile hero wrapper */}

      {/* ─── Desktop: text overlays (hidden on mobile) ──────────────────
          Absolutely positioned over the full-screen video on desktop.
      ─────────────────────────────────────────────────────────────────── */}
      {FEATURED_PROJECTS.map((project, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={`text-${project.slug}`}
            className="hidden md:block absolute bottom-28 left-0 right-0 z-[3] md:px-16 lg:px-20"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(12px)",
              transitionProperty: "opacity, transform",
              transitionDuration: `${TEXT_FADE_MS}ms`,
              transitionTimingFunction: "ease-out",
              transitionDelay: isActive ? "400ms" : "0ms",
              pointerEvents: isActive ? "auto" : "none",
            }}
            aria-hidden={!isActive}
          >
            <div className="flex flex-row items-end justify-between gap-6">
              <div className="min-w-0">
                {project.slug === "hire" ? (
                  <HireShowcaseHeadline
                    clip={HIRE_SHOWCASE_CLIPS[hireSlot]}
                    showProjectTitle={hireShowProjectHeadline}
                    variant="desktop"
                  />
                ) : (
                  <h1
                    className="text-6xl lg:text-7xl font-bold mb-3 tracking-tight max-w-4xl"
                    style={
                      project.titleFont
                        ? { fontFamily: project.titleFont }
                        : undefined
                    }
                  >
                    {project.title}
                  </h1>
                )}
                <p
                  className={
                    project.slug === "biro-labels"
                      ? "text-lg text-zinc-200 mb-4 max-w-none whitespace-nowrap leading-relaxed"
                      : project.slug === "hire"
                        ? "text-lg text-zinc-200 mb-4 max-w-2xl leading-relaxed whitespace-pre-line"
                        : "text-lg text-zinc-200 mb-4 max-w-2xl leading-relaxed"
                  }
                  style={
                    project.slug === "hire"
                      ? { textWrap: "balance" }
                      : undefined
                  }
                >
                  {project.subtitle}
                </p>
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <ToolStackPill key={tag} label={tag} />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-row flex-wrap gap-3 shrink-0 items-end justify-end">
                {project.cta.map((action) =>
                  action.external ? (
                    <a
                      key={action.label}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={ctaSecondaryClass}
                    >
                      <span className="relative z-10 inline-flex items-center gap-2">
                        {action.label}
                        <ShowcaseCtaTrailingIcon action={action} />
                      </span>
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
                      <span className="relative z-10 inline-flex items-center gap-2">
                        <span>
                          {action.label}
                          {isCaseStudyCta(action) ? (
                            <span aria-hidden> →</span>
                          ) : null}
                        </span>
                        <ShowcaseCtaTrailingIcon action={action} />
                      </span>
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* ─── Desktop: prev/next arrows ──────────────────────────────── */}
      <button
        type="button"
        onClick={prev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm border border-white/10 opacity-60 hover:opacity-100 hover:bg-black/60 transition-opacity"
        aria-label="Previous project"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm border border-white/10 opacity-60 hover:opacity-100 hover:bg-black/60 transition-opacity"
        aria-label="Next project"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ─── Desktop: dots + progress bar ───────────────────────────── */}
      <div className="hidden md:flex absolute bottom-8 left-0 right-0 z-50 flex-col items-center gap-4 px-8">
        <FeaturedProjectDots activeIndex={activeIndex} onSelect={goToSlide} />
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
