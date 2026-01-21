import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" })
  }

  try {
    const { messages } = req.body

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are mycarAi, an automotive expert assistant.
Explain car repairs clearly to non-technical drivers.
Help users avoid unnecessary repairs and save money.
`
        },
        ...messages
      ]
    })

    res.status(200).json({
      reply: response.choices[0].message.content
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "OpenAI request failed" })
  }
}
