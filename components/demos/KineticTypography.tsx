import React, { useState, useRef, useEffect, useCallback } from "react";

type EffectType = "wave" | "glitch" | "bounce" | "split" | "typewriter";

interface EffectOption {
  label: string;
  value: EffectType;
}

const EFFECTS: EffectOption[] = [
  { label: "Wave", value: "wave" },
  { label: "Glitch", value: "glitch" },
  { label: "Bounce", value: "bounce" },
  { label: "Split", value: "split" },
  { label: "Typewriter", value: "typewriter" },
];

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ffffff"];

const KineticTypography: React.FC = () => {
  const [text, setText] = useState("Creative Technologist");
  const [effect, setEffect] = useState<EffectType>("wave");
  const [speed, setSpeed] = useState(1);
  const [intensity, setIntensity] = useState(1);
  const [color, setColor] = useState("#ffffff");
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const applyEffect = useCallback(() => {
    const now = timeRef.current;
    const chars = charsRef.current;

    chars.forEach((el, i) => {
      if (!el) return;
      const offset = i * 0.15;
      const t = now * speed - offset;

      switch (effect) {
        case "wave": {
          const y = Math.sin(t * 3) * 12 * intensity;
          el.style.transform = `translateY(${y}px)`;
          el.style.opacity = "1";
          break;
        }
        case "glitch": {
          const glitchX = (Math.random() - 0.5) * 4 * intensity * (Math.sin(t * 8) > 0.7 ? 1 : 0);
          const glitchY = (Math.random() - 0.5) * 4 * intensity * (Math.sin(t * 8) > 0.7 ? 1 : 0);
          const skew = (Math.random() - 0.5) * 5 * intensity * (Math.sin(t * 6) > 0.8 ? 1 : 0);
          el.style.transform = `translate(${glitchX}px, ${glitchY}px) skewX(${skew}deg)`;
          el.style.opacity = Math.sin(t * 10) > 0.9 ? "0.3" : "1";
          break;
        }
        case "bounce": {
          const bounce = Math.abs(Math.sin(t * 2.5)) * 20 * intensity;
          const squash = 1 + Math.abs(Math.sin(t * 2.5)) * 0.15 * intensity;
          el.style.transform = `translateY(${-bounce}px) scaleX(${squash}) scaleY(${2 - squash})`;
          el.style.opacity = "1";
          break;
        }
        case "split": {
          const mid = chars.length / 2;
          const dist = (i - mid) * Math.sin(t * 1.5) * 3 * intensity;
          const rot = Math.sin(t * 2 + i * 0.3) * 10 * intensity;
          el.style.transform = `translateX(${dist}px) rotate(${rot}deg)`;
          el.style.opacity = "1";
          break;
        }
        case "typewriter": {
          const cycleLen = chars.length + 4;
          const pos = ((t * 3 + cycleLen) % (cycleLen * 2));
          const charVisible = pos < cycleLen ? pos >= i : pos < cycleLen * 2 - i;
          el.style.transform = "none";
          el.style.opacity = charVisible ? "1" : "0";
          break;
        }
      }
    });
  }, [effect, speed, intensity]);

  useEffect(() => {
    let running = true;
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (!running) return;
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      timeRef.current += delta;
      applyEffect();
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [applyEffect]);

  useEffect(() => {
    charsRef.current = charsRef.current.slice(0, text.length);
  }, [text]);

  const characters = text.split("");

  return (
    <div className="flex flex-col gap-6">
      {/* Animated text display */}
      <div
        ref={containerRef}
        className="flex items-center justify-center min-h-[140px] bg-zinc-900/50 rounded-xl border border-white/5 px-4 overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-0" aria-label={text} role="img">
          {characters.map((char, i) => (
            <span
              key={`${i}-${char}`}
              ref={(el) => { charsRef.current[i] = el; }}
              className="inline-block text-3xl md:text-5xl font-bold transition-none select-none"
              style={{
                color,
                willChange: "transform, opacity",
                minWidth: char === " " ? "0.3em" : undefined,
              }}
              aria-hidden="true"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text input */}
        <div className="md:col-span-2">
          <label className="text-xs text-zinc-400 mb-1 block">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value || " ")}
            maxLength={30}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            placeholder="Type something..."
          />
        </div>

        {/* Effect selector */}
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Effect</label>
          <div className="flex flex-wrap gap-1.5">
            {EFFECTS.map((e) => (
              <button
                key={e.value}
                onClick={() => setEffect(e.value)}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  effect === e.value
                    ? "bg-white text-black font-medium"
                    : "border border-white/20 text-zinc-400 hover:text-white"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color selector */}
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Color</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-all ${
                  color === c ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110" : "hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Speed */}
        <div>
          <label className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Speed</span>
            <span className="text-zinc-300 font-mono">{speed.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-white h-1"
          />
        </div>

        {/* Intensity */}
        <div>
          <label className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Intensity</span>
            <span className="text-zinc-300 font-mono">{intensity.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-white h-1"
          />
        </div>
      </div>
    </div>
  );
};

export default KineticTypography;
