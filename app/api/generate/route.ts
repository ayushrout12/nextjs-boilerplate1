import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const body = await req.json()
  const prompt = body.prompt

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert web developer that generates clean Next.js website code.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  return Response.json({
    result: response.choices[0].message.content,
  })
}
