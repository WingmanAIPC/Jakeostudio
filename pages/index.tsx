import React, { useState, useEffect, useRef } from "react";

// Minimal single-file React portfolio using Tailwind CSS classes.
// Drop into Next.js/React. Replace placeholders with real content.

export default function PortfolioSite() {
  const [open, setOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  
  const nav = [
    { id: "videos", label: "Videos" },
    { id: "design", label: "Design" },
    { id: "feature", label: "Feature" },
    { id: "feed", label: "Feed" },
    { id: "contact", label: "Contact" },
  ];

  // Floating elements data
  const floatingElements = [
    { text: "Python", x: 20, y: 15, delay: 0 },
    { text: "Swift", x: 80, y: 25, delay: 0.5 },
    { text: "TypeScript", x: 15, y: 70, delay: 1 },
    { text: "Runway", x: 75, y: 60, delay: 1.5 },
    { text: "Google AI Studio", x: 45, y: 10, delay: 2 },
    { text: "Vertex AI", x: 60, y: 80, delay: 2.5 },
    { text: "Adobe CC", x: 25, y: 45, delay: 3 },
    { text: "Figma", x: 70, y: 35, delay: 3.5 },
    { text: "DaVinci", x: 40, y: 65, delay: 4 },
    { text: "After Effects", x: 85, y: 15, delay: 4.5 },
    { text: "Founder", x: 50, y: 50, delay: 5 },
    { text: "Creative Technologist", x: 30, y: 30, delay: 5.5 },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
      return () => hero.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

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

      {/* Bubble Spatial Matrix Hero */}
      <section 
        id="top" 
        ref={heroRef}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
          isHovering ? 'bg-white' : 'bg-black'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingElements.map((element, index) => {
            const parallaxX = (mousePosition.x - 0.5) * 50;
            const parallaxY = (mousePosition.y - 0.5) * 50;
            const baseX = element.x + parallaxX * 0.3;
            const baseY = element.y + parallaxY * 0.3;
            
            return (
              <div
                key={index}
                className={`absolute text-xs font-medium transition-all duration-1000 ${
                  isHovering 
                    ? 'text-black opacity-100 blur-0' 
                    : 'text-zinc-500 opacity-30 blur-sm'
                }`}
                style={{
                  left: `${baseX}%`,
                  top: `${baseY}%`,
                  transform: `translate(-50%, -50%) scale(${isHovering ? 1.1 : 1})`,
                  animationDelay: `${element.delay}s`,
                  animation: isHovering 
                    ? `floatUp 2s ease-out ${element.delay}s infinite alternate` 
                    : 'none'
                }}
              >
                {element.text}
              </div>
            );
          })}
        </div>

        {/* Central Bubble */}
        <div className="relative z-10">
          <div
            className={`relative group cursor-pointer transition-all duration-1000 ${
              isHovering ? 'scale-110' : 'scale-100'
            }`}
            style={{
              transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`,
            }}
          >
            {/* Bubble Background */}
            <div 
              className={`w-64 h-64 rounded-full transition-all duration-1000 ${
                isHovering 
                  ? 'bg-gradient-to-br from-zinc-100 to-zinc-200 shadow-2xl shadow-black/50' 
                  : 'bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl shadow-black/20'
              }`}
              style={{
                background: isHovering 
                  ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(200,200,200,0.6))'
                  : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(0,0,0,0.3))'
              }}
            >
              {/* Fluid Glass Effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-30 transition-all duration-1000"
                style={{
                  background: isHovering
                    ? 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))'
                    : 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              />
              
              {/* Gradient Text Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 
                  className={`text-2xl font-bold transition-all duration-1000 ${
                    isHovering 
                      ? 'bg-gradient-to-r from-black via-zinc-800 to-black bg-clip-text text-transparent' 
                      : 'text-white'
                  }`}
                  style={{
                    background: isHovering 
                      ? 'linear-gradient(45deg, #000000, #404040, #000000)'
                      : 'none',
                    backgroundSize: '200% 200%',
                    animation: isHovering ? 'gradientShift 3s ease-in-out infinite' : 'none'
                  }}
                >
                  jakeostudio
                </h1>
              </div>

              {/* Aurora Effect Ring */}
              <div 
                className={`absolute -inset-4 rounded-full transition-all duration-1000 ${
                  isHovering ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(0,0,0,0.1), transparent)',
                  animation: isHovering ? 'auroraRotate 4s linear infinite' : 'none'
                }}
              />
            </div>

            {/* Bubble Pop Animation */}
            <div 
              className={`absolute inset-0 rounded-full transition-all duration-500 ${
                isHovering 
                  ? 'scale-150 opacity-0' 
                  : 'scale-100 opacity-0'
              }`}
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent)',
                animation: isHovering ? 'bubblePop 0.6s ease-out' : 'none'
              }}
            />
          </div>
        </div>

        {/* Content below bubble */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <h2 className={`text-4xl md:text-6xl font-semibold mb-4 transition-all duration-1000 ${
            isHovering ? 'text-black' : 'text-white'
          }`}>
            Creative Technologist
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto transition-all duration-1000 ${
            isHovering ? 'text-zinc-700' : 'text-zinc-300'
          }`}>
            I design, edit, and engineer experiences across video, graphics, and AI-driven products.
          </p>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes floatUp {
            0% { transform: translateY(0px) scale(1); opacity: 0.3; }
            50% { transform: translateY(-10px) scale(1.05); opacity: 0.8; }
            100% { transform: translateY(-20px) scale(1.1); opacity: 1; }
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes auroraRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes bubblePop {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 0.4; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        `}</style>
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

