import express from "express";
import { createServer as createViteServer } from "vite";
import { streamText, generateText } from "ai";
import dotenv from "dotenv";

dotenv.config();

// Map the app's friendly model ids to AI Gateway model strings.
// The gateway works with zero config using AI_GATEWAY_API_KEY.
const MODEL_MAP: Record<string, string> = {
  "gemini-3.1-pro-preview": "google/gemini-2.5-pro",
  "gemini-3.1-flash-preview": "google/gemini-2.5-flash",
  "gemini-3.1-flash-lite-preview": "google/gemini-2.5-flash",
  "gemini-3-pro-preview": "google/gemini-2.5-pro",
  "gemini-3-flash-preview": "google/gemini-2.5-flash",
  "gemini-2.5-flash": "google/gemini-2.5-flash",
  "gemini-2.5-flash-image": "google/gemini-2.5-flash-image-preview",
};

const DEFAULT_MODEL = "google/gemini-2.5-flash";
const IMAGE_MODEL = "google/gemini-2.5-flash-image-preview";

type IncomingImage = { mimeType: string; data: string };
type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
  images?: IncomingImage[];
};

function toModelMessages(
  history: IncomingMessage[],
  currentText: string,
  currentImages: IncomingImage[],
) {
  const messages: any[] = [];

  for (const m of history || []) {
    if (m.role === "assistant") {
      messages.push({ role: "assistant", content: m.content });
    } else {
      const parts: any[] = [{ type: "text", text: m.content }];
      for (const img of m.images || []) {
        parts.push({ type: "image", image: `data:${img.mimeType};base64,${img.data}` });
      }
      messages.push({ role: "user", content: parts });
    }
  }

  const currentParts: any[] = [{ type: "text", text: currentText }];
  for (const img of currentImages || []) {
    currentParts.push({ type: "image", image: `data:${img.mimeType};base64,${img.data}` });
  }
  messages.push({ role: "user", content: currentParts });

  return messages;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // AI generation endpoint (text + image) powered by the Vercel AI Gateway.
  app.post("/api/generate", async (req, res) => {
    const {
      prompt,
      systemInstruction,
      temperature,
      history,
      model,
      images,
    } = req.body || {};

    try {
      const requestedModel = MODEL_MAP[model] || DEFAULT_MODEL;
      const isImage = model === "gemini-2.5-flash-image" || requestedModel === IMAGE_MODEL;
      const messages = toModelMessages(history || [], prompt || "", images || []);

      // Image generation: return a single base64 data URL.
      if (isImage) {
        const result = await generateText({
          model: IMAGE_MODEL,
          messages,
        });

        let imageUrl = "";
        for (const file of result.files || []) {
          if (file.mediaType?.startsWith("image/")) {
            imageUrl = `data:${file.mediaType};base64,${file.base64}`;
            break;
          }
        }

        res.setHeader("Content-Type", "application/json");
        if (!imageUrl) {
          return res.status(502).json({ error: "No image was returned by the model." });
        }
        return res.json({ imageUrl });
      }

      // Text/code generation: stream Server-Sent Events.
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const result = streamText({
        model: requestedModel,
        system: systemInstruction || undefined,
        messages,
        temperature: typeof temperature === "number" ? temperature : 0.7,
      });

      for await (const delta of result.textStream) {
        if (delta) {
          res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("AI generation error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error?.message || "Generation failed" });
      } else {
        res.write(`data: ${JSON.stringify({ error: error?.message || "Generation failed" })}\n\n`);
        res.end();
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
