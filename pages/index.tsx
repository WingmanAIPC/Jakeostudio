import React, { useState, useEffect, useLayoutEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import HeaderFloatingBar from "../components/HeaderFloatingBar";
import PrimaryNavCluster from "../components/PrimaryNavCluster";
import { SiGithub, SiInstagram, SiLinktree } from "react-icons/si";
import { TbBrandLinkedin } from "react-icons/tb";
import {
  DOCUMENT_TITLE,
  SITE_LOGO_WORDMARK_SRC,
  SITE_RESUME_PDF_HREF,
} from "../lib/siteNav";
import LogoIntro, { shouldShowIntro } from "../components/LogoIntro";
import ProjectShowcase from "../components/ProjectShowcase";

function YouTubeLazyEmbed({
  title,
  videoId,
  className = "",
  borderClass = "border border-white/20",
  hoverDetails,
}: {
  title: string;
  videoId: string;
  className?: string;
  borderClass?: string;
  hoverDetails?: React.ReactNode;
}) {
  const [active, setActive] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false);
  const thumbSrc = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;

  useEffect(() => {
    if (!active) setIframeVisible(false);
  }, [active]);

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-2xl bg-zinc-900 ${borderClass} ${className}`}
    >
      {active ? (
        <div className="absolute inset-0">
          <img
            src={thumbSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <iframe
            className="absolute inset-0 h-full w-full transition-opacity duration-[700ms] ease-out"
            style={{ opacity: iframeVisible ? 1 : 0 }}
            src={iframeSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => {
              window.setTimeout(() => setIframeVisible(true), 200);
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          className="group relative h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          onClick={() => setActive(true)}
          aria-label={`Play: ${title}`}
        >
          <img
            src={thumbSrc}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-black/35 transition-colors group-hover:bg-black/45 group-focus-visible:bg-black/45">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/75 text-white shadow-lg ring-1 ring-white/25">
              <svg
                className="ml-1 h-7 w-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </span>
          {hoverDetails}
        </button>
      )}
    </div>
  );
}

function VideoHoverOverlay({
  heading,
  subtitle,
  process,
  stack,
}: {
  heading: string;
  subtitle: string;
  process?: string;
  stack?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center rounded-2xl bg-black/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
      <div className="max-h-full overflow-y-auto p-4 text-center sm:p-6">
        <h3 className="mb-2 text-base font-semibold sm:text-lg">{heading}</h3>
        <p className="mb-3 text-sm text-zinc-300">{subtitle}</p>
        {process ? <p className="text-xs text-zinc-400">{process}</p> : null}
        {stack ? <p className="text-xs text-zinc-400">{stack}</p> : null}
      </div>
    </div>
  );
}

const VIDEO_GRID_ITEMS = [
  {
    id: "Ag7EAF_djj4",
    title: "Wingman — Commercial Demo",
    subtitle: "AI Life Coach • iOS App • SwiftUI • LLM Integration",
    process: "Process: concept → design → develop → ship",
    stack: "Stack: SwiftUI, OpenRouter, iOS Development, EQ Frameworks",
  },
  {
    id: "oGaejTwxYNc",
    title: "Biro Sales Inc. — Admin Dashboard Walkthrough",
    subtitle: "Full-Stack • Supabase • Stripe • QuickBooks Integration",
    process: "Process: design → develop → integrate → deploy",
    stack: "Stack: Next.js, Supabase, Stripe, QuickBooks, HubSpot",
  },
  {
    id: "3Uy1mO11f7s",
    title: "Worldwide Technologies Commercial Demo",
    subtitle: "48 Hours • Google Vertex AI • Capcut • ElevenLabs • ChatGPT",
    process: "Process: concept → AI integration → edit → delivery",
    stack: "Stack: Google Vertex AI, Capcut, ElevenLabs, ChatGPT",
  },
  {
    id: "OZf9mW6tnT8",
    title: "STARGIRL",
    subtitle: "7 Day Production • Runway • After Effects • Photoshop",
    process: "Process: concept → shoot → edit → vfx → delivery",
    stack: "Stack: Runway, After Effects, Photoshop, Canon XF400, DJI Osmo",
  },
  {
    id: "iZUIeVODCgs",
    title: "Midwest",
    subtitle: "6 Month Production • Premiere Pro • Photoshop",
    process: "Process: concept → shoot → edit → grade → delivery",
    stack: "Stack: Premiere Pro, Photoshop, Canon XF400, Canon 5D Mark",
  },
  {
    id: "xSFlMa3p748",
    title: "Magical Meals",
    subtitle: "2 Month Production • Team of 8 • After Effects • Illustrator",
    process: "Process: concept → brand kit → shoot → edit → vfx → delivery",
    stack: "Stack: After Effects, Illustrator, Brand Kit, Canon XF400",
  },
  {
    id: "mvUyHR0VAas",
    title: "Welcome to the Nati",
    subtitle: "24 Hours • After Effects • Canon 5D Mark • GoPro Hero 6",
    process: "Process: concept → shoot → edit → vfx → delivery",
    stack: "Stack: After Effects, Canon 5D Mark, GoPro Hero 6",
  },
  {
    id: "3ZP0ILPIlHM",
    title: "Summer in Colorado",
    subtitle: "48 Hours • Premiere Pro • Canon 5D Mark • GoPro Hero 6",
    process: "Process: concept → shoot → edit → grade → delivery",
    stack: "Stack: Premiere Pro, Canon 5D Mark, GoPro Hero 6",
  },
];

/**
 * Wider than `max-w-7xl` (~1280px) so Design / Video (and matching blocks below)
 * breathe on ultrawide — closer to the full-bleed hero without going true edge-to-edge.
 */
const PAGE_WIDE_SECTION =
  "mx-auto w-full max-w-[min(100%,2800px)] px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20";

const DESIGN_GALLERY: { src: string; alt: string; ratio: string }[] = [
  {
    src: "/WHMDayton.jpg",
    alt: "Women's History Month 2024 — commitment to the whole person, University of Dayton Women's Center",
    ratio: "1/1",
  },
  {
    src: "/VelocityBlueLong.png",
    alt: "Velocity wordmark on blue",
    ratio: "3/1",
  },
  {
    src: "/WomenLead.jpg",
    alt: "Women Lead. Certification — University of Dayton Center for Leadership",
    ratio: "3/4",
  },
  {
    src: "/ProfessionalDevelopment.jpg",
    alt: "Professional Development 2023–2024 — University of Dayton Center for Leadership",
    ratio: "3/4",
  },
  { src: "/BionicKid.jpg", alt: "Bionic Kid", ratio: "3/4" },
  {
    src: "/12.17.23.jpg",
    alt: "Pink Floyd The Dark Side of the Moon 50th anniversary poster",
    ratio: "3/4",
  },
  { src: "/CrystalStrawberry.jpg", alt: "Crystal Strawberry", ratio: "2/3" },
  { src: "/LandoNorris.jpg", alt: "Lando Norris", ratio: "3/4" },
  { src: "/SSLCards.jpg", alt: "SSL Cards", ratio: "4/3" },
  { src: "/PlayboiCarti.jpg", alt: "Playboi Carti", ratio: "3/4" },
  { src: "/OutofSync.jpg", alt: "Out of Sync", ratio: "2/3" },
  { src: "/BeatsStudioBuds.png", alt: "Beats Studio Buds", ratio: "16/9" },
  { src: "/SocialHour.jpg", alt: "Social Hour", ratio: "3/4" },
  { src: "/KoreanBBQ.jpg", alt: "Korean BBQ", ratio: "3/4" },
];

export default function PortfolioSite() {
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(true);
  /** False until client runs session check — avoids painting ProjectShowcase before LogoIntro */
  const [heroReady, setHeroReady] = useState(false);
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  useLayoutEffect(() => {
    if (shouldShowIntro()) {
      setShowIntro(true);
      setIntroComplete(false);
    }
    setHeroReady(true);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <>
      <Head>
        <title>{DOCUMENT_TITLE}</title>
        <meta
          name="description"
          content="Portfolio of Jake Owens — AI Creative Technologist specializing in full-stack development, AI product design, and creative production."
        />
      </Head>

      <div
        className="min-h-screen bg-black text-zinc-100 scroll-smooth"
        style={{ backgroundColor: "#000000" }}
      >
        {/* Logo Intro — once per session, removed from DOM after exit */}
        {showIntro && !introComplete && (
          <LogoIntro onComplete={() => setIntroComplete(true)} />
        )}

        <HeaderFloatingBar>
          <PrimaryNavCluster logoHref="#top" />
        </HeaderFloatingBar>

        {/* Hero — mount only after session intro check so first paint is never bright slides */}
        {heroReady ? (
          <ProjectShowcase />
        ) : (
          <div
            className="h-screen w-full bg-[#0a0a0a]"
            aria-hidden
          />
        )}

        {/* Design Section */}
        <section id="design" className={`${PAGE_WIDE_SECTION} py-16`}>
          <h2 className="text-2xl font-semibold mb-8">Design</h2>
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 min-[1600px]:columns-5 min-[2200px]:columns-6 gap-6 space-y-6">
            {DESIGN_GALLERY.map((item) => (
              <div key={item.src} className="break-inside-avoid mb-6">
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({ src: item.src, alt: item.alt })
                  }
                  className="block w-full cursor-pointer rounded-2xl border-0 bg-transparent p-0 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label={`View larger: ${item.alt}`}
                >
                  <div className="relative overflow-hidden rounded-2xl border-2 border-transparent bg-zinc-900 transition-all duration-300 hover:border-white/30">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-auto w-full object-cover"
                      loading="lazy"
                      style={{ aspectRatio: item.ratio }}
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Video Section */}
        <section id="video" className={`${PAGE_WIDE_SECTION} py-16`}>
          <h2 className="text-2xl font-semibold mb-8">Video</h2>
          {/*
            Flex + justify-center so the last row (e.g. 2 tiles under a 3-col layout)
            stays centered instead of hugging the left like CSS Grid.
          */}
          <div className="flex flex-wrap justify-center gap-4">
            {VIDEO_GRID_ITEMS.map((v) => (
              <div
                key={v.id}
                className="w-full shrink-0 sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] min-[2000px]:w-[calc((100%-3rem)/4)]"
              >
                <YouTubeLazyEmbed
                  videoId={v.id}
                  title={v.title}
                  className="w-full"
                  hoverDetails={
                    <VideoHoverOverlay
                      heading={v.title}
                      subtitle={v.subtitle}
                      process={v.process}
                      stack={v.stack}
                    />
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={`${PAGE_WIDE_SECTION} py-20`}>
          <div className="mx-auto w-full max-w-3xl border border-white/10 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">
              AI Creative Technologist available for remote work
            </h3>
            <p className="text-sm text-zinc-300 mb-8">
              Design, production, and AI development solutions. I respond within 24
              hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <a
                href="mailto:jakeostudio@gmail.com?subject=Project Inquiry&body=Hi Jake, I'd like to discuss a project with you."
                className="inline-block px-6 py-3 rounded-2xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
              >
                Get in touch
              </a>
              <a
                href={SITE_RESUME_PDF_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-2xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                View Resume
              </a>
              <Link
                href="/about"
                className="inline-block px-6 py-3 rounded-2xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                About me
              </Link>
            </div>
            <div className="text-xs text-zinc-500">
              jakeostudio@gmail.com · Based in USA · Available for remote
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10">
          <div className={`${PAGE_WIDE_SECTION} py-8`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
              <Link
                href="/"
                className="block opacity-90 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-md"
                aria-label="jakeostudio home"
              >
                <img
                  src={SITE_LOGO_WORDMARK_SRC}
                  alt="jakeostudio"
                  className="h-7 w-auto max-w-[min(70vw,220px)] object-contain object-left sm:h-8"
                />
              </Link>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href="https://www.instagram.com/jakeostudio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram className="h-5 w-5" aria-hidden />
                </a>
                <a
                  href="https://www.linkedin.com/in/jakehowens/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <TbBrandLinkedin className="h-5 w-5" aria-hidden />
                </a>
                <a
                  href="https://github.com/WingmanAIPC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <SiGithub className="h-5 w-5" aria-hidden />
                </a>
                <a
                  href="https://linktr.ee/JAKEOStudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Linktree"
                >
                  <SiLinktree className="h-5 w-5" aria-hidden />
                </a>
              </div>
            </div>
            <p className="text-center text-xs text-zinc-500">
              &copy; {new Date().getFullYear()} jakeostudio
            </p>
          </div>
        </footer>

        {/* Design lightbox */}
        {lightbox ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-xl leading-none text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Close enlarged image"
            >
              &times;
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[min(90dvh,90vh)] max-w-[min(100%,95vw)] w-auto object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
