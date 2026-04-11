import React from "react";
import CaseStudyLayout, {
  Section,
  DeepDiveArticle,
  DeepDiveItem,
  DeepDiveFigure,
  DeepDiveVideo,
  FlowNode,
  FlowArrow,
} from "../../components/case-study/CaseStudyLayout";
import { DeepDiveCursorClaudeAside } from "../../components/case-study/DeveloperToolLogos";

const OPENAI_CHART_SRC = encodeURI("/openai chart.png");
const WINGMAN_FLOW_VIDEO_SRC = encodeURI("/ScreenRecording_04-10-2026 21-43-06_1.mov");

function WingmanYouTubeEmbed() {
  const [active, setActive] = React.useState(false);
  const [iframeVisible, setIframeVisible] = React.useState(false);
  const videoId = "Ag7EAF_djj4";
  const thumbSrc = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  React.useEffect(() => {
    if (!active) setIframeVisible(false);
  }, [active]);

  if (active) {
    return (
      <div className="relative h-full w-full">
        <img
          src={thumbSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <iframe
          className="absolute inset-0 h-full w-full transition-opacity duration-[700ms] ease-out"
          style={{ opacity: iframeVisible ? 1 : 0 }}
          src={iframeSrc}
          title="Wingman Commercial Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => {
            window.setTimeout(() => setIframeVisible(true), 200);
          }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="group relative w-full h-full outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      onClick={() => setActive(true)}
      aria-label="Play: Wingman Commercial Demo"
    >
      <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 transition-colors group-hover:bg-black/50">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/75 text-white shadow-lg ring-1 ring-white/25">
          <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </span>
      </span>
    </button>
  );
}

const EQ_METRICS = [
  { name: "COMM_DIRECTNESS", description: "How directly vs. indirectly you communicate", range: "Direct ↔ Indirect" },
  { name: "COMM_EMPATHY", description: "Tendency to lead with emotional understanding", range: "Analytical ↔ Empathetic" },
  { name: "EMO_INTENSITY", description: "How strongly emotions are experienced", range: "Reserved ↔ Intense" },
  { name: "EMO_REGULATION", description: "Ability to manage emotional responses", range: "Reactive ↔ Regulated" },
  { name: "REASSURANCE_NEED", description: "Need for external validation", range: "Self-assured ↔ Reassurance-seeking" },
  { name: "COMM_DETAIL_LEVEL", description: "Preference for detail vs. big picture", range: "Big picture ↔ Detail-oriented" },
  { name: "THINKING_SYSTEMATIC", description: "Structured vs. intuitive reasoning", range: "Intuitive ↔ Systematic" },
  { name: "CONFLICT_AVOIDANCE", description: "Tendency to avoid or engage conflict", range: "Engages ↔ Avoids" },
  { name: "CONFLICT_DIRECTNESS", description: "How directly conflicts are addressed", range: "Indirect ↔ Confrontational" },
  { name: "THINKING_ABSTRACTION", description: "Concrete vs. abstract thinking preference", range: "Concrete ↔ Abstract" },
  { name: "THINKING_VALUE_ORIENTATION", description: "Logic-driven vs. values-driven decisions", range: "Logic ↔ Values" },
  { name: "SOCIAL_ENERGY", description: "Energy from social interaction", range: "Introverted ↔ Extroverted" },
  { name: "CONFLICT_COLLABORATION", description: "Preference for collaborative resolution", range: "Independent ↔ Collaborative" },
];

function RadarDiagram() {
  const cx = 150, cy = 150, maxR = 120;
  const n = EQ_METRICS.length;

  const rings = [0.25, 0.5, 0.75, 1.0];
  const sampleValues = [0.28, 0.49, 0.20, 0.29, 0.28, -0.04, -0.35, 0.24, 0.49, 0.70, 0.23, -0.25, 0.63];

  const getPoint = (index: number, value: number) => {
    const angle = (2 * Math.PI * index) / n - Math.PI / 2;
    const normalizedValue = (value + 1) / 2;
    const r = normalizedValue * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const dataPoints = sampleValues.map((v, i) => getPoint(i, v));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto" aria-label="EQ Radar visualization">
      {rings.map((r) => (
        <polygon
          key={r}
          points={Array.from({ length: n }, (_, i) => {
            const angle = (2 * Math.PI * i) / n - Math.PI / 2;
            const radius = r * maxR;
            return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      ))}

      {Array.from({ length: n }, (_, i) => {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + maxR * Math.cos(angle)}
            y2={cy + maxR * Math.sin(angle)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        );
      })}

      <path d={dataPath} fill="rgba(52, 211, 153, 0.15)" stroke="rgba(52, 211, 153, 0.6)" strokeWidth={1.5} />

      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#34d399" />
      ))}
    </svg>
  );
}

export default function Wingman() {
  return (
    <CaseStudyLayout
      meta={{
        title: "Wingman",
        description:
          "A native iOS AI companion that uses a 13-metric emotional\u00A0intelligence framework to personalize every conversation — turning generic AI chat into a context-aware life coach, therapist, and thinking partner.",
        role: "Solo Designer & Developer",
        timeline: "2024 – Present (ongoing)",
        liveUrl: "https://apps.apple.com/us/app/wingman-eq-life-coach/id6747995730",
        liveLabel: "App Store",
        heroImage: "/Wingman WoG.png",
        heroImageAlt: "Wingman app icon",
        heroImageClassName: "w-24 h-24 md:w-28 md:h-28 object-contain",
      }}
      techStack={[
        "SwiftUI",
        "Xcode",
        "OpenRouter API",
        "Kimi K2.5",
        "iOS Development",
        "EQ Frameworks",
        "Figma",
        "Supabase",
        "Docker",
        "LLM Integration",
      ]}
    >
      {/* Context */}
      <Section label="Context" title="Why Generalized AI Falls Short">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <p>
              The smartest AI models in the world know nothing about you. Every conversation starts fresh — or altered by opaque memory systems. They function as generic PhD-level assistants, but without understanding <em>who you are</em>, they miss the nuance that makes advice actually land.
            </p>
            <p>
              Wingman started from a personal realization: AI as a therapist, coach, friend, psychologist, and ideation tool is extraordinarily powerful — but only when it understands your emotional patterns, communication style, and thinking tendencies. Not from a transcript history, but from a structured psychological profile that evolves with you.
            </p>
            <p>
              The thesis: emotional intelligence tracking fundamentally changes the quality of AI interaction. A model that sees your unique EQ score — understanding core metrics of how you think, feel, and communicate — can tailor responses in ways that feel genuinely personal.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 flex h-full flex-col gap-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">What Wingman Replaces</h3>
            <div className="space-y-3 text-sm text-zinc-300">
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 shrink-0 mt-0.5">01</span>
                <p>Generic ChatGPT conversations with no user context</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 shrink-0 mt-0.5">02</span>
                <p>Therapy apps that feel impersonal and scripted</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 shrink-0 mt-0.5">03</span>
                <p>Journaling apps with no intelligent feedback</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 shrink-0 mt-0.5">04</span>
                <p>Multiple AI subscriptions for different use cases</p>
              </div>
            </div>
            <div className="h-px bg-white/10" />
            <p className="text-xs text-zinc-500">
              Research basis: 68% of ChatGPT usage falls under practical guidance — exactly the use cases where personalized EQ context transforms the interaction quality.
            </p>
            <div className="mt-auto rounded-xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/15 via-emerald-400/10 to-teal-500/15 px-4 py-3">
              <p className="text-xs text-emerald-200/90">
                Wingman signal: personalized EQ context helps the model respond with more empathy, precision, and emotional fit.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* The 13-Metric EQ Framework */}
      <Section label="Core Innovation" title="The 13-Metric EQ Framework">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4 text-sm text-zinc-300 leading-relaxed">
            <p>
              Condensed from multiple open-source emotional intelligence frameworks based on <a href="https://openpsychometrics.org/" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white">openpsychometrics.org</a>, the system measures 13 psychological dimensions on a -1.0 to +1.0 scale with a baseline of 0.
            </p>
            <p>
              Scores fluctuate through daily check-in questions (Likert-scale) with calibrated weights based on psychometric foundations. Each question shifts specific metrics, fine-tuning the profile as users engage over time.
            </p>
            <p>
              On chat initialization, the full EQ profile loads into the system prompt alongside personalization settings (name, age, sex, personality type). The model — trained to interpret these metrics as user-specific emotional context — adjusts its communication style, depth, and approach accordingly.
            </p>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 mt-4">
              <RadarDiagram />
              <p className="text-xs text-zinc-500 text-center mt-3">
                Sample EQ radar — 13 axes, each metric represented as a point on the -1 to +1 range. Profile shape shifts with each daily check-in.
              </p>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="grid gap-1.5">
              {EQ_METRICS.map((metric, i) => (
                <div
                  key={metric.name}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-zinc-900/40 px-4 py-2.5"
                >
                  <span className="text-xs text-zinc-600 font-mono w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-200 font-mono">{metric.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{metric.description}</p>
                  </div>
                  <span className="text-xs text-zinc-600 hidden sm:block">{metric.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Approach */}
      <Section label="Approach" title="Technical Decisions">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-base font-semibold">Native iOS via SwiftUI</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Built native for the personal experience of having it on iPhone — and for the exclusivity that comes with Apple&apos;s ecosystem. When presented as a marketing final video in class, it drew visible reactions. Early development used Xcode&apos;s beta ChatGPT integration, but Cursor and Claude Code quickly proved more capable for the heavy lifting.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-base font-semibold">OpenRouter for LLM Access</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              OpenRouter provides a single API endpoint for switching between models as the landscape evolves. Current model: Kimi K2.5 — selected for scoring highest on emotional intelligence benchmarks while remaining in the top 10 for general intelligence. Previously used Kimi K2 (before image support) and GPT 5.2 for multimodal.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-base font-semibold">Cloud over Local LLMs</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Local model testing worked for prototyping but cloud services were the clear path for a public iOS release. The product is fundamentally a prompt service — the token cost scales with usage, and cloud deployment ensures consistent quality across all users without device-dependent performance issues.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-base font-semibold">Daily check-in (Likert 1–5)</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Wingman&apos;s daily check-in presents short Likert-scale questions (1–5) that map to the 13 EQ metrics. Each answer is weighted so scores shift in a psychometrically grounded way — the profile refines over time instead of resetting every chat. That signal pairs with the mood rating (also 1–5) so the model gets both stable traits and how you&apos;re feeling today before new threads start.
            </p>
          </div>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Architecture */}
      <Section label="Architecture" title="System Overview">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/30 p-6 md:p-8 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-[500px] justify-center flex-wrap md:flex-nowrap">
            <FlowNode label="iOS App" sub="SwiftUI" />
            <FlowArrow />
            <FlowNode label="OpenRouter" sub="API Gateway" />
            <FlowArrow />
            <FlowNode label="Kimi K2.5" sub="LLM Provider" />
          </div>
          <div className="flex items-center gap-3 mt-6 min-w-[500px] justify-center flex-wrap md:flex-nowrap">
            <FlowNode label="Daily Check-in" sub="Likert Questions" />
            <FlowArrow />
            <FlowNode label="EQ Engine" sub="13-Metric Calc" />
            <FlowArrow />
            <FlowNode label="System Prompt" sub="Profile Injection" />
          </div>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Key Details */}
      <Section label="Key Details" title="Deep Dives">
        <DeepDiveArticle>
          <DeepDiveItem
            number="01"
            title="Prompt Engineering as Product Design"
            aside={
              <DeepDiveFigure
                src={OPENAI_CHART_SRC}
                alt="Breakdown of ChatGPT usage categories: practical guidance, writing, seeking information, and other segments"
                caption="Why this matters: a huge share of ChatGPT use is practical guidance and support. Wingman targets that same job-to-be-done — then personalizes tone and depth using your EQ profile instead of a one-size-fits-all reply."
              />
            }
          >
            <p>
              The system prompt is the product. Different EQ profiles produce meaningfully different AI responses — not just in tone, but in the depth, structure, and type of support offered.
            </p>
            <p>
              This bridges design thinking and technical implementation: the &ldquo;UI&rdquo; of an AI product isn&apos;t only screens — it&apos;s the prompt architecture that shapes every interaction.
            </p>
            <p>
              Web search is intentionally off. Real-time news and Generative Engine Optimization (GEO) can skew answers; keeping the model in a closed context keeps responses steadier and more aligned with your profile.
            </p>
          </DeepDiveItem>

          <DeepDiveItem
            number="02"
            title="Onboarding & Daily Check-in UX"
            aside={
              <DeepDiveVideo src={WINGMAN_FLOW_VIDEO_SRC} />
            }
          >
            <p>
              Users open to a greeting, a 1–5 mood rating, and the Wingman button above the EQ radar. After mood, a daily insight appears; from there they can chat, browse history, or open settings.
            </p>
            <p>
              The bar is low friction: a few taps to log state, immediate value from the insight, and an obvious path into conversation. Optional settings carry profile, name, birthday (age for the model), and other personalization.
            </p>
          </DeepDiveItem>

          <DeepDiveItem
            number="03"
            title="Building AI Products Solo"
            aside={<DeepDiveCursorClaudeAside />}
          >
            <p>
              The development journey went through Xcode&apos;s beta AI features, then to Cursor and Claude Code working side by side. Python knowledge from AP Computer Science Principles (scored a 5) provided the foundation — SwiftUI was learned through the process of building, with AI tools handling the complexity gaps.
            </p>
            <p>
              The approach: function as your own agency. AI-assisted development unlocks the ability to build native apps, handle backend infrastructure, design UX, and iterate rapidly — all as a solo developer. Block coding concepts from high school translated directly into understanding how to architect and delegate to AI coding tools.
            </p>
          </DeepDiveItem>
        </DeepDiveArticle>
      </Section>

      {/* Commercial Demo */}
      <Section label="Demo" title="Commercial Video">
        <div className="aspect-video overflow-hidden rounded-2xl bg-zinc-900 border border-white/10">
          <WingmanYouTubeEmbed />
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Outcome */}
      <Section label="Outcome" title="Results & Reflection">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <p>
              The positive reinforcement from the EQ-calibrated responses is tangible — conversations feel personal, insights feel earned, and the daily check-in creates a rhythm of self-reflection that generic AI completely lacks. The best mental health tool for a 23-year-old new grad navigating an economic landscape of layoffs and uncertainty.
            </p>
            <p>
              Development continues alongside other projects. The journey from Wingman into AI-assisted development broadly — working within Cursor, Claude, Claude Code — has shaped a design philosophy focused on where the human creative touch makes the real difference.
            </p>
            <p className="text-zinc-400">
              New update coming May 2026.
            </p>
            <a
              href="https://apps.apple.com/us/app/wingman-eq-life-coach/id6747995730"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 px-5 py-3 hover:border-white/20 transition-colors w-fit"
            >
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <p className="text-[10px] text-zinc-400 leading-tight">Download on the</p>
                <p className="text-sm font-semibold text-white leading-tight">App Store</p>
              </div>
            </a>
          </div>
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <h3 className="text-base font-semibold text-zinc-100">Honest Reflection</h3>
            <p>
              Wingman was built with the ambition to be a breakout product. A business was formed around it, pitch competitions were entered, investors were approached. It didn&apos;t blow up — partly due to inexperience with fundraising pitches, discomfort with public speaking to crowds, and the challenge of marketing a deeply personal tool.
            </p>
            <p>
              But the journey itself was the product: networking, failing at pitches, being surprised by the people met along the way. The app brought curiosity, joy, and discovery. It&apos;s not everything — but it&apos;s still the first place to go when stuck in your own head.
            </p>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 mt-2">
              <p className="text-xs text-zinc-400">
                A life full of love, confidence, happiness, and strength — that&apos;s the pitch. Built for anyone who finds AI models genuinely smart and wants to unlock the best AI companion for anything in life.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </CaseStudyLayout>
  );
}
