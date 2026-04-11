import React from "react";
import Link from "next/link";
import PillNav from "./PillNav";
import { PRIMARY_NAV, SITE_LOGO_HEADER_SRC } from "../lib/siteNav";

const mobileLinkBase =
  "rounded-full px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap";

/**
 * Desktop: PillNav. Mobile: compact Work / About / Hire links (PillNav CSS hides below md).
 */
export default function PrimaryNavCluster({
  activeHref = "",
  logoHref = "/",
}: {
  activeHref?: string;
  /** `#top` on homepage for scroll-to-top; `/` elsewhere */
  logoHref?: string;
}) {
  return (
    <>
      <div className="md:hidden">
        <nav
          className="flex items-center gap-0.5 rounded-full border border-white/15 bg-white/[0.06] px-1 py-1 text-zinc-300 shadow-lg backdrop-blur-2xl"
          aria-label="Primary"
        >
          <Link
            href={logoHref}
            className="flex items-center justify-center px-2 py-1"
            aria-label="Home"
          >
            <img
              src={SITE_LOGO_HEADER_SRC}
              alt="jakeostudio"
              className="h-6 w-auto max-w-[3rem] object-contain object-center"
            />
          </Link>
          {PRIMARY_NAV.map((item) => {
            const active = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${mobileLinkBase} ${
                  active
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
                aria-label={item.ariaLabel}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden md:block">
        <PillNav
          logo={SITE_LOGO_HEADER_SRC}
          logoHref={logoHref}
          logoAlt="jakeostudio"
          items={PRIMARY_NAV}
          activeHref={activeHref}
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#000000"
          pillTextColor="#ffffff"
          initialLoadAnimation={false}
        />
      </div>
    </>
  );
}
