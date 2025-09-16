import React, { useState } from "react";

// Minimal single-file React portfolio using Tailwind CSS classes.
// Drop into Next.js/React. Replace placeholders with real content.

export default function PortfolioSite() {
  const [open, setOpen] = useState(false);
  const nav = [
    { id: "work", label: "Work" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "notes", label: "Notes" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight">jakeostudio</a>
          <nav className="hidden md:flex gap-6">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-sm text-zinc-300 hover:text-white">
                {n.label}
              </a>
            ))}
          </nav>
          <button className="md:hidden text-sm" onClick={() => setOpen(!open)}>menu</button>
        </div>
        {open && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-4 py-3 flex flex-col gap-3">
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} className="text-sm text-zinc-300" onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto max-w-7xl px-4 pt-16 pb-8">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7">
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
              Creative Technologist & Video Editor
            </h1>
            <p className="mt-4 text-zinc-300 max-w-xl">
              I design, edit, and engineer experiences across video, graphics, and AI‑driven products. Minimalist UX, high craft, fast delivery.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#work" className="px-4 py-2 rounded-2xl bg-white text-black text-sm font-medium">View Work</a>
              <a href="#contact" className="px-4 py-2 rounded-2xl border border-white/20 text-sm">Book a project</a>
            </div>
            <ul className="mt-6 text-xs text-zinc-400 flex flex-wrap gap-3">
              <li>UX/UI</li>
              <li>Video Editing</li>
              <li>Color & VFX</li>
              <li>Motion</li>
              <li>AI/ML Integration</li>
              <li>Web Apps</li>
              <li>On‑set & Studio</li>
            </ul>
          </div>
          <div className="md:col-span-5">
            <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
              {/* Replace with embedded reel */}
              <div className="h-full w-full grid place-items-center bg-zinc-900">
                <span className="text-zinc-400 text-sm">Embed reel (Vimeo/YouTube/Frame.io)</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-500">Reel ▶︎ 90s • narrative, commercial, music video</div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="mx-auto max-w-7xl px-4 py-6 border-y border-white/5">
        <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500">
          <span>Selected tools: Adobe CC, After Effects, DaVinci, Figma, Python, Swift, Runway, Supabase</span>
          <span className="hidden md:inline">•</span>
          <span>Available: Remote • Grand Rapids • Michigan</span>
        </div>
      </section>

      {/* Work grid */}
      <section id="work" className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Selected Work</h2>
          <a href="#contact" className="text-sm text-zinc-300 hover:text-white">Need help? Get in touch →</a>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Music Video — Cinematic story",
              tags: ["Director", "Edit", "Color"],
            },
            {
              title: "Brand Film — Launch",
              tags: ["Edit", "VFX", "Grade"],
            },
            {
              title: "Product UI — AI Companion",
              tags: ["UX/UI", "Proto", "Frontend"],
            },
            {
              title: "Commercial — 30s spot",
              tags: ["Edit", "Mix", "Delivery"],
            },
            {
              title: "Motion Graphics — Explainer",
              tags: ["Design", "AE", "VO"],
            },
            {
              title: "Case Study — Wingman",
              tags: ["Product", "AI", "Systems"],
            },
          ].map((item, i) => (
            <a key={i} href="#case-template" className="group border border-white/10 rounded-2xl overflow-hidden hover:border-white/20">
              <div className="aspect-video bg-zinc-900 grid place-items-center">
                <span className="text-zinc-500 text-xs">Thumbnail {i + 1}</span>
              </div>
              <div className="p-4">
                <div className="text-sm font-medium">{item.title}</div>
                <div className="mt-1 text-xs text-zinc-400">{item.tags.join(" • ")}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-semibold">Services</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Video Editing & Finishing",
              desc: "Narrative, branded, music, social. Fast turnover. Color, sound polish, delivery specs.",
              cta: "Request edit slot",
            },
            {
              name: "Motion & Graphics",
              desc: "Titles, explainers, lower thirds, toolkits. AE pipelines that scale.",
              cta: "Start a motion brief",
            },
            {
              name: "UX/UI & Creative Tech",
              desc: "Prototypes and microsites. AI features that feel human. Shipping mindset.",
              cta: "Book a product sprint",
            },
          ].map((s, i) => (
            <div key={i} className="border border-white/10 rounded-2xl p-5">
              <div className="text-sm font-medium">{s.name}</div>
              <p className="mt-2 text-sm text-zinc-300">{s.desc}</p>
              <a href="#contact" className="mt-4 inline-block text-xs px-3 py-1.5 rounded-xl bg-white text-black">{s.cta}</a>
            </div>
          ))}
        </div>
      </section>

      {/* Case Study Template */}
      <section id="case-template" className="mx-auto max-w-5xl px-4 py-16">
        <div className="border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold">Case Study Template</h3>
          <div className="mt-4 grid md:grid-cols-3 gap-6 text-sm text-zinc-300">
            <div>
              <div className="text-zinc-400 text-xs uppercase">Project</div>
              <p>Title / role / year</p>
            </div>
            <div>
              <div className="text-zinc-400 text-xs uppercase">Brief</div>
              <p>Goal, audience, constraints, timeline.</p>
            </div>
            <div>
              <div className="text-zinc-400 text-xs uppercase">Outcome</div>
              <p>Impact metrics, before/after frames, what shipped.</p>
            </div>
          </div>
          <div className="mt-6 aspect-video rounded-xl bg-zinc-900 grid place-items-center">
            <span className="text-zinc-500 text-xs">Drop hero frame or trailer here</span>
          </div>
          <ul className="mt-6 list-disc list-inside text-sm text-zinc-300 space-y-1">
            <li>Process: storyboard → edit → grade → deliverables.</li>
            <li>Stack: Adobe, AE, Davinci, Figma, Runway, Python tools.</li>
            <li>My edge: systems thinking, pace control, taste.</li>
          </ul>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold">About Jake</h2>
            <p className="mt-4 text-zinc-300 text-sm">
              Creative generalist with roots in video and a toolkit in design, motion, and code. I build clear stories and usable products. I like small teams, fast cycles, and measurable impact.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
              <div className="border border-white/10 rounded-xl p-4">
                <div className="font-medium">Capabilities</div>
                <p className="mt-1 text-zinc-300">Editing, color & finishing, motion, UX/UI, prototyping, lightweight frontend, AI feature design.</p>
              </div>
              <div className="border border-white/10 rounded-xl p-4">
                <div className="font-medium">Edge</div>
                <p className="mt-1 text-zinc-300">Taste + systems. I balance craft with speed and ship reliably.
                </p>
              </div>
            </div>
          </div>
          <aside>
            <div className="border border-white/10 rounded-2xl p-4">
              <div className="text-sm font-medium">Download PDF Portfolio</div>
              <p className="text-xs text-zinc-400 mt-1">One‑page capabilities + links.</p>
              <a href="#" className="mt-3 inline-block text-xs px-3 py-1.5 rounded-xl bg-white text-black">Download</a>
            </div>
            <div className="mt-4 border border-white/10 rounded-2xl p-4">
              <div className="text-sm font-medium">Currently</div>
              <ul className="mt-2 text-xs text-zinc-400 space-y-1">
                <li>Freelance video editing</li>
                <li>AI companion product experiments</li>
                <li>Open to agency collabs</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Notes / Writing */}
      <section id="notes" className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-2xl font-semibold">Notes</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {[1,2,3,4].map((i) => (
            <article key={i} className="border border-white/10 rounded-2xl p-5">
              <div className="text-sm font-medium">Short post title {i}</div>
              <p className="mt-2 text-sm text-zinc-300">Write concise learning notes, behind‑the‑scenes, or breakdowns. Signal thinking depth.</p>
              <a href="#" className="mt-3 inline-block text-xs text-zinc-300 hover:text-white">Read →</a>
            </article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-5xl px-4 pb-20">
        <div className="border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold">Let's build something</h2>
          <p className="mt-2 text-sm text-zinc-300">Tell me about your project. I respond within 24 hours.</p>
          <form className="mt-6 grid md:grid-cols-2 gap-4">
            <input className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm" placeholder="Your name" />
            <input className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm" placeholder="Email" />
            <input className="md:col-span-2 px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm" placeholder="Project type (edit, motion, UI, other)" />
            <textarea className="md:col-span-2 px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm h-28" placeholder="Scope, timeline, links" />
            <button className="md:col-span-2 mt-2 px-4 py-2 rounded-2xl bg-white text-black text-sm font-medium w-fit">Send inquiry</button>
          </form>
          <div className="mt-4 text-xs text-zinc-500">Or email: hello@jakeostudio.com • Based in Michigan • Available for remote</div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-zinc-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} jakeostudio</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">Vimeo</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
