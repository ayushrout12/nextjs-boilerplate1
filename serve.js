import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  const slug = event.path.split("/").pop();

  const { data, error } = await supabase
    .from("published_sites")
    .select("html")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/html" },
      body: "<h1>Site not found</h1>",
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: data.html,
  };
};