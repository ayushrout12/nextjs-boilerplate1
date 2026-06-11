import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  try {
    const { slug, html } = JSON.parse(event.body || "{}");

    if (!slug || !html) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing slug or html" }),
      };
    }

    const { error } = await supabase
      .from("published_sites")
      .upsert({ slug, html }, { onConflict: "slug" });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: `https://trylotus.dev/s/${slug}`,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};