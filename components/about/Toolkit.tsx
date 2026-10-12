import React from "react";
import { toolStackIconMap, toolStackPillTheme } from "../../lib/toolStackIcons";
import Reveal from "../studio/Reveal";
import Sparkle from "../studio/Sparkle";
import studio from "../studio/studio.module.css";
import about from "./about.module.css";

/** Labels must match keys in lib/toolStackIcons.tsx to pick up an icon and colour. */
const TOOL_CATEGORIES = [
  {
    label: "AI & Development",
    items: ["Cursor", "Claude Code", "ChatGPT", "OpenRouter", "Prompt Engineering"],
  },
  {
    label: "Front-End & Engineering",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "SwiftUI",
      "REST APIs",
      "Node.js",
    ],
  },
  {
    label: "Design & Prototyping",
    items: ["Figma", "Photoshop", "Illustrator", "Affinity"],
  },
  {
    label: "Motion & Video",
    items: ["After Effects", "Premiere Pro", "CapCut", "Riverside"],
  },
  {
    label: "Platforms & Infrastructure",
    items: ["Vercel", "Supabase", "Stripe", "GitHub", "HubSpot"],
  },
];

const pad = (n: number) => String(n).padStart(2, "0");
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

export default function Toolkit() {
  return (
    <section className={about.section} aria-labelledby="toolkit-title">
      <Reveal>
        <p className={`${studio.label} ${studio.labelRow} ${studio.reveal}`}>
          <Sparkle />
          <span>Toolkit</span>
        </p>
        <h2 id="toolkit-title" className={about.sectionTitle}>
          <span className={studio.mask}>
            <span style={i(1)}>Tools</span>
          </span>
          <span className={studio.mask}>
            <span style={i(2)}>
              <em className={about.outline}>&amp; stack.</em>
            </span>
          </span>
        </h2>
      </Reveal>

      <div className={about.toolGroups}>
        {TOOL_CATEGORIES.map((cat) => (
          <Reveal key={cat.label} className={about.toolGroup}>
            <h3 className={`${studio.label} ${about.toolGroupHead} ${studio.reveal}`}>
              <span className={about.toolGroupName}>{cat.label}</span>
              <span>{pad(cat.items.length)}</span>
            </h3>
            <ul className={about.tools}>
              {cat.items.map((item, n) => {
                const Icon = toolStackIconMap[item];
                const tone = toolStackPillTheme[item]?.color;
                return (
                  <li
                    key={item}
                    className={`${about.tool} ${studio.reveal}`}
                    style={
                      {
                        "--i": n * 0.6 + 1,
                        ...(tone ? { "--tone": tone } : null),
                      } as React.CSSProperties
                    }
                  >
                    {Icon ? <Icon className={about.toolIcon} aria-hidden /> : null}
                    {item}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
