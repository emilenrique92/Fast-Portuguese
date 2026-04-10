import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  scenario: string;
  userLevel: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages, scenario, userLevel }: ChatRequest = await req.json();

    const systemPrompt = `You are Marina, a friendly Brazilian Portuguese tutor helping a Spanish speaker learn Portuguese.

Current student level: ${userLevel || "A1"}
Conversation scenario: ${scenario || "general"}

Your teaching approach:
- Respond PRIMARILY in Brazilian Portuguese (not European Portuguese)
- Keep responses conversational and natural (2-4 sentences max)
- After your Portuguese response, add a brief correction/tip section if the user made errors
- Highlight key vocabulary differences between Spanish and Portuguese
- Use a warm, encouraging tone
- Gradually increase complexity as the student improves
- If the student writes in Spanish, respond in Portuguese and gently guide them to try in Portuguese
- Point out "falsos amigos" (false cognates) when relevant
- Use brackets [like this] to provide Spanish translations for new words

Scenario contexts:
- meeting_people: introductions, greetings, basic info exchange
- ordering_food: restaurant vocabulary, menu items, preferences
- travel: directions, transportation, asking for help
- shopping: prices, sizes, bargaining politely
- small_talk: weather, weekend, family, hobbies
- opinions: expressing likes/dislikes, agreeing/disagreeing
- general: free conversation practice

Format corrections like this (only when needed):
💡 *Correção:* [correction in Portuguese with Spanish translation]

Always end responses with a follow-up question to keep the conversation flowing.`;

    const openaiMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        max_tokens: 400,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: `OpenAI error: ${error}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || "Desculpe, não entendi. Pode repetir?";

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
