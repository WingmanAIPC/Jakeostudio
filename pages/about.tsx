import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  DOCUMENT_TITLE,
  SITE_LOGO_HEADER_SRC,
  SITE_RESUME_PDF_HREF,
} from "../lib/siteNav";
import HowIWorkContent from "../components/HowIWorkContent";
import { ToolStackPill } from "../components/ToolStackPill";

const TOOL_CATEGORIES = [
  {
    label: "AI & Development",
    items: [
      "Cursor",
      "Claude Code",
      "ChatGPT",
      "OpenRouter",
      "Prompt Engineering",
    ],
  },
  {
    label: "Front-End & Engineering",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "SwiftUI",
      "REST APIs",
      "Node.js",
    ],
  },
  {
    label: "Design & Prototyping",
    items: ["Figma", "Photoshop", "Illustrator", "Affinity"],
  },
  {
    label: "Motion & Video",
    items: ["After Effects", "Premiere Pro", "CapCut", "Riverside"],
  },
  {
    label: "Platforms & Infrastructure",
    items: ["Vercel", "Supabase", "Stripe", "GitHub", "HubSpot"],
  },
];

function BackArrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 12H5m0 0l7 7m-7-7l7-7"
      />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>{DOCUMENT_TITLE}</title>
        <meta
          name="description"
          content="Jake Owens — AI Creative Technologist. Always learning what's needed to build what matters."
        />
        <meta property="og:title" content="About — jakeostudio" />
        <meta
          property="og:description"
          content="AI Creative Technologist — always learning what's needed to build what matters."
        />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-black text-zinc-100">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl lg:max-w-6xl relative flex h-14 items-center justify-between px-4">
            <Link
              href="/"
              className="relative z-10 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <BackArrow />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="jakeostudio home"
            >
              <img
                src={SITE_LOGO_HEADER_SRC}
                alt="jakeostudio"
                className="h-6 w-auto max-w-[2.75rem] object-contain object-center sm:h-7 sm:max-w-[3.25rem]"
              />
            </Link>
            <a
              href={SITE_RESUME_PDF_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              Resume
            </a>
          </div>
        </nav>

        <main className="pt-28 pb-24 md:pt-36">
          <div className="mx-auto max-w-3xl lg:max-w-6xl px-4">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16 lg:items-stretch">
              {/* Left: intro + how I work — scrolls; row height follows this column */}
              <div className="min-w-0 pb-20 lg:pb-0">
                <div className="mb-20">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-4">
                    About
                  </p>
                  <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                    Jake Owens
                  </h1>
                  <p className="text-lg text-zinc-400 mb-2">
                    AI Creative Technologist
                  </p>
                  <p className="text-base text-zinc-300 max-w-2xl leading-relaxed">
                    Always learning what&apos;s needed to build what matters.
                  </p>
                </div>

                <section>
                  <h2 className="text-2xl font-semibold mb-6">How I Work</h2>
                  <HowIWorkContent />
                </section>
              </div>

              {/* Right: tools first, then background — sticky on lg so it pins while left story scrolls */}
              <div className="min-w-0 lg:border-l lg:border-white/10 lg:pl-12 xl:pl-16 lg:flex lg:flex-col">
                <div className="space-y-20 lg:sticky lg:top-28 lg:w-full lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain lg:pb-1 lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
                  <section>
                    <h2 className="text-2xl font-semibold mb-6">
                      Tools & Stack
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                      {TOOL_CATEGORIES.map((cat) => (
                        <div key={cat.label} className="min-w-0">
                          <h3 className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">
                            {cat.label}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {cat.items.map((item) => (
                              <ToolStackPill key={item} label={item} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-6">Background</h2>
                    <ul className="space-y-4 text-[15px] text-zinc-300">
                      <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                        <span>
                          BFA in Graphic Design, University of Dayton (2025)
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                        <span>
                          Adobe US National Champion (2021) — 1st place out of
                          44,000
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                        <span>
                          Experience spanning graphic design, motion/video
                          production, live sports broadcasting, web development,
                          and AI product design
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                        <span>
                          Currently building with Biro Sales Inc. and maintaining
                          Wingman
                        </span>
                      </li>
                    </ul>
                  </section>
                </div>
              </div>
            </div>

            {/* Contact */}
            <section className="border-t border-white/10 pt-12 mt-16 lg:mt-20 text-center">
              <h2 className="text-2xl font-semibold mb-6">Contact</h2>
              <div className="space-y-4 text-[15px]">
                <p className="text-zinc-300">
                  <a
                    href="mailto:jakeostudio@gmail.com"
                    className="underline underline-offset-4 decoration-zinc-600 hover:decoration-white transition-colors"
                  >
                    jakeostudio@gmail.com
                  </a>
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a
                    href={SITE_RESUME_PDF_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2.5 rounded-2xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
                  >
                    Download Resume
                  </a>
                  <Link
                    href="/work"
                    className="inline-block px-5 py-2.5 rounded-2xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    View Work
                  </Link>
                </div>
                <p className="text-xs text-zinc-500 mt-4">
                  Based in USA · Available for remote work
                </p>
              </div>
            </section>
          </div>
        </main>

        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-3xl lg:max-w-6xl px-4 py-12 text-center">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} jakeostudio
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
