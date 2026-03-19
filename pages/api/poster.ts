import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const STYLE_DIRECTIONS = [
  {
    name: "Swiss International Style",
    prompt: "clean Swiss international typographic poster, Helvetica-inspired type, bold grid layout, minimal color palette, geometric shapes, Josef Müller-Brockmann influence",
  },
  {
    name: "Psychedelic Concert Poster",
    prompt: "1960s psychedelic concert poster, swirling organic lettering, vibrant saturated colors, Art Nouveau borders, hand-drawn illustration, Fillmore poster style",
  },
  {
    name: "Minimalist Bauhaus",
    prompt: "Bauhaus school design poster, primary colors, geometric forms, clean sans-serif typography, asymmetric composition, Kandinsky and Moholy-Nagy influence",
  },
  {
    name: "Risograph Print",
    prompt: "risograph printed poster, limited color palette with overprint effects, grainy halftone textures, misregistration, indie zine aesthetic",
  },
  {
    name: "Japanese Woodblock",
    prompt: "Japanese ukiyo-e inspired poster, woodblock print texture, flowing lines, muted earth tones with accent colors, nature motifs, elegant typography",
  },
  {
    name: "Art Deco",
    prompt: "1920s Art Deco poster, gold and black color scheme, geometric sunburst patterns, elegant serif typography, Gatsby-era luxury, symmetrical layout",
  },
  {
    name: "Soviet Constructivist",
    prompt: "Soviet constructivist propaganda poster, bold red and black, diagonal composition, photomontage elements, strong geometric typography, Alexander Rodchenko influence",
  },
  {
    name: "Vaporwave",
    prompt: "vaporwave aesthetic poster, pastel pink and cyan, retro 80s grid, marble busts, Japanese text accents, glitch effects, nostalgic digital aesthetic",
  },
  {
    name: "Brutalist Typography",
    prompt: "brutalist graphic design poster, raw oversized typography, extreme contrast, intentional imperfection, black and white with one accent color, confrontational layout",
  },
  {
    name: "Retro Futurism",
    prompt: "retro futuristic poster, 1950s space age aesthetic, atomic era illustrations, chrome and neon colors, starfield background, vintage sci-fi typography",
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { song } = req.body;

    if (!song || typeof song !== "string" || song.trim().length === 0) {
      return res.status(400).json({ error: "Song name is required" });
    }

    const styleIndex = Math.floor(Math.random() * STYLE_DIRECTIONS.length);
    const style = STYLE_DIRECTIONS[styleIndex];

    const prompt = `Design a stunning music poster for the song "${song.trim()}". 

Style direction: ${style.prompt}

The poster should:
- Feature the song title and artist name prominently
- Include visual elements and imagery inspired by the song's themes, mood, and lyrics
- Be a vertical poster format (portrait orientation)
- Feel like a collectible art print, not a generic template
- Have strong visual hierarchy and intentional composition

Do NOT include any realistic human faces or photographs of people. Use abstract, typographic, or illustrative approaches instead.`;

    const openai = new OpenAI({ apiKey });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1792",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({ error: "No image generated" });
    }

    res.status(200).json({ imageUrl, style: style.name });
  } catch (err: unknown) {
    console.error("Poster API error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    if (!res.headersSent) {
      res.status(500).json({ error: message });
    }
  }
}
