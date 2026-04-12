import React from "react";
import DesktopUnifiedNav from "./DesktopUnifiedNav";

/** Desktop: single unified pill nav. Mobile uses `MobileHeader` on pages that include it. */
export default function PrimaryNavCluster({
  activeHref = "",
  logoHref = "/",
}: {
  activeHref?: string;
  /** `#top` on homepage for scroll-to-top; `/` elsewhere */
  logoHref?: string;
}) {
  return (
    <div className="hidden md:block">
      <DesktopUnifiedNav logoHref={logoHref} activeHref={activeHref} />
    </div>
  );
}
