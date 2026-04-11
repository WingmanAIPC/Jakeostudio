import React from "react";
import Head from "next/head";
import Link from "next/link";
import { DOCUMENT_TITLE, SITE_LOGO_HEADER_SRC } from "../../lib/siteNav";

export interface CaseStudyMeta {
  title: string;
  /** When set, replaces the default text `<h1>` (e.g. client wordmark). `title` is still used for Open Graph / Twitter. */
  heroTitle?: React.ReactNode;
  description: string;
  role: string;
  timeline: string;
  liveUrl?: string;
  liveLabel?: string;
  ogImage?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImageClassName?: string;
}

interface CaseStudyLayoutProps {
  meta: CaseStudyMeta;
  techStack: string[];
  children: React.ReactNode;
  /** Optional hero visual when no `heroImage` (e.g. client wordmark). */
  heroAddon?: React.ReactNode;
}

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
    </svg>
  );
}

export function Section({
  id,
  label,
  title,
  children,
  className = "",
}: {
  id?: string;
  label?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-12 md:py-16 ${className}`}>
      {label && (
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">{label}</p>
      )}
      {title && (
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">{title}</h2>
      )}
      {children}
    </section>
  );
}

export function DetailCard({
  number,
  title,
  children,
}: {
  number?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 md:p-8">
      <div className="flex items-start gap-4 mb-4">
        {number && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium">
            {number}
          </span>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

/** Single bordered column with dividers — easier to read than stacked separate cards. */
export function DeepDiveArticle({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/30 overflow-hidden max-w-5xl mx-auto w-full">
      <div className="divide-y divide-white/10">{children}</div>
    </div>
  );
}

export function DeepDiveFigure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="space-y-2">
      <div className="rounded-xl border border-white/10 bg-zinc-950 overflow-hidden">
        <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
      </div>
      {caption ? (
        <figcaption className="text-xs text-zinc-500 leading-relaxed">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function DeepDiveVideo({
  src,
  caption,
  /** Portrait screen recordings: narrow “phone” frame so the player matches ~9:16 instead of a wide 16:9 box with pillarboxing. */
  variant = "portrait",
  loop = false,
  autoPlay = false,
  muted = false,
}: {
  src: string;
  caption?: string;
  variant?: "portrait" | "wide";
  /** When true, video restarts when it ends (works well with muted + autoPlay for motion samples). */
  loop?: boolean;
  autoPlay?: boolean;
  /** Most browsers require muted for autoplay to run. */
  muted?: boolean;
}) {
  if (variant === "wide") {
    return (
      <figure className="space-y-2">
        <div className="rounded-xl border border-white/10 bg-black overflow-hidden">
          <video
            src={src}
            controls
            playsInline
            preload="metadata"
            loop={loop}
            autoPlay={autoPlay}
            muted={muted}
            className="w-full max-h-[min(70vh,560px)] object-contain"
          />
        </div>
        {caption ? (
          <figcaption className="text-xs text-zinc-500 leading-relaxed">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="space-y-2">
      <div className="mx-auto w-full max-w-[min(100%,300px)]">
        <div className="rounded-[1.35rem] border border-white/15 bg-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden">
          <video
            src={src}
            controls
            playsInline
            preload="metadata"
            loop={loop}
            autoPlay={autoPlay}
            muted={muted}
            className="w-full h-auto block"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="text-xs text-zinc-500 leading-relaxed">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function DeepDiveItem({
  number,
  title,
  children,
  aside,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-6 md:px-8 md:py-7">
      <h3 className="text-base font-semibold text-zinc-100 mb-4">
        <span className="mr-2 font-mono text-xs font-medium text-zinc-500 tabular-nums">
          {number}
        </span>
        {title}
      </h3>
      {aside ? (
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
          <div className="text-sm text-zinc-300 leading-[1.7] space-y-3 min-w-0">{children}</div>
          <div className="mt-6 lg:mt-0 min-w-0 lg:sticky lg:top-24 space-y-2">{aside}</div>
        </div>
      ) : (
        <div className="text-sm text-zinc-300 leading-[1.7] space-y-3 max-w-3xl">{children}</div>
      )}
    </div>
  );
}

export function TechStackGrid({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function FlowStep({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-300">
      {children}
    </div>
  );
}

export function FlowArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-zinc-600 shrink-0" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

export function FlowNode({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-center shrink-0">
      <p className="text-sm font-medium text-zinc-100">{label}</p>
      {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function CaseStudyLayout({ meta, techStack, children, heroAddon }: CaseStudyLayoutProps) {
  const pageTitle = `${meta.title} — jakeostudio`;

  return (
    <>
      <Head>
        <title>{DOCUMENT_TITLE}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="article" />
        {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={meta.description} />
      </Head>

      <div className="min-h-screen bg-black text-zinc-100">
        {/* Top navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl flex h-14 items-center justify-start gap-5 px-4 sm:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <BackArrow />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <Link
              href="/"
              className="rounded-md px-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="jakeostudio home"
            >
              <img
                src={SITE_LOGO_HEADER_SRC}
                alt="jakeostudio"
                className="h-6 w-auto max-w-[2.75rem] object-contain object-center sm:h-7 sm:max-w-[3.25rem]"
              />
            </Link>
            <a
              href="/JacobOwens2026Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              Resume
            </a>
          </div>
        </nav>

        {/* Hero */}
        <header className="pt-28 pb-12 md:pt-36 md:pb-16">
          <div className="mx-auto max-w-5xl px-4">
            <div
              className={`flex flex-col ${
                meta.heroImage || heroAddon ? "md:flex-row md:items-center md:gap-12" : ""
              }`}
            >
              <div className="flex-1 min-w-0 max-w-3xl">
                <h1
                  className={
                    meta.heroTitle
                      ? "mb-4"
                      : "text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4"
                  }
                >
                  {meta.heroTitle ?? meta.title}
                </h1>
                <p className="text-lg md:text-xl text-zinc-300 mb-8 leading-relaxed">
                  {meta.description}
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <div>
                    <span className="text-zinc-500">Role</span>
                    <p className="text-zinc-200 font-medium">{meta.role}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Timeline</span>
                    <p className="text-zinc-200 font-medium">{meta.timeline}</p>
                  </div>
                  {meta.liveUrl && (
                    <div>
                      <span className="text-zinc-500">Live</span>
                      <p>
                        <a
                          href={meta.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
                        >
                          {meta.liveLabel || meta.liveUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {meta.heroImage ? (
                <div className="mt-8 md:mt-0 shrink-0 flex justify-center">
                  <img
                    src={meta.heroImage}
                    alt={meta.heroImageAlt || meta.title}
                    className={meta.heroImageClassName || "w-32 h-32 md:w-40 md:h-40 object-contain"}
                  />
                </div>
              ) : heroAddon ? (
                <div className="mt-8 md:mt-0 shrink-0 flex justify-center md:justify-end w-full md:w-auto">
                  {heroAddon}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* Divider */}
        <div className="mx-auto max-w-5xl px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        {/* Content sections */}
        <main className="mx-auto max-w-5xl px-4">
          {children}

          {/* Tech Stack — always at bottom */}
          <Section label="Stack" title="Tools & Technologies">
            <TechStackGrid items={techStack} />
          </Section>
        </main>

        {/* Footer CTA */}
        <footer className="border-t border-white/10 mt-16">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center">
            <p className="text-sm text-zinc-500 mb-4">Interested in working together?</p>
            <a
              href="mailto:jakeostudio@gmail.com?subject=Project Inquiry&body=Hi Jake, I'd like to discuss a project with you."
              className="inline-block px-6 py-3 rounded-2xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Get in touch
            </a>
            <p className="mt-8 text-xs text-zinc-600">&copy; {new Date().getFullYear()} jakeostudio</p>
          </div>
        </footer>
      </div>
    </>
  );
}
