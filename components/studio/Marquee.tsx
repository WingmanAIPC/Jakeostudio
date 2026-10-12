import React from "react";
import styles from "./studio.module.css";

/**
 * Endless horizontal strip. `children` is rendered twice so the loop is seamless;
 * it receives `duplicate = true` for the second copy so interactive content can
 * drop out of the tab order and the accessibility tree there.
 */
export default function Marquee({
  children,
  seconds = 48,
  reverse = false,
  pausable = false,
  className = "",
  label,
}: {
  children: (duplicate: boolean) => React.ReactNode;
  /** Time for one full loop */
  seconds?: number;
  reverse?: boolean;
  /** Hold still on hover / keyboard focus */
  pausable?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`${styles.marquee} ${className}`.trim()}
      data-reverse={reverse ? "" : undefined}
      data-pausable={pausable ? "" : undefined}
      role={label ? "group" : undefined}
      aria-label={label}
    >
      <div
        className={styles.marqueeTrack}
        style={{ "--dur": `${seconds}s` } as React.CSSProperties}
      >
        <div className={styles.marqueeGroup}>{children(false)}</div>
        <div className={styles.marqueeGroup} aria-hidden>
          {children(true)}
        </div>
      </div>
    </div>
  );
}
