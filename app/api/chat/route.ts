import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const lowerMsg = message.toLowerCase();
    
    let reply = "";
    if (lowerMsg.includes("hero") || lowerMsg.includes("header")) {
      reply = "i'll create a stunning hero section with a lotus‑inspired gradient and a clear call‑to‑action. want it centered or with an image?";
    } else if (lowerMsg.includes("contact") || lowerMsg.includes("form")) {
      reply = "adding a contact form. i'll include name, email, and message fields with lotus‑styled inputs. should i add a captcha?";
    } else if (lowerMsg.includes("dark") || lowerMsg.includes("light")) {
      reply = "your site already has a dark/light mode toggle. you can customize the colors in `globals.css` under the lotus palette.";
    } else if (lowerMsg.includes("lotus")) {
      reply = "🌸 the lotus symbolizes purity and rebirth. your site will bloom beautifully with soft pinks and greens.";
    } else {
      reply = `i understand you want to build something related to "${message}". tell me more – a landing page, a blog, a shop? i'll generate the code.`;
    }
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "something went wrong. please try again." }, { status: 500 });
  }
}
