import React from "react";
import CaseStudyLayout, {
  Section,
  DetailCard,
  FlowNode,
  FlowArrow,
} from "../../components/case-study/CaseStudyLayout";
import { BiroHeroWordmark, BiroIntegrationStrip } from "../../components/case-study/BiroCaseStudyVisuals";

function YouTubeLazyEmbed({
  title,
  videoId,
}: {
  title: string;
  videoId: string;
}) {
  const [active, setActive] = React.useState(false);
  const thumbSrc = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-900 border border-white/10">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={iframeSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="group relative h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          onClick={() => setActive(true)}
          aria-label={`Play: ${title}`}
        >
          <img src={thumbSrc} alt="" className="h-full w-full object-cover" />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 transition-colors group-hover:bg-black/50">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/75 text-white shadow-lg ring-1 ring-white/25">
              <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export default function BiroLabels() {
  return (
    <CaseStudyLayout
      meta={{
        title: "Biro Labels",
        heroTitle: <BiroHeroWordmark />,
        description:
          "A modern e-commerce platform replacing an outdated WooCommerce site — custom storefront with Amazon-style ordering, Stripe checkout, QuickBooks integration, and a purpose-built admin dashboard for order fulfillment.",
        role: "Solo Designer & Developer",
        timeline: "Jan – Apr 2026 (4 months)",
        liveUrl: "https://birolabels.com",
        liveLabel: "birolabels.com",
      }}
      techStack={[
        "Next.js",
        "React",
        "Supabase",
        "Stripe",
        "QuickBooks API",
        "Google Merchant",
        "HubSpot",
        "Vercel",
        "Cursor",
        "Claude",
        "Vertex AI",
      ]}
    >
      {/* Context */}
      <Section label="Context" title="The Problem">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <p>
              Biro Sales is a thermal label distributor serving primarily commercial grocery stores — the labels printed at meat counters, produce scales, and for UPC/safe-handling compliance. Their catalog spans 171+ SKUs across multiple manufacturers.
            </p>
            <p>
              Their existing WooCommerce site was outdated in design, navigation, and mobile experience. WooCommerce&apos;s plugin ecosystem added unnecessary complexity, and the storefront didn&apos;t reflect the straightforward, utilitarian experience their B2B customers needed.
            </p>
            <p>
              Fulfillment was handled through a patchwork of WooCommerce&apos;s built-in tools, QuickBooks for accounting and inventory, and UPS for shipping — with no unified view.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">Before vs. After</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-zinc-500 mb-1">Before</p>
                <ul className="space-y-1 text-zinc-300">
                  <li>• WooCommerce with excessive plugins</li>
                  <li>• Outdated design, poor mobile UX</li>
                  <li>• Product data scattered across spreadsheets</li>
                  <li>• No unified order management view</li>
                  <li>• Manual fulfillment coordination</li>
                </ul>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-zinc-500 mb-1">After</p>
                <ul className="space-y-1 text-zinc-300">
                  <li>• Clean, mobile-optimized storefront</li>
                  <li>• Amazon-style ordering and reordering</li>
                  <li>• Centralized admin dashboard</li>
                  <li>• Automated email flows via HubSpot</li>
                  <li>• Multi-method checkout via Stripe</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Video Walkthroughs */}
      <Section label="Walkthroughs" title="Customer & Admin Experience">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-3">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Customer Experience</p>
            <YouTubeLazyEmbed title="Biro Labels customer walkthrough" videoId="nJfioQ8lLSg" />
            <p className="text-sm text-zinc-400">
              Full storefront flow — browsing, filtering, cart, and Stripe checkout with multiple payment methods.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Admin &amp; Store Managers</p>
            <YouTubeLazyEmbed title="Biro Labels admin walkthrough" videoId="oGaejTwxYNc" />
            <p className="text-sm text-zinc-400">
              Order fulfillment view, product management, integration shortcuts to Stripe, QuickBooks, and Vercel dashboards.
            </p>
          </div>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Approach */}
      <Section label="Approach" title="Architecture Decisions">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-base font-semibold">Why Next.js + React</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Next.js provided the most open-ended architecture for connecting external services via API routes — no plugin lock-in like WooCommerce or Shopify. Combined with AI-assisted development through Cursor, this stack allowed rapid iteration while maintaining full control over the checkout flow, admin tools, and third-party integrations.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-base font-semibold">Why Supabase</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Supabase offered a fast setup with a clean API, built-in auth for customer and admin accounts, and real-time capabilities. Cursor&apos;s Supabase skills gave the AI models direct context for efficient integration — making database operations, RLS policies, and auth flows straightforward to implement.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-base font-semibold">Stripe over PayPal</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              The client initially wanted crypto payment capabilities. Stripe won over PayPal because it offered Apple Pay, Google Pay, direct ACH, credit card, and crypto via USDC stablecoins — all with lower surcharge fees. Stripe&apos;s Acodei plugin for QuickBooks also solved the accounting sync challenge without building a custom invoice payment route.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <h3 className="text-base font-semibold">QuickBooks Integration</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              QuickBooks was the client&apos;s existing accounting and product database system. Rather than building a direct QuickBooks payment integration (which proved unfriendly for UX), Stripe&apos;s Acodei plugin provided automatic sync between Stripe transactions and QuickBooks — keeping the client&apos;s accounting workflow intact.
            </p>
          </div>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Data Flow Diagram */}
      <Section label="Architecture" title="Integration Data Flow">
        <div className="mb-8 max-w-2xl mx-auto">
          <BiroIntegrationStrip />
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/30 p-6 md:p-8 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-[600px] justify-center flex-wrap md:flex-nowrap">
            <FlowNode label="Storefront" sub="Next.js + React" />
            <FlowArrow />
            <FlowNode label="Supabase" sub="Auth, DB, Storage" />
            <FlowArrow />
            <FlowNode label="Stripe" sub="Checkout + Payments" />
            <FlowArrow />
            <FlowNode label="QuickBooks" sub="Acodei Sync" />
          </div>
          <div className="flex items-center gap-3 mt-6 min-w-[600px] justify-center flex-wrap md:flex-nowrap">
            <FlowNode label="Order Placed" sub="Customer" />
            <FlowArrow />
            <FlowNode label="HubSpot" sub="Email Automation" />
            <FlowArrow />
            <FlowNode label="Admin Dashboard" sub="Fulfillment View" />
            <FlowArrow />
            <FlowNode label="UPS Tracking" sub="Manual Entry" />
          </div>
          <p className="text-xs text-zinc-500 mt-6 text-center">
            Webhooks sync order status between Stripe, HubSpot, and the admin dashboard. Tracking numbers entered by fulfillment staff trigger automated customer emails.
          </p>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Key Details */}
      <Section label="Key Details" title="Deep Dives">
        <div className="grid gap-6">
          <DetailCard number="01" title="AI-Assisted Development Velocity">
            <p>
              Cursor carried the development efficiency on this project. AI agents (Composer 2 with Opus 4.6 for heavy coding tasks requiring large code contexts) wrote the vast majority of the code, while Claude and Claude Code handled research and solution evaluation.
            </p>
            <p>
              <strong className="text-zinc-100">Time estimate without AI:</strong> 4 months for design alone, 12+ months for full development.
              <br />
              <strong className="text-zinc-100">Actual time:</strong> 4 months total — design, development, and deployment.
            </p>
            <p>
              The biggest accelerators were API route generation (reading third-party API docs and integrating them within the codebase context), managing 171 products across scattered data sources, and debugging middleware for production auth security — separating admin accounts from customer accounts using environment-level email validation.
            </p>
            <p>
              A custom Cursor script was even used to generate placeholder product images from SKU data for early wireframing, which later prompted the client&apos;s team to photograph all missing labels and share them via Dropbox.
            </p>
          </DetailCard>

          <DetailCard number="02" title="Admin Dashboard">
            <p>
              The dashboard splits into two core functions: <strong className="text-zinc-100">order management</strong> and <strong className="text-zinc-100">store management</strong> — matching the client&apos;s real-world workflow of processing orders and maintaining product data.
            </p>
            <p>
              <strong className="text-zinc-100">Order Management:</strong> View all orders including incomplete ones (captured customer info, unpaid). Each order displays product SKUs for warehouse fulfillment, with a dedicated field for entering UPS tracking numbers. Once entered, HubSpot automations trigger customer notifications — order confirmation, shipping updates, and delivery confirmation.
            </p>
            <p>
              <strong className="text-zinc-100">Store Management:</strong> All 171+ products organized, filterable, and editable — images, descriptions, SKUs, stock counts, and admin notes. Smart search finds products by name, SKU, size, type, or any detail. This replaced the scattered spreadsheet/QuickBooks workflow the client had been using.
            </p>
            <p>
              Admin access is secured via environment variables containing authorized email addresses, enforced through middleware — a practical cybersecurity approach for a small team.
            </p>
          </DetailCard>

          <DetailCard number="03" title="AI Video Production">
            <p>
              Utilized Google&apos;s Vertex AI Studio (Veo 3.1) during the free $300 trial to produce studio-grade video content showcasing thermal labels in commercial grocery environments — labels on scales from various manufacturers, bulk case ordering visuals, and brand storytelling.
            </p>
            <p>
              The creative direction aligned with the owner&apos;s vision: utilitarian, &ldquo;present and sell labels plainly,&rdquo; at an Amazon-level customer experience. This bridged AI content generation with real product marketing — producing assets that would typically require a production team and on-location shoots.
            </p>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 mt-2">
              <p className="text-xs text-zinc-400">
                Brand keywords from the pitch deck: Manufacturing Professionalism, Quick-Access Ease, Transparent Filtering, Streamlined Ordering, Improved Customer Experience, Expanded Payment Capability, Efficient Order Management.
              </p>
            </div>
          </DetailCard>

          <DetailCard number="04" title="Product Data Migration">
            <p>
              With 171 products and data scattered across QuickBooks, multiple spreadsheets, and internal storage systems, migration was a significant challenge. Rather than waiting for perfect data, products were imported iteratively as data and images became available.
            </p>
            <p>
              This &ldquo;progressive import&rdquo; approach was unconventional but practical — it avoided the bottleneck of traditional bulk imports (like Shopify CSV or WooCommerce exports) and naturally led to building the store management dashboard as a better long-term solution for maintaining product data.
            </p>
          </DetailCard>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Outcome */}
      <Section label="Outcome" title="Results & Reflection">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <p>
              The site is live at <a href="https://birolabels.com" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white">birolabels.com</a>. Client feedback has been consistently positive — &ldquo;this is awesome, exactly what I envisioned, great work.&rdquo;
            </p>
            <p>
              The fulfillment workflow now flows from browser-based order review to warehouse packing to UPS tracking entry, with automated customer emails at every stage. The designated UPS computer at the warehouse integrates naturally — staff enter tracking numbers in the admin dashboard, and the system handles the rest.
            </p>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-zinc-400 mb-2 font-medium">Development was broken into 3 phases:</p>
              <ul className="text-xs text-zinc-400 space-y-1">
                <li><strong className="text-zinc-300">Phase 1:</strong> Discovery — architecture planning, wireframes, integration selection (Next.js over WooCommerce, Supabase, Vercel)</li>
                <li><strong className="text-zinc-300">Phase 2:</strong> Core build — storefront, product catalog, auth, admin dashboard</li>
                <li><strong className="text-zinc-300">Phase 3:</strong> Integrations — switched from PayPal to Stripe, HubSpot email flows, Google Merchant for SEO</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <h3 className="text-base font-semibold text-zinc-100">What I&apos;d improve in v2</h3>
            <p>
              The iterative product import approach was creative and efficient, but it caused friction when managing images and SKUs across 171 products before the admin dashboard was fully built. In v2, I&apos;d build the product management UI first, then import.
            </p>
            <p>
              UPS API integration was explored but proved extremely difficult to custom-integrate — their developer experience is notably poor. The manual tracking-number workflow ended up being pragmatic for this client&apos;s scale, but a direct API integration would reduce steps.
            </p>
            <p>
              HubSpot configuration for timed reorder reminders (e.g., emailing customers when they&apos;re likely running low on labels) is set up but could be refined with better purchase frequency data over time.
            </p>
          </div>
        </div>
      </Section>
    </CaseStudyLayout>
  );
}
