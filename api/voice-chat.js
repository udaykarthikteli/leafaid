// Vercel serverless function: /api/voice-chat
// Receives a short voice recording (16 kHz mono WAV, base64), asks Gemini to
// transcribe it, detect the spoken language, and answer in that same language.
// Requires env var GEMINI_API_KEY.
import { generate } from '../lib/gemini.js';

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

  try {
    const out = await generate({
      apiKey,
      parts: [{ text: PROMPT + extra }, { inline_data: { mime_type: 'audio/wav', data: audio } }],
      generationConfig: { maxOutputTokens: 2048, temperature: 0.5, responseMimeType: 'application/json' },
      accept: (t) => !!parseJson(t),
    });
    if (!out.ok) return res.status(out.status).json({ error: out.error });

    const raw = parseJson(out.text);
    const language = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$/.test(raw.language || '') ? raw.language : '';
    return res.status(200).json({
      transcript: str(raw.transcript, 600),
      lang: language,
      reply: str(raw.reply, 1800),
    });
  } catch (err) {
    console.error('Voice chat handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
