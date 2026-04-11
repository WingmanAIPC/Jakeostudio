import type { MouseEvent } from "react";
import type { NextRouter } from "next/router";

/**
 * Navigate to the home page. Kept as a thin wrapper so existing call sites
 * (`CaseStudyLayout`, work index) continue to compile without changes beyond
 * swapping the hash target.
 */
export function navigateHomeToFeature(
  router: NextRouter,
  e?: MouseEvent<HTMLAnchorElement>,
): void {
  if (e) {
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
  }

  void router.push("/", undefined, { scroll: true });
}
