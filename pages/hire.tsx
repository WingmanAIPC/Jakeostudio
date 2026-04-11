import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import YouTubeSegmentPlayer from "../components/YouTubeSegmentPlayer";
import { CAPABILITY_CARDS } from "../lib/capabilities";
import {
  DOCUMENT_TITLE,
  SITE_LOGO_HEADER_SRC,
  SITE_RESUME_PDF_HREF,
} from "../lib/siteNav";
import { HIRE_SHOWCASE_CLIPS } from "../lib/work";

export default function HirePage() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [scrollBlack, setScrollBlack] = useState(0);
  const rolesRef = useRef<HTMLElement>(null);
  const clip = HIRE_SHOWCASE_CLIPS[videoIndex % HIRE_SHOWCASE_CLIPS.length];

  useEffect(() => {
    const updateOverlay = () => {
      const roles = rolesRef.current;
      if (!roles) return;
      const vh = window.innerHeight || 1;
      const top = roles.getBoundingClientRect().top;
      // 0 while roles is below the fold; ramps as its top approaches ~35% viewport; ~1 past hero
      const start = vh * 0.92;
      const end = vh * 0.28;
      const t = (start - top) / Math.max(1, start - end);
      setScrollBlack(Math.max(0, Math.min(1, t)));
    };

    updateOverlay();
    window.addEventListener("scroll", updateOverlay, { passive: true });
    window.addEventListener("resize", updateOverlay);
    return () => {
      window.removeEventListener("scroll", updateOverlay);
      window.removeEventListener("resize", updateOverlay);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{DOCUMENT_TITLE}</title>
        <meta
          name="description"
          content="Jake Owens is available for remote work — AI Creative Technologist, Full-Stack Developer, UX Designer, and Video Producer."
        />
        <meta property="og:title" content="Available for Work — jakeostudio" />
        <meta
          property="og:description"
          content="AI Creative Technologist available for remote work. Design, production, and AI development solutions."
        />
      </Head>

      <div className="min-h-screen bg-black text-zinc-100">
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: "177.78vh",
              height: "100vh",
              minWidth: "100vw",
              minHeight: "56.25vw",
              transform: "translate(-50%, -50%)",
            }}
          >
            <YouTubeSegmentPlayer
              videoId={clip.id}
              segments={clip.segments}
              isActive
              startDelayMs={clip.startDelayMs ?? 0}
              onComplete={() => {
                // Defer clip change so YT player teardown finishes; avoid remounting the whole
                // player host (no `key`) — only videoId/segments change and the effect rebuilds.
                window.setTimeout(() => {
                  setVideoIndex(
                    (i) => (i + 1) % HIRE_SHOWCASE_CLIPS.length,
                  );
                }, 0);
              }}
              className="h-full w-full"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.8) 100%)",
            }}
          />
          <div
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: scrollBlack }}
            aria-hidden
          />
        </div>

        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/45 backdrop-blur-md">
          <div className="mx-auto max-w-5xl relative flex h-14 items-center justify-between px-4 sm:px-6">
            <Link
              href="/"
              className="relative z-10 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              &larr; Home
            </Link>
            <Link
              href="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
              aria-label="jakeostudio home"
            >
              <img
                src={SITE_LOGO_HEADER_SRC}
                alt="jakeostudio"
                className="h-6 w-auto max-w-[2.75rem] object-contain object-center sm:h-7 sm:max-w-[3.25rem]"
              />
            </Link>
            <Link
              href="/work"
              className="relative z-10 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              View Work
            </Link>
          </div>
        </nav>

        <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-16 text-center pt-14 sm:pb-20">
          <div className="flex w-full max-w-2xl flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-4 py-1.5 mb-6 sm:mb-8">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-300 tracking-wide uppercase">
                Available for Work
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 max-w-2xl sm:mb-10">
              Let&apos;s build something together
            </h1>
            <div className="flex w-full max-w-md flex-col flex-wrap items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
              <a
                href="mailto:jakeostudio@gmail.com?subject=Opportunity&body=Hi Jake, I'd like to discuss a role or project with you."
                className="inline-flex min-h-[48px] items-center justify-center px-8 py-3.5 rounded-2xl bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors text-center"
              >
                Get in touch
              </a>
              <a
                href={SITE_RESUME_PDF_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center px-8 py-3.5 rounded-2xl border-2 border-white/40 bg-black/30 backdrop-blur-md text-white text-sm font-semibold hover:bg-white/15 hover:border-white/60 transition-colors text-center"
              >
                Download Resume
              </a>
            </div>
          </div>
        </section>

        <section
          ref={rolesRef}
          className="relative z-10 bg-black py-24 px-6"
        >
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold mb-10 text-center">
              Roles I am strong within
            </h2>
            <div className="grid gap-4">
              {CAPABILITY_CARDS.map((role) => (
                <div
                  key={role.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6"
                >
                  <h3 className="font-semibold mb-1">{role.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {role.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-sm text-zinc-400 mb-6">
                Based in USA &middot; Available for remote work &middot;
                Open to contract, freelance, or full-time
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:jakeostudio@gmail.com?subject=Opportunity"
                  className="text-sm text-zinc-300 underline underline-offset-4 decoration-zinc-600 hover:decoration-white transition-colors"
                >
                  jakeostudio@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-white/10 bg-black">
          <div className="mx-auto max-w-3xl px-6 py-8 text-center">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} jakeostudio
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
