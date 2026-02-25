import React, { useState, useRef, useEffect, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { gsap } from "gsap";

interface Demo {
  id: string;
  label: string;
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

  const handleDemoChange = (idx: number) => {
    if (idx === activeDemo) return;
    const el = contentRef.current;
    if (!el) { setActiveDemo(idx); return; }
    gsap.to(el, {
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        setActiveDemo(idx);
        setActiveTab("preview");
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      },
    });
  };

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

  useEffect(() => {
    crossfadeContent();
  }, []);

  const current = demos[activeDemo];

  return (
    <div ref={containerRef} className="opacity-0">
      {/* Demo selector buttons + tags + Preview/Code toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {demos.map((demo, i) => (
          <button
            key={demo.id}
            onClick={() => handleDemoChange(i)}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
              activeDemo === i
                ? "bg-white text-black font-medium"
                : "border border-white/20 text-zinc-400 hover:text-white"
            }`}
          >
            {demo.label}
          </button>
        ))}

        <div className="flex flex-wrap items-center gap-1.5 ml-1">
          {current.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
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

      {/* Card */}
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-950">

        {/* Content area */}
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
                <pre className="overflow-x-auto p-6 text-sm leading-relaxed m-0">
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
  );
};

export default CodeShowcase;
