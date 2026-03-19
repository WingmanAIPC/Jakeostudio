export const kineticTypographyCode = `import React, { useState, useRef, useEffect, useCallback } from "react";

type EffectType = "wave" | "glitch" | "bounce" | "split" | "typewriter";

const KineticTypography: React.FC = () => {
  const [text, setText] = useState("Design Technologist");
  const [effect, setEffect] = useState<EffectType>("wave");
  const [speed, setSpeed] = useState(1);
  const [intensity, setIntensity] = useState(1);
  const [color, setColor] = useState("#ffffff");
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const applyEffect = useCallback(() => {
    const now = timeRef.current;
    charsRef.current.forEach((el, i) => {
      if (!el) return;
      const offset = i * 0.15;
      const t = now * speed - offset;

      switch (effect) {
        case "wave": {
          const y = Math.sin(t * 3) * 12 * intensity;
          el.style.transform = \`translateY(\${y}px)\`;
          break;
        }
        case "glitch": {
          const glitch = (Math.random() - 0.5) * 4 * intensity;
          el.style.transform = \`translate(\${glitch}px, \${glitch}px)\`;
          el.style.opacity = Math.sin(t * 10) > 0.9 ? "0.3" : "1";
          break;
        }
        case "bounce": {
          const bounce = Math.abs(Math.sin(t * 2.5)) * 20 * intensity;
          el.style.transform = \`translateY(\${-bounce}px)\`;
          break;
        }
        case "split": {
          const mid = charsRef.current.length / 2;
          const dist = (i - mid) * Math.sin(t * 1.5) * 3 * intensity;
          el.style.transform = \`translateX(\${dist}px)\`;
          break;
        }
        case "typewriter": {
          const cycleLen = charsRef.current.length + 4;
          const pos = ((t * 3 + cycleLen) % (cycleLen * 2));
          el.style.opacity = pos >= i ? "1" : "0";
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
      timeRef.current += (now - lastTime) / 1000;
      lastTime = now;
      applyEffect();
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [applyEffect]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-center min-h-[140px]">
        {text.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => { charsRef.current[i] = el; }}
            style={{ color, willChange: "transform, opacity" }}
          >
            {char === " " ? "\\u00A0" : char}
          </span>
        ))}
      </div>
      {/* Controls: text input, effect selector, speed, intensity, color */}
    </div>
  );
};`;

export const miniWingmanCode = `import React, { useState, useRef, useEffect } from "react";

const SCALE_COLORS = ["#ef4444", "#f59e0b", "#a1a1aa", "#6ee7b7", "#10b981"];

interface LikertQuestion {
  id: string;
  text: string;
  dimension: string;
}

const QUESTIONS: LikertQuestion[] = [
  { id: "sa", text: "I can easily identify what I'm feeling.", dimension: "Self-Awareness" },
  { id: "em", text: "I naturally pick up on how others are feeling.", dimension: "Empathy" },
  { id: "mo", text: "I stay motivated even when things get difficult.", dimension: "Motivation" },
  { id: "ss", text: "I find it easy to navigate social situations.", dimension: "Social Skills" },
  { id: "sr", text: "When I feel a strong emotion, I can pause before reacting.", dimension: "Self-Regulation" },
];

interface Message { role: "assistant" | "user"; content: string; }

const MiniWingman: React.FC = () => {
  const [phase, setPhase] = useState<"likert" | "profile" | "chat">("likert");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Wingman branding: dark forest green (#14532d / #166534)
  // Likert buttons use a red-to-green color scale matching the iOS app
  // Progress bar and chat accents use Wingman green

  const handleAnswer = (value: number) => {
    const q = QUESTIONS[currentQ];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      const profile: Record<string, number> = {};
      QUESTIONS.forEach(q => { profile[q.dimension] = newAnswers[q.id] ?? 3; });
      setPhase("profile");
      setTimeout(() => {
        setPhase("chat");
        sendInitialMessage(profile);
      }, 2500);
    }
  };

  const sendInitialMessage = async (profile: Record<string, number>) => {
    setIsStreaming(true);
    const res = await fetch("/api/wingman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [], eqProfile: profile, isInitial: true }),
    });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    setMessages([{ role: "assistant", content: "" }]);
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
      setMessages([{ role: "assistant", content: fullText }]);
    }
    setIsStreaming(false);
  };

  // Likert scale with colored circles (red → orange → gray → green)
  // Wingman SVG logo replaces generic "W" badge
  // Chat UI with green-themed message bubbles and streaming
  // ...
};`;

export const songPosterCode = `import React, { useState } from "react";

const STYLE_DIRECTIONS = [
  "Swiss International Style", "Psychedelic Concert Poster",
  "Minimalist Bauhaus", "Risograph Print", "Japanese Woodblock",
  "Art Deco", "Soviet Constructivist", "Vaporwave",
  "Brutalist Typography", "Retro Futurism",
];

const SongPosterGenerator: React.FC = () => {
  const [song, setSong] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [styleName, setStyleName] = useState<string | null>(null);

  const generate = async (songInput?: string) => {
    const target = songInput || song;
    if (!target.trim()) return;
    setLoading(true);

    const res = await fetch("/api/poster", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song: target.trim() }),
    });

    const data = await res.json();
    setImageUrl(data.imageUrl);
    setStyleName(data.style);
    setLoading(false);
  };

  // API route builds a DALL-E 3 prompt with:
  // - Song name and artist extracted from input
  // - Randomized style direction from 10 design movements
  // - Visual elements inspired by the song's themes
  // - Poster-specific composition rules
  //
  // Example prompt for "Bohemian Rhapsody - Queen":
  // "Design a stunning music poster... Style: Psychedelic Concert Poster,
  //  1960s swirling organic lettering, vibrant saturated colors..."

  return (
    <div>
      <input
        type="text"
        value={song}
        onChange={(e) => setSong(e.target.value)}
        placeholder="e.g. Bohemian Rhapsody - Queen"
      />
      <button onClick={() => generate()}>Generate</button>
      {imageUrl && <img src={imageUrl} alt="Generated poster" />}
      {styleName && <span>{styleName}</span>}
      <button onClick={() => generate(song)}>Generate Another</button>
    </div>
  );
};`;

export const cardBuilderCode = `import React, { useState, useMemo } from "react";

type AnimationStyle = "float" | "pulse" | "spin" | "wobble" | "shimmer";
type WizardStep = "intro" | "name" | "icon" | "style" | "animation" | "message" | "done";

const GRADIENTS = [
  { label: "Indigo", value: "linear-gradient(135deg, #6366f1, #8b5cf6)", rgb: "99,102,241" },
  { label: "Sunset", value: "linear-gradient(135deg, #f97316, #ec4899)", rgb: "249,115,22" },
  { label: "Ocean", value: "linear-gradient(135deg, #06b6d4, #3b82f6)", rgb: "6,182,212" },
  // ... more gradient options with rgb values for glass tinting
];

const ContactCard: React.FC = () => {
  const [step, setStep] = useState<WizardStep>("intro");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🚀");
  const [gradientIdx, setGradientIdx] = useState(0);
  const [anim, setAnim] = useState<AnimationStyle>("float");
  const [isFlipped, setIsFlipped] = useState(false);

  const gradient = GRADIENTS[gradientIdx];

  // Glassmorphism card with backdrop-blur, translucent tint, and edge glow
  // Click-to-flip with CSS 3D transforms (preserve-3d + rotateY)
  // Atmospheric background: drifting gradient orbs + dot grid overlay
  // Step-by-step wizard: intro → name → icon → style → animation → message → done
  // On submit, data is saved to Supabase

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="card-preview" style={{ perspective: "800px" }}>
        <div
          onClick={() => setIsFlipped(f => !f)}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : undefined,
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Front: glass card with icon, name, divider */}
          <div style={{
            background: \`rgba(\${gradient.rgb}, 0.15)\`,
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: \`0 8px 32px rgba(\${gradient.rgb}, 0.25)\`,
          }}>
            <span>{icon}</span>
            <span>{name || "Your Name"}</span>
          </div>
          {/* Back: enlarged icon + "Contact Card" label */}
        </div>
      </div>
      <div className="wizard-step">
        {/* Renders current step with smooth transitions */}
      </div>
    </div>
  );
};`;
