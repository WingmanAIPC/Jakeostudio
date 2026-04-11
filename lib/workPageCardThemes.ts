/**
 * Case study cards on /work — shared dark default (like “What I offer”); hover restores each project’s light theme.
 */
export type WorkCardThemeKey = "wingman" | "cloverleaf" | "biro";

export type WorkCardTheme = {
  /** Link / card shell */
  surface: string;
  surfaceHover: string;
  /** Absolute gradient overlay (Tailwind bg-gradient-to-br + opacity via group-hover in page) */
  gradient: string;
  kicker: string;
  title: string;
  subtitle: string;
  body: string;
  tag: string;
  /** “Case study →” pill */
  cta: string;
};

export const WORK_PAGE_CARD_THEMES: Record<WorkCardThemeKey, WorkCardTheme> = {
  wingman: {
    /** Default: match “What I offer” cards; hover: previous light emerald card + CTA. */
    surface:
      "border-white/10 bg-zinc-900/35 transition-all duration-300 ease-out",
    surfaceHover:
      "hover:border-emerald-500 hover:bg-white hover:shadow-lg hover:shadow-emerald-600/20",
    gradient: "from-emerald-400/20 via-emerald-500/5 to-green-600/15",
    kicker: "text-zinc-500 group-hover:text-emerald-700",
    title: "text-white group-hover:text-emerald-950",
    subtitle: "text-zinc-300 group-hover:text-emerald-900",
    body: "text-zinc-400 group-hover:text-emerald-950",
    tag: "border-white/10 bg-white/10 text-zinc-200 group-hover:border-emerald-300/90 group-hover:bg-emerald-100 group-hover:text-emerald-950",
    cta:
      "border-2 border-white/25 bg-white/[0.08] text-zinc-200 transition-colors duration-300 group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-[0_0_20px_-12px_rgba(5,150,105,0.45)]",
  },
  cloverleaf: {
    /** Default: same dark shell as Wingman; hover: previous light green card. */
    surface:
      "border-white/10 bg-zinc-900/35 transition-all duration-300 ease-out",
    surfaceHover:
      "hover:bg-white hover:border-[#79E000] hover:shadow-lg hover:shadow-[#10A142]/20",
    gradient: "from-[#79E000]/25 via-[#10A142]/8 to-[#074522]/15",
    kicker: "text-zinc-500 group-hover:text-[#0d7a32]",
    title: "text-white group-hover:text-[#052e12]",
    subtitle: "text-zinc-300 group-hover:text-[#052e12]",
    body: "text-zinc-400 group-hover:text-[#052e12]",
    tag: "border-white/10 bg-white/10 text-zinc-200 group-hover:border-[#10A142]/60 group-hover:bg-white group-hover:text-[#052e12]",
    cta:
      "border-2 border-white/25 bg-white/[0.08] text-zinc-200 transition-colors duration-300 group-hover:border-[#10A142] group-hover:bg-[#10A142] group-hover:text-white group-hover:shadow-[0_0_20px_-12px_rgba(16,161,66,0.35)]",
  },
  biro: {
    /** Default: same dark shell as Wingman; hover: previous light orange card. */
    surface:
      "border-white/10 bg-zinc-900/35 transition-all duration-300 ease-out",
    surfaceHover:
      "hover:bg-white hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/25",
    gradient: "from-orange-500/20 via-slate-900/[0.07] to-blue-950/20",
    kicker: "text-zinc-500 group-hover:text-orange-700",
    title: "text-white group-hover:text-slate-950",
    subtitle: "text-zinc-300 group-hover:text-slate-800",
    body: "text-zinc-400 group-hover:text-slate-800",
    tag: "border-white/10 bg-white/10 text-zinc-200 group-hover:border-slate-300 group-hover:bg-white group-hover:text-slate-900",
    cta:
      "border-2 border-white/25 bg-white/[0.08] text-zinc-200 transition-colors duration-300 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_0_20px_-12px_rgba(249,115,22,0.35)]",
  },
};
