// Vercel serverless function: /api/chat
// Requires env var GEMINI_API_KEY (Vercel -> Project -> Settings -> Environment Variables),
// then REDEPLOY after adding it.

const SYSTEM_PROMPT = `You are the Leaf Aid Assistant, embedded inside the Leaf Aid plant-disease-diagnosis app.
You help users understand plant leaf diseases, symptoms, treatment options, and prevention tips.
Keep answers concise (2-5 sentences unless asked for detail), practical, and friendly.
If asked something totally unrelated to plants, gardening, or the Leaf Aid app, gently redirect back to what you can help with.
If the user mentions a specific diagnosis Leaf Aid gave them, treat it as real and build your answer around it.`;

// 'gemini-flash-latest' is Google's alias that always points to the newest Flash model.
// To pin a specific model, set GEMINI_MODEL in Vercel (e.g. the exact name from Google AI Studio).
const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY' });
  }

  // Vercel parses JSON bodies automatically; handle a raw string just in case.
  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { message, context, lang } = body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing "message"' });
  }

  const contextLine = context
    ? `\nContext — the user's most recent Leaf Aid scan: ${context}`
    : '';
  const langName = { te: 'Telugu', hi: 'Hindi' }[lang];
  const langLine = langName
    ? `\nAlways reply in ${langName} (use ${langName} script). Keep disease and crop names understandable.`
    : '';
  const prompt = `${SYSTEM_PROMPT}${langLine}${contextLine}\n\nUser: ${message}`;

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey, // header instead of ?key= so it never lands in logs
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 2048, // thinking tokens count toward this limit
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await resp.json();

    if (!resp.ok) {
      console.error('Gemini error:', resp.status, data);
      return res
        .status(resp.status)
        .json({ error: data?.error?.message || 'Gemini API error' });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .filter(Boolean)
        .join('') ||
      "Sorry, I couldn't come up with a reply just now — try asking again.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
