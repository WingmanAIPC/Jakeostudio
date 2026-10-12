import type { WorkCardThemeKey } from "./workPageCardThemes";

export type { WorkCardThemeKey };

export type ProjectCtaIcon = "apple" | "mail" | "document" | "play" | "globe";

export interface ProjectCta {
  label: string;
  href: string;
  external?: boolean;
  icon?: ProjectCtaIcon;
}

/** Mobile hero metadata grid (case-study intro style). */
export interface CaseStudyMeta {
  role: string;
  timeline: string;
  live?: {
    label: string;
    href: string;
    external?: boolean;
    /** Matches CTA icon (e.g. App Store apple) for trailing icon on the Live link. */
    icon?: ProjectCtaIcon;
  };
}

/** Biro carousel: customer-facing walkthrough (iframe, loops) */
export const BIRO_CUSTOMER_VIDEO_ID = "nJfioQ8lLSg";

/** Biro carousel: admin dashboard walkthrough (segment playback) */
export const BIRO_ADMIN_VIDEO_ID = "oGaejTwxYNc";

export const BIRO_CAROUSEL_EMBED_DELAY_MS = 3000;

/** Admin clip: 0–18s, 0:26–0:32, 1:06–1:27 */
export const BIRO_ADMIN_SEGMENTS: { start: number; end: number }[] = [
  { start: 0, end: 18 },
  { start: 26, end: 32 },
  { start: 66, end: 87 },
];

/** Pool for Cloverleaf showcase: pairs of thumbnails (2 people) rotate each visit. */
export const CLOVERLEAF_THUMB_VIDEO_IDS = [
  "xpSuA6PAAFY",
  "-YZcY-5BUbA",
  "sdhIwU2xtp0",
  "PxDkwXAW5CY",
  "ch_EGlZxnC8",
  "0S6S6TqtY-s",
  "xR-gExV56lw",
  "BLzIZlp4Gak",
  "RhChXGHwIx8",
  "AeAK9aCZsDI",
  "ITr7VHyHa2E",
  "sAwEztvfG_k",
];

/** No 1280×720 custom thumb on YouTube — maxresdefault 404s → grey placeholder; hqdefault works. */
const CLOVERLEAF_THUMB_USE_HQ = new Set<string>(["PxDkwXAW5CY", "ch_EGlZxnC8"]);

export function cloverleafYouTubeThumbUrl(videoId: string): string {
  const size = CLOVERLEAF_THUMB_USE_HQ.has(videoId)
    ? "hqdefault"
    : "maxresdefault";
  return `https://img.youtube.com/vi/${videoId}/${size}.jpg`;
}

export interface FeaturedProject {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  color: string;
  /** When set, /work case card uses light brand theme instead of dark zinc. */
  workCardTheme?: WorkCardThemeKey;
  titleFont?: string;
  /** Per-slide auto-advance duration in ms (default 9000). Ignored for thumbs-then-video (advance on video end). */
  slideDuration?: number;
  mediaType:
    | "video"
    | "image"
    | "youtube"
    | "rotating-thumbnails"
    | "thumbs-then-video";
  backgroundImage: string;
  videoSrc?: string;
  youtubeVideoId?: string;
  /** Start offset for YouTube embed (seconds) */
  youtubeStartSeconds?: number;
  /** Default true; set false for segment-only backgrounds */
  youtubeLoop?: boolean;
  /** Multi-range playback (YouTube IFrame API) */
  youtubeSegments?: { start: number; end: number }[];
  /** After slide active, wait before segment player init */
  youtubeSegmentStartDelayMs?: number;
  /** Delay before iframe src loads (ms), e.g. after slide transition */
  youtubeEmbedDelayMs?: number;
  thumbnails?: string[];
  /** Cloverleaf landing: two YouTube ids aligned with `thumbnails` for short muted previews */
  cloverleafPreviewVideoIds?: string[];
  cta: ProjectCta[];
  /** Long intro paragraph for mobile showcase (falls back to description, then subtitle). */
  heroBlurb?: string;
  /** Role / timeline / live link grid on mobile when set. */
  caseStudyMeta?: CaseStudyMeta;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: "wingman",
    title: "Wingman",
    titleFont: "var(--font-inter), sans-serif",
    slideDuration: 32000,
    subtitle:
      "EQ Anxiety Coach — Native iOS AI companion with a 13-metric emotional\u00A0intelligence framework. Live on the App Store.",
    description:
      "Native iOS app with EQ framework that personalizes AI conversations. Live on the App Store.",
    tags: ["SwiftUI", "LLM Integration", "iOS Development", "EQ Frameworks"],
    workCardTheme: "wingman",
    color: "from-emerald-500/20 to-green-500/20",
    mediaType: "youtube",
    youtubeVideoId: "Ag7EAF_djj4",
    /** Hold poster 2s on first paint before iframe + autoplay (landing hero). */
    youtubeEmbedDelayMs: 2000,
    backgroundImage:
      "https://img.youtube.com/vi/Ag7EAF_djj4/maxresdefault.jpg",
    cta: [
      { label: "View Case Study", href: "/work/wingman" },
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/wingman-eq-life-coach/id6747995730",
        external: true,
        icon: "apple",
      },
    ],
    heroBlurb:
      "A native iOS AI companion that uses a 13-metric emotional intelligence framework to personalize every conversation — turning generic AI chat into a context-aware life coach, therapist, and thinking partner.",
    caseStudyMeta: {
      role: "Solo Designer & Developer",
      timeline: "2024 – Present (ongoing)",
      live: {
        label: "App Store",
        href: "https://apps.apple.com/us/app/wingman-eq-life-coach/id6747995730",
        external: true,
        icon: "apple",
      },
    },
  },
  {
    slug: "cloverleaf",
    title: "Cloverleaf",
    titleFont: "var(--font-inter), 'Inter', sans-serif",
    subtitle:
      "Video production & motion design for B2B SaaS customer storytelling",
    description:
      "Testimonial video production, short-form content strategy, and motion graphics.",
    tags: ["Video Production", "Motion Design", "After Effects", "Premiere Pro"],
    workCardTheme: "cloverleaf",
    color: "from-purple-500/20 to-pink-500/20",
    mediaType: "thumbs-then-video",
    backgroundImage:
      "https://img.youtube.com/vi/ITr7VHyHa2E/maxresdefault.jpg",
    thumbnails: [
      cloverleafYouTubeThumbUrl(CLOVERLEAF_THUMB_VIDEO_IDS[0]),
      cloverleafYouTubeThumbUrl(CLOVERLEAF_THUMB_VIDEO_IDS[1]),
    ],
    videoSrc: encodeURI("/Cloverleaf Outro Final.mp4"),
    cta: [
      { label: "View Case Study", href: "/work/cloverleaf" },
      {
        label: "Watch Playlist",
        href: "https://www.youtube.com/playlist?list=PL18Q1CsxcdgRhhpWPSXSjkJCx12SRp_1_",
        external: true,
        icon: "play",
      },
    ],
    heroBlurb:
      "Testimonial video production, short-form content strategy, and motion design for B2B SaaS, with customer stories built to convert from interview through final motion graphics.",
    caseStudyMeta: {
      role: "Video & Motion Lead",
      timeline: "May 2024 – Jan 2025",
      live: {
        label: "Watch playlist",
        href: "https://www.youtube.com/playlist?list=PL18Q1CsxcdgRhhpWPSXSjkJCx12SRp_1_",
        external: true,
        icon: "play",
      },
    },
  },
  {
    slug: "biro-labels",
    title: "Biro Sales Inc.",
    titleFont: "var(--font-inter), sans-serif",
    slideDuration: 30000,
    subtitle:
      "B2B label sales storefront, fulfillment workflows, and management, built solo with AI.",
    description:
      "Storefront, admin, and payment handoff to QuickBooks. Solo build, team-operated.",
    tags: ["Next.js", "React", "Supabase", "Stripe", "AI Development"],
    workCardTheme: "biro",
    color: "from-blue-500/20 to-cyan-500/20",
    mediaType: "youtube",
    youtubeVideoId: BIRO_CUSTOMER_VIDEO_ID,
    youtubeEmbedDelayMs: BIRO_CAROUSEL_EMBED_DELAY_MS,
    backgroundImage: `https://img.youtube.com/vi/${BIRO_CUSTOMER_VIDEO_ID}/maxresdefault.jpg`,
    cta: [
      { label: "View Case Study", href: "/work/biro-labels" },
      {
        label: "Visit Site",
        href: "https://birolabels.com",
        external: true,
        icon: "globe",
      },
    ],
    heroBlurb:
      "B2B storefront, fulfillment workflows, and admin tooling, built solo with AI-assisted development. Stripe, Supabase, and QuickBooks handoff so the team can sell and run operations frictionless.",
    caseStudyMeta: {
      role: "Solo Product & Engineer",
      timeline: "2025 – Present",
      live: {
        label: "Visit Site",
        href: "https://birolabels.com",
        external: true,
        icon: "globe",
      },
    },
  },
];
