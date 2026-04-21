// /api/pronunciation.ts

import OpenAI from "openai"

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // ⚠️ Vercel needs body parsing workaround (keep simple for now)
    const { message } = req.body

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Evaluate pronunciation and return score (0-100)"
        },
        {
          role: "user",
          content: message
        }
      ]
    })

    res.status(200).json({
      reply: response.choices[0].message.content
    })

  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
}
