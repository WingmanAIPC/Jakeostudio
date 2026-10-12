import React from "react";
import type { IconType } from "react-icons";
import {
  TbComponents,
  TbMovie,
  TbSparkles,
  TbTerminal2,
  TbVectorBezier2,
} from "react-icons/tb";
import { CAPABILITY_CARDS, type CapabilityIcon } from "../../lib/capabilities";
import Reveal from "../studio/Reveal";
import Sparkle from "../studio/Sparkle";
import studio from "../studio/studio.module.css";
import work from "./work.module.css";

const ICONS: Record<CapabilityIcon, IconType> = {
  technologist: TbSparkles,
  fullstack: TbTerminal2,
  product: TbComponents,
  motion: TbMovie,
  graphic: TbVectorBezier2,
};

const pad = (n: number) => String(n).padStart(2, "0");
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

export default function Capabilities() {
  return (
    <section className={work.section} aria-labelledby="capabilities-title">
      <div className={studio.wrap}>
        <Reveal className={work.sectionHead}>
          <div>
            <p className={`${studio.label} ${studio.labelRow} ${studio.reveal}`}>
              <Sparkle />
              <span>Capabilities</span>
            </p>
            <h2 id="capabilities-title" className={work.sectionTitle}>
              <span className={studio.mask}>
                <span style={i(1)}>One person.</span>
              </span>
              <span className={studio.mask}>
                <span style={i(2)}>
                  <em className={work.outline}>The whole pipeline.</em>
                </span>
              </span>
            </h2>
          </div>
          <p className={`${work.sectionLead} ${studio.reveal}`} style={i(4)}>
            Strategy, identity, interface, code, and the film that launches it.
            No handoffs, nothing lost in translation.
          </p>
        </Reveal>

        <Reveal as="ul" className={work.capGrid}>
          {CAPABILITY_CARDS.map((card, n) => {
            const Icon = ICONS[card.icon];
            return (
              <li key={card.title} className={work.cap}>
                <div className={`${work.capTop} ${studio.reveal}`} style={i(n)}>
                  <span className={work.capIdx}>C/{pad(n + 1)}</span>
                  <Icon className={work.capIcon} strokeWidth={1.4} aria-hidden />
                </div>
                <h3 className={`${work.capTitle} ${studio.reveal}`} style={i(n + 1)}>
                  {card.title}
                </h3>
                <p className={`${work.capDesc} ${studio.reveal}`} style={i(n + 2)}>
                  {card.desc}
                </p>
                <ul className={`${work.capTools} ${studio.reveal}`} style={i(n + 3)}>
                  {card.tools.map((t) => (
                    <li key={t} className={work.capTool}>
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
