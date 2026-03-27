import React from "react";

const MAILTO_HREF =
  "mailto:jakeostudio@gmail.com?subject=Opportunity&body=Hi Jake, I'd like to connect about a role or project.";

const RESUME_HREF = "/OwensResumeGen2026.pdf";

/** E.164 (e.g. +15551234567). Update to your real number. */
const PHONE_HREF = "tel:+15555550100";

const iconRoundBtnClass =
  "flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/15 bg-black/90 text-white shadow-lg backdrop-blur-md transition-colors hover:border-white/30 hover:bg-black";

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

/** Mail + phone icon buttons, grouped next to resume. */
function ContactIconButtons() {
  return (
    <div className="flex items-center gap-2" aria-label="Quick contact">
      <a href={MAILTO_HREF} className={iconRoundBtnClass} aria-label="Email">
        <MailIcon />
      </a>
      <a href={PHONE_HREF} className={iconRoundBtnClass} aria-label="Call">
        <PhoneIcon />
      </a>
    </div>
  );
}

function QuickResume() {
  return (
    <>
      <a
        href={RESUME_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={`${iconRoundBtnClass} md:hidden`}
        aria-label="View resume"
      >
        <ResumeIcon />
      </a>

      <a
        href={RESUME_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative hidden h-[42px] w-[42px] items-center overflow-hidden rounded-full border border-white/15 bg-black/90 text-white shadow-lg backdrop-blur-md transition-[width] duration-300 ease-out hover:w-fit focus-visible:w-fit md:inline-flex`}
        aria-label="View resume"
      >
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center" aria-hidden>
          <ResumeIcon />
        </span>
        <span className="pr-4 text-xs font-medium tracking-tight text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 whitespace-nowrap">
          Resume
        </span>
      </a>
    </>
  );
}

export default function HeaderFloatingBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed top-4 left-0 right-0 z-[100] flex justify-center px-2 sm:px-3">
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {children}
        <ContactIconButtons />
        <QuickResume />
      </div>
    </div>
  );
}
