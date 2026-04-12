import type { IconType } from "react-icons";
import {
  SiAffinity,
  SiClaude,
  SiFigma,
  SiGithub,
  SiHubspot,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiReact,
  SiStripe,
  SiSupabase,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import {
  TbApi,
  TbBrandAdobeAfterEffect,
  TbBrandAdobeIllustrator,
  TbBrandAdobePhotoshop,
  TbBrandAdobePremier,
  TbBrandVscode,
  TbMicrophone2,
  TbMovie,
  TbRoute,
  TbSparkles,
} from "react-icons/tb";

/** Pixel size for stack pills (matches text-xs). */
export const TOOL_STACK_ICON_SIZE = 14;

/** Map display label → icon. Labels must match `TOOL_CATEGORIES` items exactly. */
export const toolStackIconMap: Partial<Record<string, IconType>> = {
  Cursor: TbBrandVscode,
  "Claude Code": SiClaude,
  ChatGPT: SiOpenai,
  OpenRouter: TbRoute,
  "Prompt Engineering": TbSparkles,
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  SwiftUI: SiSwift,
  "REST APIs": TbApi,
  "Node.js": SiNodedotjs,
  Figma: SiFigma,
  Photoshop: TbBrandAdobePhotoshop,
  Illustrator: TbBrandAdobeIllustrator,
  Affinity: SiAffinity,
  "After Effects": TbBrandAdobeAfterEffect,
  "Premiere Pro": TbBrandAdobePremier,
  CapCut: TbMovie,
  Riverside: TbMicrophone2,
  Vercel: SiVercel,
  Supabase: SiSupabase,
  Stripe: SiStripe,
  GitHub: SiGithub,
  HubSpot: SiHubspot,
  /** Hero / work featured tags */
  "LLM Integration": SiOpenai,
  "iOS Development": SiSwift,
  "EQ Frameworks": TbSparkles,
  "Video Production": TbMovie,
  "Motion Design": TbBrandAdobeAfterEffect,
  "AI Development": SiOpenai,
};

/** Subtle tinted pill (dark UI): icon at brand hex, soft fill + border. */
export type ToolStackPillTheme = {
  color: string;
  background: string;
  border: string;
};

/** Labels must match `TOOL_CATEGORIES` items exactly. */
export const toolStackPillTheme: Partial<Record<string, ToolStackPillTheme>> = {
  Cursor: {
    color: "#a1a1aa",
    background: "rgba(113, 113, 122, 0.14)",
    border: "rgba(161, 161, 170, 0.35)",
  },
  "Claude Code": {
    color: "#d97757",
    background: "rgba(217, 119, 87, 0.12)",
    border: "rgba(217, 119, 87, 0.35)",
  },
  ChatGPT: {
    color: "#10a37f",
    background: "rgba(16, 163, 127, 0.12)",
    border: "rgba(16, 163, 127, 0.35)",
  },
  OpenRouter: {
    color: "#7c89ff",
    background: "rgba(124, 137, 255, 0.12)",
    border: "rgba(124, 137, 255, 0.35)",
  },
  "Prompt Engineering": {
    color: "#c084fc",
    background: "rgba(192, 132, 252, 0.12)",
    border: "rgba(192, 132, 252, 0.35)",
  },
  React: {
    color: "#61dafb",
    background: "rgba(97, 218, 251, 0.1)",
    border: "rgba(97, 218, 251, 0.35)",
  },
  "Next.js": {
    color: "#f4f4f5",
    background: "rgba(244, 244, 245, 0.08)",
    border: "rgba(244, 244, 245, 0.28)",
  },
  TypeScript: {
    color: "#3178c6",
    background: "rgba(49, 120, 198, 0.12)",
    border: "rgba(49, 120, 198, 0.38)",
  },
  "Tailwind CSS": {
    color: "#38bdf8",
    background: "rgba(56, 189, 248, 0.1)",
    border: "rgba(56, 189, 248, 0.35)",
  },
  SwiftUI: {
    color: "#0a84ff",
    background: "rgba(10, 132, 255, 0.12)",
    border: "rgba(10, 132, 255, 0.35)",
  },
  "REST APIs": {
    color: "#34d399",
    background: "rgba(52, 211, 153, 0.1)",
    border: "rgba(52, 211, 153, 0.32)",
  },
  "Node.js": {
    color: "#5fa04e",
    background: "rgba(95, 160, 78, 0.12)",
    border: "rgba(95, 160, 78, 0.35)",
  },
  Figma: {
    color: "#f24e1e",
    background: "rgba(242, 78, 30, 0.1)",
    border: "rgba(242, 78, 30, 0.32)",
  },
  Photoshop: {
    color: "#31a8ff",
    background: "rgba(49, 168, 255, 0.1)",
    border: "rgba(49, 168, 255, 0.32)",
  },
  Illustrator: {
    color: "#ff9a00",
    background: "rgba(255, 154, 0, 0.1)",
    border: "rgba(255, 154, 0, 0.32)",
  },
  Affinity: {
    color: "#5b9bd5",
    background: "rgba(91, 155, 213, 0.12)",
    border: "rgba(91, 155, 213, 0.32)",
  },
  "After Effects": {
    color: "#9999ff",
    background: "rgba(153, 153, 255, 0.12)",
    border: "rgba(153, 153, 255, 0.35)",
  },
  "Premiere Pro": {
    color: "#9999ff",
    background: "rgba(153, 153, 255, 0.1)",
    border: "rgba(153, 153, 255, 0.3)",
  },
  CapCut: {
    color: "#00e5c9",
    background: "rgba(0, 229, 201, 0.1)",
    border: "rgba(0, 229, 201, 0.3)",
  },
  Riverside: {
    color: "#fb923c",
    background: "rgba(251, 146, 60, 0.12)",
    border: "rgba(251, 146, 60, 0.32)",
  },
  Vercel: {
    color: "#fafafa",
    background: "rgba(250, 250, 250, 0.06)",
    border: "rgba(250, 250, 250, 0.25)",
  },
  Supabase: {
    color: "#3ecf8e",
    background: "rgba(62, 207, 142, 0.12)",
    border: "rgba(62, 207, 142, 0.35)",
  },
  Stripe: {
    color: "#635bff",
    background: "rgba(99, 91, 255, 0.12)",
    border: "rgba(99, 91, 255, 0.35)",
  },
  GitHub: {
    color: "#e6edf3",
    background: "rgba(230, 237, 243, 0.08)",
    border: "rgba(230, 237, 243, 0.22)",
  },
  HubSpot: {
    color: "#ff7a59",
    background: "rgba(255, 122, 89, 0.12)",
    border: "rgba(255, 122, 89, 0.32)",
  },
  "LLM Integration": {
    color: "#10a37f",
    background: "rgba(16, 163, 127, 0.12)",
    border: "rgba(16, 163, 127, 0.35)",
  },
  "iOS Development": {
    color: "#0a84ff",
    background: "rgba(10, 132, 255, 0.12)",
    border: "rgba(10, 132, 255, 0.35)",
  },
  "EQ Frameworks": {
    color: "#a78bfa",
    background: "rgba(167, 139, 250, 0.12)",
    border: "rgba(167, 139, 250, 0.35)",
  },
  "Video Production": {
    color: "#f472b6",
    background: "rgba(244, 114, 182, 0.1)",
    border: "rgba(244, 114, 182, 0.32)",
  },
  "Motion Design": {
    color: "#a78bfa",
    background: "rgba(153, 153, 255, 0.12)",
    border: "rgba(153, 153, 255, 0.35)",
  },
  "AI Development": {
    color: "#34d399",
    background: "rgba(52, 211, 153, 0.12)",
    border: "rgba(52, 211, 153, 0.35)",
  },
};
