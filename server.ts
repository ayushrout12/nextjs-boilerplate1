import express from "express";
import { createServer as createViteServer } from "vite";
import { streamText, generateText } from "ai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Supabase client for deploy/publish (stores generated sites, served worldwide).
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabase =
  SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Turn a desired name into a safe, url-friendly subdomain slug.
function slugify(name: string) {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// Render the not-found page for a missing published site.
function notFoundPage() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Site not found</title><style>body{margin:0;font-family:Georgia,'Times New Roman',serif;background:#fdf2f6;color:#7a2942;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center}div{max-width:28rem;padding:2rem}h1{font-size:2rem;margin:0 0 .5rem}p{color:#a05673}</style></head><body><div><h1>Site not found</h1><p>This Lotus site doesn't exist or hasn't been published yet.</p></div></body></html>`;
}

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

  // Deploy/publish endpoint: store the generated site and return a live URL.
  app.post("/api/deploy", async (req, res) => {
    const { html, name, title } = req.body || {};

    if (!supabase) {
      return res.status(500).json({ error: "Publishing is not configured." });
    }
    if (!html || typeof html !== "string") {
      return res.status(400).json({ error: "Missing site HTML to publish." });
    }

    try {
      let slug = slugify(name) || `site-${Date.now().toString(36)}`;

      // Ensure the slug is unique by appending a short suffix if taken.
      const { data: existing } = await supabase
        .from("published_sites")
        .select("subdomain")
        .eq("subdomain", slug)
        .maybeSingle();

      if (existing) {
        slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      }

      const { error } = await supabase.from("published_sites").insert({
        subdomain: slug,
        title: title || name || "Lotus site",
        html_content: html,
      });

      if (error) throw error;

      const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
      const host = req.headers.host;
      const url = `${proto}://${host}/s/${slug}`;

      return res.json({ success: true, subdomain: slug, url });
    } catch (error: any) {
      console.error("Deploy error:", error);
      return res.status(500).json({ error: error?.message || "Deploy failed" });
    }
  });

  // Public serve route: render a published site by slug, viewable worldwide.
  app.get("/s/:slug", async (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");

    if (!supabase) {
      return res.status(500).send(notFoundPage());
    }

    try {
      const { data, error } = await supabase
        .from("published_sites")
        .select("html_content")
        .eq("subdomain", req.params.slug)
        .maybeSingle();

      if (error || !data) {
        return res.status(404).send(notFoundPage());
      }

      return res.status(200).send(data.html_content);
    } catch {
      return res.status(404).send(notFoundPage());
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
