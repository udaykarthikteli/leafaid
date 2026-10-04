// Vercel serverless function: /api/voice-chat
// Receives a short voice recording (16 kHz mono WAV, base64), asks Gemini to
// transcribe it, detect the spoken language, and answer in that same language.
// Requires env var GEMINI_API_KEY.

const MODELS = [
  process.env.GEMINI_MODEL || 'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
];

const RETRYABLE = new Set([429, 500, 502, 503, 504]);

const PROMPT = `You are the Leaf Aid Assistant inside a plant-disease-diagnosis app. You help users understand plant leaf diseases, symptoms, treatment and prevention.

The attached audio is the user's spoken question. Listen to it, work out which language they spoke (it may be English, Telugu, Hindi, Tamil, Kannada, or any other language), and answer in THAT SAME language and script.

Reply with ONLY a JSON object (no markdown fences, no extra text) with exactly these keys:
{
  "transcript": string,  // what the user said, written in the language and script they spoke. "" if there is no clear speech.
  "language": string,    // BCP-47 code of the spoken language, e.g. "en-US", "te-IN", "hi-IN", "ta-IN"
  "reply": string        // your answer in the same language. "" if there is no clear speech.
}

Rules for "reply":
- 2 to 5 short sentences, practical and friendly.
- Plain text only, because it will be read aloud: no markdown, no asterisks, no bullet symbols, no emojis.
- If the question is unrelated to plants, gardening or the Leaf Aid app, gently steer back to what you can help with.
- If the user mentions a diagnosis Leaf Aid gave them, treat it as real and build your answer around it.`;

async function callGemini(model, apiKey, b64, extra) {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT + extra },
              { inline_data: { mime_type: 'audio/wav', data: b64 } },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 4096, // thinking tokens count toward this limit
          temperature: 0.5,
          responseMimeType: 'application/json',
        },
      }),
    }
  );
  const data = await resp.json().catch(() => ({}));
  return { resp, data };
}

function parseJson(text) {
  const clean = String(text || '').replace(/```json|```/gi, '').trim();
  try { return JSON.parse(clean); } catch {}
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { audio, context, lang } = body;
  if (typeof audio !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(audio) || audio.length < 200) {
    return res.status(400).json({ error: 'No audio received.' });
  }
  if (audio.length > 3_500_000) {
    return res.status(413).json({ error: 'Recording is too long. Please keep it under 30 seconds.' });
  }

  const langName = { te: 'Telugu', hi: 'Hindi' }[lang];
  const extra =
    (langName ? `\n\nIf the spoken language is unclear, answer in ${langName}.` : '') +
    (context ? `\n\nContext — the user's most recent Leaf Aid scan: ${String(context).slice(0, 300)}` : '');

  let lastStatus = 503;
  let lastError = 'The assistant is busy right now. Please try again in a moment.';

  try {
    for (const model of MODELS) {
      const { resp, data } = await callGemini(model, apiKey, audio, extra);

      if (resp.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('');
        const raw = parseJson(text);
        if (!raw) {
          lastStatus = 502;
          lastError = 'Could not read the assistant response. Please try again.';
          continue;
        }
        const language = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$/.test(raw.language || '') ? raw.language : '';
        return res.status(200).json({
          transcript: str(raw.transcript, 600),
          lang: language,
          reply: str(raw.reply, 1800),
        });
      }

      console.error(`Gemini ${model}:`, resp.status, data?.error?.message);
      lastStatus = resp.status;
      lastError = data?.error?.message || lastError;

      if (resp.status === 404 || RETRYABLE.has(resp.status)) continue;
      return res.status(resp.status).json({ error: lastError });
    }

    return res.status(lastStatus).json({ error: lastError });
  } catch (err) {
    console.error('Voice chat handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
