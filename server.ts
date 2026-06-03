import express from "express";
import { createServer as createViteServer } from "vite";
import { streamText, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
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

// Normalize generated CDN globals so published sites render standalone:
// aliases framer-motion (UMD global is `Motion`) and provides a `LucideReact`
// global built from the vanilla `lucide` icon data.
const RUNTIME_SHIM = `<script>(function(){
  function aliasMotion(){try{var m=window.Motion||window.FramerMotion||window.framerMotion;if(m){window.Motion=m;window.FramerMotion=m;window.framerMotion=m;}}catch(e){}}
  function makeIcon(name){return function(props){props=props||{};var R=window.React;if(!R)return null;var data=(window.lucide&&((window.lucide.icons&&window.lucide.icons[name])||window.lucide[name]))||[];var size=props.size!=null?props.size:24;var kids=(Array.isArray(data)?data:[]).map(function(n,i){return R.createElement(n[0],Object.assign({key:i},n[1]));});return R.createElement('svg',{xmlns:'http://www.w3.org/2000/svg',width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:props.strokeWidth!=null?props.strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',className:props.className,style:props.style,'aria-hidden':true},kids);};}
  function aliasLucide(){try{if(typeof window.LucideReact==='undefined'&&typeof Proxy!=='undefined'){var p=new Proxy({},{get:function(_,name){if(typeof name!=='string'||name==='__esModule'||name==='default')return undefined;return makeIcon(name);}});window.LucideReact=p;window.lucideReact=p;}}catch(e){}}
  aliasMotion();aliasLucide();
  window.addEventListener('load',function(){try{aliasMotion();aliasLucide();if(window.Babel&&window.Babel.transformScriptTags){window.Babel.transformScriptTags();}}catch(e){console.error('[preview]',e);}});
})();</script>`;

function withRuntimeFixes(html: string) {
  if (!html || typeof html !== "string") return html;
  if (html.includes("</head>")) return html.replace("</head>", `${RUNTIME_SHIM}</head>`);
  return RUNTIME_SHIM + html;
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

// Direct Google model ids (no "google/" prefix) for when a user supplies
// their own Gemini API key instead of using the AI Gateway.
// NOTE: free-tier Gemini keys have a quota of 0 for gemini-2.5-pro, so by
// default we map the "pro" selections to flash (which the free tier allows).
// Set GEMINI_ALLOW_PRO=true if you have a paid key and want real pro.
const GOOGLE_ALLOW_PRO =
  String(process.env.GEMINI_ALLOW_PRO || "").toLowerCase() === "true";
const GOOGLE_PRO_MODEL = GOOGLE_ALLOW_PRO ? "gemini-2.5-pro" : "gemini-2.5-flash";
const GOOGLE_MODEL_MAP: Record<string, string> = {
  "gemini-3.1-pro-preview": GOOGLE_PRO_MODEL,
  "gemini-3.1-flash-preview": "gemini-2.5-flash",
  "gemini-3.1-flash-lite-preview": "gemini-2.5-flash",
  "gemini-3-pro-preview": GOOGLE_PRO_MODEL,
  "gemini-3-flash-preview": "gemini-2.5-flash",
  "gemini-2.5-flash": "gemini-2.5-flash",
  "gemini-2.5-flash-image": "gemini-2.5-flash-image-preview",
};
const GOOGLE_DEFAULT_MODEL = "gemini-2.5-flash";
const GOOGLE_IMAGE_MODEL = "gemini-2.5-flash-image-preview";

// Resolve which model object to use. With a user-provided Gemini key we hit
// Google directly; otherwise we use the AI Gateway model string.
function resolveModel(
  modelId: string,
  userApiKey: string | undefined,
  forImage: boolean,
) {
  // Prefer a per-request user key; otherwise use the app's configured Gemini
  // key from the environment (the "chosen" key shared by all visitors).
  const userKey = typeof userApiKey === "string" ? userApiKey.trim() : "";
  const envKey = (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    ""
  ).trim();
  const key = userKey || envKey;
  if (key) {
    const google = createGoogleGenerativeAI({ apiKey: key });
    const googleId = forImage
      ? GOOGLE_IMAGE_MODEL
      : GOOGLE_MODEL_MAP[modelId] || GOOGLE_DEFAULT_MODEL;
    return google(googleId);
  }
  // Fall back to the AI Gateway (model string, zero-config with AI_GATEWAY_API_KEY).
  if (forImage) return IMAGE_MODEL;
  return MODEL_MAP[modelId] || DEFAULT_MODEL;
}

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
      apiKey,
    } = req.body || {};

    try {
      const isImage = model === "gemini-2.5-flash-image";
      const requestedModel = resolveModel(model, apiKey, isImage);
      const messages = toModelMessages(history || [], prompt || "", images || []);

      // Image generation: return a single base64 data URL.
      if (isImage) {
        const result = await generateText({
          model: requestedModel,
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

      let streamError: string | null = null;

      const result = streamText({
        model: requestedModel,
        system: systemInstruction || undefined,
        messages,
        temperature: typeof temperature === "number" ? temperature : 0.7,
        onError: ({ error }: { error: unknown }) => {
          const raw = (error as any)?.message || "";
          if (/quota|rate limit|RESOURCE_EXHAUSTED|limit: 0/i.test(raw)) {
            streamError =
              "Your Gemini API key hit its quota. Free-tier keys can't use Pro models — switch to a Flash model, wait a moment, or use a paid key.";
          } else {
            streamError = raw || "Generation failed. Check your API key.";
          }
          console.error("AI stream error:", error);
        },
      });

      for await (const delta of result.textStream) {
        if (delta) {
          res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
        }
      }

      if (streamError) {
        res.write(`data: ${JSON.stringify({ error: streamError })}\n\n`);
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

      return res.status(200).send(withRuntimeFixes(data.html_content));
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
