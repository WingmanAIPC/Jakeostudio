import React, { useState, useEffect } from "react";
import PrismaticBurst from "../components/PrismaticBurst";
import PillNav from "../components/PillNav";

// Minimal single-file React portfolio using Tailwind CSS classes.
// Drop into Next.js/React. Replace placeholders with real content.

export default function PortfolioSite() {
  const navItems = [
    { label: "Videos", href: "#videos", ariaLabel: "Go to Videos section" },
    { label: "Feature", href: "#feature", ariaLabel: "Go to Feature section" },
    { label: "Design", href: "#design", ariaLabel: "Go to Design section" },
    { label: "Feed", href: "#feed", ariaLabel: "Go to Feed section" },
    { label: "Me", href: "#contact", ariaLabel: "Go to Me section" },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 scroll-smooth" style={{ backgroundColor: '#000000' }}>
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

        {/* Fade Out Overlays with Arc Ease */}
        <div className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, #000000 0%, #000000 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 80%, transparent 100%)'
        }}></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none" style={{
          background: 'linear-gradient(to top, #000000 0%, #000000 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 80%, transparent 100%)'
        }}></div>

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
        <div className="grid grid-cols-2 gap-2">
          {/* Worldwide Technologies Commercial Demo */}
          <a href="https://youtu.be/3Uy1mO11f7s" target="_blank" rel="noopener noreferrer">
            <div className="aspect-video bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl border border-white/20">
              <img 
                src="https://img.youtube.com/vi/3Uy1mO11f7s/maxresdefault.jpg" 
                alt="Worldwide Technologies Commercial Demo"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Hover details */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">Worldwide Technologies Commercial Demo</h3>
                  <p className="text-sm text-zinc-300 mb-4">48 Hours • Google Vertex AI • Capcut • ElevenLabs • ChatGPT</p>
                  <p className="text-xs text-zinc-400">Process: concept → AI integration → edit → delivery</p>
                  <p className="text-xs text-zinc-400">Stack: Google Vertex AI, Capcut, ElevenLabs, ChatGPT</p>
                </div>
              </div>
            </div>
          </a>

          {/* STARGIRL */}
          <a href="https://youtu.be/OZf9mW6tnT8" target="_blank" rel="noopener noreferrer">
            <div className="aspect-video bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl border border-white/20">
              <img 
                src="https://img.youtube.com/vi/OZf9mW6tnT8/maxresdefault.jpg" 
                alt="STARGIRL"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Hover details */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">STARGIRL</h3>
                  <p className="text-sm text-zinc-300 mb-4">7 Day Production • Runway • After Effects • Photoshop</p>
                  <p className="text-xs text-zinc-400">Process: concept → shoot → edit → vfx → delivery</p>
                  <p className="text-xs text-zinc-400">Stack: Runway, After Effects, Photoshop, Canon XF400, DJI Osmo</p>
                </div>
              </div>
            </div>
          </a>

          {/* Midwest */}
          <a href="https://youtu.be/iZUIeVODCgs" target="_blank" rel="noopener noreferrer">
            <div className="aspect-video bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl border border-white/20">
              <img 
                src="https://img.youtube.com/vi/iZUIeVODCgs/maxresdefault.jpg" 
                alt="Midwest"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Hover details */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">Midwest</h3>
                  <p className="text-sm text-zinc-300 mb-4">6 Month Production • Premiere Pro • Photoshop</p>
                  <p className="text-xs text-zinc-400">Process: concept → shoot → edit → grade → delivery</p>
                  <p className="text-xs text-zinc-400">Stack: Premiere Pro, Photoshop, Canon XF400, Canon 5D Mark</p>
                </div>
              </div>
            </div>
          </a>

          {/* Magical Meals */}
          <a href="https://youtu.be/xSFlMa3p748" target="_blank" rel="noopener noreferrer">
            <div className="aspect-video bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl border border-white/20">
              <img 
                src="https://img.youtube.com/vi/xSFlMa3p748/maxresdefault.jpg" 
                alt="Magical Meals"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Hover details */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">Magical Meals</h3>
                  <p className="text-sm text-zinc-300 mb-4">2 Month Production • Team of 8 • After Effects • Illustrator</p>
                  <p className="text-xs text-zinc-400">Process: concept → brand kit → shoot → edit → vfx → delivery</p>
                  <p className="text-xs text-zinc-400">Stack: After Effects, Illustrator, Brand Kit, Canon XF400</p>
                </div>
            </div>
          </div>
          </a>

          {/* Welcome to the Nati */}
          <a href="https://youtu.be/mvUyHR0VAas" target="_blank" rel="noopener noreferrer">
            <div className="aspect-video bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl border border-white/20">
              <img 
                src="https://img.youtube.com/vi/mvUyHR0VAas/maxresdefault.jpg" 
                alt="Welcome to the Nati"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Hover details */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">Welcome to the Nati</h3>
                  <p className="text-sm text-zinc-300 mb-4">24 Hours • After Effects • Canon 5D Mark • GoPro Hero 6</p>
                  <p className="text-xs text-zinc-400">Process: concept → shoot → edit → vfx → delivery</p>
                  <p className="text-xs text-zinc-400">Stack: After Effects, Canon 5D Mark, GoPro Hero 6</p>
                </div>
              </div>
            </div>
          </a>

          {/* Nights Like This */}
          <a href="https://youtu.be/bhBixCPlr7s" target="_blank" rel="noopener noreferrer">
            <div className="aspect-video bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl border border-white/20">
              <img 
                src="https://img.youtube.com/vi/bhBixCPlr7s/maxresdefault.jpg" 
                alt="Nights Like This"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Hover details */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">Nights Like This</h3>
                  <p className="text-sm text-zinc-300 mb-4">24 Hours • Premiere Pro • Canon 5D Mark</p>
                  <p className="text-xs text-zinc-400">Process: concept → shoot → edit → grade → delivery</p>
                  <p className="text-xs text-zinc-400">Stack: Premiere Pro, Canon 5D Mark</p>
          </div>
              </div>
            </div>
          </a>

          {/* Summer in Colorado */}
          <a href="https://youtu.be/3ZP0ILPIlHM" target="_blank" rel="noopener noreferrer">
            <div className="aspect-video bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl border border-white/20">
              <img 
                src="https://img.youtube.com/vi/3ZP0ILPIlHM/maxresdefault.jpg" 
                alt="Summer in Colorado"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Hover details */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">Summer in Colorado</h3>
                  <p className="text-sm text-zinc-300 mb-4">48 Hours • Premiere Pro • Canon 5D Mark • GoPro Hero 6</p>
                  <p className="text-xs text-zinc-400">Process: concept → shoot → edit → grade → delivery</p>
                  <p className="text-xs text-zinc-400">Stack: Premiere Pro, Canon 5D Mark, GoPro Hero 6</p>
                </div>
          </div>
        </div>
          </a>

          {/* Ski-Tage */}
          <a href="https://youtu.be/dVAJL6DPhmo" target="_blank" rel="noopener noreferrer">
            <div className="aspect-video bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl border border-white/20">
              <img 
                src="https://img.youtube.com/vi/dVAJL6DPhmo/maxresdefault.jpg" 
                alt="Ski-Tage"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Hover details */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">Ski-Tage</h3>
                  <p className="text-sm text-zinc-300 mb-4">72 Hours • After Effects • Canon 5D Mark • GoPro Hero 6</p>
                  <p className="text-xs text-zinc-400">Process: concept → shoot → edit → vfx → delivery</p>
                  <p className="text-xs text-zinc-400">Stack: After Effects, Canon 5D Mark, GoPro Hero 6</p>
                </div>
              </div>
            </div>
          </a>
        </div>
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
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 group cursor-pointer relative">
            <img 
              src="https://img.youtube.com/vi/Ag7EAF_djj4/maxresdefault.jpg" 
              alt="Wingman Feature Video"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-2">Wingman Feature Video</h3>
                <p className="text-sm text-zinc-300 mb-4">AI Life Coach • iOS App • EQ Training</p>
                <p className="text-xs text-zinc-400">Click to watch on YouTube</p>
              </div>
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

        {/* Divider Line */}
        <div className="flex justify-center my-12">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Cloverleaf Testimonials Feature */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Cloverleaf Testimonials — Creative Storytelling</h3>
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
          <a href="https://www.youtube.com/playlist?list=PL18Q1CsxcdgRhhpWPSXSjkJCx12SRp_1_" target="_blank" rel="noopener noreferrer">
            <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 group cursor-pointer relative">
              <img 
                src="https://img.youtube.com/vi/ITr7VHyHa2E/maxresdefault.jpg" 
                alt="Cloverleaf Testimonials Playlist"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <div className="text-center p-6">
                  <h3 className="text-lg font-semibold mb-2">Cloverleaf Testimonials</h3>
                  <p className="text-sm text-zinc-300 mb-4">Customer Stories • Product Marketing • Video Design</p>
                  <p className="text-xs text-zinc-400">Click to view playlist on YouTube</p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Design Section - Masonry Layout */}
      <section id="design" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8">
          Design
        </h2>
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {/* Bionic Kid - Tall vertical */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/BionicKid.jpg" alt="Bionic Kid" className="w-full h-auto object-cover" style={{ aspectRatio: '3/4' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* Crystal Strawberry - Very tall vertical */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/CrystalStrawberry.jpg" alt="Crystal Strawberry" className="w-full h-auto object-cover" style={{ aspectRatio: '2/3' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* Lando Norris - Tall vertical */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/LandoNorris.jpg" alt="Lando Norris" className="w-full h-auto object-cover" style={{ aspectRatio: '3/4' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* SSL Cards - Wide horizontal */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/SSLCards.jpg" alt="SSL Cards" className="w-full h-auto object-cover" style={{ aspectRatio: '4/3' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* WHM Dayton - Wide horizontal */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/WHMDayton.jpg" alt="WHM Dayton" className="w-full h-auto object-cover" style={{ aspectRatio: '16/9' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* Playboi Carti - Tall vertical */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/PlayboiCarti.jpg" alt="Playboi Carti" className="w-full h-auto object-cover" style={{ aspectRatio: '3/4' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* Out of Sync - Very tall vertical */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/OutofSync.jpg" alt="Out of Sync" className="w-full h-auto object-cover" style={{ aspectRatio: '2/3' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* Professional Development - Tall vertical */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/ProfessionalDevelopment.jpg" alt="Professional Development" className="w-full h-auto object-cover" style={{ aspectRatio: '3/4' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* Beats Studio Buds - Wide horizontal */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/BeatsStudioBuds.png" alt="Beats Studio Buds" className="w-full h-auto object-cover" style={{ aspectRatio: '16/9' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* Korean BBQ - Tall vertical poster */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/KoreanBBQ.jpg" alt="Korean BBQ" className="w-full h-auto object-cover" style={{ aspectRatio: '3/4' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* Data Landmark - Wide horizontal poster */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/DataLandmarkPoster.jpg" alt="Data Landmark" className="w-full h-auto object-cover" style={{ aspectRatio: '16/9' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          </div>
          
          {/* Social Hour - Tall vertical poster */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-zinc-900 group cursor-pointer relative overflow-hidden rounded-2xl">
              <img src="/SocialHour.jpg" alt="Social Hour" className="w-full h-auto object-cover" style={{ aspectRatio: '3/4' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
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
        <div className="w-full">
          <style jsx>{`
            iframe {
              width: 100% !important;
              min-width: 100% !important;
              max-width: 100% !important;
            }
          `}</style>
          <div className="space-y-8 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
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

      {/* Me Section */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-semibold mb-4">Creative Technologist</h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
            Blending the art of technology, creative thinking, and design.
          </p>
              </div>

        {/* Creative Services & Tools */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Services */}
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
            {/* Tools */}
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

