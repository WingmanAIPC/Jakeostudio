import type { PillNavItem } from "../components/PillNav";

/** Shown in the browser tab (document title) sitewide */
export const DOCUMENT_TITLE = "JAKEOSTUDIO";

/** Compact “jo” mark — floating pill nav, about/case-study top bar, mobile cluster */
export const SITE_LOGO_HEADER_SRC = "/jowhite.png";

/** Full wordmark — Work index hero, homepage intro splash, footer (transparent PNG) */
export const SITE_LOGO_WORDMARK_SRC = "/jakeostudiowhitetsnprt.png";

/** Resume PDF — every Resume / Download resume CTA and nav action */
export const SITE_RESUME_PDF_HREF = "/JacobOwens2026Resume.pdf";

export const PRIMARY_NAV: PillNavItem[] = [
  { label: "Work", href: "/work", ariaLabel: "Work and capabilities" },
  { label: "About", href: "/about", ariaLabel: "About me" },
  { label: "Hire", href: "/hire", ariaLabel: "Available for work" },
];
