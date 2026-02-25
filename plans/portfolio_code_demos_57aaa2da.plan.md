---
name: Portfolio Code Demos
overview: Add 2-3 interactive code sample demos to the Jakeostudio portfolio site with a reusable CodeShowcase component (live preview + code toggle), positioned in a new section between the existing Feature and Video sections. Designed to directly satisfy the Amazon DT "coding samples in front end programming languages" requirement.
todos:
  - id: code-showcase
    content: Build the reusable CodeShowcase component with preview/code toggle, syntax highlighting via prism-react-renderer, and GSAP transitions
    status: pending
  - id: movie-demo
    content: Build MovieListDemo - React component that fetches movie data, renders accessible table, with search/filter and sort
    status: pending
  - id: motion-demo
    content: Build MotionPlayground - interactive CSS animation controls with real-time property adjustment
    status: pending
  - id: integrate-site
    content: "Add #code section to index.tsx between Feature and Video, update PillNav with new anchor, write codeStrings.ts"
    status: pending
  - id: responsive-demo
    content: (Optional) Build ResponsiveDemo - draggable container width with adaptive CSS Grid layout
    status: pending
isProject: false
---

# Portfolio Interactive Code Demos

## Goal

The [Amazon job posting](https://www.amazon.jobs/en/jobs/3187993/design-technologist-prime-video) explicitly requires "coding samples in front end programming languages" as a Basic Qualification. Your current site (`jakeostudio.vercel.app`) showcases creative work well but has no visible code. This plan adds 2-3 interactive demos with a code toggle that lets viewers see both the live result AND the source code — proving you write real front-end code.

## Current Site Architecture (Reference)

- **Framework:** Next.js 14 (Pages Router), TypeScript, Tailwind CSS, GSAP
- **Structure:** Single-page app in `pages/index.tsx`, components in `components/`
- **Sections flow:** Hero -> Services/Tools -> Feature (Wingman/Cloverleaf) -> Video -> Design -> Feed -> Contact
- **Deployment:** Vercel

## What to Build

### 1. CodeShowcase Component

A reusable wrapper component that displays any interactive demo with a Preview/Code toggle.

**File:** `components/CodeShowcase.tsx`

**Behavior:**

- Two-tab toggle: "Preview" (default) and "Code"
- Preview tab renders the live interactive demo as children
- Code tab shows syntax-highlighted source code
- Smooth crossfade transition between tabs (use GSAP since it's already installed)
- Title, description, and tech tags displayed above the demo area
- Responsive: full-width on mobile, constrained max-width on desktop

**Rough structure:**

```tsx
interface CodeShowcaseProps {
  title: string;
  description: string;
  tags: string[];
  code: string;
  language: string;
  children: React.ReactNode; // the live demo
}
```

**Syntax highlighting:** Install `prism-react-renderer` (lightweight, zero-config, works with Next.js). It renders code as React elements with theme-able styling — no heavy bundle.

```bash
npm install prism-react-renderer
```

Use the `nightOwl` or `vsDark` theme to match the site's black background aesthetic.

### 2. Demo 1: Movie Data Component (React + Fetch + Semantic HTML)

**File:** `components/demos/MovieListDemo.tsx`

**Why this demo:** It maps directly to the [Amazon DT interview coding prompt](d:\Resumes\Design Technologist AWS\Prep\technical_study_guide.md) ("build a React component that fetches a list of movies and displays them in an HTML table"). Showing this on your portfolio means you've already demonstrated the exact skill they test for.

**What it does:**

- Fetches movie data from a free public API (TMDB or a local JSON mock in `public/data/movies.json` for reliability)
- Renders an accessible HTML `<table>` with columns: Poster, Title, Release Date, Rating
- Includes a search/filter input that filters the movie list in real-time
- Handles loading, error, and empty states
- Sort by clicking column headers

**Key code to showcase:**

- `useState` + `useEffect` for data lifecycle
- `fetch` with async/await and error handling
- `.filter()` and `.sort()` array methods
- Semantic HTML: `<table>`, `<thead>`, `<th scope="col">`, `<caption>`
- Accessibility: `aria-label`, `role="status"` on loading state

**Tech tags:** `React` `TypeScript` `Fetch API` `Semantic HTML` `Accessibility`

### 3. Demo 2: Motion/Interaction Playground (CSS + JS)

**File:** `components/demos/MotionPlayground.tsx`

**Why this demo:** Shows the intersection of motion design and code — your unique DT differentiator. Proves you don't just design motion in After Effects; you implement it in CSS/JS.

**What it does:**

- A card UI element with animated micro-interactions
- Interactive sliders/controls that adjust animation properties in real-time:
  - Duration (ms)
  - Easing curve (ease, ease-in-out, cubic-bezier, spring)
  - Transform type (scale, rotate, translateY, skew)
  - Color transition
- The card animates live as you adjust the controls
- A "Reset" button and "Randomize" button for exploration
- The code view shows the computed CSS being generated

**Key code to showcase:**

- CSS transitions and transforms applied via inline styles or CSS custom properties
- React state driving CSS values
- `useRef` for direct DOM manipulation if needed
- Clean separation of controls from presentation

**Tech tags:** `CSS Animations` `React State` `CSS Custom Properties` `Interactive Controls`

### 4. Demo 3 (Optional — If Time Allows): Responsive Layout Visualizer

**File:** `components/demos/ResponsiveDemo.tsx`

**Why this demo:** "Responsive/Adaptive Design" is an explicit Basic Qualification keyword.

**What it does:**

- A mini container with a drag handle to resize its width
- Inside, a card grid layout that adapts (4-col -> 2-col -> 1-col)
- Visual breakpoint indicators showing which breakpoint is active
- The code view shows the CSS Grid / media query code

**Tech tags:** `CSS Grid` `Media Queries` `Responsive Design`

## Where It Goes in the Site

Add a new section between the existing **Feature** section (Wingman/Cloverleaf) and the **Video** section. This positions your code demos right after your project case studies — the narrative flow becomes: "Here are my projects" -> "Here's the code I write" -> "Here's my other creative work."

In `pages/index.tsx`, add:

```tsx
{/* After Feature section, before Video section */}
<section id="code" className="...">
  <h2>Code Samples</h2>
  <p>Interactive demos — toggle to see the source code.</p>
  
  <CodeShowcase
    title="Movie Data Component"
    description="React component that fetches, filters, and displays movie data with accessible semantic HTML."
    tags={["React", "TypeScript", "Fetch API", "Semantic HTML"]}
    code={movieListCode}
    language="tsx"
  >
    <MovieListDemo />
  </CodeShowcase>

  <CodeShowcase
    title="Motion Playground"
    description="Interactive CSS animation controls — adjust properties in real-time."
    tags={["CSS Animations", "React State", "CSS Custom Properties"]}
    code={motionPlaygroundCode}
    language="tsx"
  >
    <MotionPlayground />
  </CodeShowcase>
</section>
```

Update `PillNav` items to include the new `#code` anchor.

## Code String Strategy

For the code toggle to show source code, you need the source as a string. Two approaches:

- **Simple (recommended for speed):** Store the demo source as a template literal string in a separate file like `components/demos/codeStrings.ts`. Copy the relevant code into these strings. Yes, it's duplicated — but it's fast and you control exactly what's shown.
- **Advanced (if time):** Use a webpack raw-loader or Next.js plugin to import `.tsx` files as strings at build time.

Go with the simple approach for a few-day timeline.

## Styling Guidelines

- Match the existing site aesthetic: black background, zinc/white text, clean typography
- Code view: dark syntax theme (nightOwl from prism-react-renderer)
- Toggle buttons: pill-shaped, similar to the PillNav style for visual consistency
- Demo area: subtle border (`border-zinc-800`) with rounded corners
- Tags: small pills similar to the existing project tags in the Feature section
- Add a subtle GSAP entrance animation (fade up) when the section scrolls into view, consistent with the rest of the site

## File Summary


| File                                    | Purpose                                     |
| --------------------------------------- | ------------------------------------------- |
| `components/CodeShowcase.tsx`           | Reusable preview/code toggle wrapper        |
| `components/demos/MovieListDemo.tsx`    | Movie list fetch + filter demo              |
| `components/demos/MotionPlayground.tsx` | CSS animation interactive playground        |
| `components/demos/ResponsiveDemo.tsx`   | (Optional) Responsive layout visualizer     |
| `components/demos/codeStrings.ts`       | Source code as strings for the code view    |
| `public/data/movies.json`               | Mock movie data (if not using external API) |
| `pages/index.tsx`                       | Add new #code section                       |
| `components/PillNav.tsx`                | Add "Code" nav item                         |


## Dependencies to Install

```bash
npm install prism-react-renderer
```

That's the only new dependency. Everything else uses the existing stack (React, TypeScript, Tailwind, GSAP).