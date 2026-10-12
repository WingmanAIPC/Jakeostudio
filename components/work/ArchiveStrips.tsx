import React, { useEffect, useRef, useState } from "react";
import { TbPlayerPlayFilled, TbX } from "react-icons/tb";
import {
  ARCHIVE_DESIGNS,
  ARCHIVE_FILMS,
  type ArchiveDesign,
  type ArchiveFilm,
} from "../../lib/workIndex";
import Marquee from "../studio/Marquee";
import Reveal from "../studio/Reveal";
import Sparkle from "../studio/Sparkle";
import studio from "../studio/studio.module.css";
import work from "./work.module.css";

type Open =
  | { kind: "film"; film: ArchiveFilm }
  | { kind: "design"; design: ArchiveDesign };

const pad = (n: number) => String(n).padStart(2, "0");
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/** YouTube returns a 120×90 grey placeholder (not an error) when maxres is missing. */
function onThumbLoad(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.naturalWidth <= 120 && img.src.includes("maxresdefault")) {
    img.src = img.src.replace("maxresdefault", "hqdefault");
  }
}

function Lightbox({ open, onClose }: { open: Open; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const label = open.kind === "film" ? open.film.title : open.design.alt;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className={work.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className={`${work.iconBtn} ${work.lightboxClose}`}
        onClick={onClose}
        aria-label="Close"
      >
        <TbX className="h-5 w-5" aria-hidden />
      </button>
      {open.kind === "film" ? (
        <div className={work.lightboxVideo} onClick={(e) => e.stopPropagation()}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
              open.film.videoId,
            )}?autoplay=1&rel=0`}
            title={open.film.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <img
          src={open.design.src}
          alt={open.design.alt}
          className={work.lightboxImage}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <p className={studio.label}>{label}</p>
    </div>
  );
}

export default function ArchiveStrips() {
  const [open, setOpen] = useState<Open | null>(null);
  const close = React.useCallback(() => setOpen(null), []);

  return (
    <section className={work.archive} aria-labelledby="archive-title">
      <div className={studio.wrap}>
        <Reveal className={work.sectionHead}>
          <div>
            <p className={`${studio.label} ${studio.labelRow} ${studio.reveal}`}>
              <Sparkle />
              <span>Archive</span>
            </p>
            <h2 id="archive-title" className={work.sectionTitle}>
              <span className={studio.mask}>
                <span style={i(1)}>More film</span>
              </span>
              <span className={studio.mask}>
                <span style={i(2)}>
                  <em className={work.outline}>and design.</em>
                </span>
              </span>
            </h2>
          </div>
          <p className={`${work.sectionLead} ${studio.reveal}`} style={i(4)}>
            Commercials, short films, posters, and identity work. Pick anything
            to open it.
          </p>
        </Reveal>
      </div>

      <Reveal className={work.stripBlock}>
        <div className={studio.wrap}>
          <p className={`${studio.label} ${work.stripLabel}`}>
            <span>Film</span>
            <span className={`${studio.rule} ${work.stripRule}`} aria-hidden />
            <span>{pad(ARCHIVE_FILMS.length)}</span>
          </p>
        </div>
        <Marquee seconds={64} pausable className={work.strip} label="Films">
          {(duplicate) =>
            ARCHIVE_FILMS.map((film) => (
              <button
                key={film.videoId}
                type="button"
                className={`${work.tile} ${work.filmTile}`}
                onClick={() => setOpen({ kind: "film", film })}
                tabIndex={duplicate ? -1 : undefined}
                aria-label={`Play ${film.title}`}
              >
                <span className={work.tileMedia}>
                  <img
                    src={`https://img.youtube.com/vi/${film.videoId}/maxresdefault.jpg`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onLoad={onThumbLoad}
                  />
                  <span className={work.tilePlay} aria-hidden>
                    <TbPlayerPlayFilled className="ml-px h-3.5 w-3.5" />
                  </span>
                </span>
                <span className={work.tileCaption}>
                  <span>{film.title}</span>
                  <span>{film.note}</span>
                </span>
              </button>
            ))
          }
        </Marquee>
      </Reveal>

      <Reveal className={work.stripBlock}>
        <div className={studio.wrap}>
          <p className={`${studio.label} ${work.stripLabel}`}>
            <span>Design</span>
            <span className={`${studio.rule} ${work.stripRule}`} aria-hidden />
            <span>{pad(ARCHIVE_DESIGNS.length)}</span>
          </p>
        </div>
        <Marquee seconds={84} reverse pausable className={work.strip} label="Design work">
          {(duplicate) =>
            ARCHIVE_DESIGNS.map((design) => (
              <button
                key={design.thumb}
                type="button"
                className={`${work.tile} ${work.designTile}`}
                onClick={() => setOpen({ kind: "design", design })}
                tabIndex={duplicate ? -1 : undefined}
                aria-label={`View ${design.alt}`}
              >
                <span
                  className={work.tileMedia}
                  style={{ aspectRatio: String(design.ratio) }}
                >
                  <img src={design.thumb} alt="" loading="lazy" decoding="async" />
                </span>
              </button>
            ))
          }
        </Marquee>
      </Reveal>

      {open ? <Lightbox open={open} onClose={close} /> : null}
    </section>
  );
}
