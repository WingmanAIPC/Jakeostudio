import React, { useEffect, useRef, useState } from "react";

type InViewOptions = {
  /** Keep reporting as the element leaves and re-enters (default: latch on first entry). */
  repeat?: boolean;
  rootMargin?: string;
  threshold?: number;
};

/** True once the element has scrolled into view (or always, with `repeat`, while it is). */
export function useInView<T extends Element>(
  ref: React.RefObject<T>,
  { repeat = false, rootMargin = "0px 0px -12% 0px", threshold = 0.01 }: InViewOptions = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!repeat) io.disconnect();
        } else if (repeat) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, repeat, rootMargin, threshold]);

  return inView;
}

type RevealProps = {
  as?: keyof JSX.IntrinsicElements;
  /** Extra delay in ms once in view */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
} & InViewOptions;

/**
 * Sets `data-inview` on itself when scrolled into view. Pair with the
 * `.reveal` / `.mask` / `.rule` classes in studio.module.css (on this element
 * or its children) to drive the entrance.
 */
export default function Reveal({
  as = "div",
  delay,
  className,
  style,
  children,
  repeat,
  rootMargin,
  threshold,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { repeat, rootMargin, threshold });
  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={className}
      data-inview={inView ? "" : undefined}
      style={
        delay ? ({ ...style, "--d": `${delay}ms` } as React.CSSProperties) : style
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
