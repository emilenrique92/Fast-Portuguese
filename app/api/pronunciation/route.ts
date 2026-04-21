import OpenAI from 'openai'

export async function POST(req: Request) {

  const formData = await req.formData()
  const audio = formData.get('audio') as File
  const expectedText = formData.get('expectedText') as string

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  // 1. TRANSCRIBE AUDIO
  const transcription = await openai.audio.transcriptions.create({
    file: audio,
    model: 'gpt-4o-mini-transcribe'
  })

  const spokenText = transcription.text

  // 2. EVALUATE PRONUNCIATION
  const evaluation = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: `
You are a pronunciation evaluator for Portuguese learners.

Compare:
Expected: "${expectedText}"
Spoken: "${spokenText}"

Return:
- score (0-100)
- short feedback
- highlight mistakes

Respond JSON only.
        `
      }
    ]
  })

  const result = JSON.parse(evaluation.choices[0].message.content!)

  return Response.json({
    spokenText,
    score: result.score,
    feedback: result.feedback
  })
}
