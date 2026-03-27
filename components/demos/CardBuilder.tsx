import React, { useState, useRef, useEffect, useMemo } from "react";

type AnimationStyle = "float" | "pulse" | "spin" | "wobble" | "shimmer";
type WizardStep = "intro" | "name" | "icon" | "style" | "animation" | "message" | "done";

const ICONS = ["\u{1F680}", "\u{1F3A8}", "\u{1F4A1}", "\u{1F3B5}", "\u26A1", "\u{1F31F}", "\u{1F525}", "\u{1F30A}", "\u{1F3AF}", "\u{1F916}", "\u{1F9E0}", "\u{1F48E}"];

const GRADIENTS = [
  { label: "Indigo", value: "linear-gradient(135deg, #6366f1, #8b5cf6)", rgb: "99,102,241" },
  { label: "Sunset", value: "linear-gradient(135deg, #f97316, #ec4899)", rgb: "249,115,22" },
  { label: "Ocean", value: "linear-gradient(135deg, #06b6d4, #3b82f6)", rgb: "6,182,212" },
  { label: "Forest", value: "linear-gradient(135deg, #10b981, #059669)", rgb: "16,185,129" },
  { label: "Ember", value: "linear-gradient(135deg, #ef4444, #f59e0b)", rgb: "239,68,68" },
  { label: "Midnight", value: "linear-gradient(135deg, #1e1b4b, #6366f1)", rgb: "99,102,241" },
  { label: "Rose", value: "linear-gradient(135deg, #fb7185, #f472b6)", rgb: "251,113,133" },
  { label: "Slate", value: "linear-gradient(135deg, #334155, #64748b)", rgb: "100,116,139" },
];

const ANIMATIONS: { label: string; value: AnimationStyle }[] = [
  { label: "Float", value: "float" },
  { label: "Pulse", value: "pulse" },
  { label: "Spin", value: "spin" },
  { label: "Wobble", value: "wobble" },
  { label: "Shimmer", value: "shimmer" },
];

const STEP_ORDER: WizardStep[] = ["intro", "name", "icon", "style", "animation", "message", "done"];

const ANIMATION_CSS = `
  @keyframes cardFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(1deg); }
  }
  @keyframes cardPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }
  @keyframes cardSpin {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
  }
  @keyframes cardWobble {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(2deg); }
    75% { transform: rotate(-2deg); }
  }
  @keyframes cardShimmer {
    0% { filter: brightness(1); }
    50% { filter: brightness(1.15); }
    100% { filter: brightness(1); }
  }
  @keyframes orbDrift1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(20px, -15px) scale(1.1); }
    66% { transform: translate(-10px, 10px) scale(0.95); }
  }
  @keyframes orbDrift2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-15px, 20px) scale(0.9); }
    66% { transform: translate(25px, -5px) scale(1.05); }
  }
  @keyframes orbDrift3 {
    0%, 100% { transform: translate(0, 0) scale(1.05); }
    50% { transform: translate(10px, 15px) scale(0.95); }
  }
  @keyframes cardFlipIn {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(180deg); }
  }
  @keyframes cardFlipOut {
    0% { transform: rotateY(180deg); }
    100% { transform: rotateY(360deg); }
  }
`;

const ANIMATION_STYLE: Record<AnimationStyle, React.CSSProperties> = {
  float: { animation: "cardFloat 3s ease-in-out infinite" },
  pulse: { animation: "cardPulse 2s ease-in-out infinite" },
  spin: { animation: "cardSpin 4s linear infinite" },
  wobble: { animation: "cardWobble 2s ease-in-out infinite" },
  shimmer: { animation: "cardShimmer 2.5s ease-in-out infinite" },
};

const CardBuilder: React.FC = () => {
  const [step, setStep] = useState<WizardStep>("intro");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("\u{1F680}");
  const [gradientIdx, setGradientIdx] = useState(0);
  const [anim, setAnim] = useState<AnimationStyle>("float");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const [isFlipped, setIsFlipped] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const gradient = GRADIENTS[gradientIdx];

  const transition = (nextStep: WizardStep) => {
    setFadeClass("opacity-0 translate-y-2");
    setTimeout(() => {
      setStep(nextStep);
      setFadeClass("opacity-0 -translate-y-2");
      requestAnimationFrame(() => {
        setFadeClass("opacity-100 translate-y-0");
      });
    }, 200);
  };

  useEffect(() => {
    if (step === "name" && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [step]);

  const submit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          icon,
          bg_style: gradient.value,
          animation: anim,
          note: note.trim() || null,
        }),
      });

      if (!res.ok) {
        throw new Error(`Could not save your card (${res.status}). Try again.`);
      }
      transition("done");
    } catch (e) {
      const raw = e instanceof Error ? e.message : "Something went wrong.";
      const message =
        raw === "Failed to fetch"
          ? "Network error. Check your connection and try again."
          : raw;
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardClick = () => {
    if (anim === "spin") return;
    setIsFlipped((f) => !f);
  };

  const cardAnimStyle = useMemo(() => {
    if (anim === "spin") return ANIMATION_STYLE.spin;
    return ANIMATION_STYLE[anim];
  }, [anim]);

  const cardPreview = (
    <div
      className="flex items-center justify-center cursor-pointer"
      style={{ perspective: "800px" }}
      onClick={handleCardClick}
    >
      <div
        className="relative w-48 h-60 select-none"
        style={{
          transformStyle: "preserve-3d",
          transition: anim !== "spin" ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
          transform: isFlipped && anim !== "spin" ? "rotateY(180deg)" : undefined,
          ...cardAnimStyle,
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background: `linear-gradient(135deg, rgba(${gradient.rgb}, 0.15), rgba(${gradient.rgb}, 0.05))`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: `0 8px 32px rgba(${gradient.rgb}, 0.25), inset 0 0 0 1px rgba(255,255,255,0.08)`,
          }}
        >
          {/* Glass reflection */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)",
              borderRadius: "inherit",
            }}
          />
          {/* Gradient tint edge */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: gradient.value,
              opacity: 0.08,
            }}
          />
          <span className="text-4xl mb-3 relative z-10">{icon}</span>
          <span className="text-white font-semibold text-sm tracking-wide px-4 text-center relative z-10 drop-shadow-sm">
            {name || "Your Name"}
          </span>
          <div className="w-12 h-0.5 rounded mt-2 relative z-10" style={{ backgroundColor: `rgba(${gradient.rgb}, 0.4)` }} />
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, rgba(${gradient.rgb}, 0.2), rgba(${gradient.rgb}, 0.08))`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: `0 8px 32px rgba(${gradient.rgb}, 0.25), inset 0 0 0 1px rgba(255,255,255,0.08)`,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)",
              borderRadius: "inherit",
            }}
          />
          <span className="text-6xl mb-2 relative z-10">{icon}</span>
          <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] relative z-10">Contact Card</span>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case "intro":
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <h3 className="text-lg font-semibold text-white">Contact Card</h3>
            <p className="text-sm text-zinc-400 max-w-xs">
              Create a personal networking card to connect with Jake.
            </p>
            <button
              onClick={() => transition("name")}
              className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </button>
          </div>
        );

      case "name":
        return (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-zinc-400">What&apos;s your name?</p>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              placeholder="Enter your name"
              className="bg-zinc-900 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white text-center placeholder:text-zinc-600 focus:outline-none focus:border-white/30 w-56"
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) transition("icon"); }}
            />
            <button
              onClick={() => transition("icon")}
              disabled={!name.trim()}
              className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-40"
            >
              Next
            </button>
          </div>
        );

      case "icon":
        return (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-zinc-400">Pick your icon</p>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                    icon === ic
                      ? "bg-white/20 ring-2 ring-white/50 scale-110"
                      : "bg-zinc-800 hover:bg-zinc-700 hover:scale-105"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
            <button
              onClick={() => transition("style")}
              className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Next
            </button>
          </div>
        );

      case "style":
        return (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-zinc-400">Choose your style</p>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENTS.map((g, i) => (
                <button
                  key={g.label}
                  onClick={() => setGradientIdx(i)}
                  className={`w-12 h-12 rounded-xl transition-all ${
                    gradientIdx === i ? "ring-2 ring-white/50 scale-110" : "hover:scale-105"
                  }`}
                  style={{ background: g.value }}
                  aria-label={g.label}
                />
              ))}
            </div>
            <button
              onClick={() => transition("animation")}
              className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Next
            </button>
          </div>
        );

      case "animation":
        return (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-zinc-400">Choose an animation</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {ANIMATIONS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => { setAnim(a.value); setIsFlipped(false); }}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                    anim === a.value
                      ? "bg-white text-black font-medium"
                      : "border border-white/20 text-zinc-400 hover:text-white"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => transition("message")}
              className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Next
            </button>
          </div>
        );

      case "message":
        return (
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <p className="text-sm text-zinc-400">Leave a note for Jake</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (optional)"
              className="w-full bg-zinc-900 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30"
            />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Say hi, leave feedback, anything..."
              maxLength={280}
              rows={3}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 resize-none"
            />
            <button
              onClick={submit}
              disabled={submitting}
              className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Card"}
            </button>
            {submitError ? (
              <p className="text-xs text-red-400 text-center max-w-xs" role="alert">
                {submitError}
              </p>
            ) : null}
          </div>
        );

      case "done":
        return (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl">
              &#x2713;
            </div>
            <h3 className="text-lg font-semibold text-white">Card Sent!</h3>
            <p className="text-sm text-zinc-400 max-w-xs">
              Thanks, {name}! Jake will see your card.
            </p>
          </div>
        );
    }
  };

  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = step === "done" ? 100 : (stepIndex / (STEP_ORDER.length - 1)) * 100;

  return (
    <div className="flex flex-col gap-6 min-h-[420px]">
      <style>{ANIMATION_CSS}</style>

      {step !== "done" && (
        <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Card preview with atmospheric background */}
        <div className="relative flex items-center justify-center min-h-[280px] rounded-xl border border-white/5 overflow-hidden bg-zinc-950/80">
          {/* Gradient orbs */}
          <div
            className="absolute w-40 h-40 rounded-full blur-[60px] opacity-30"
            style={{
              background: `radial-gradient(circle, rgba(${gradient.rgb}, 0.6), transparent)`,
              top: "10%",
              left: "10%",
              animation: "orbDrift1 8s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-32 h-32 rounded-full blur-[50px] opacity-20"
            style={{
              background: `radial-gradient(circle, rgba(${gradient.rgb}, 0.5), transparent)`,
              bottom: "15%",
              right: "10%",
              animation: "orbDrift2 10s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-24 h-24 rounded-full blur-[40px] opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent)",
              top: "50%",
              left: "50%",
              marginTop: "-48px",
              marginLeft: "-48px",
              animation: "orbDrift3 12s ease-in-out infinite",
            }}
          />

          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10">
            {cardPreview}
          </div>

          {anim !== "spin" && (
            <p className="absolute bottom-3 text-[9px] text-zinc-600 z-10">tap card to flip</p>
          )}
        </div>

        {/* Wizard step */}
        <div className={`flex items-center justify-center transition-all duration-200 ${fadeClass}`}>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default CardBuilder;
