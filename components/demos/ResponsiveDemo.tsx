import React, { useState, useRef, useCallback, useEffect } from "react";

const BREAKPOINTS = [
  { label: "Mobile", maxWidth: 480, cols: 1, color: "#ef4444" },
  { label: "Tablet", maxWidth: 768, cols: 2, color: "#f59e0b" },
  { label: "Desktop", maxWidth: Infinity, cols: 4, color: "#10b981" },
];

const CARDS = [
  { title: "Analytics", icon: "📊" },
  { title: "Settings", icon: "⚙️" },
  { title: "Messages", icon: "💬" },
  { title: "Profile", icon: "👤" },
  { title: "Calendar", icon: "📅" },
  { title: "Storage", icon: "📁" },
  { title: "Reports", icon: "📈" },
  { title: "Security", icon: "🔒" },
];

const ResponsiveDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [isDragging, setIsDragging] = useState(false);
  const [maxWidth, setMaxWidth] = useState(800);

  useEffect(() => {
    const updateMax = () => {
      if (containerRef.current?.parentElement) {
        setMaxWidth(containerRef.current.parentElement.clientWidth - 32);
      }
    };
    updateMax();
    window.addEventListener("resize", updateMax);
    return () => window.removeEventListener("resize", updateMax);
  }, []);

  const activeBreakpoint = BREAKPOINTS.find((bp) => containerWidth <= bp.maxWidth) || BREAKPOINTS[2];
  const cols = activeBreakpoint.cols;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startWidth = containerWidth;

    const handleMouseMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      const newWidth = Math.max(280, Math.min(maxWidth, startWidth + delta));
      setContainerWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [containerWidth, maxWidth]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    const startX = e.touches[0].clientX;
    const startWidth = containerWidth;

    const handleTouchMove = (ev: TouchEvent) => {
      const delta = ev.touches[0].clientX - startX;
      const newWidth = Math.max(280, Math.min(maxWidth, startWidth + delta));
      setContainerWidth(newWidth);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  }, [containerWidth, maxWidth]);

  return (
    <div>
      {/* Breakpoint indicators */}
      <div className="flex items-center gap-3 mb-4">
        {BREAKPOINTS.map((bp) => (
          <div key={bp.label} className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                activeBreakpoint.label === bp.label ? "scale-125" : "opacity-40"
              }`}
              style={{ backgroundColor: bp.color }}
            />
            <span
              className={`text-xs transition-colors ${
                activeBreakpoint.label === bp.label ? "text-zinc-200 font-medium" : "text-zinc-600"
              }`}
            >
              {bp.label}
              {bp.maxWidth < Infinity && ` ≤${bp.maxWidth}px`}
            </span>
          </div>
        ))}
        <span className="text-xs font-mono text-zinc-500 ml-auto">
          {Math.round(containerWidth)}px
        </span>
      </div>

      {/* Resizable container */}
      <div className="relative" ref={containerRef}>
        <div
          className="relative border border-white/10 rounded-xl overflow-hidden bg-zinc-900/50 transition-[border-color] duration-300"
          style={{
            width: `${containerWidth}px`,
            maxWidth: "100%",
            borderColor: `${activeBreakpoint.color}33`,
          }}
        >
          <div
            className="p-4 grid gap-3 transition-all duration-300"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {CARDS.map((card) => (
              <div
                key={card.title}
                className="bg-zinc-800/80 border border-white/5 rounded-lg p-3 flex items-center gap-2 transition-all duration-300"
              >
                <span className="text-base">{card.icon}</span>
                <span className="text-xs text-zinc-300 truncate">{card.title}</span>
              </div>
            ))}
          </div>

          {/* Drag handle */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`absolute top-0 right-0 bottom-0 w-3 cursor-col-resize flex items-center justify-center group transition-colors ${
              isDragging ? "bg-white/10" : "hover:bg-white/5"
            }`}
            aria-label="Drag to resize container"
            role="separator"
          >
            <div className={`w-0.5 h-8 rounded-full transition-colors ${isDragging ? "bg-white/40" : "bg-white/20 group-hover:bg-white/30"}`} />
          </div>
        </div>
      </div>

      {/* Width slider fallback for mobile */}
      <div className="mt-3 md:hidden">
        <input
          type="range"
          min={280}
          max={maxWidth}
          value={containerWidth}
          onChange={(e) => setContainerWidth(Number(e.target.value))}
          className="w-full accent-white h-1"
          aria-label="Container width"
        />
      </div>

    </div>
  );
};

export default ResponsiveDemo;
