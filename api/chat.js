// Vercel serverless function: /api/chat
// Requires env var GEMINI_API_KEY (Vercel -> Project -> Settings -> Environment Variables),
// then REDEPLOY after adding it.

const SYSTEM_PROMPT = `You are the Leaf Aid Assistant, embedded inside the Leaf Aid plant-disease-diagnosis app.
You help users understand plant leaf diseases, symptoms, treatment options, and prevention tips.
Keep answers concise (2-5 sentences unless asked for detail), practical, and friendly.
If asked something totally unrelated to plants, gardening, or the Leaf Aid app, gently redirect back to what you can help with.
If the user mentions a specific diagnosis Leaf Aid gave them, treat it as real and build your answer around it.`;

// Models are tried in order. If one is overloaded (503/429/5xx), the next is used.
// Set GEMINI_MODEL in Vercel to put your own preferred model first.
const MODELS = [
  process.env.GEMINI_MODEL || 'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
];

const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callGemini(model, apiKey, prompt) {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
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
  const data = await resp.json().catch(() => ({}));
  return { resp, data };
}

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

  let lastStatus = 503;
  let lastError = 'The assistant is busy right now. Please try again in a moment.';

  try {
    for (const model of MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const { resp, data } = await callGemini(model, apiKey, prompt);

        if (resp.ok) {
          const reply =
            data?.candidates?.[0]?.content?.parts
              ?.map((p) => p.text)
              .filter(Boolean)
              .join('') ||
            "Sorry, I couldn't come up with a reply just now — try asking again.";
          return res.status(200).json({ reply });
        }

        console.error(`Gemini ${model} attempt ${attempt + 1}:`, resp.status, data?.error?.message);
        lastStatus = resp.status;
        lastError = data?.error?.message || lastError;

        // 404 = model name doesn't exist -> skip straight to the next model.
        if (resp.status === 404) break;
        // Non-retryable errors (bad key, bad request) -> stop and report.
        if (!RETRYABLE.has(resp.status) && resp.status !== 404) {
          return res.status(resp.status).json({ error: lastError });
        }
        if (attempt === 0) await sleep(600);
      }
    }

    return res.status(lastStatus).json({ error: lastError });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
