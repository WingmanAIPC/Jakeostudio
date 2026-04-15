import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_PEEK_MS } from "../lib/navPeek";
import {
  PRIMARY_NAV,
  SITE_LOGO_DESKTOP_HEADER_HOVER_SRC,
  SITE_LOGO_DESKTOP_HEADER_SRC,
  SITE_MAILTO_HREF,
  SITE_PHONE_HREF,
  SITE_RESUME_PDF_HREF,
} from "../lib/siteNav";

function isRouterHref(href: string) {
  if (href.startsWith("#")) return false;
  if (href.startsWith("http://") || href.startsWith("https://")) return false;
  if (href.startsWith("//")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  return true;
}

export default function DesktopUnifiedNav({
  logoHref = "/",
  activeHref = "",
  className = "",
  peekTimerActive = false,
}: {
  logoHref?: string;
  activeHref?: string;
  className?: string;
  /** Homepage: expand pill with primary links for `NAV_PEEK_MS`, then collapse (matches mobile). */
  peekTimerActive?: boolean;
}) {
  const [isPeekOpen, setIsPeekOpen] = useState(false);

  useEffect(() => {
    if (!peekTimerActive) {
      setIsPeekOpen(false);
      return;
    }
    setIsPeekOpen(true);
    const id = window.setTimeout(() => setIsPeekOpen(false), NAV_PEEK_MS);
    return () => window.clearTimeout(id);
  }, [peekTimerActive]);
  const logoInner = (
    <span className="desktop-unified-nav__logo-mark" aria-hidden>
      <img
        src={SITE_LOGO_DESKTOP_HEADER_SRC}
        alt=""
        className="desktop-unified-nav__logo-img desktop-unified-nav__logo-img--default"
        decoding="async"
      />
      <img
        src={SITE_LOGO_DESKTOP_HEADER_HOVER_SRC}
        alt=""
        className="desktop-unified-nav__logo-img desktop-unified-nav__logo-img--hover"
        decoding="async"
      />
    </span>
  );

  const logoEl =
    logoHref.startsWith("#") ? (
      <a
        href={logoHref}
        className="desktop-unified-nav__logo"
        aria-label="Home"
      >
        {logoInner}
      </a>
    ) : (
      <Link href={logoHref} className="desktop-unified-nav__logo" aria-label="Home">
        {logoInner}
      </Link>
    );

  return (
    <nav
      className={`desktop-unified-nav${isPeekOpen ? " is-peek-open" : ""} ${className}`.trim()}
      aria-label="Primary"
    >
      {logoEl}
      <div className="desktop-unified-nav__rail">
        <div className="desktop-unified-nav__tier1">
          {PRIMARY_NAV.map((item) =>
            isRouterHref(item.href) ? (
              <Link
                key={item.href}
                href={item.href}
                className={`desktop-unified-nav__link${
                  activeHref === item.href ? " is-active" : ""
                }`}
                aria-label={item.ariaLabel ?? item.label}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className={`desktop-unified-nav__link${
                  activeHref === item.href ? " is-active" : ""
                }`}
                aria-label={item.ariaLabel ?? item.label}
              >
                {item.label}
              </a>
            ),
          )}
          <div className="desktop-unified-nav__contact">
            <button
              type="button"
              className="desktop-unified-nav__contact-trigger"
              aria-label="Contact"
              aria-haspopup="true"
            >
              Contact
            </button>
            <div className="desktop-unified-nav__tier2">
              <a href={SITE_MAILTO_HREF} className="desktop-unified-nav__action">
                Email
              </a>
              <a href={SITE_PHONE_HREF} className="desktop-unified-nav__action">
                Call
              </a>
              <a
                href={SITE_RESUME_PDF_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="desktop-unified-nav__action"
              >
                Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
