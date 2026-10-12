import React, { useEffect, useRef, useState } from "react";
import { TbArrowDown } from "react-icons/tb";
import type { WorkEntry } from "../../lib/workIndex";
import { scrollToId } from "../../lib/scrollToId";
import Marquee from "../studio/Marquee";
import Sparkle from "../studio/Sparkle";
import studio from "../studio/studio.module.css";
import work from "./work.module.css";

const TICKER = [
  "Brand identity",
  "Web design",
  "Full-stack development",
  "iOS apps",
  "Dashboards",
  "Product design",
  "Motion design",
  "Video production",
];

const pad = (n: number) => String(n).padStart(2, "0");
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

export default function WorkHero({ entries }: { entries: WorkEntry[] }) {
  // Entrance runs once the page has painted.
  const [on, setOn] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(r);
  }, []);

  /* ── cursor-following thumbnail over the index ── */
  const peekRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLElement>(null);
  const [peek, setPeek] = useState<number | null>(null);
  const [lastPeek, setLastPeek] = useState(0);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0, placed: false });

  useEffect(() => {
    if (peek === null) {
      pos.current.placed = false;
      return;
    }
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const el = peekRef.current;
      if (!el) return;
      const p = pos.current;
      const t = target.current;
      if (!p.placed) {
        p.x = t.x;
        p.y = t.y;
        p.placed = true;
      } else {
        p.x += (t.x - p.x) * 0.16;
        p.y += (t.y - p.y) * 0.16;
      }
      // Trails left of the cursor, but never further right than the index's own
      // edge — so it floats over the headline, not over the rows being read.
      const edge = indexRef.current?.getBoundingClientRect().left ?? p.x;
      const x = Math.min(p.x - el.offsetWidth - 28, edge - el.offsetWidth + 20);
      const y = Math.max(12, p.y - el.offsetHeight / 2);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [peek]);

  const onMove = (e: React.MouseEvent) => {
    target.current.x = e.clientX;
    target.current.y = e.clientY;
  };
  const showPeek = (n: number) => {
    setPeek(n);
    setLastPeek(n);
  };

  return (
    <header className={work.hero} data-inview={on ? "" : undefined}>
      <div className={studio.field} aria-hidden />
      <div className={studio.wrap}>
        <div className={work.heroGrid}>
          <div>
            <p className={`${studio.label} ${studio.labelRow} ${studio.reveal}`}>
              <Sparkle spin />
              <span>Work</span>
              <span aria-hidden>/</span>
              <span>Selected projects</span>
            </p>
            <h1 className={work.heroTitle}>
              <span className={studio.mask}>
                <span style={i(1)}>Design, film</span>
              </span>
              <span className={studio.mask}>
                <span style={i(2)}>and software,</span>
              </span>
              <span className={studio.mask}>
                <span style={i(3)}>
                  <em className={work.outline}>built end to end.</em>
                </span>
              </span>
            </h1>
            <p className={`${work.heroLead} ${studio.reveal}`} style={i(6)}>
              Brand identities, websites, apps, and film for companies that want
              to look as good as they are.
            </p>
          </div>

          <nav
            ref={indexRef}
            className={`${work.index} ${studio.reveal}`}
            style={i(5)}
            aria-label="Project index"
            onMouseMove={onMove}
            onMouseLeave={() => setPeek(null)}
          >
            <div className={`${studio.label} ${work.indexHead}`}>
              <span>Index</span>
              <span>
                {pad(entries.length)} projects
              </span>
            </div>
            {entries.map((e, n) => (
              <a
                key={e.id}
                href={`#${e.id}`}
                className={work.indexRow}
                onClick={(ev) => {
                  if (scrollToId(e.id)) ev.preventDefault();
                }}
                onMouseEnter={() => showPeek(n)}
              >
                <span className={work.indexNum}>{pad(n + 1)}</span>
                <span className={work.indexName}>
                  <span className="truncate">{e.title}</span>
                  <span
                    className={work.indexDot}
                    style={{ background: e.accent }}
                    aria-hidden
                  />
                </span>
                <span className={work.indexCats}>{e.categories.join(" · ")}</span>
                <TbArrowDown className={`${work.indexArrow} h-4 w-4`} aria-hidden />
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className={`${work.ticker} ${studio.reveal}`} style={i(8)}>
        <Marquee seconds={46}>
          {() =>
            TICKER.map((t) => (
              <span key={t} className={`${studio.label} ${work.tickerItem}`}>
                <span>{t}</span>
                <Sparkle />
              </span>
            ))
          }
        </Marquee>
      </div>

      <div
        ref={peekRef}
        className={work.peek}
        data-on={peek !== null ? "" : undefined}
        aria-hidden
      >
        {entries.map((e, n) => (
          <img
            key={e.id}
            src={e.thumb}
            alt=""
            decoding="async"
            data-on={n === lastPeek ? "" : undefined}
          />
        ))}
      </div>
    </header>
  );
}
