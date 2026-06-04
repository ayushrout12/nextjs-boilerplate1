import { streamText, generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Map the app's friendly model ids to AI Gateway model strings.
// The gateway works zero-config with AI_GATEWAY_API_KEY.
const MODEL_MAP = {
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

const GOOGLE_ALLOW_PRO =
  String(process.env.GEMINI_ALLOW_PRO || "").toLowerCase() === "true";
const GOOGLE_PRO_MODEL = GOOGLE_ALLOW_PRO ? "gemini-2.5-pro" : "gemini-2.5-flash";
const GOOGLE_MODEL_MAP = {
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

function resolveModel(modelId, userApiKey, forImage) {
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
  if (forImage) return IMAGE_MODEL;
  return MODEL_MAP[modelId] || DEFAULT_MODEL;
}

function toModelMessages(history, currentText, currentImages) {
  const messages = [];
  for (const m of history || []) {
    if (m.role === "assistant") {
      messages.push({ role: "assistant", content: m.content });
    } else {
      const parts = [{ type: "text", text: m.content }];
      for (const img of m.images || []) {
        parts.push({ type: "image", image: `data:${img.mimeType};base64,${img.data}` });
      }
      messages.push({ role: "user", content: parts });
    }
  }
  const currentParts = [{ type: "text", text: currentText }];
  for (const img of currentImages || []) {
    currentParts.push({ type: "image", image: `data:${img.mimeType};base64,${img.data}` });
  }
  messages.push({ role: "user", content: currentParts });
  return messages;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { prompt, systemInstruction, temperature, history, model, images, apiKey } =
    payload || {};

  try {
    const isImage = model === "gemini-2.5-flash-image";
    const requestedModel = resolveModel(model, apiKey, isImage);
    const messages = toModelMessages(history || [], prompt || "", images || []);

    // Image generation: return a single base64 data URL.
    if (isImage) {
      const result = await generateText({ model: requestedModel, messages });
      let imageUrl = "";
      for (const file of result.files || []) {
        if (file.mediaType?.startsWith("image/")) {
          imageUrl = `data:${file.mediaType};base64,${file.base64}`;
          break;
        }
      }
      if (!imageUrl) {
        return json({ error: "No image was returned by the model." }, 502);
      }
      return json({ imageUrl });
    }

    // Text/code generation: stream Server-Sent Events.
    const encoder = new TextEncoder();
    let streamError = null;

    const result = streamText({
      model: requestedModel,
      system: systemInstruction || undefined,
      messages,
      temperature: typeof temperature === "number" ? temperature : 0.7,
      onError: ({ error }) => {
        const raw = error?.message || "";
        if (/quota|rate limit|RESOURCE_EXHAUSTED|limit: 0/i.test(raw)) {
          streamError =
            "Your Gemini API key hit its quota. Free-tier keys can't use Pro models — switch to a Flash model, wait a moment, or use a paid key.";
        } else {
          streamError = raw || "Generation failed. Check your API key.";
        }
        console.error("AI stream error:", error);
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const delta of result.textStream) {
            if (delta) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`));
            }
          }
          if (streamError) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: streamError })}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: err?.message || "Generation failed" })}\n\n`),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return json({ error: error?.message || "Generation failed" }, 500);
  }
};
