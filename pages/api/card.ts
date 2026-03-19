import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, icon, bg_style, animation, note } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Name is required" });
    }

    const { error } = await supabaseAdmin.from("cards").insert({
      name: name.trim().slice(0, 24),
      email: email ? String(email).trim().slice(0, 100) : null,
      icon: icon || "🚀",
      bg_style: bg_style || "linear-gradient(135deg, #6366f1, #8b5cf6)",
      animation: animation || "float",
      note: note ? String(note).trim().slice(0, 280) : null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to save card" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Card API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
