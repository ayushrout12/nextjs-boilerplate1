/* global process */
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, systemInstruction, temperature } = req.body || {};

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing prompt." });
  }

  try {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "No Gemini API key configured on server.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          systemInstruction ||
          "You are Lotus, an AI website builder. Generate clean, working web project files.",
        temperature: typeof temperature === "number" ? temperature : 0.7,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: error?.message || "Gemini API request failed.",
      });
    }

    res.write(
      `data: ${JSON.stringify({
        error: error?.message || "Gemini API request failed.",
      })}\n\n`
    );
    res.write("data: [DONE]\n\n");
    res.end();
  }
}
