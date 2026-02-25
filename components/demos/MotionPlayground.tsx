import React, { useState, useCallback } from "react";

const EASING_OPTIONS = [
  { label: "ease", value: "ease" },
  { label: "ease-in-out", value: "ease-in-out" },
  { label: "ease-in", value: "ease-in" },
  { label: "ease-out", value: "ease-out" },
  { label: "linear", value: "linear" },
  { label: "spring", value: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" },
];

const TRANSFORM_OPTIONS = [
  { label: "Scale", value: "scale", unit: "", range: [0.5, 2], step: 0.05, default: 1 },
  { label: "Rotate", value: "rotate", unit: "deg", range: [0, 360], step: 5, default: 0 },
  { label: "TranslateY", value: "translateY", unit: "px", range: [-60, 60], step: 2, default: 0 },
  { label: "Skew", value: "skewX", unit: "deg", range: [-30, 30], step: 1, default: 0 },
];

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const SHADOW_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Soft", value: "0 8px 24px -4px" },
  { label: "Hard", value: "0 4px 0 0" },
  { label: "Glow", value: "0 0 24px 4px" },
];

interface MotionState {
  duration: number;
  easing: string;
  transformType: number;
  transformValue: number;
  hoverColor: string;
  hoverShadow: string;
  hoverBorderRadius: number;
}

const BASE_COLOR = "#6366f1";

const DEFAULTS: MotionState = {
  duration: 500,
  easing: "ease-in-out",
  transformType: 0,
  transformValue: 1.15,
  hoverColor: "#ec4899",
  hoverShadow: "0 8px 24px -4px",
  hoverBorderRadius: 12,
};

const MotionPlayground: React.FC = () => {
  const [state, setState] = useState<MotionState>({ ...DEFAULTS });
  const [isHovered, setIsHovered] = useState(false);

  const transform = TRANSFORM_OPTIONS[state.transformType];

  const buildTransform = (val: number) =>
    transform.unit === ""
      ? `${transform.value}(${val})`
      : `${transform.value}(${val}${transform.unit})`;

  const baseStyle: React.CSSProperties = {
    transition: `all ${state.duration}ms ${state.easing}`,
    transform: buildTransform(transform.default),
    backgroundColor: BASE_COLOR,
    borderRadius: 12,
    boxShadow: "none",
  };

  const hoveredStyle: React.CSSProperties = {
    ...baseStyle,
    transform: buildTransform(state.transformValue),
    backgroundColor: state.hoverColor,
    borderRadius: state.hoverBorderRadius,
    boxShadow:
      state.hoverShadow === "none"
        ? "none"
        : `${state.hoverShadow} ${state.hoverColor}66`,
  };

  const cardStyle = isHovered ? hoveredStyle : baseStyle;

  const randomize = useCallback(() => {
    const ti = Math.floor(Math.random() * TRANSFORM_OPTIONS.length);
    const t = TRANSFORM_OPTIONS[ti];
    const range = t.range[1] - t.range[0];
    const val = t.range[0] + Math.random() * range;
    const snapped = Math.round(val / t.step) * t.step;

    setState({
      duration: Math.round((200 + Math.random() * 1300) / 50) * 50,
      easing: EASING_OPTIONS[Math.floor(Math.random() * EASING_OPTIONS.length)].value,
      transformType: ti,
      transformValue: snapped,
      hoverColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      hoverShadow: SHADOW_OPTIONS[Math.floor(Math.random() * SHADOW_OPTIONS.length)].value,
      hoverBorderRadius: [4, 12, 24, 50][Math.floor(Math.random() * 4)],
    });
  }, []);

  const reset = useCallback(() => {
    setState({ ...DEFAULTS });
  }, []);

  const setTransformType = (idx: number) => {
    const t = TRANSFORM_OPTIONS[idx];
    const defaultHover = idx === 0 ? 1.15 : t.range[1] * 0.3;
    setState((s) => ({ ...s, transformType: idx, transformValue: Math.round(defaultHover / t.step) * t.step }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card preview */}
      <div className="flex items-center justify-center min-h-[240px] bg-zinc-900/50 rounded-xl border border-white/5">
        <div
          style={cardStyle}
          className="w-28 h-36 flex flex-col items-center justify-center shadow-lg cursor-pointer select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-8 h-8 rounded-full bg-white/30 mb-2" />
          <div className="w-14 h-1.5 rounded bg-white/40 mb-1" />
          <div className="w-10 h-1.5 rounded bg-white/25" />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Duration */}
        <div>
          <label className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Duration</span>
            <span className="text-zinc-300 font-mono">{state.duration}ms</span>
          </label>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={state.duration}
            onChange={(e) => setState((s) => ({ ...s, duration: Number(e.target.value) }))}
            className="w-full accent-white h-1"
          />
        </div>

        {/* Easing */}
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Easing</label>
          <div className="flex flex-wrap gap-1.5">
            {EASING_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setState((s) => ({ ...s, easing: opt.value }))}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  state.easing === opt.value
                    ? "bg-white text-black font-medium"
                    : "border border-white/20 text-zinc-400 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transform type */}
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Transform</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {TRANSFORM_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => setTransformType(i)}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  state.transformType === i
                    ? "bg-white text-black font-medium"
                    : "border border-white/20 text-zinc-400 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>{transform.label}</span>
            <span className="text-zinc-300 font-mono">
              {state.transformValue.toFixed(transform.unit === "" ? 2 : 0)}
              {transform.unit}
            </span>
          </div>
          <input
            type="range"
            min={transform.range[0]}
            max={transform.range[1]}
            step={transform.step}
            value={state.transformValue}
            onChange={(e) => setState((s) => ({ ...s, transformValue: Number(e.target.value) }))}
            className="w-full accent-white h-1"
          />
        </div>

        {/* Hover color */}
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Hover Color</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setState((s) => ({ ...s, hoverColor: c }))}
                className={`w-6 h-6 rounded-full transition-all ${
                  state.hoverColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110" : "hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Select hover color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Shadow + Border Radius */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Shadow</label>
            <div className="flex flex-wrap gap-1.5">
              {SHADOW_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setState((s) => ({ ...s, hoverShadow: opt.value }))}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    state.hoverShadow === opt.value
                      ? "bg-white text-black font-medium"
                      : "border border-white/20 text-zinc-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Radius</span>
              <span className="text-zinc-300 font-mono">{state.hoverBorderRadius}px</span>
            </label>
            <input
              type="range"
              min={0}
              max={50}
              step={2}
              value={state.hoverBorderRadius}
              onChange={(e) => setState((s) => ({ ...s, hoverBorderRadius: Number(e.target.value) }))}
              className="w-full accent-white h-1"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={randomize}
            className="px-3 py-1.5 text-xs rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
          >
            Randomize
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-xs rounded-full border border-white/20 text-zinc-400 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotionPlayground;
