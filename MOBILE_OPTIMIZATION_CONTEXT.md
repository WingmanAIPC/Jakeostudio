# Mobile Optimization — Change Context

Branch: `claude/mobile-optimization-wZNQZ`

---

## Summary of All Changes

### Goals
- Fix mobile portrait layout (videos cropped, layout broken)
- YouTube-style mobile hero: 16:9 video at top, info stacked below
- Glass header bar fixed to top of mobile screen (edge-to-edge)
- Desktop layout completely unchanged

---

## Files Modified

### `components/LogoIntro.tsx`
- **Splash logo reduced on mobile** to ~70% of previous size
- `max-w-[min(62vw,20rem)]` and `max-h-[min(27vh,8rem)]` (was `min(88vw,28rem)` / `min(38vh,11rem)`)
- `sm:` breakpoints unchanged

---

### `components/PrimaryNavCluster.tsx`
- **Mobile nav restructured** into a single horizontal pill row
- Logo (`jowhite.png`) sits as first item inside the pill nav
- Layout: `[jo logo] [Work] [About] [Hire]` — one row, no stacking
- `md:hidden` branch is now inside `HeaderFloatingBar` which is `hidden md:flex`, so this only renders on desktop via the `hidden md:block` PillNav branch

---

### `components/HeaderFloatingBar.tsx`
- **Added `MobileHeader` export** — full-width glass bar, `fixed top-0 left-0 right-0 z-[101] md:hidden`
  - Height: 52px
  - Style: `bg-black/70 backdrop-blur-2xl border-b border-white/[0.08]`
  - Left: jo logo + Work / About / Hire nav links
  - Right: Email / Call / Resume icon-only buttons (no labels)
- **`HeaderFloatingBar` default export** changed to `hidden md:flex` — invisible on mobile
- **`ContactAndResumeActions`** already `hidden md:flex` (desktop expandable pills only)
- **Removed `MobileContactBar`** (was a bottom bar with Email/Call/Resume labels — replaced by `MobileHeader`)
- Added imports: `Link` from `next/link`, `PRIMARY_NAV` + `SITE_LOGO_HEADER_SRC` from `../lib/siteNav`

---

### `components/YouTubeAutoplayBackground.tsx`
- **Added `fillContainer?: boolean` prop** (default `false`)
- When `true`: inner wrapper uses `absolute inset-0` (fills a sized container)
- When `false`: original `177.78vh × 100vh translate(-50%,-50%)` viewport-cover behavior
- Used to fix video cropping in the 16:9 mobile hero container

---

### `components/ProjectShowcase.tsx`

#### Layout restructure
- **Section**: `relative w-full md:overflow-hidden md:[height:100svh]` (height only on desktop)
- **Mobile hero wrapper**: `<div className="relative overflow-hidden md:contents">` wraps the video strip and mobile info area
  - `md:contents` removes the wrapper from the desktop layout tree, preserving `md:absolute md:inset-0` anchoring on the video div
  - On mobile: `relative overflow-hidden` clips the mobile flash overlay to the hero area only
- **Shared video area**: `mt-14 md:mt-0 relative w-full overflow-hidden md:absolute md:inset-0` with `style={{ aspectRatio: "16/9" }}`
  - Mobile: in normal flow as a 16:9 strip below the header (`mt-14`)
  - Desktop: `inset:0` overrides aspect-ratio, fills full `100svh`
- **Mobile controls strip** (`md:hidden`): slide dots + timer bar directly under the 16:9 video (`flex flex-col gap-3 py-3`)
- **Mobile info area**: `relative pb-6`; active slide `relative z-[1]` (sets height from content), inactive slides `absolute left-0 right-0 top-0` + opacity cross-fade (no fixed min-height gap above the next section)
  - **Case-study style** (project slides): title, body (`heroBlurb` → `description` → `subtitle`), optional **Role / Timeline / Live** grid from `caseStudyMeta`, tags as muted `join(" · ")`, CTAs as underlined text links (`mobileCtaLabel` maps e.g. View Case Study → “Read case study →”)
  - **Hire slide**: subtitle, `/jakeostudiowhite.png`, **2×3** `hireMobileRoles`, “Dive deeper →” → `/work`, then text links for contact + resume
  - Data: [`lib/work.ts`](lib/work.ts) — `heroBlurb?`, `caseStudyMeta?`, `hireMobileRoles?`, exported `CaseStudyMeta`
- **Desktop text overlays**: `hidden md:block absolute bottom-28` (unchanged)

#### Flash overlay — split into two refs
- **Desktop flash**: `pointer-events-none fixed inset-0 z-[500] bg-white hidden md:block` — covers full viewport, desktop only
- **Mobile flash**: `pointer-events-none absolute inset-0 z-[500] bg-white md:hidden` **inside the 16:9 video div** — white wipe only over the player, not the info panel; `runSlideTransition` uses `matchMedia` so `transitionend` attaches to the visible overlay
- **`runSlideTransition`** updated to animate both refs simultaneously; listens on whichever is non-null for transition timing

#### Cloverleaf video zoom fix
- `ThumbsThenVideoBackground` now accepts `fillContainer?: boolean` prop
- Passes `fillContainer` to internal `YouTubeAutoplayBackground` preview clips
- `SlideBackground` threads `fillContainer` down to `ThumbsThenVideoBackground`
- Result: Cloverleaf preview clips fill the 16:9 container instead of viewport-centering

#### Animation / spacing
- `TEXT_FADE_MS`: `400` → `800` (2× slower text fade-in/out, both mobile and desktop)
- **Desktop** CTA row: glass pills unchanged at bottom overlay
- **Mobile** CTAs: underlined links only (no glass buttons in the info panel)
- `isMobile` state via `useLayoutEffect` + `matchMedia("(max-width: 767px)")` — synchronous before paint
- `mobileProgressRef` added alongside `progressRef` — RAF loop updates both

---

### `pages/index.tsx`
- **Imports** `MobileHeader` from `HeaderFloatingBar` (replaced `MobileContactBar`)
- **Renders** `<MobileHeader logoHref="#top" />` before `<HeaderFloatingBar>`
- **Footer** `pb-20 md:pb-0` removed (no more bottom bar clearance needed)
- **`DESIGN_GALLERY` reordered**: BionicKid, 12.17.23, Crystal, Lando, SSL, Playboi, OutofSync, Beats, VelocityBlueLong, SocialHour, KoreanBBQ, WHMDayton, WomenLead, ProfDev

---

## Key Architecture Notes

### Mobile vs Desktop branching
| Element | Mobile (`< 768px`) | Desktop (`≥ 768px`) |
|---|---|---|
| `MobileHeader` | `fixed top-0`, visible | `md:hidden` |
| `HeaderFloatingBar` | `hidden` | `md:flex`, floating pill nav |
| Video area | 16:9 aspect ratio, normal flow | `absolute inset-0`, fills 100svh |
| Info area | case-study / hire grid below controls strip | `md:hidden` |
| Dots + timer | strip under 16:9 video | `hidden` (desktop uses bottom overlay) |
| Desktop text overlays | `hidden` | `md:block absolute bottom-28` |
| Desktop flash | `hidden` | `md:block fixed inset-0` |
| Mobile flash | `absolute inset-0` on **video div only** | `md:hidden` |
| Footer bottom padding | none | none |

### `fillContainer` prop chain
```
ProjectShowcase (isMobile state)
  → SlideBackground (fillContainer prop)
    → YouTubeAutoplayBackground (fillContainer prop) — direct YouTube slides
    → ThumbsThenVideoBackground (fillContainer prop) — Cloverleaf slide
      → YouTubeAutoplayBackground (fillContainer prop) — phase 0/1 previews
```

### Constants (ProjectShowcase.tsx)
```ts
const DEFAULT_SLIDE_MS = 9000;
const TEXT_FADE_MS = 800;        // was 400
const WHITE_FLASH_IN_MS = 340;
const WHITE_FLASH_OUT_MS = 400;
const THUMBNAIL_ROTATE_MS = 3000;
const CLOVERLEAF_PREVIEW_PHASE_MS = 6000; // THUMBNAIL_ROTATE_MS * 2
```

---

## Nav / Site Config (unchanged, reference only)

**`lib/siteNav.ts`**
```ts
SITE_LOGO_HEADER_SRC = "/jowhite.png"
SITE_LOGO_WORDMARK_SRC = "/jakeostudiowhitetsnprt.png"
SITE_RESUME_PDF_HREF = "/JacobOwens2026Resume.pdf"
PRIMARY_NAV = [
  { label: "Work",  href: "/work",  ariaLabel: "Work and capabilities" },
  { label: "About", href: "/about", ariaLabel: "About me" },
  { label: "Hire",  href: "/hire",  ariaLabel: "Available for work" },
]
```

**`HeaderFloatingBar.tsx` constants**
```ts
MAILTO_HREF = "mailto:jakeostudio@gmail.com?subject=Opportunity&body=..."
PHONE_HREF  = "tel:+15555550100"
```
