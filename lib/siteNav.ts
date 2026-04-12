/** Shown in the browser tab (document title) sitewide */
export const DOCUMENT_TITLE = "JAKEOSTUDIO";

/** Compact “jo” mark — floating pill nav, about/case-study top bar, mobile cluster */
export const SITE_LOGO_HEADER_SRC = "/jowhite.png";

/** Desktop unified header wordmark — same asset as footer / wide lockup */
export const SITE_LOGO_DESKTOP_HEADER_SRC = "/jakeostudiowhitetsnprt.png";

/** Same lockup as header wordmark, black — used on logo chip hover (white fill) */
export const SITE_LOGO_DESKTOP_HEADER_HOVER_SRC = "/jakeostudio.png";

/** Full wordmark — Work index hero, homepage intro splash, footer (transparent PNG) */
export const SITE_LOGO_WORDMARK_SRC = "/jakeostudiowhitetsnprt.png";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

/** Resume PDF — every Resume / Download resume CTA and nav action */
export const SITE_RESUME_PDF_HREF = "/JacobOwens2026Resume.pdf";

export const SITE_CONTACT_EMAIL = "jakeostudio@gmail.com";

export const SITE_MAILTO_HREF = `mailto:${SITE_CONTACT_EMAIL}?subject=Opportunity&body=Hi Jake, I'd like to connect about a role or project.`;

/** E.164. Update to your real number. */
export const SITE_PHONE_HREF = "tel:+15555550100";

export const PRIMARY_NAV: PillNavItem[] = [
  { label: "Work", href: "/work", ariaLabel: "Work and capabilities" },
  { label: "About", href: "/about", ariaLabel: "About me" },
  { label: "Hire", href: "/hire", ariaLabel: "Available for work" },
];
