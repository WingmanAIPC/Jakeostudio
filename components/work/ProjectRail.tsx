import React, { useEffect, useState } from "react";
import type { WorkEntry } from "../../lib/workIndex";
import { scrollToId } from "../../lib/scrollToId";
import work from "./work.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Fixed tick rail on the right edge (wide screens): shows which project is
 * crossing the middle of the screen and jumps between them.
 */
export default function ProjectRail({ entries }: { entries: WorkEntry[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-project]"),
    );
    const onScreen = new Set<string>();
    // A thin band across the middle of the viewport: at most one section is "current".
    const io = new IntersectionObserver(
      (records) => {
        records.forEach((r) => {
          const id = (r.target as HTMLElement).dataset.project as string;
          if (r.isIntersecting) onScreen.add(id);
          else onScreen.delete(id);
        });
        const current = entries.find((e) => onScreen.has(e.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [entries]);

  const accent = entries.find((e) => e.id === active)?.accent;

  return (
    <nav
      className={work.rail}
      data-visible={active ? "" : undefined}
      aria-label="Projects"
      style={accent ? ({ "--accent": accent } as React.CSSProperties) : undefined}
    >
      {entries.map((e, n) => (
        <a
          key={e.id}
          href={`#${e.id}`}
          className={work.railItem}
          aria-current={e.id === active ? "true" : undefined}
          tabIndex={active ? undefined : -1}
          onClick={(ev) => {
            if (scrollToId(e.id)) ev.preventDefault();
          }}
        >
          <span className={work.railName}>{e.short}</span>
          <span>{pad(n + 1)}</span>
          <span className={work.railTick} aria-hidden />
        </a>
      ))}
    </nav>
  );
}
