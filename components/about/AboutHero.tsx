import React, { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { TbLayersIntersect, TbRocket, TbSchool, TbTrophy } from "react-icons/tb";
import {
  SITE_CONTACT_EMAIL,
  SITE_LOGO_HEADER_SRC,
  SITE_MAILTO_HREF,
} from "../../lib/siteNav";
import Reveal, { useInView } from "../studio/Reveal";
import Sparkle from "../studio/Sparkle";
import studio from "../studio/studio.module.css";
import about from "./about.module.css";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/** Counts up to `to` the first time it scrolls into view. */
function CountUp({ to, duration = 1500 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * eased).toLocaleString("en-US");
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref}>{to.toLocaleString("en-US")}</span>;
}

const FACTS: {
  icon: IconType;
  label: string;
  figure: React.ReactNode;
  text: string;
}[] = [
  {
    icon: TbTrophy,
    label: "Adobe ACA · 2021",
    figure: (
      <>
        1st <small>of <CountUp to={44000} /></small>
      </>
    ),
    text: "Adobe US National Champion, first place out of 44,000 students.",
  },
  {
    icon: TbSchool,
    label: "Education · 2025",
    figure: "BFA",
    text: "Graphic Design, University of Dayton.",
  },
  {
    icon: TbLayersIntersect,
    label: "Range",
    figure: (
      <>
        <CountUp to={5} duration={900} /> <small>disciplines</small>
      </>
    ),
    text: "Graphic design, motion and video production, live sports broadcasting, web development, and AI product design.",
  },
  {
    icon: TbRocket,
    label: "Currently",
    figure: "Now",
    text: "Building with Biro Sales Inc. and maintaining Wingman.",
  },
];

export default function AboutHero() {
  // Entrance runs once the page has painted.
  const [on, setOn] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(r);
  }, []);

  return (
    <header className={about.hero}>
      <div className={studio.field} aria-hidden />
      <div className={studio.wrap}>
        <div className={about.heroGrid} data-inview={on ? "" : undefined}>
          <div>
            <p className={`${studio.label} ${studio.labelRow} ${studio.reveal}`}>
              <Sparkle spin />
              <span>About</span>
            </p>
            <h1 className={about.name}>
              <span className={studio.mask}>
                <span style={i(1)}>Jake</span>
              </span>
              <span className={studio.mask}>
                <span style={i(2)}>Owens</span>
              </span>
            </h1>
            <p className={`${about.role} ${studio.reveal}`} style={i(4)}>
              <span>Creative Technologist</span>
              <span className={`${studio.label} ${about.cycle}`} aria-hidden>
                <span style={{ "--n": 0 } as React.CSSProperties}>Design</span>
                <span style={{ "--n": 1 } as React.CSSProperties}>Film</span>
                <span style={{ "--n": 2 } as React.CSSProperties}>Software</span>
              </span>
            </p>
            <p className={`${about.tagline} ${studio.reveal}`} style={i(5)}>
              Always learning what&apos;s needed to build what matters.
            </p>
          </div>

          <aside className={`${about.card} ${studio.reveal}`} style={i(6)} aria-label="Profile">
            <div className={`${studio.label} ${about.cardHead}`}>
              <span>Profile</span>
              <span>jakeostudio</span>
            </div>
            <div className={about.cardBody}>
              <span className={about.mark}>
                <img src={SITE_LOGO_HEADER_SRC} alt="" />
              </span>
              <div>
                <p className={about.cardName}>Jake Owens</p>
                <p className={studio.label}>Design / Film / Software</p>
              </div>
            </div>
            <dl className={about.cardRows}>
              <div className={about.cardRow}>
                <dt className={studio.label}>Role</dt>
                <dd>Creative Technologist</dd>
              </div>
              <div className={about.cardRow}>
                <dt className={studio.label}>Works on</dt>
                <dd>Brands, websites, apps, and film</dd>
              </div>
              <div className={about.cardRow}>
                <dt className={studio.label}>Based</dt>
                <dd>USA</dd>
              </div>
              <div className={about.cardRow}>
                <dt className={studio.label}>Contact</dt>
                <dd>
                  <a href={SITE_MAILTO_HREF}>{SITE_CONTACT_EMAIL}</a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <Reveal as="ul" className={about.facts} aria-label="Background">
          {FACTS.map((f, n) => (
            <li key={f.label} className={about.fact}>
              <div className={`${studio.label} ${about.factTop} ${studio.reveal}`} style={i(n)}>
                <span>{f.label}</span>
                <f.icon className={about.factIcon} strokeWidth={1.5} aria-hidden />
              </div>
              <p className={`${about.factFigure} ${studio.reveal}`} style={i(n + 1)}>
                {f.figure}
              </p>
              <p className={`${about.factText} ${studio.reveal}`} style={i(n + 2)}>
                {f.text}
              </p>
            </li>
          ))}
        </Reveal>
      </div>
    </header>
  );
}
