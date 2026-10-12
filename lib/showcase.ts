/**
 * Landing hero slideshow data.
 *
 * Kept separate from `FEATURED_PROJECTS` (which drives the /work case-study cards)
 * so a project can appear in the hero without needing a /work/<slug> page.
 *
 * Every clip carries an explicit duration (file clips) or explicit time ranges
 * (YouTube clips), so the progress rail never has to guess. YouTube clips are
 * additionally clamped at runtime to the video's real length.
 */
import {
  BIRO_ADMIN_SEGMENTS,
  BIRO_ADMIN_VIDEO_ID,
  BIRO_CUSTOMER_VIDEO_ID,
  CLOVERLEAF_THUMB_VIDEO_IDS,
  HIRE_SHOWCASE_CLIPS,
  cloverleafYouTubeThumbUrl,
  type ProjectCta,
} from "./work";
import { SITE_RESUME_PDF_HREF } from "./siteNav";

export type ShowcaseCategory =
  | "Website"
  | "Mobile App"
  | "Dashboard"
  | "E-commerce"
  | "AI"
  | "Brand"
  | "Testimonials"
  | "Motion"
  | "Film"
  | "Commercial";

export type TimeRange = { start: number; end: number };

type ClipBase = {
  /** Unique within its slide */
  id: string;
  /** Optional "Now showing" caption under the slide copy */
  label?: string;
  /** No audio track — hides the sound toggle while this clip plays */
  silent?: boolean;
};

export type FileClip = ClipBase & {
  kind: "file";
  /** 1920×1080 H.264, used on landscape / desktop viewports */
  src: string;
  /** 1280×720 H.264, used on portrait / phone viewports */
  srcSmall?: string;
  /** Exact first frame of the encode, so poster → playback has no visible jump */
  poster: string;
  /** Seconds of the file to play */
  duration: number;
};

export type YouTubeClip = ClipBase & {
  kind: "youtube";
  videoId: string;
  /** Ordered ranges in seconds; the player cuts through black between them */
  segments: TimeRange[];
  /** Defaults to the video's maxresdefault thumbnail */
  poster?: string;
};

export type ShowcaseClip = FileClip | YouTubeClip;

export interface ShowcaseSlide {
  id: string;
  /** Short name for the chapter rail */
  short: string;
  title: string;
  subtitle: string;
  categories: ShowcaseCategory[];
  /** Pills under the copy (tool names get icons via ToolStackPill) */
  tags: string[];
  /** Brand accent — rail fill, eyebrow dot */
  accent: string;
  /** Representative frame: rail hover preview + blurred backdrop in portrait */
  thumb: string;
  clips: ShowcaseClip[];
  /** Play this many clips per visit, rotating through `clips` on later visits. Default: all. */
  clipsPerVisit?: number;
  /** Appended after each visit's clips */
  outro?: ShowcaseClip;
  cta: ProjectCta[];
}

export function ytPoster(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function clipPoster(clip: ShowcaseClip): string {
  if (clip.kind === "file") return clip.poster;
  return clip.poster ?? ytPoster(clip.videoId);
}

/** Planned length in seconds (YouTube clips may end earlier if the video is shorter). */
export function clipDuration(clip: ShowcaseClip): number {
  if (clip.kind === "file") return clip.duration;
  return clip.segments.reduce((a, s) => a + Math.max(0, s.end - s.start), 0);
}

/** Clips for the n-th visit (0-based) to a slide. */
export function planVisit(slide: ShowcaseSlide, visit: number): ShowcaseClip[] {
  const pool = slide.clips;
  const per = slide.clipsPerVisit ?? pool.length;
  let picked: ShowcaseClip[];
  if (per >= pool.length) {
    picked = pool;
  } else {
    const start = (visit * per) % pool.length;
    picked = Array.from({ length: per }, (_, i) => pool[(start + i) % pool.length]);
  }
  return slide.outro ? [...picked, slide.outro] : picked;
}

const START_A_PROJECT: ProjectCta = { label: "Start a project", href: "/hire" };

export const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: "jsi-cabinetry",
    short: "JSI Cabinetry",
    title: "JSI Cabinetry",
    subtitle:
      "A new brand site with a photo-based kitchen visualizer, plus a field app for sales reps and a dashboard for their managers.",
    categories: ["Website", "Mobile App", "Dashboard"],
    // TODO(jake): swap in the real stack (e.g. "Next.js", "Supabase") — tool names render with icons.
    tags: ["Kitchen Visualizer", "Rep App", "Manager Dashboard", "Lead Routing"],
    accent: "#8EA7DB",
    thumb: "/showcase/jsi-cabinetry-thumb.jpg",
    clips: [
      {
        kind: "file",
        id: "reel",
        src: "/showcase/jsi-cabinetry-1080.mp4",
        srcSmall: "/showcase/jsi-cabinetry-720.mp4",
        poster: "/showcase/jsi-cabinetry-poster.jpg",
        duration: 40,
        silent: true,
      },
    ],
    // TODO(jake): add { label: "Visit Site", href: "https://…", external: true, icon: "globe" }
    cta: [START_A_PROJECT],
  },
  {
    id: "wingman",
    short: "Wingman",
    title: "Wingman",
    subtitle:
      "EQ anxiety coach — a native iOS AI companion built on a 13-metric emotional intelligence framework. Live on the App Store.",
    categories: ["Mobile App", "AI"],
    tags: ["SwiftUI", "LLM Integration", "iOS Development", "EQ Frameworks"],
    accent: "#34D399",
    thumb: ytPoster("Ag7EAF_djj4"),
    clips: [
      {
        kind: "youtube",
        id: "commercial",
        videoId: "Ag7EAF_djj4",
        segments: [{ start: 0, end: 32 }],
      },
    ],
    cta: [
      { label: "View Case Study", href: "/work/wingman" },
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/wingman-eq-life-coach/id6747995730",
        external: true,
        icon: "apple",
      },
    ],
  },
  {
    id: "cm-chicken",
    short: "CM Chicken",
    title: "CM Chicken",
    subtitle:
      "A rebrand and website for a Korean fried chicken spot in Cincinnati — a loud new identity, a menu built for ordering, and delivery handoff.",
    categories: ["Brand", "Website"],
    // TODO(jake): swap in the real stack — tool names render with icons.
    tags: ["Brand Identity", "Web Design", "Menu System", "Online Ordering"],
    accent: "#FF5A1F",
    thumb: "/showcase/cm-chicken-thumb.jpg",
    clips: [
      {
        kind: "file",
        id: "reel",
        src: "/showcase/cm-chicken-1080.mp4",
        srcSmall: "/showcase/cm-chicken-720.mp4",
        poster: "/showcase/cm-chicken-poster.jpg",
        duration: 27,
      },
    ],
    // TODO(jake): add { label: "Visit Site", href: "https://…", external: true, icon: "globe" }
    cta: [START_A_PROJECT],
  },
  {
    id: "cloverleaf",
    short: "Cloverleaf",
    title: "Cloverleaf",
    subtitle:
      "Customer testimonial production and motion design for B2B SaaS — stories built to convert, from interview to final graphics.",
    categories: ["Testimonials", "Motion"],
    tags: ["Video Production", "Motion Design", "After Effects", "Premiere Pro"],
    accent: "#79E000",
    thumb: ytPoster("ITr7VHyHa2E"),
    clips: CLOVERLEAF_THUMB_VIDEO_IDS.map((videoId) => ({
      kind: "youtube" as const,
      id: videoId,
      videoId,
      segments: [{ start: 0, end: 6 }],
      poster: cloverleafYouTubeThumbUrl(videoId),
    })),
    clipsPerVisit: 2,
    outro: {
      kind: "file",
      id: "outro",
      src: encodeURI("/Cloverleaf Outro Final.mp4"),
      poster: "/showcase/cloverleaf-outro-poster.jpg",
      duration: 5,
    },
    cta: [
      { label: "View Case Study", href: "/work/cloverleaf" },
      {
        label: "Watch Playlist",
        href: "https://www.youtube.com/playlist?list=PL18Q1CsxcdgRhhpWPSXSjkJCx12SRp_1_",
        external: true,
        icon: "play",
      },
    ],
  },
  {
    id: "biro-labels",
    short: "Biro Sales",
    title: "Biro Sales Inc.",
    subtitle:
      "A B2B label storefront, fulfillment workflows, and admin tooling — built solo with AI, with Stripe and QuickBooks handoff.",
    categories: ["E-commerce", "Dashboard"],
    tags: ["Next.js", "React", "Supabase", "Stripe", "AI Development"],
    accent: "#60A5FA",
    thumb: ytPoster(BIRO_CUSTOMER_VIDEO_ID),
    clips: [
      {
        kind: "youtube",
        id: "storefront",
        videoId: BIRO_CUSTOMER_VIDEO_ID,
        segments: [{ start: 0, end: 27 }],
        label: "Storefront walkthrough",
      },
      {
        kind: "youtube",
        id: "admin",
        videoId: BIRO_ADMIN_VIDEO_ID,
        segments: BIRO_ADMIN_SEGMENTS,
        label: "Admin dashboard",
      },
    ],
    clipsPerVisit: 1,
    cta: [
      { label: "View Case Study", href: "/work/biro-labels" },
      {
        label: "Visit Site",
        href: "https://birolabels.com",
        external: true,
        icon: "globe",
      },
    ],
  },
  {
    id: "available",
    short: "Films",
    title: "Available for Work",
    subtitle:
      "AI Creative Technologist — design, production, and software development.",
    categories: ["Film", "Commercial"],
    tags: [
      "Product & UX",
      "Creative direction",
      "Motion & video",
      "AI development",
      "Full-stack web",
      "Brand systems",
    ],
    accent: "#F5D48A",
    thumb: ytPoster(HIRE_SHOWCASE_CLIPS[0].id),
    clips: HIRE_SHOWCASE_CLIPS.map((c) => ({
      kind: "youtube" as const,
      id: c.id,
      videoId: c.id,
      segments: c.segments,
      label: c.headlineTitle,
    })),
    clipsPerVisit: 1,
    cta: [
      { label: "Get in Touch", href: "/hire" },
      {
        label: "Resume",
        href: SITE_RESUME_PDF_HREF,
        external: true,
        icon: "document",
      },
    ],
  },
];
