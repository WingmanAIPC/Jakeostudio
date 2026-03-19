import React, { useState, useRef, useEffect, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { gsap } from "gsap";

interface Demo {
  id: string;
  label: string;
  description: string;
  tags: string[];
  code: string;
  language: string;
  children: React.ReactNode;
}

interface CodeShowcaseProps {
  demos: Demo[];
}

const CodeShowcase: React.FC<CodeShowcaseProps> = ({ demos }) => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const crossfadeContent = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
  }, []);

  const handleDemoChange = useCallback((idx: number) => {
    if (idx === activeDemo) return;
    if (idx < 0 || idx >= demos.length) return;

    const el = contentRef.current;
    const direction = idx > activeDemo ? 1 : -1;

    if (!el) {
      setActiveDemo(idx);
      setActiveTab("preview");
      return;
    }

    gsap.to(el, {
      opacity: 0,
      x: -30 * direction,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setActiveDemo(idx);
        setActiveTab("preview");
        gsap.fromTo(
          el,
          { opacity: 0, x: 30 * direction },
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
        );
      },
    });
  }, [activeDemo, demos.length]);

  const handleTabChange = (tab: "preview" | "code") => {
    if (tab === activeTab) return;
    const el = contentRef.current;
    if (!el) { setActiveTab(tab); return; }
    gsap.to(el, {
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        setActiveTab(tab);
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      },
    });
  };

  const goNext = useCallback(() => {
    handleDemoChange((activeDemo + 1) % demos.length);
  }, [activeDemo, demos.length, handleDemoChange]);

  const goPrev = useCallback(() => {
    handleDemoChange((activeDemo - 1 + demos.length) % demos.length);
  }, [activeDemo, demos.length, handleDemoChange]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current;
    touchStartRef.current = null;
    if (Math.abs(dx) > 60) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  useEffect(() => {
    crossfadeContent();
  }, [crossfadeContent]);

  const current = demos[activeDemo];

  return (
    <div ref={containerRef} className="opacity-0">
      {/* Header: title, description, tags, and Preview/Code toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{current.label}</h3>
          <p className="text-sm text-zinc-400 mb-2">{current.description}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {current.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleTabChange("preview")}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeTab === "preview"
                ? "bg-white/15 text-zinc-200 font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => handleTabChange("code")}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeTab === "code"
                ? "bg-white/15 text-zinc-200 font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Feature card with navigation arrows */}
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left arrow */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 z-10 w-10 h-10 rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all backdrop-blur-sm"
          aria-label="Previous demo"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 z-10 w-10 h-10 rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all backdrop-blur-sm"
          aria-label="Next demo"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Card */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-950">
          <div ref={contentRef}>
            {activeTab === "preview" ? (
              <div className="p-6">{current.children}</div>
            ) : (
              <Highlight
                theme={themes.nightOwl}
                code={current.code.trim()}
                language={current.language}
              >
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre className="overflow-x-auto p-6 text-sm leading-relaxed m-0 max-h-[500px]">
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        <span className="inline-block w-8 text-right mr-4 text-zinc-600 select-none text-xs">
                          {i + 1}
                        </span>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            )}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {demos.map((demo, i) => (
          <button
            key={demo.id}
            onClick={() => handleDemoChange(i)}
            aria-label={`Go to ${demo.label} demo`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === activeDemo
                ? "bg-white w-6"
                : "bg-white/25 w-2 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CodeShowcase;
