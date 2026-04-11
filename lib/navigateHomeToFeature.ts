import type { MouseEvent } from "react";
import type { NextRouter } from "next/router";

/**
 * Client-side: go to `/` then scroll to `#feature` and sync the hash.
 * `Link` to `/#feature` often loses the hash on transition; this matches intent reliably.
 */
export function navigateHomeToFeature(router: NextRouter, e?: MouseEvent<HTMLAnchorElement>): void {
  if (e) {
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
  }

  // `scroll: false` avoids Next scrolling to top after navigation, which races (and often wins)
  // against scrolling to `#feature` — especially on heavier case study pages.
  void router.push("/", undefined, { scroll: false }).then(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#feature") {
      window.history.replaceState(null, "", "/#feature");
    }
    const scroll = () => {
      document.getElementById("feature")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    scroll();
    requestAnimationFrame(() => requestAnimationFrame(scroll));
    window.setTimeout(scroll, 80);
    window.setTimeout(scroll, 200);
    window.setTimeout(scroll, 450);
    window.setTimeout(scroll, 700);
  });
}
