import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeaderFloatingBar from "../components/HeaderFloatingBar";
import PillNav from "../components/PillNav";
import SkillsSlider from "../components/SkillsSlider";

const PrismaticBurst = dynamic(() => import("../components/PrismaticBurst"), {
  ssr: false,
  loading: () => null,
});

// Minimal single-file React portfolio using Tailwind CSS classes.
// Drop into Next.js/React. Replace placeholders with real content.

/** Click-to-play: loads YouTube iframe only after interaction (privacy + fewer parallel players). */
function YouTubeLazyEmbed({
  title,
  videoId,
  playlistId,
  thumbnailVideoId,
  className = "",
  borderClass = "border border-white/20",
  hoverDetails,
}: {
  title: string;
  videoId?: string;
  playlistId?: string;
  thumbnailVideoId?: string;
  className?: string;
  borderClass?: string;
  hoverDetails?: React.ReactNode;
}) {
  const [active, setActive] = useState(false);

  if (!videoId && !playlistId) {
    throw new Error("YouTubeLazyEmbed: pass videoId or playlistId");
  }

  const thumbId = thumbnailVideoId ?? videoId;
  const thumbSrc = thumbId ? `https://img.youtube.com/vi/${thumbId}/maxresdefault.jpg` : null;

  const embedBase = playlistId
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(playlistId)}`
    : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId!)}`;

  const iframeSrc = `${embedBase}${embedBase.includes("?") ? "&" : "?"}autoplay=1&rel=0`;

  return (
    <div className={`relative aspect-video overflow-hidden rounded-2xl bg-zinc-900 ${borderClass} ${className}`}>
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={iframeSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="group relative h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          onClick={() => setActive(true)}
          aria-label={`Play: ${title}`}
        >
          {thumbSrc ? (
            <img src={thumbSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-sm text-zinc-400">
              Play video
            </div>
          )}
          <span className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-black/35 transition-colors group-hover:bg-black/45 group-focus-visible:bg-black/45">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/75 text-white shadow-lg ring-1 ring-white/25">
              <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
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

const VIDEO_GRID_ITEMS: {
  id: string;
  title: string;
  subtitle: string;
  process: string;
  stack: string;
}[] = [
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
    id: "bhBixCPlr7s",
    title: "Nights Like This",
    subtitle: "24 Hours • Premiere Pro • Canon 5D Mark",
    process: "Process: concept → shoot → edit → grade → delivery",
    stack: "Stack: Premiere Pro, Canon 5D Mark",
  },
  {
    id: "3ZP0ILPIlHM",
    title: "Summer in Colorado",
    subtitle: "48 Hours • Premiere Pro • Canon 5D Mark • GoPro Hero 6",
    process: "Process: concept → shoot → edit → grade → delivery",
    stack: "Stack: Premiere Pro, Canon 5D Mark, GoPro Hero 6",
  },
  {
    id: "dVAJL6DPhmo",
    title: "Ski-Tage",
    subtitle: "72 Hours • After Effects • Canon 5D Mark • GoPro Hero 6",
    process: "Process: concept → shoot → edit → vfx → delivery",
    stack: "Stack: After Effects, Canon 5D Mark, GoPro Hero 6",
  },
];

/** Masonry order matches prior layout. Click opens lightbox (no hover grey overlay). */
const DESIGN_GALLERY: { src: string; alt: string; ratio: string }[] = [
  { src: "/BionicKid.jpg", alt: "Bionic Kid", ratio: "3/4" },
  {
    src: "/12.17.23.jpg",
    alt: "Pink Floyd The Dark Side of the Moon 50th anniversary poster — typography, prism, and spectrum waves",
    ratio: "3/4",
  },
  { src: "/CrystalStrawberry.jpg", alt: "Crystal Strawberry", ratio: "2/3" },
  { src: "/LandoNorris.jpg", alt: "Lando Norris", ratio: "3/4" },
  { src: "/SSLCards.jpg", alt: "SSL Cards", ratio: "4/3" },
  { src: "/WHMDayton.jpg", alt: "WHM Dayton", ratio: "16/9" },
  { src: "/PlayboiCarti.jpg", alt: "Playboi Carti", ratio: "3/4" },
  { src: "/OutofSync.jpg", alt: "Out of Sync", ratio: "2/3" },
  { src: "/ProfessionalDevelopment.jpg", alt: "Professional Development", ratio: "3/4" },
  { src: "/BeatsStudioBuds.png", alt: "Beats Studio Buds", ratio: "16/9" },
  { src: "/royalmafiaWHITE.png", alt: "Royal Mafia White", ratio: "1/1" },
  { src: "/DataLandmarkPoster.jpg", alt: "Data Landmark", ratio: "16/9" },
  { src: "/SocialHour.jpg", alt: "Social Hour", ratio: "3/4" },
  { src: "/KoreanBBQ.jpg", alt: "Korean BBQ", ratio: "3/4" },
  { src: "/VelocityBlueLong.png", alt: "Touch the Sky", ratio: "16/9" },
];

export default function PortfolioSite() {
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(true), 3500);

    const handleScroll = () => {
      if (window.scrollY > 50) setShowScrollHint(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
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

  const navItems = [
    { label: "Feature", href: "#feature", ariaLabel: "Go to Feature section" },
    { label: "Design", href: "#design", ariaLabel: "Go to Design section" },
    { label: "Video", href: "#video", ariaLabel: "Go to Video section" },
    { label: "Feed", href: "#feed", ariaLabel: "Go to Feed section" },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 scroll-smooth" style={{ backgroundColor: '#000000' }}>
      <HeaderFloatingBar>
        <div className="hidden md:block">
          <PillNav
            logo="/jowhite.png"
            logoAlt="jostudio"
            items={navItems}
            activeHref=""
            baseColor="#000000"
            pillColor="#ffffff"
            hoveredPillTextColor="#000000"
            pillTextColor="#ffffff"
            initialLoadAnimation={false}
          />
        </div>
      </HeaderFloatingBar>

      {/* Hero with Prismatic Burst Background */}
      <section 
        id="top" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Prismatic Burst Background - Optimized */}
        <div className="absolute inset-0 z-0">
          <PrismaticBurst
            intensity={1.75}
            speed={0.7}
            animationType="rotate"
            colors={['#ffffff', '#ffffff', '#ffffff']}
            distort={3.2}
            rayCount={2}
            mixBlendMode="lighten"
          />
        </div>

        {/* Fade Out Overlays with Arc Ease */}
        <div className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, #000000 0%, #000000 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 80%, transparent 100%)'
        }}></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none" style={{
          background: 'linear-gradient(to top, #000000 0%, #000000 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 80%, transparent 100%)'
        }}></div>

        {/* Central Logo */}
        <div className="relative z-10">
          <a
            href="#creative"
            className="relative group block cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg"
            aria-label="View Design Technologist section"
          >
            <img
              src="/jakeostudiowhite.png"
              alt="jakeostudio"
              className="w-64 h-64 object-contain"
            />
          </a>
        </div>

        {/* Scroll Down Hint Arrow */}
        <button
          onClick={() => {
            document.getElementById("creative")?.scrollIntoView({ behavior: "smooth" });
            setShowScrollHint(false);
          }}
          aria-label="Scroll down"
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-700 ease-out cursor-pointer ${
            showScrollHint ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <svg
            className="w-6 h-6 text-white/60 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

      </section>

      {/* Design Technologist Section */}
      <section id="creative" className="mx-auto max-w-7xl px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-semibold mb-4">Design Technologist</h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
            Blending design, technology, and creative thinking into working experiences.
          </p>
        </div>

        <SkillsSlider />
      </section>

      {/* Feature Section */}
      <section id="feature" className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">
            Feature
          </h2>
        </div>
        
        {/* Wingman Feature */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <YouTubeLazyEmbed
            title="Wingman Feature Video"
            videoId="Ag7EAF_djj4"
            borderClass="border border-white/10"
            hoverDetails={
              <VideoHoverOverlay
                heading="Wingman Feature Video"
                subtitle="AI Life Coach • iOS App • EQ Training"
                process="Tap play to watch on this page."
              />
            }
          />
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Wingman — Your AI Assistant for Life</h3>
            <p className="text-zinc-300 text-sm">
              Meet Wingman, your personal life coach, designed to help you reflect deeply, grow intentionally, and thrive in every area of life.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-white/10">AI Coach</span>
              <span className="px-2 py-1 rounded-full bg-white/10">EQ Training</span>
              <span className="px-2 py-1 rounded-full bg-white/10">iOS App</span>
              </div>
            <a 
              href="https://apps.apple.com/us/app/wingman-eq-life-coach/id6747995730" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download App
            </a>
          </div>
        </div>

        {/* Divider Line */}
        <div className="flex justify-center my-12">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Biro Labels */}
        <div className="mb-16 space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-xl font-semibold">Biro Labels</h3>
            <p className="text-zinc-300 text-sm">
              Customer storefront and admin tools for store managers. Built, designed, and developed solo.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-white/10">Web design</span>
              <span className="px-2 py-1 rounded-full bg-white/10">UX</span>
              <span className="px-2 py-1 rounded-full bg-white/10">Customer experience</span>
              <span className="px-2 py-1 rounded-full bg-white/10">Admin tools</span>
            </div>
            <a
              href="https://birolabels.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded-2xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              View Website
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Customer experience</p>
              <YouTubeLazyEmbed
                title="Biro Labels customer-facing site walkthrough"
                videoId="nJfioQ8lLSg"
                borderClass="border border-white/10"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Admin &amp; store managers</p>
              <YouTubeLazyEmbed
                title="Biro Labels admin walkthrough for store managers"
                videoId="oGaejTwxYNc"
                borderClass="border border-white/10"
              />
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="flex justify-center my-12">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Cloverleaf Testimonials Feature */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Playlist embed — shown first on mobile, second on desktop */}
          <div className="order-1 md:order-2">
            <YouTubeLazyEmbed
              title="Cloverleaf Testimonials — playlist"
              playlistId="PL18Q1CsxcdgRhhpWPSXSjkJCx12SRp_1_"
              thumbnailVideoId="ITr7VHyHa2E"
              borderClass="border border-white/10"
              hoverDetails={
                <VideoHoverOverlay
                  heading="Cloverleaf Testimonials"
                  subtitle="Customer Stories • Product Marketing • Video Design"
                  process="Tap play to watch the playlist on this page."
                />
              }
            />
          </div>
          {/* Text - shown second on mobile, first on desktop */}
          <div className="space-y-4 order-2 md:order-1">
            <h3 className="text-xl font-semibold">Cloverleaf Testimonials</h3>
            <p className="text-zinc-300 text-sm">
              Developed compelling customer testimonial videos that showcase product value through authentic storytelling and professional video design.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-white/10">Testimonials</span>
              <span className="px-2 py-1 rounded-full bg-white/10">Storytelling</span>
              <span className="px-2 py-1 rounded-full bg-white/10">Video Design</span>
              <span className="px-2 py-1 rounded-full bg-white/10">Product Marketing</span>
            </div>
            <a 
              href="https://www.youtube.com/playlist?list=PL18Q1CsxcdgRhhpWPSXSjkJCx12SRp_1_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded-2xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              View Playlist
            </a>
          </div>
        </div>
      </section>

      {/* Design Section - Masonry Layout */}
      <section id="design" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8">
          Design
        </h2>
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {DESIGN_GALLERY.map((item) => (
            <div key={item.src} className="break-inside-avoid mb-6">
              <button
                type="button"
                onClick={() => setLightbox({ src: item.src, alt: item.alt })}
                className="block w-full cursor-pointer rounded-2xl border-0 bg-transparent p-0 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label={`View larger: ${item.alt}`}
              >
                <div className="relative overflow-hidden rounded-2xl border-2 border-transparent bg-zinc-900 transition-all duration-300 hover:border-white/30">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-auto w-full object-cover"
                    style={{ aspectRatio: item.ratio }}
                  />
                </div>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section id="video" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8">
          Video
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {VIDEO_GRID_ITEMS.map((v) => (
            <YouTubeLazyEmbed
              key={v.id}
              videoId={v.id}
              title={v.title}
              hoverDetails={
                <VideoHoverOverlay
                  heading={v.title}
                  subtitle={v.subtitle}
                  process={v.process}
                  stack={v.stack}
                />
              }
            />
          ))}
        </div>
      </section>

      {/* Instagram Feed */}
      <section id="feed" className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">
            Feed
          </h2>
        </div>
        <div className="w-full">
          <style jsx>{`
            iframe {
              width: 100% !important;
              min-width: 100% !important;
              max-width: 100% !important;
            }
          `}</style>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Instagram Reel 1 - 9:16 aspect ratio */}
            <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden w-full">
              <div className="w-full">
                <iframe
                  src="https://www.instagram.com/reel/DC_R8DvRon5/embed/"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="w-full"
                  style={{ minWidth: '100%', width: '100%' }}
                ></iframe>
              </div>
            </div>
            
            {/* Instagram Reel 2 - 9:16 aspect ratio */}
            <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden w-full">
              <div className="w-full">
                <iframe
                  src="https://www.instagram.com/reel/DCq-2X3pvFj/embed/"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="w-full"
                ></iframe>
              </div>
            </div>
            
            {/* Instagram Reel 3 - 9:16 aspect ratio */}
            <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden w-full">
              <div className="w-full">
                <iframe
                  src="https://www.instagram.com/reel/C1ICys3xpJS/embed/"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="w-full"
                ></iframe>
              </div>
            </div>
            
            {/* Instagram Reel 4 - 9:16 aspect ratio */}
            <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden w-full">
              <div className="w-full">
                <iframe
                  src="https://www.instagram.com/reel/C0-ETfhvIYd/embed/"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="w-full"
                ></iframe>
              </div>
            </div>
            
            {/* Instagram Reel 5 - 9:16 aspect ratio */}
            <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden w-full">
              <div className="w-full">
                <iframe
                  src="https://www.instagram.com/reel/C07OmITJvBm/embed/"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="w-full"
                ></iframe>
              </div>
            </div>
            
            {/* Instagram Reel 6 - 9:16 aspect ratio */}
            <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden w-full">
              <div className="w-full">
                <iframe
                  src="https://www.instagram.com/reel/C045T56PQx2/embed/"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="w-full"
                ></iframe>
              </div>
            </div>
            
            {/* Instagram Reel 7 - 9:16 aspect ratio */}
            <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden w-full">
              <div className="w-full">
                <iframe
                  src="https://www.instagram.com/reel/C02K4lxP8MD/embed/"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="w-full"
                ></iframe>
          </div>
            </div>
            
            {/* Instagram Post 8 - 1:1 aspect ratio (regular post) */}
            <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden w-full">
              <div className="w-full">
                <iframe
                  src="https://www.instagram.com/p/DF_XY4uPeLV/embed/"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="w-full"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-xs text-zinc-500">Follow for more creative content ✦</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
        {/* Contact CTA */}
        <div className="border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Need help with something?</h3>
          <p className="text-sm text-zinc-300 mb-6">Design, creative, and technology solutions. I respond within 24 hours.</p>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:jakeostudio@gmail.com?subject=Project Inquiry&body=Hi Jake, I'd like to discuss a project with you." 
                className="inline-block px-6 py-3 rounded-2xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
              >
                Ask me
              </a>
              <a 
                href="/OwensResumeGen2026.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-2xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Check my Resume
              </a>
            </div>
            <div className="text-xs text-zinc-500">
              jakeostudio@gmail.com • Based in USA • Available for remote
            </div>
        </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">jakeostudio</span>
          </div>
          <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-xs hover:bg-white/10 transition-colors">IG</a>
              <a href="#" className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-xs hover:bg-white/10 transition-colors">IN</a>
              <a href="#" className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-xs hover:bg-white/10 transition-colors">Li</a>
            </div>
          </div>
          <div className="text-center text-xs text-zinc-500">
            <p>Instagram • LinkedIn • LinkTree</p>
            <p className="mt-2">© {new Date().getFullYear()} jakeostudio</p>
          </div>
        </div>
      </footer>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-xl leading-none text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Close enlarged image"
          >
            ×
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
  );
}

