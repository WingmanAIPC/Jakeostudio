import type { PillNavItem } from "../components/PillNav";

/** Shown in the browser tab (document title) sitewide */
export const DOCUMENT_TITLE = "JAKEOSTUDIO";

/** Compact “jo” mark — floating pill nav, about/case-study top bar, mobile cluster */
export const SITE_LOGO_HEADER_SRC = "/jowhite.png";

/** Full wordmark — Work index hero, case study page hero, homepage intro splash */
export const SITE_LOGO_WORDMARK_SRC = "/jakeostudiowhite.png";

export const PRIMARY_NAV: PillNavItem[] = [
  { label: "Work", href: "/work", ariaLabel: "Work and capabilities" },
  { label: "About", href: "/about", ariaLabel: "About me" },
  { label: "Hire", href: "/hire", ariaLabel: "Available for work" },
];
