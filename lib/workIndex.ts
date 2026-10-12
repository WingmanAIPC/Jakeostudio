/**
 * /work page data.
 *
 * Media (clips, thumb, accent, links) comes from the landing hero's
 * `SHOWCASE_SLIDES` so a reel only has to be encoded and registered once.
 * This file adds the short copy the Work page shows beside each reel.
 */
import {
  SHOWCASE_SLIDES,
  type ShowcaseCategory,
  type ShowcaseClip,
} from "./showcase";
import type { ProjectCta } from "./work";

export type ScopeIcon =
  | "brand"
  | "web"
  | "app"
  | "dashboard"
  | "ai"
  | "code"
  | "menu"
  | "order"
  | "visualizer"
  | "game"
  | "store"
  | "payments"
  | "ledger"
  | "film"
  | "motion"
  | "shortform";

export interface WorkScopeItem {
  label: string;
  icon: ScopeIcon;
}

interface WorkCopy {
  /** Matches a `SHOWCASE_SLIDES` id — also the section's #anchor */
  id: string;
  /** Who it's for, in a few words (shown small beside the title) */
  sector: string;
  year: string;
  summary: string;
  scope: WorkScopeItem[];
  /** One detail worth remembering: a short figure plus the line that explains it */
  detail: { figure: string; text: string };
}

export interface WorkEntry extends WorkCopy {
  title: string;
  short: string;
  categories: ShowcaseCategory[];
  accent: string;
  thumb: string;
  clips: ShowcaseClip[];
  cta: ProjectCta[];
}

const WORK_COPY: WorkCopy[] = [
  {
    id: "wingman",
    sector: "EQ coach for iOS",
    year: "2024 — Now",
    summary:
      "A native iOS companion that reads how you communicate and coaches you through it. Designed, built, and shipped solo.",
    scope: [
      { label: "Product design", icon: "app" },
      { label: "SwiftUI build", icon: "code" },
      { label: "LLM integration", icon: "ai" },
      { label: "Launch commercial", icon: "film" },
    ],
    detail: {
      figure: "13",
      text: "emotional-intelligence metrics shape every conversation. Live on the App Store.",
    },
  },
  {
    id: "cm-chicken",
    sector: "Korean fried chicken · Cincinnati, OH",
    year: "2026",
    summary:
      "A loud new identity and a website with a menu built for ordering, for a Korean fried chicken spot in Cincinnati.",
    scope: [
      { label: "Brand identity", icon: "brand" },
      { label: "Website", icon: "web" },
      { label: "Menu system", icon: "menu" },
      { label: "Online ordering", icon: "order" },
    ],
    detail: {
      figure: "2",
      text: "locations on one menu, with ordering handed straight to delivery.",
    },
  },
  {
    id: "jsi-cabinetry",
    sector: "Cabinet maker",
    year: "2026",
    summary:
      "A new brand site with a kitchen visualizer, a field app for sales reps, and a dashboard for their managers.",
    scope: [
      { label: "Brand website", icon: "web" },
      { label: "Kitchen visualizer", icon: "visualizer" },
      { label: "Rep portal", icon: "app" },
      { label: "Manager dashboard", icon: "dashboard" },
    ],
    detail: {
      figure: "3",
      text: "door styles to try on a photo of your own kitchen before you call a dealer.",
    },
  },
  {
    id: "jgmma",
    sector: "Mixed martial arts · West Chester, OH",
    year: "2026",
    summary:
      "Brand, website, and member platform for Jorge Gurgel Mixed Martial Arts, with an owner dashboard for check-ins, members, and orders.",
    scope: [
      { label: "Brand identity", icon: "brand" },
      { label: "Website", icon: "web" },
      { label: "Member app", icon: "game" },
      { label: "Owner dashboard", icon: "dashboard" },
    ],
    detail: {
      figure: "XP",
      text: "for every check-in. Members level up a fight card each time they show up.",
    },
  },
  {
    id: "biro-labels",
    sector: "B2B label sales",
    year: "2026",
    summary:
      "A B2B label storefront with fulfillment workflows and admin tooling, wired to Stripe and QuickBooks.",
    scope: [
      { label: "Storefront", icon: "store" },
      { label: "Admin dashboard", icon: "dashboard" },
      { label: "Stripe payments", icon: "payments" },
      { label: "QuickBooks handoff", icon: "ledger" },
    ],
    detail: {
      figure: "1",
      text: "person built it. A whole team runs the business on it.",
    },
  },
  {
    id: "cloverleaf",
    sector: "B2B SaaS · team development",
    year: "2024 — 25",
    summary:
      "Customer testimonial production and motion design for a B2B SaaS platform, from raw interview to final graphics.",
    scope: [
      { label: "Testimonial films", icon: "film" },
      { label: "Motion graphics", icon: "motion" },
      { label: "Short-form content", icon: "shortform" },
    ],
    detail: {
      figure: "20–40",
      text: "minute interviews, cut into customer stories that stand on their own.",
    },
  },
];

export const WORK_ENTRIES: WorkEntry[] = WORK_COPY.map((copy) => {
  const slide = SHOWCASE_SLIDES.find((s) => s.id === copy.id);
  if (!slide) throw new Error(`No showcase slide for work entry "${copy.id}"`);
  return {
    ...copy,
    title: slide.title,
    short: slide.short,
    categories: slide.categories,
    accent: slide.accent,
    thumb: slide.thumb,
    clips: slide.outro ? [...slide.clips, slide.outro] : slide.clips,
    cta: slide.cta,
  };
});

/* ───────────────────────── Archive strips ───────────────────────── */

export interface ArchiveFilm {
  videoId: string;
  title: string;
  /** Production note shown under the title */
  note: string;
}

export const ARCHIVE_FILMS: ArchiveFilm[] = [
  { videoId: "OZf9mW6tnT8", title: "STARGIRL", note: "7-day production" },
  { videoId: "3Uy1mO11f7s", title: "Worldwide Technologies", note: "Commercial · 48 hours" },
  { videoId: "iZUIeVODCgs", title: "Midwest", note: "6-month production" },
  { videoId: "xSFlMa3p748", title: "Magical Meals", note: "Team of 8 · 2 months" },
  { videoId: "mvUyHR0VAas", title: "Welcome to the Nati", note: "24 hours" },
  { videoId: "3ZP0ILPIlHM", title: "Summer in Colorado", note: "48 hours" },
];

export interface ArchiveDesign {
  /** Full-size original (opened in the lightbox) */
  src: string;
  /** Small encode for the strip — see scripts/encode-archive-thumbs.sh */
  thumb: string;
  alt: string;
  /** width / height */
  ratio: number;
}

const design = (file: string, slug: string, alt: string, ratio: number): ArchiveDesign => ({
  src: encodeURI(`/${file}`),
  thumb: `/archive/${slug}.jpg`,
  alt,
  ratio,
});

export const ARCHIVE_DESIGNS: ArchiveDesign[] = [
  design("BionicKid.jpg", "bionic-kid", "Bionic Kid", 503 / 640),
  design("OutofSync.jpg", "out-of-sync", "Out of Sync", 437 / 640),
  design("LandoNorris.jpg", "lando-norris", "Lando Norris", 426 / 640),
  design("SSLCards.jpg", "ssl-cards", "SSL Cards", 4 / 3),
  design("12.17.23.jpg", "dark-side", "The Dark Side of the Moon, 50th anniversary poster", 3 / 4),
  design("CrystalStrawberry.jpg", "crystal-strawberry", "Crystal Strawberry", 3 / 4),
  design("BeatsStudioBuds.png", "beats-studio-buds", "Beats Studio Buds", 640 / 306),
  design("PlayboiCarti.jpg", "playboi-carti", "Playboi Carti", 3 / 4),
  design("SocialHour.jpg", "social-hour", "Social Hour", 426 / 640),
  design("KoreanBBQ.jpg", "korean-bbq", "Korean BBQ", 3 / 4),
  design("WHMDayton.jpg", "whm-dayton", "Women's History Month 2024, University of Dayton", 1),
  design("Senior Exhibition Radial Poster.jpg", "senior-exhibition", "2024 Senior Exhibition poster", 560 / 640),
];
