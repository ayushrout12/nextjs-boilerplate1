import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const supabase =
  SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

function slugify(name) {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
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

  const { html, name, title } = payload || {};

  if (!supabase) {
    return json({ error: "Publishing is not configured." }, 500);
  }
  if (!html || typeof html !== "string") {
    return json({ error: "Missing site HTML to publish." }, 400);
  }

  try {
    let slug = slugify(name) || `site-${Date.now().toString(36)}`;

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

    const url = new URL(req.url);
    const origin = `${url.protocol}//${url.host}`;
    return json({ success: true, subdomain: slug, url: `${origin}/s/${slug}` });
  } catch (error) {
    console.error("Deploy error:", error);
    return json({ error: error?.message || "Deploy failed" }, 500);
  }
};
