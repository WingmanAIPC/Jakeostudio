import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { navigateHomeToFeature } from "../../lib/navigateHomeToFeature";

const CASE_STUDIES = [
  {
    slug: "biro-labels",
    title: "Biro Labels",
    subtitle: "E-Commerce Platform & Admin Dashboard",
    description:
      "Full-stack e-commerce platform for a thermal label company — custom storefront, Stripe checkout, QuickBooks integration, and admin dashboard. Solo design and development.",
    tags: ["Next.js", "Supabase", "Stripe", "Full-Stack"],
    color: "from-blue-500/20 to-cyan-500/20",
    priority: 1,
  },
  {
    slug: "wingman",
    title: "Wingman",
    subtitle: "AI Emotional Intelligence Companion",
    description:
      "Native iOS app with a 13-metric EQ framework that personalizes AI conversations through psychological profiling and mood tracking. Live on the App Store.",
    tags: ["SwiftUI", "OpenRouter", "Prompt Engineering", "iOS"],
    color: "from-emerald-500/20 to-green-500/20",
    priority: 2,
  },
  {
    slug: "cloverleaf",
    title: "Cloverleaf",
    subtitle: "Video & Motion Design",
    description:
      "Testimonial video production, short-form content strategy, and motion graphics for a B2B team-development SaaS platform.",
    tags: ["Premiere Pro", "After Effects", "Motion Design", "Brand"],
    color: "from-purple-500/20 to-pink-500/20",
    priority: 3,
  },
];

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

export default function WorkIndex() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Work — jakeostudio</title>
        <meta name="description" content="Case studies in full-stack development, AI product design, and creative production by Jake Owens." />
        <meta property="og:title" content="Work — jakeostudio" />
        <meta property="og:description" content="Case studies in full-stack development, AI product design, and creative production." />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-black text-zinc-100">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl flex items-center justify-between px-4 h-14">
            <Link
              href="/#feature"
              prefetch={false}
              onClick={(e) => navigateHomeToFeature(router, e)}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <BackArrow />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              jakeostudio
            </Link>
            <a
              href="/OwensResumeGen2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              Resume
            </a>
          </div>
        </nav>

        <main className="pt-28 pb-24 md:pt-36">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-16">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Work</h1>
              <p className="text-lg text-zinc-400 max-w-2xl">
                Selected projects spanning full-stack development, AI product design, and creative production.
              </p>
            </div>

            <div className="grid gap-6">
              {CASE_STUDIES.map((study) => (
                <Link
                  key={study.slug}
                  href={`/work/${study.slug}`}
                  className="group relative block rounded-2xl border border-white/10 bg-zinc-900/40 p-6 md:p-8 transition-all duration-300 hover:border-white/20 hover:bg-zinc-900/70"
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${study.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-2">
                          Case Study {study.priority}
                        </p>
                        <h2 className="text-2xl font-semibold mb-1">{study.title}</h2>
                        <p className="text-sm text-zinc-400 mb-4">{study.subtitle}</p>
                        <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
                          {study.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {study.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-500 group-hover:text-white transition-colors shrink-0 md:mt-8">
                        <span>Read</span>
                        <ArrowRight />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-12 text-center">
            <p className="text-xs text-zinc-600">&copy; {new Date().getFullYear()} jakeostudio</p>
          </div>
        </footer>
      </div>
    </>
  );
}
