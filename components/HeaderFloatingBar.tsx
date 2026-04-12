"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  SITE_RESUME_PDF_HREF,
  SITE_LOGO_HEADER_SRC,
  SITE_MAILTO_HREF,
  SITE_PHONE_HREF,
  PRIMARY_NAV,
} from "../lib/siteNav";

const PEEK_MS = 20000;
const PEEK_COLLAPSE_MS = 750;

/** Mobile header: icon only (no glass bubble). Desktop nav is `DesktopUnifiedNav` in `HeaderFloatingBar` children. */
const iconPlainMobileClass =
  "flex shrink-0 items-center justify-center p-1.5 text-zinc-400 transition-colors hover:text-white active:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-md";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function ResumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

type PeekState = "collapsed" | "peeking" | "collapsing";

function useOutsideClose(
  open: boolean,
  setOpen: (v: boolean) => void,
  ref: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, ref, setOpen]);
}

/** Fixed full-width glass header — mobile only (md:hidden). */
export function MobileHeader({
  logoHref = "/",
  peekTimerActive = false,
}: {
  logoHref?: string;
  /** When true, run ~20s nav peek then collapse (homepage after intro + hero). */
  peekTimerActive?: boolean;
}) {
  const [peekState, setPeekState] = useState<PeekState>(() =>
    peekTimerActive ? "peeking" : "collapsed",
  );
  /** After peek: logo tap fades Work / About / Hire in place (same row as logo), not a dropdown. */
  const [navRevealed, setNavRevealed] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const peekTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useOutsideClose(navRevealed, setNavRevealed, menuRef);
  useOutsideClose(contactOpen, setContactOpen, contactRef);

  useEffect(() => {
    const navShown =
      peekState === "peeking" ||
      peekState === "collapsing" ||
      (peekState === "collapsed" && navRevealed);
    if (navShown) setContactOpen(false);
  }, [peekState, navRevealed]);

  useEffect(() => {
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);

    if (!peekTimerActive) {
      setPeekState("collapsed");
      return;
    }

    setPeekState("peeking");
    peekTimerRef.current = setTimeout(() => {
      setPeekState("collapsing");
      collapseTimerRef.current = setTimeout(
        () => setPeekState("collapsed"),
        PEEK_COLLAPSE_MS,
      );
    }, PEEK_MS);

    return () => {
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, [peekTimerActive]);

  useEffect(() => {
    if (peekState === "peeking" || peekState === "collapsing") {
      setNavRevealed(false);
    }
  }, [peekState]);

  const navLinkClass =
    "px-1.5 py-1 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap";

  const onLogoClick = useCallback(
    (e: React.MouseEvent) => {
      if (peekState !== "collapsed") return;
      e.preventDefault();
      setContactOpen(false);
      setNavRevealed((v) => !v);
    },
    [peekState],
  );

  const navMotionClass =
    peekState === "peeking"
      ? "opacity-100 translate-x-0"
      : peekState === "collapsing"
        ? "pointer-events-none opacity-0 -translate-x-3"
        : peekState === "collapsed" && navRevealed
          ? "opacity-100 translate-x-0"
          : "pointer-events-none opacity-0 -translate-x-2";

  const contactMotionClass = contactOpen
    ? "opacity-100 translate-x-0 pointer-events-auto"
    : "pointer-events-none opacity-0 translate-x-2";

  const primaryNavLinksVisible =
    peekState === "peeking" ||
    peekState === "collapsing" ||
    (peekState === "collapsed" && navRevealed);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[101] md:hidden flex items-center justify-between gap-2 px-3 bg-black/70 backdrop-blur-2xl border-b border-white/[0.08]"
      style={{ height: "52px" }}
    >
      <div ref={menuRef} className="relative flex min-w-0 flex-1 items-center gap-1">
        <div className="relative z-[2] flex shrink-0 items-center">
          <Link
            href={logoHref}
            onClick={onLogoClick}
            className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label={
              peekState === "collapsed"
                ? navRevealed
                  ? "Hide navigation"
                  : "Show navigation"
                : "Home"
            }
            aria-expanded={
              peekState === "collapsed" ? navRevealed : undefined
            }
          >
            <img
              src={SITE_LOGO_HEADER_SRC}
              alt="jakeostudio"
              className="h-5 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Same horizontal slot as the initial peek (beside logo) — fade in/out, no dropdown panel. */}
        <nav
          className={`absolute left-10 top-1/2 z-[1] flex -translate-y-1/2 items-center gap-x-0.5 transition-[opacity,transform] ease-[cubic-bezier(0.33,1,0.68,1)] ${
            peekState === "collapsing" ? "duration-[750ms]" : "duration-300"
          } ${navMotionClass}`}
          aria-label="Primary"
          aria-hidden={
            !(
              peekState === "peeking" ||
              (peekState === "collapsed" && navRevealed)
            )
          }
        >
          {peekState === "collapsed" && navRevealed ? (
            <Link
              href={logoHref}
              className={navLinkClass}
              onClick={() => setNavRevealed(false)}
            >
              Home
            </Link>
          ) : null}
          {(peekState === "peeking" ||
            peekState === "collapsing" ||
            (peekState === "collapsed" && navRevealed)) &&
            PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass}
                aria-label={item.ariaLabel}
                onClick={() => setNavRevealed(false)}
              >
                {item.label}
              </Link>
            ))}
        </nav>
      </div>

      <div
        ref={contactRef}
        className="relative flex shrink-0 items-center justify-end gap-1"
      >
        <div
          className={`relative flex min-w-0 items-center justify-end transition-opacity duration-300 ease-out ${
            primaryNavLinksVisible
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <nav
            className={`absolute right-full top-1/2 z-[1] mr-1 flex -translate-y-1/2 items-center gap-x-0.5 transition-[opacity,transform] ease-[cubic-bezier(0.33,1,0.68,1)] duration-300 ${contactMotionClass}`}
            aria-label="Contact"
            aria-hidden={!contactOpen}
          >
            <a
              href={SITE_MAILTO_HREF}
              className={navLinkClass}
              onClick={() => setContactOpen(false)}
            >
              Email
            </a>
            <a
              href={SITE_PHONE_HREF}
              className={navLinkClass}
              onClick={() => setContactOpen(false)}
            >
              Call
            </a>
          </nav>
          <button
            type="button"
            className={`${iconPlainMobileClass} relative z-[2]`}
            aria-label={contactOpen ? "Hide contact links" : "Show contact links"}
            aria-expanded={contactOpen}
            onClick={() => {
              setNavRevealed(false);
              setContactOpen((c) => !c);
            }}
          >
            <UserIcon className="h-[19.8px] w-[19.8px] -translate-y-px" />
          </button>
        </div>
        <a
          href={SITE_RESUME_PDF_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={iconPlainMobileClass}
          aria-label="View resume PDF"
        >
          <ResumeIcon className="h-[19.8px] w-[19.8px] block" />
        </a>
      </div>
    </div>
  );
}

export default function HeaderFloatingBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed top-4 left-0 right-0 z-[100] hidden md:flex justify-center px-2 sm:px-3">
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {children}
      </div>
    </div>
  );
}
