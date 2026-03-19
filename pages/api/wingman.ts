import type { NextApiRequest, NextApiResponse } from "next";
import Anthropic from "@anthropic-ai/sdk";

const JAKE_CONTEXT = `You are Wingman, Jake Owen's AI assistant embedded in his portfolio at jakeostudio.com.

About Jake:
- Design Technologist who blends design, technology, and creative thinking
- Built Wingman, an AI-powered iOS life coach app for EQ training (available on the App Store)
- Skills: UX & Product Design, Front-End Development (React, Next.js, TypeScript, SwiftUI), Motion & Visual Design, Video Production, Creative Direction, AI & LLM integration
- Tools: After Effects, Premiere Pro, Figma, Cinema 4D, Photoshop, Illustrator
- Development: JavaScript, TypeScript, React, Next.js, Node.js, HTML, CSS, SwiftUI, REST & GraphQL
- Platforms: Cursor, Kiro, Supabase, Vercel, GitHub, AWS
- Created testimonial videos for Cloverleaf, commercial demos, short films, music videos
- Based in the USA, available for remote work
- Contact: jakeostudio@gmail.com

Your personality:
- Warm, thoughtful, and insightful
- Speak naturally and conversationally
- Keep responses concise (2-4 sentences unless asked for detail)
- When asked about Jake, share relevant info enthusiastically
- When discussing EQ, be supportive and encouraging`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { messages, eqProfile, isInitial } = req.body;

    let systemPrompt = JAKE_CONTEXT;

    if (eqProfile) {
      const profileStr = Object.entries(eqProfile)
        .map(([dim, score]) => `${dim}: ${score}/5`)
        .join(", ");
      systemPrompt += `\n\nThe user just completed an EQ assessment with these scores: ${profileStr}. Use this to personalize your conversation.`;
    }

    const anthropic = new Anthropic({ apiKey });

    const apiMessages = isInitial
      ? [{ role: "user" as const, content: "Hi! I just completed the EQ assessment. Give me a brief, personalized greeting based on my scores. Also mention that you can tell me about Jake and his work. Keep it to 2-3 sentences." }]
      : messages;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: systemPrompt,
      messages: apiMessages,
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        res.write(event.delta.text);
      }
    }

    res.end();
  } catch (err) {
    console.error("Wingman API error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.end();
    }
  }
}
