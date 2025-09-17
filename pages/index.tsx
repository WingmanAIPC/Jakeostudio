import React, { useState } from "react";

// Minimal single-file React portfolio using Tailwind CSS classes.
// Drop into Next.js/React. Replace placeholders with real content.

export default function PortfolioSite() {
  const [open, setOpen] = useState(false);
  const nav = [
    { id: "videos", label: "Videos" },
    { id: "design", label: "Design" },
    { id: "feature", label: "Feature" },
    { id: "feed", label: "Feed" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight">
            jostudio
          </a>
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

      {/* Hero Section */}
      <section id="top" className="mx-auto max-w-7xl px-4 pt-16 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-semibold leading-tight mb-6">
            Creative Technologist
          </h1>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
            I design, edit, and engineer experiences across video, graphics, and AI-driven products. 
            Minimalist UX, high craft, fast delivery.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Capabilities</h3>
              <ul className="text-sm text-zinc-300 space-y-2">
                <li>• Video Editing & Color Grading</li>
                <li>• Motion Graphics & VFX</li>
                <li>• UX/UI Design & Prototyping</li>
                <li>• AI Integration & Frontend Dev</li>
                <li>• Creative Direction</li>
              </ul>
            </div>
            
            <div className="border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Software</h3>
              <ul className="text-sm text-zinc-300 space-y-2">
                <li>• Adobe Creative Suite</li>
                <li>• DaVinci Resolve</li>
                <li>• Figma & After Effects</li>
                <li>• Python & Swift</li>
                <li>• Runway & Supabase</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">My Edge</h3>
              <p className="text-sm text-zinc-300">
                Taste + systems thinking. I balance craft with speed and ship reliably. 
                Small teams, fast cycles, measurable impact.
              </p>
            </div>
            
            <div className="border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Currently Available</h3>
              <p className="text-sm text-zinc-300 mb-4">
                Open to work all kinds of work: freelance, contract, part-time, full-time.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Remote • Grand Rapids, MI</span>
                <a href="#" className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8">
          Videos
        </h2>
        <div className="grid grid-cols-2 gap-0">
          <div className="aspect-video bg-zinc-900 grid place-items-center group cursor-pointer relative">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
              </div>
              <span className="text-zinc-400 text-sm">YouTube Video 1</span>
            </div>
            {/* Hover details */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-2">Music Video — Cinematic Story</h3>
                <p className="text-sm text-zinc-300 mb-4">Director • Edit • Color</p>
                <p className="text-xs text-zinc-400">Process: storyboard → edit → grade → deliverables</p>
                <p className="text-xs text-zinc-400">Stack: Adobe, DaVinci, After Effects</p>
              </div>
            </div>
          </div>
          <div className="aspect-video bg-zinc-900 grid place-items-center group cursor-pointer relative">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
              </div>
              <span className="text-zinc-400 text-sm">YouTube Video 2</span>
            </div>
            {/* Hover details */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-2">Brand Film — Launch</h3>
                <p className="text-sm text-zinc-300 mb-4">Edit • VFX • Grade</p>
                <p className="text-xs text-zinc-400">Process: concept → edit → vfx → delivery</p>
                <p className="text-xs text-zinc-400">Stack: Adobe, After Effects, DaVinci</p>
              </div>
            </div>
          </div>
          <div className="aspect-video bg-zinc-900 grid place-items-center group cursor-pointer relative">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
              </div>
              <span className="text-zinc-400 text-sm">Music Video</span>
            </div>
            {/* Hover details */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-2">Music Video — Cinematic Story</h3>
                <p className="text-sm text-zinc-300 mb-4">Director • Edit • Color</p>
                <p className="text-xs text-zinc-400">Process: storyboard → edit → grade → deliverables</p>
                <p className="text-xs text-zinc-400">Stack: Adobe, DaVinci, After Effects</p>
              </div>
            </div>
          </div>
          <div className="aspect-video bg-zinc-900 grid place-items-center group cursor-pointer relative">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
              </div>
              <span className="text-zinc-400 text-sm">Brand Film</span>
            </div>
            {/* Hover details */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-2">Brand Film — Launch</h3>
                <p className="text-sm text-zinc-300 mb-4">Edit • VFX • Grade</p>
                <p className="text-xs text-zinc-400">Process: concept → edit → vfx → delivery</p>
                <p className="text-xs text-zinc-400">Stack: Adobe, After Effects, DaVinci</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Section */}
      <section id="design" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8">
          Design
        </h2>
        <div className="grid grid-cols-4 gap-0">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="aspect-square bg-zinc-900 grid place-items-center group cursor-pointer relative overflow-hidden">
              <span className="text-zinc-500 text-xs">Design {i}</span>
              {/* This will adapt to different aspect ratios when real images are uploaded */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Wingman Feature */}
      <section id="feature" className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">
            Feature
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 grid place-items-center group cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
              </div>
              <span className="text-zinc-400 text-sm">Wingman Demo</span>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Wingman — Your AI Assistant for Life</h3>
            <p className="text-zinc-300 text-sm">
              Now Available on the iOS App Store. Meet Wingman, your personal life coach, designed to help you reflect deeply, grow intentionally, and thrive in every area of life.
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
              className="inline-block px-4 py-2 rounded-2xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Download App
            </a>
          </div>
        </div>
      </section>


      {/* Instagram Feed */}
      <section id="feed" className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">
            Feed
          </h2>
        </div>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 grid place-items-center">
              <div className="text-center">
                <div className="text-sm text-zinc-400 mb-2">IG Post Recent</div>
                <div className="text-xs text-zinc-500">Instagram integration coming soon</div>
              </div>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 grid place-items-center">
              <div className="text-center">
                <div className="text-sm text-zinc-400 mb-2">IG Post Second Recent</div>
                <div className="text-xs text-zinc-500">Instagram integration coming soon</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500">Scrollable feed ✦</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-5xl px-4 pb-20">
        <div className="border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need help with something?</h2>
          <p className="text-sm text-zinc-300 mb-6">Design, creative, and technology solutions. I respond within 24 hours.</p>
          <div className="space-y-4">
            <a 
              href="mailto:hello@jakeostudio.com" 
              className="inline-block px-6 py-3 rounded-2xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Ask me
            </a>
            <div className="text-xs text-zinc-500">
              hello@jakeostudio.com • Based in Michigan • Available for remote
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
              <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-xs"></div>
            </div>
          </div>
          <div className="text-center text-xs text-zinc-500">
            <p>Instagram • LinkedIn • LinkTree</p>
            <p className="mt-2">© {new Date().getFullYear()} jakeostudio</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

