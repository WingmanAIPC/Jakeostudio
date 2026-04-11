import React from "react";
import Link from "next/link";
import { SITE_RESUME_PDF_HREF, SITE_LOGO_HEADER_SRC, PRIMARY_NAV } from "../lib/siteNav";

const MAILTO_HREF =
  "mailto:jakeostudio@gmail.com?subject=Opportunity&body=Hi Jake, I'd like to connect about a role or project.";

/** E.164 (e.g. +15551234567). Update to your real number. */
const PHONE_HREF = "tel:+15555550100";

const iconRoundBtnClass =
  "flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white shadow-lg backdrop-blur-2xl transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/30 hover:bg-white/[0.12] active:scale-[0.97]";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
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

const expandPillBaseClass =
  "group relative hidden h-[42px] max-w-[42px] items-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06] text-white shadow-lg backdrop-blur-2xl transition-[max-width,background-color,border-color,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,1,1)] hover:duration-[1050ms] hover:ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/35 hover:bg-white/[0.12] hover:shadow-[0_10px_40px_-12px_rgba(255,255,255,0.18)] focus-visible:duration-[1050ms] focus-visible:ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 md:inline-flex";

const expandLabelClass =
  "text-xs font-medium tracking-tight text-white whitespace-nowrap opacity-0 -translate-x-1.5 transition-[opacity,transform] duration-150 ease-in delay-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:duration-[820ms] group-hover:delay-[260ms] group-hover:ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:duration-[820ms] group-focus-visible:delay-[260ms] group-focus-visible:ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Desktop-only expandable contact + resume pills in the top header. */
function ContactAndResumeActions() {
  return (
    <div
      className="hidden md:flex items-center gap-3"
      aria-label="Quick contact and resume"
    >
      <a
        href={MAILTO_HREF}
        className={`${expandPillBaseClass} hover:max-w-[min(100vw-8rem,320px)] focus-visible:max-w-[min(100vw-8rem,320px)]`}
        aria-label="Email jakeostudio@gmail.com"
      >
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center" aria-hidden>
          <MailIcon />
        </span>
        <span className={`pr-6 ${expandLabelClass}`}>jakeostudio@gmail.com</span>
      </a>
      <a
        href={PHONE_HREF}
        className={`${expandPillBaseClass} hover:max-w-[200px] focus-visible:max-w-[200px]`}
        aria-label="Call me"
      >
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center" aria-hidden>
          <PhoneIcon />
        </span>
        <span className={`pr-6 ${expandLabelClass}`}>Call me</span>
      </a>
      <a
        href={SITE_RESUME_PDF_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={`${expandPillBaseClass} hover:max-w-[220px] focus-visible:max-w-[220px]`}
        aria-label="View resume"
      >
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center" aria-hidden>
          <ResumeIcon />
        </span>
        <span className={`pr-6 ${expandLabelClass}`}>Resume</span>
      </a>
    </div>
  );
}

/** Fixed full-width glass header — mobile only (md:hidden). Logo + nav on left, icons on right. */
export function MobileHeader({ logoHref = "/" }: { logoHref?: string }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[101] md:hidden flex items-center justify-between px-4 bg-black/70 backdrop-blur-2xl border-b border-white/[0.08]"
      style={{ height: "52px" }}
    >
      <div className="flex items-center gap-3">
        <Link href={logoHref} aria-label="Home">
          <img
            src={SITE_LOGO_HEADER_SRC}
            alt="jakeostudio"
            className="h-6 w-auto object-contain"
          />
        </Link>
        <nav className="flex items-center" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2 py-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
              aria-label={item.ariaLabel}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <a
          href={MAILTO_HREF}
          className="flex items-center justify-center w-8 h-8 text-zinc-400 hover:text-white transition-colors"
          aria-label="Email"
        >
          <MailIcon className="w-5 h-5" />
        </a>
        <a
          href={PHONE_HREF}
          className="flex items-center justify-center w-8 h-8 text-zinc-400 hover:text-white transition-colors"
          aria-label="Call"
        >
          <PhoneIcon className="w-5 h-5" />
        </a>
        <a
          href={SITE_RESUME_PDF_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 text-zinc-400 hover:text-white transition-colors"
          aria-label="Resume"
        >
          <ResumeIcon className="w-5 h-5" />
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
        <ContactAndResumeActions />
      </div>
    </div>
  );
}
