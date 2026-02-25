import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";

interface Skill {
  title: string;
  desc: string;
  icon: React.ReactNode;
  gradient: string;
}

const skills: Skill[] = [
  {
    title: "UX & Product",
    desc: "Interaction design, UX prototyping, information architecture, testing & QA",
    gradient: "from-blue-500/60 to-blue-600/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
      </svg>
    ),
  },
  {
    title: "Front-End & Prototyping",
    desc: "High-fidelity prototypes, responsive & adaptive design, REST APIs",
    gradient: "from-cyan-500/60 to-cyan-600/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "Motion & Visual Design",
    desc: "Motion graphics, color grading, sound design, storyboarding",
    gradient: "from-violet-500/60 to-violet-600/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: "Video Production",
    desc: "Testimonials, commercials, social media content, storytelling",
    gradient: "from-rose-500/60 to-rose-600/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9.75a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "Creative Direction",
    desc: "Brand strategy, visual identity, branding campaigns, creative concepting & art direction",
    gradient: "from-amber-500/60 to-amber-600/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: "AI & Technical Systems",
    desc: "LLM integration, prompt engineering, AI-assisted development",
    gradient: "from-emerald-500/60 to-emerald-600/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
  },
  {
    title: "Creative Suite",
    desc: "After Effects, Premiere Pro, Photoshop, Illustrator, Figma, Cinema 4D & InDesign",
    gradient: "from-pink-500/60 to-pink-600/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25-9.75 5.25-9.75-5.25 4.179-2.25" />
      </svg>
    ),
  },
  {
    title: "Development",
    desc: "JavaScript, TypeScript, React.js, Next.js, Node.js, HTML, CSS, SwiftUI, REST & GraphQL",
    gradient: "from-orange-500/60 to-orange-600/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "AI & Platforms",
    desc: "Cursor, Kiro, Supabase, Vercel, GitHub, AWS, CI/CD pipelines & cloud infrastructure",
    gradient: "from-indigo-500/60 to-indigo-600/20",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
  },
];

const TOTAL = skills.length;
const CARD_GAP = 16;
const AUTO_ADVANCE_MS = 4000;

const loopedSkills = [...skills, ...skills, ...skills];

function getVisibleCount(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

export default function SkillsSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);
  const dragStartRef = useRef<{ x: number; trackX: number } | null>(null);
  const indexRef = useRef(TOTAL);

  const [currentIndex, setCurrentIndex] = useState(TOTAL);
  const [visibleCount, setVisibleCount] = useState(3);
  const [cardWidth, setCardWidth] = useState(320);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    const vc = getVisibleCount(window.innerWidth);
    setVisibleCount(vc);
    const cw = (w - CARD_GAP * (vc - 1)) / vc;
    setCardWidth(cw);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const getX = useCallback(
    (index: number) => -(index * (cardWidth + CARD_GAP)),
    [cardWidth]
  );

  const resetIfNeeded = useCallback(
    (index: number) => {
      if (index >= TOTAL * 2) {
        const wrapped = index - TOTAL;
        indexRef.current = wrapped;
        setCurrentIndex(wrapped);
        if (trackRef.current) {
          gsap.set(trackRef.current, { x: getX(wrapped) });
        }
      } else if (index < TOTAL) {
        const wrapped = index + TOTAL;
        indexRef.current = wrapped;
        setCurrentIndex(wrapped);
        if (trackRef.current) {
          gsap.set(trackRef.current, { x: getX(wrapped) });
        }
      }
    },
    [getX]
  );

  const slideTo = useCallback(
    (index: number, duration = 0.5) => {
      indexRef.current = index;
      setCurrentIndex(index);
      if (trackRef.current) {
        gsap.to(trackRef.current, {
          x: getX(index),
          duration,
          ease: "power2.inOut",
          overwrite: true,
          onComplete: () => resetIfNeeded(index),
        });
      }
    },
    [getX, resetIfNeeded]
  );

  const resetAutoTimer = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      const next = indexRef.current + 1;
      indexRef.current = next;
      setCurrentIndex(next);
      if (trackRef.current) {
        gsap.to(trackRef.current, {
          x: getX(next),
          duration: 0.6,
          ease: "power2.inOut",
          overwrite: true,
          onComplete: () => resetIfNeeded(next),
        });
      }
    }, AUTO_ADVANCE_MS);
  }, [getX, resetIfNeeded]);

  useEffect(() => {
    resetAutoTimer();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [resetAutoTimer]);

  useEffect(() => {
    if (trackRef.current) {
      gsap.set(trackRef.current, { x: getX(indexRef.current) });
    }
  }, [cardWidth, visibleCount, getX]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isPausedRef.current = true;
    const trackX = trackRef.current
      ? (gsap.getProperty(trackRef.current, "x") as number)
      : 0;
    dragStartRef.current = { x: e.clientX, trackX };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current || !trackRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    gsap.set(trackRef.current, { x: dragStartRef.current.trackX + dx });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const threshold = cardWidth * 0.25;
    let newIndex = indexRef.current;
    if (dx < -threshold) newIndex = indexRef.current + 1;
    else if (dx > threshold) newIndex = indexRef.current - 1;
    dragStartRef.current = null;
    slideTo(newIndex);
    isPausedRef.current = false;
    resetAutoTimer();
  };

  const activeDot = ((currentIndex % TOTAL) + TOTAL) % TOTAL;

  return (
    <div className="relative select-none">
      <div
        ref={containerRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{ gap: CARD_GAP, touchAction: "pan-y" }}
        >
          {loopedSkills.map((skill, i) => (
            <div
              key={`${skill.title}-${i}`}
              className="flex-shrink-0"
              style={{ width: cardWidth }}
            >
              <div className={`rounded-2xl p-[1px] bg-gradient-to-br ${skill.gradient} h-full`}>
                <div className="rounded-2xl bg-black/90 backdrop-blur-sm p-6 h-full flex flex-col justify-between min-h-[180px]">
                  <div>
                    <div className="text-white/80 mb-4">{skill.icon}</div>
                    <h4 className="font-semibold text-lg mb-2 text-white leading-tight">
                      {skill.title}
                    </h4>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed min-h-[2.75rem]">
                    {skill.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === activeDot
                ? "bg-white w-6"
                : "bg-white/25 hover:bg-white/50"
            }`}
            onClick={() => {
              slideTo(TOTAL + i);
              resetAutoTimer();
            }}
          />
        ))}
      </div>
    </div>
  );
}
