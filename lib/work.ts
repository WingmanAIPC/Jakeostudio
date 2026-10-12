/** Shared project media ids and link types — consumed by lib/showcase.ts and lib/workIndex.ts. */

export type ProjectCtaIcon = "apple" | "mail" | "document" | "play" | "globe";

export interface ProjectCta {
  label: string;
  href: string;
  external?: boolean;
  icon?: ProjectCtaIcon;
}

/** Biro: customer-facing walkthrough */
export const BIRO_CUSTOMER_VIDEO_ID = "nJfioQ8lLSg";

/** Biro: admin dashboard walkthrough (segment playback) */
export const BIRO_ADMIN_VIDEO_ID = "oGaejTwxYNc";

/** Admin clip: 0–18s, 0:26–0:32, 1:06–1:27 */
export const BIRO_ADMIN_SEGMENTS: { start: number; end: number }[] = [
  { start: 0, end: 18 },
  { start: 26, end: 32 },
  { start: 66, end: 87 },
];

/** Cloverleaf testimonial pool — short previews rotate through these. */
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
