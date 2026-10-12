import React from "react";
import styles from "./studio.module.css";

/** The four-point star from the jakeostudio wordmark — used as the site's bullet / separator. */
export default function Sparkle({
  spin = false,
  className = "",
}: {
  spin?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={`${styles.sparkle} ${spin ? styles.sparkleSpin : ""} ${className}`.trim()}
    >
      <path d="M12 0c.6 6.9 5.1 11.4 12 12-6.9.6-11.4 5.1-12 12-.6-6.9-5.1-11.4-12-12C6.9 11.4 11.4 6.9 12 0z" />
    </svg>
  );
}
