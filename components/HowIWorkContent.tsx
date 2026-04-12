"use client";

import React, { useEffect, useState } from "react";

const POSTER_SRC = "/OutofSync.jpg";

const triggerButtonClass =
  "group inline m-0 cursor-pointer bg-transparent border-0 p-0 font-inherit text-inherit align-baseline whitespace-normal [word-break:break-word]";

const triggerLabelClass =
  "underline decoration-zinc-500 underline-offset-[3px] transition-colors group-hover:decoration-white group-hover:text-white";

export default function HowIWorkContent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div className="space-y-5 text-[15px] text-zinc-300 leading-relaxed">
        <p>
          I&apos;ve been teaching myself how to make things on computers since I
          was a kid. It started with wanting to design intros and branding for
          YouTube creators on a Toshiba laptop that could barely run — I once
          let a 10-second render cook for 48 hours straight. That stubbornness
          never really went away. It just found better outlets.
        </p>
        <p>
          I grew up between Cincinnati and Dayton, played catcher through high
          school, and poured everything creative into my school&apos;s digital
          media arts program — where I eventually placed{" "}
          <button
            type="button"
            className={triggerButtonClass}
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <span className={triggerLabelClass}>
              1st out of 44,000 students in the Adobe ACA US National Championship
            </span>
            .{" "}
          </button>
          I studied graphic design at the University of Dayton, starting in
          digital and fine art, then moving through typography, design systems,
          branding, and client work. Along the way I picked up a minor in video
          production, which put me in the truck as a technical director for live
          sports broadcasts — the same situational awareness I built behind the
          plate translated directly into calling cameras and leading a crew.
          I&apos;ve designed, directed, filmed, and edited across baseball,
          soccer, volleyball, studio productions, music videos, and a solar
          eclipse.
        </p>
        <p>
          What drives all of it is a pretty simple thing: I care about people, and
          I want to build things that actually help them. That&apos;s what pulled
          me into studying psychology, emotional intelligence, social
          media&apos;s impact on mental health, and eventually building Wingman —
          an AI-powered EQ coaching app I&apos;ve been developing from the
          ground up. I watched AI go from a novelty to something genuinely
          powerful, and I saw most people using it in ways that barely scratched
          the surface. I wanted to create something that used it meaningfully —
          something that felt like it was making a real difference when someone
          picked it up. That same instinct applies to everything I take on,
          whether it&apos;s a full-stack e-commerce platform for a client or a
          gameday graphic for a team. I learn what I need to learn, I build what
          needs to be built, and I try to leave things better than I found them.
        </p>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="out-of-sync-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            aria-label="Close poster"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-lg flex-col items-center gap-4 rounded-2xl border border-white/15 bg-zinc-950 p-4 shadow-2xl sm:max-w-2xl sm:p-6">
            <div className="flex w-full items-start justify-between gap-4">
              <h3
                id="out-of-sync-title"
                className="text-left text-sm font-medium text-white"
              >
                Out of Sync
              </h3>
              <button
                type="button"
                className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-xs text-zinc-300 hover:border-white/40 hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="max-h-[min(78vh,820px)] w-full overflow-auto rounded-lg border border-white/10 bg-black">
              <img
                src={POSTER_SRC}
                alt="Out of Sync — poster that won 1st place in the Adobe ACA US National Championship"
                className="mx-auto h-auto w-full max-w-full object-contain object-top"
              />
            </div>
            <p className="text-center text-xs text-zinc-500">
              1st place, Adobe ACA US National Championship
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
