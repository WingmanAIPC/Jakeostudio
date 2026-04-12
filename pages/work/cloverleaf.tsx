import CaseStudyLayout, {
  Section,
  DetailCard,
  DeepDiveVideo,
} from "../../components/case-study/CaseStudyLayout";

const CLOVERLEAF_PLAYLIST_ID = "PL18Q1CsxcdgRhhpWPSXSjkJCx12SRp_1_";
const CLOVERLEAF_BRANDMARK_SRC = encodeURI("/Brandmark Default@6x.png");
const CLOVERLEAF_OUTRO_SRC = encodeURI("/Cloverleaf Outro Final.mp4");

/** Showcase order —4×3 grid (12). Opens in playlist context on YouTube. */
const TESTIMONIAL_VIDEOS = [
  { id: "xpSuA6PAAFY", title: "Cloverleaf testimonial" },
  { id: "-YZcY-5BUbA", title: "Cloverleaf testimonial" },
  { id: "sdhIwU2xtp0", title: "Cloverleaf testimonial" },
  { id: "PxDkwXAW5CY", title: "Cloverleaf testimonial" },
  { id: "ch_EGlZxnC8", title: "Cloverleaf testimonial" },
  { id: "0S6S6TqtY-s", title: "Cloverleaf testimonial" },
  { id: "xR-gExV56lw", title: "Cloverleaf testimonial" },
  { id: "BLzIZlp4Gak", title: "Cloverleaf testimonial" },
  { id: "RhChXGHwIx8", title: "Cloverleaf testimonial" },
  { id: "AeAK9aCZsDI", title: "Cloverleaf testimonial" },
  { id: "ITr7VHyHa2E", title: "Cloverleaf testimonial" },
  { id: "sAwEztvfG_k", title: "Cloverleaf testimonial" },
] as const;

export default function Cloverleaf() {
  return (
    <CaseStudyLayout
      meta={{
        title: "Cloverleaf",
        description:
          "Testimonial video production, short-form content strategy (Opal), and animated motion graphics for a B2B team-development SaaS platform — cutting long-form interviews into compelling product stories.",
        role: "Video Producer & Motion Designer",
        timeline: "May 2024 – Jan 2025",
        liveUrl: `https://www.youtube.com/playlist?list=${CLOVERLEAF_PLAYLIST_ID}`,
        liveLabel: "YouTube Playlist",
        heroImage: CLOVERLEAF_BRANDMARK_SRC,
        heroImageAlt: "Cloverleaf brandmark",
        heroImageClassName: "w-24 h-24 md:w-28 md:h-28 object-contain",
      }}
      techStack={[
        "Premiere Pro",
        "After Effects",
        "Illustrator",
        "Riverside.fm",
        "Motion Design",
        "Video Production",
        "Brand Strategy",
        "Notion",
      ]}
    >
      {/* Context */}
      <Section label="Context" title="The Content Gap">
        <div className="grid md:grid-cols-2 gap-8 md:items-start">
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <p>
              Cloverleaf is a B2B SaaS platform for team development — used by companies like Kroger and P&G, along with business coaches in the corporate space. Their content strategy was ramping up with podcasts, short-form media, and YouTube videos explaining the product and featuring customer stories.
            </p>
            <p>
              The gap: they had 20-40 minute recorded interviews with customers talking about how Cloverleaf helped their teams, but no one turning those into polished, compelling stories that could stand on their own. Short-form often started in Opal — Cloverleaf&apos;s short-form content tool — while motion graphics and a consistent finish across the library still needed dedicated design support.
            </p>
            <p>
              The team was composed of a graphic designer and marketing specialists with mobile production equipment and a branded recording room — but digital video assets and motion design weren&apos;t strengths.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">Role Breakdown</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">1</span>
                <div>
                  <p className="text-zinc-200 font-medium">Testimonial Video Production</p>
                  <p className="text-zinc-500 text-xs">Cut 20-40 min interviews into compelling short stories</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">2</span>
                <div>
                  <p className="text-zinc-200 font-medium">Short-Form Content Strategy</p>
                  <p className="text-zinc-500 text-xs">Opal-assisted clips for YouTube Shorts, Instagram Reels, and TikTok</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">3</span>
                <div>
                  <p className="text-zinc-200 font-medium">Motion Graphics</p>
                  <p className="text-zinc-500 text-xs">Animated logo outro for long-form brand consistency</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">4</span>
                <div>
                  <p className="text-zinc-200 font-medium">Online Production Support</p>
                  <p className="text-zinc-500 text-xs">Riverside.fm recording quality management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Video Samples */}
      <Section label="Portfolio" title="Testimonial Playlist">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TESTIMONIAL_VIDEOS.map((v) => {
            const href = `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}&list=${encodeURIComponent(CLOVERLEAF_PLAYLIST_ID)}`;
            return (
              <a
                key={v.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl overflow-hidden border border-white/5 ring-0 transition-shadow hover:ring-2 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <img
                  src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  className="w-full aspect-video object-cover transition-opacity group-hover:opacity-90"
                />
              </a>
            );
          })}
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Approach */}
      <Section label="Approach" title="Production Workflow">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Pre-Production</p>
            <h3 className="text-base font-semibold">Recording Setup</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Managed online production using Riverside.fm to ensure high-quality footage from remote interviews. Prepared alongside the interviewer (my boss) who had questions ready for customers — leaders got leader-specific questions, team members got team-dynamic questions.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Editing</p>
            <h3 className="text-base font-semibold">Story Extraction</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Premiere Pro or After Effects depending on footage quality. Applied non-shake filters for poor cameras, voice enhancers for sound quality, color grading, and video polishing. The core skill: finding the stories within 20-40 minutes of conversation — the moments people can process and recognize easily.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 space-y-3">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Delivery</p>
            <h3 className="text-base font-semibold">Review & Distribution</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Recording updates within Notion for my boss to review. Final cuts distributed across YouTube (long-form), YouTube Shorts, Instagram Reels, and TikTok. Visual subtitles and clip candidates came from Opal, which scored the best AI-picked moments from transcripts before hand-off to edit.
            </p>
          </div>
        </div>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Key Details */}
      <Section label="Key Details" title="Deep Dives">
        <div className="grid gap-6">
          <DetailCard number="01" title="Testimonial Storytelling Technique">
            <p>
              The editing approach: hook the viewer with a strong moment from the testimonial about how Cloverleaf &ldquo;wowed&rdquo; the interviewee. Then build the context — what features they used, the team dynamic, just enough story to keep you engaged.
            </p>
            <p>
              The technical cuts: removing thinking pauses, &ldquo;ums,&rdquo; rambling, and dead air while retaining the authentic emotional arc. The goal was telling the story of how Cloverleaf&apos;s product was beneficial to their company&apos;s teams — not just that someone liked it, but <em>how</em> it changed their work.
            </p>
          </DetailCard>

          <DetailCard number="02" title="Animated Logo Outro">
            <p>
              Cloverleaf&apos;s team lacked motion designers, so their video library had no consistent ending treatment. Using their brand kit assets, I separated elements in Adobe Illustrator and animated them in After Effects following their brand guidelines.
            </p>
            <p>
              This was a system-level solution, not a one-off asset — the outro was shared across the company&apos;s asset library for anyone making Cloverleaf videos on other teams. It brought consistency to what had been an ad hoc video closing approach.
            </p>
            <DeepDiveVideo
              src={CLOVERLEAF_OUTRO_SRC}
              variant="wide"
              loop
              autoPlay
              muted
              caption="Loops automatically (muted so autoplay is allowed in the browser — unmute with controls if the file has audio)."
            />
            <p className="text-xs text-zinc-500">
              Note: Cloverleaf has since rebranded, so the specific outro assets are no longer in active use, but the template approach influenced their new brand system.
            </p>
          </DetailCard>

          <DetailCard number="03" title="Short-Form Content Strategy">
            <p>
              Shorts were produced to accommodate three platforms simultaneously: YouTube Shorts, Instagram Reels, and TikTok. Format decisions focused on visual subtitles (critical for silent scrolling), strong hooks from the first 2 seconds, and AI-assisted clip selection from full transcripts.
            </p>
            <p>
              Cloverleaf&apos;s short-form content tool was called <strong className="font-semibold text-zinc-200">Opal</strong>. We used it to upload full interviews, score segments by transcript quality, and surface the strongest clips as starting points for editing — cutting down the time spent scrubbing through 40 minutes of footage for usable moments.
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
              The animated outro was adopted company-wide and shared across teams as a brand asset. The CEO and my direct boss were positive about the video quality — &ldquo;they came out awesome.&rdquo;
            </p>
            <p>
              The testimonial playlist grew to approximately 19 videos during the internship, each telling a distinct customer story. The podcast clips and short-form content expanded Cloverleaf&apos;s reach across YouTube, Instagram, and TikTok simultaneously.
            </p>
          </div>
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <h3 className="text-base font-semibold text-zinc-100">Honest Reflection</h3>
            <p>
              The work was well-received, but I was frustrated with managing motion assets on the timeline I had — it felt too copy-paste at times, not enough opportunity to repair or refine. The volume of content (19+ videos) meant prioritizing output over craft on some pieces.
            </p>
            <p>
              The strongest contribution was the outro as a system-level asset and the story extraction technique for testimonials. The weakest area was the short-form content, which leaned heavily on Opal and similar tooling rather than editorial judgment — something I&apos;d approach differently with more time.
            </p>
          </div>
        </div>
      </Section>
    </CaseStudyLayout>
  );
}
