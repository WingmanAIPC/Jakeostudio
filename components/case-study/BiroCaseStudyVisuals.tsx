import React from "react";

// Brand SVG paths from Simple Icons (MIT): https://github.com/simple-icons/simple-icons

/** Hero `<h1>` scale: white BIRO + accent LABELS (matches live site). */
export function BiroHeroWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${className}`}>
      <span className="text-white">BIRO</span>
      <span className="text-amber-500">LABELS</span>
    </span>
  );
}

/** Compact wordmark for cards / callouts. */
export function BiroSiteWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 mb-2">Client wordmark</p>
      <span className="text-3xl md:text-4xl font-bold tracking-tight">
        <span className="text-white">BIRO</span>
        <span className="text-amber-500">LABELS</span>
      </span>
    </div>
  );
}

/* Simple Icons (MIT): https://github.com/simple-icons/simple-icons */

function IconShell({
  children,
  label,
  className = "h-5 w-5 text-zinc-400",
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <span className="inline-flex flex-col items-center gap-1" title={label}>
      <span className={`inline-flex ${className}`} aria-hidden>
        {children}
      </span>
      <span className="text-[9px] uppercase tracking-wider text-zinc-600 max-w-[4.5rem] text-center leading-tight">
        {label}
      </span>
    </span>
  );
}

export function SupabaseIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z"
      />
    </svg>
  );
}

export function StripeIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"
      />
    </svg>
  );
}

export function VercelIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path fill="currentColor" d="m12 1.608 12 20.784H0Z" />
    </svg>
  );
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  );
}

export function QuickBooksIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm.642 4.1335c.9554 0 1.7296.776 1.7296 1.7332v9.0667h1.6c1.614 0 2.9275-1.3156 2.9275-2.933 0-1.6173-1.3136-2.9333-2.9276-2.9333h-.6654V7.3334h.6654c2.5722 0 4.6577 2.0897 4.6577 4.667 0 2.5774-2.0855 4.6666-4.6577 4.6666H12.642zM7.9837 7.333h3.3291v12.533c-.9555 0-1.73-.7759-1.73-1.7332V9.0662H7.9837c-1.6146 0-2.9277 1.316-2.9277 2.9334 0 1.6175 1.3131 2.9333 2.9277 2.9333h.6654v1.7332h-.6654c-2.5725 0-4.6577-2.0892-4.6577-4.6665 0-2.5771 2.0852-4.6666 4.6577-4.6666Z"
      />
    </svg>
  );
}

/** Compact row of marks for services referenced in copy; keeps the page scannable. */
export function BiroIntegrationStrip() {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950/40 px-4 py-4">
      <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 text-center mb-3">
        Key integrations
      </p>
      <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-4">
        <IconShell label="Supabase">
          <SupabaseIcon className="h-5 w-5 text-emerald-400/90" />
        </IconShell>
        <IconShell label="Stripe">
          <StripeIcon className="h-5 w-5 text-zinc-300" />
        </IconShell>
        <IconShell label="Vercel">
          <VercelIcon className="h-4 w-4 text-zinc-300" />
        </IconShell>
        <IconShell label="Google">
          <GoogleIcon className="h-5 w-5 text-zinc-300" />
        </IconShell>
        <IconShell label="QuickBooks">
          <QuickBooksIcon className="h-5 w-5 text-emerald-500/80" />
        </IconShell>
      </div>
    </div>
  );
}
