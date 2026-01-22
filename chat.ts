import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 1️⃣ Allow only POST
  if (req.method !== "POST") {
    return res.status(200).json({ error: "Only POST allowed" });
  }

  try {
    // 2️⃣ Safety check for API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OpenAI API key" });
    }

    // 3️⃣ Validate input
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // 4️⃣ Create OpenAI client
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 5️⃣ Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are mycarAi, an automotive assistant that helps drivers understand repairs and avoid unnecessary work.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    // 6️⃣ Send response
    return res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
