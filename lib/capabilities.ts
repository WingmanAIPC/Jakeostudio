export type CapabilityIcon =
  | "technologist"
  | "fullstack"
  | "product"
  | "motion"
  | "graphic";

export interface Capability {
  icon: CapabilityIcon;
  title: string;
  desc: string;
  /** Tools and methods, shown as small tags */
  tools: string[];
}

/** Copy for the /work capabilities grid */
export const CAPABILITY_CARDS: Capability[] = [
  {
    icon: "technologist",
    title: "Creative Technologist",
    desc: "Building products with AI as core infrastructure.",
    tools: ["Cursor", "Claude Code", "LLM integration", "Prompt engineering"],
  },
  {
    icon: "fullstack",
    title: "Full-Stack Developer",
    desc: "Shipping production apps solo.",
    tools: ["React", "Next.js", "TypeScript", "Node.js", "Supabase", "Stripe", "REST APIs"],
  },
  {
    icon: "product",
    title: "UX & Product Designer",
    desc: "Design that feels right.",
    tools: ["Interaction design", "Prototyping", "Information architecture", "User research"],
  },
  {
    icon: "motion",
    title: "Motion & Video Producer",
    desc: "Brand storytelling, from interview to final cut.",
    tools: ["After Effects", "Premiere Pro", "Testimonials", "Short-form"],
  },
  {
    icon: "graphic",
    title: "Graphic Designer",
    desc: "Campaign-ready visuals for web, social, and print.",
    tools: ["Brand systems", "Layout", "Typography"],
  },
];
