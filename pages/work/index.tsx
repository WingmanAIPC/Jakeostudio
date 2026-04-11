import React from "react";
import Head from "next/head";
import Link from "next/link";
import HeaderFloatingBar from "../../components/HeaderFloatingBar";
import PrimaryNavCluster from "../../components/PrimaryNavCluster";
import { CAPABILITY_CARDS } from "../../lib/capabilities";
import { DOCUMENT_TITLE, SITE_LOGO_WORDMARK_SRC } from "../../lib/siteNav";
import { WORK_PAGE_CARD_THEMES } from "../../lib/workPageCardThemes";
import { FEATURED_PROJECTS } from "../../lib/work";

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

export default function WorkIndex() {
  return (
    <>
      <Head>
        <title>{DOCUMENT_TITLE}</title>
        <meta name="description" content="Case studies in full-stack development, AI product design, and creative production by Jake Owens." />
        <meta property="og:title" content="Work — jakeostudio" />
        <meta property="og:description" content="Case studies in full-stack development, AI product design, and creative production." />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-black text-zinc-100">
        <HeaderFloatingBar>
          <PrimaryNavCluster activeHref="/work" />
        </HeaderFloatingBar>

        <main className="pt-28 pb-24 md:pt-36">
          <div className="mx-auto max-w-5xl px-4">
            <header className="mb-10 md:mb-12 flex flex-col items-center text-center">
              <h1 className="sr-only">Work</h1>
              <Link
                href="/"
                className="block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Home"
              >
                <img
                  src={SITE_LOGO_WORDMARK_SRC}
                  alt="jakeostudio"
                  className="mx-auto h-12 w-auto max-w-[min(100%,18rem)] object-contain object-center sm:h-14 md:h-16 md:max-w-[min(100%,22rem)] lg:h-[4.5rem] lg:max-w-[min(100%,26rem)]"
                />
              </Link>
            </header>

            <section className="mb-16 md:mb-20" aria-labelledby="capabilities-heading">
              <h2 id="capabilities-heading" className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-6 text-center">
                What I offer
              </h2>
              <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4">
                {CAPABILITY_CARDS.map((card) => (
                  <div
                    key={card.title}
                    className="w-full max-w-sm shrink-0 rounded-2xl border border-white/10 bg-zinc-900/35 p-5 md:p-6 transition-colors hover:border-white/20 hover:bg-zinc-900/55 sm:w-72 sm:max-w-[min(100%,18rem)]"
                  >
                    <h3 className="text-base font-semibold text-white mb-2">{card.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="case-studies-heading">
              <h2 id="case-studies-heading" className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-6">
                Case studies
              </h2>
              <div className="grid gap-6">
                {FEATURED_PROJECTS.filter((p) => p.slug !== "hire").map((project, i) => {
                  const cardTheme = project.workCardTheme
                    ? WORK_PAGE_CARD_THEMES[project.workCardTheme]
                    : null;
                  return (
                    <Link
                      key={project.slug}
                      href={`/work/${project.slug}`}
                      className={`group relative block rounded-2xl border p-6 md:p-8 transition-all duration-300 ${
                        cardTheme
                          ? `${cardTheme.surface} ${cardTheme.surfaceHover}`
                          : "border-zinc-300/80 bg-zinc-100 text-zinc-900 hover:bg-white hover:border-zinc-400"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                          cardTheme ? cardTheme.gradient : project.color
                        }`}
                      />
                      <div className="relative">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium uppercase tracking-widest mb-2 ${
                                cardTheme?.kicker ?? "text-zinc-600"
                              }`}
                            >
                              Case Study {i + 1}
                            </p>
                            <h3
                              className={`text-2xl font-semibold mb-1 ${
                                cardTheme?.title ?? "text-zinc-950"
                              }`}
                            >
                              {project.title}
                            </h3>
                            <p
                              className={`text-sm mb-4 ${
                                cardTheme?.subtitle ?? "text-zinc-800"
                              }`}
                            >
                              {project.subtitle}
                            </p>
                            {project.description ? (
                              <p
                                className={`text-sm leading-relaxed max-w-2xl ${
                                  cardTheme?.body ?? "text-zinc-800"
                                }`}
                              >
                                {project.description}
                              </p>
                            ) : null}
                            <div className="flex flex-wrap gap-2 mt-4">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`rounded-full border px-3 py-1 text-xs ${
                                    cardTheme?.tag ??
                                    "bg-white border-zinc-300 text-zinc-900"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="shrink-0 md:mt-8 md:self-start">
                            <span
                              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                                cardTheme?.cta ??
                                "border-2 border-zinc-700 bg-white text-zinc-900 shadow-sm group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white"
                              }`}
                            >
                              <span>Case study</span>
                              <ArrowRight />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
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
