import React, { useState, useEffect } from "react";
import PrismaticBurst from "../components/PrismaticBurst";
import PillNav from "../components/PillNav";

// Minimal single-file React portfolio using Tailwind CSS classes.
// Drop into Next.js/React. Replace placeholders with real content.

export default function PortfolioSite() {
  const navItems = [
    { label: "Videos", href: "#videos", ariaLabel: "Go to Videos section" },
    { label: "Design", href: "#design", ariaLabel: "Go to Design section" },
    { label: "Feature", href: "#feature", ariaLabel: "Go to Feature section" },
    { label: "Feed", href: "#feed", ariaLabel: "Go to Feed section" },
    { label: "Me", href: "#contact", ariaLabel: "Go to Me section" },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 scroll-smooth">
      {/* Floating Pill Navigation */}
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

        {/* Central Logo */}
        <div className="relative z-10">
          <div className="relative group cursor-pointer">
            <img
              src="/jakeostudiowhite.png"
              alt="jakeostudio"
              className="w-64 h-64 object-contain"
            />
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

      {/* Me Section */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-semibold mb-4">Creative Technologist</h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
            Blending the art of technology, creative thinking, and design.
          </p>
              </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Profile Image Slideshow */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">About Me</h3>
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 grid place-items-center">
              <div className="text-center">
                <div className="text-sm text-zinc-400 mb-2">Profile Slideshow</div>
                <div className="text-xs text-zinc-500">Images coming soon</div>
              </div>
            </div>
          </div>

          {/* Services & Tools */}
          <div className="space-y-8">
            {/* Services */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Services</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-sm mb-2">UX/UI Design</h4>
                  <p className="text-xs text-zinc-400">Prototyping, user research, interface design</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-sm mb-2">Creative Direction</h4>
                  <p className="text-xs text-zinc-400">Brand strategy, visual identity, art direction</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-sm mb-2">Video Editing</h4>
                  <p className="text-xs text-zinc-400">Narrative, commercial, music video production</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-sm mb-2">VFX & Animation</h4>
                  <p className="text-xs text-zinc-400">Motion graphics, visual effects, 3D animation</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-sm mb-2">Motion Design</h4>
                  <p className="text-xs text-zinc-400">Title sequences, animation, motion graphics</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-sm mb-2">AI Integration</h4>
                  <p className="text-xs text-zinc-400">Machine learning, automation, AI-powered tools</p>
                </div>
              </div>
            </div>

            {/* Tools */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Tools</h3>
              <div className="space-y-4">
                <div className="border border-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-sm mb-2">Creative Suite</h4>
                  <p className="text-xs text-zinc-400">Adobe Creative Cloud, Figma, After Effects, Blender</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-sm mb-2">Development</h4>
                  <p className="text-xs text-zinc-400">Cursor, TypeScript, Python, HTML, CSS, React, Next.js</p>
                </div>
                <div className="border border-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-sm mb-2">AI & ML</h4>
                  <p className="text-xs text-zinc-400">Google AI Labs, OpenAI (Codex, ChatGPT), Runway, Vertex AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Need help with something?</h3>
          <p className="text-sm text-zinc-300 mb-6">Design, creative, and technology solutions. I respond within 24 hours.</p>
          <div className="space-y-4">
            <a 
              href="mailto:jakeostudio@gmail.com" 
              className="inline-block px-6 py-3 rounded-2xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Ask me
            </a>
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
    </div>
  );
}

