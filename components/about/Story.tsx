import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  TbBroadcast,
  TbDeviceLaptop,
  TbHeartHandshake,
  TbTrophy,
  TbX,
} from "react-icons/tb";
import Reveal from "../studio/Reveal";
import Sparkle from "../studio/Sparkle";
import studio from "../studio/studio.module.css";
import { EqRadar, Multiview, PosterCard, RenderWindow } from "./Vignettes";
import about from "./about.module.css";

const POSTER_SRC = "/OutofSync.jpg";

const pad = (n: number) => String(n).padStart(2, "0");
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

function PosterDialog({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className={about.dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Out of Sync"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className={about.dialogClose}
        onClick={onClose}
        aria-label="Close poster"
      >
        <TbX className="h-5 w-5" aria-hidden />
      </button>
      <img
        src={POSTER_SRC}
        alt="Out of Sync — poster that won 1st place in the Adobe ACA US National Championship"
        className={about.dialogImage}
        onClick={(e) => e.stopPropagation()}
      />
      <p className={studio.label}>
        Out of Sync &middot; 1st place, Adobe ACA US National Championship
      </p>
    </div>
  );
}

function Chapter({
  n,
  icon: Icon,
  kicker,
  title,
  vignette,
  children,
}: {
  n: number;
  icon: IconType;
  kicker: string;
  title: string;
  vignette: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="article" className={about.chapter}>
      <div className={about.chapterSide}>
        <p className={`${studio.label} ${about.chapterHead} ${studio.reveal}`}>
          <Icon className={about.chapterIcon} aria-hidden />
          <span className={about.bright}>{pad(n)}</span>
          <span>{kicker}</span>
        </p>
        <h3 className={about.chapterTitle}>
          <span className={studio.mask}>
            <span style={i(1)}>{title}</span>
          </span>
        </h3>
        <div className={`${about.vignette} ${studio.reveal}`} style={i(3)}>
          {vignette}
        </div>
      </div>
      <div className={`${about.prose} ${studio.reveal}`} style={i(2)}>
        {children}
      </div>
    </Reveal>
  );
}

export default function Story() {
  const [posterOpen, setPosterOpen] = useState(false);
  const openPoster = useCallback(() => setPosterOpen(true), []);
  const closePoster = useCallback(() => setPosterOpen(false), []);

  return (
    <section className={about.section} aria-labelledby="story-title">
      <Reveal>
        <p className={`${studio.label} ${studio.labelRow} ${studio.reveal}`}>
          <Sparkle />
          <span>Story</span>
        </p>
        <h2 id="story-title" className={about.sectionTitle}>
          <span className={studio.mask}>
            <span style={i(1)}>How I work,</span>
          </span>
          <span className={studio.mask}>
            <span style={i(2)}>
              <em className={about.outline}>and how I got here.</em>
            </span>
          </span>
        </h2>
      </Reveal>

      <div className={about.chapters}>
        <Chapter
          n={1}
          icon={TbDeviceLaptop}
          kicker="Origin"
          title="A 48-hour render"
          vignette={<RenderWindow />}
        >
          <p>
            I&apos;ve been teaching myself how to make things on computers since
            I was a kid. It started with wanting to design intros and branding
            for YouTube creators on a Toshiba laptop that could barely run. I
            once let <strong>a 10-second render cook for 48 hours straight</strong>.
          </p>
          <p>
            That stubbornness never really went away. It just found better
            outlets.
          </p>
        </Chapter>

        <Chapter
          n={2}
          icon={TbTrophy}
          kicker="Craft"
          title="First of 44,000"
          vignette={<PosterCard onOpen={openPoster} />}
        >
          <p>
            I grew up between Cincinnati and Dayton, played catcher through high
            school, and poured everything creative into my school&apos;s digital
            media arts program, where I eventually placed{" "}
            {/* A span, not a <button>: a button won't wrap inline with the sentence. */}
            <span
              role="button"
              tabIndex={0}
              className={about.proseLink}
              onClick={openPoster}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openPoster();
                }
              }}
              aria-haspopup="dialog"
            >
              1st out of 44,000 students in the Adobe ACA US National
              Championship
            </span>
            .
          </p>
          <p>
            I studied graphic design at the University of Dayton, starting in
            digital and fine art, then moving through typography, design
            systems, branding, and client work.
          </p>
        </Chapter>

        <Chapter
          n={3}
          icon={TbBroadcast}
          kicker="Live"
          title="In the truck"
          vignette={<Multiview />}
        >
          <p>
            Along the way I picked up a minor in video production, which put me
            in the truck as a technical director for live sports broadcasts. The
            same situational awareness I built behind the plate translated
            directly into <strong>calling cameras and leading a crew</strong>.
          </p>
          <p>
            I&apos;ve designed, directed, filmed, and edited across baseball,
            soccer, volleyball, studio productions, music videos, and a solar
            eclipse.
          </p>
        </Chapter>

        <Chapter
          n={4}
          icon={TbHeartHandshake}
          kicker="Purpose"
          title="Built for people"
          vignette={<EqRadar />}
        >
          <p>
            What drives all of it is a pretty simple thing:{" "}
            <strong>
              I care about people, and I want to build things that actually help
              them.
            </strong>{" "}
            That&apos;s what pulled me into studying psychology, emotional
            intelligence, social media&apos;s impact on mental health, and
            eventually building{" "}
            <Link href="/work/wingman" className={about.proseLink}>
              Wingman
            </Link>
            , an AI-powered EQ coaching app I&apos;ve been developing from the
            ground up.
          </p>
          <p>
            I watched AI go from a novelty to something genuinely powerful, and
            I saw most people using it in ways that barely scratched the
            surface. I wanted to create something that used it meaningfully,
            something that felt like it was making a real difference when
            someone picked it up.
          </p>
          <p>
            That same instinct applies to everything I take on, whether
            it&apos;s a full-stack e-commerce platform for a client or a gameday
            graphic for a team.
          </p>
        </Chapter>
      </div>

      {posterOpen ? <PosterDialog onClose={closePoster} /> : null}
    </section>
  );
}
