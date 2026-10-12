import React, { useEffect, useRef } from "react";
import Sparkle from "../studio/Sparkle";
import studio from "../studio/studio.module.css";
import about from "./about.module.css";

const WORDS =
  "I learn what I need to learn, I build what needs to be built, and I try to leave things better than I found them.".split(
    " ",
  );

/** The line the story lands on — each word lights up as it scrolls through the screen. */
export default function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the block's top reaches 85% down the screen → 1 as its bottom reaches 55%.
      const from = vh * 0.85;
      const to = vh * 0.55 - rect.height;
      const p = (from - rect.top) / (from - to);
      el.style.setProperty("--p", String(Math.max(0, Math.min(1.1, p))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={about.statement}>
      <p className={`${studio.label} ${studio.labelRow}`}>
        <Sparkle />
        <span>The short version</span>
      </p>
      <p
        ref={ref}
        className={about.statementText}
        style={{ "--n": WORDS.length } as React.CSSProperties}
      >
        {WORDS.map((w, k) => (
          <React.Fragment key={k}>
            <span
              className={about.word}
              style={{ "--w": k / WORDS.length } as React.CSSProperties}
            >
              {w}
            </span>{" "}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
