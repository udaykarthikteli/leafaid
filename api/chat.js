// Vercel serverless function: /api/chat
// Requires env var GEMINI_API_KEY (Vercel -> Project -> Settings -> Environment Variables),
// then REDEPLOY after adding it.
import { generate } from '../lib/gemini.js';

const SYSTEM_PROMPT = `You are the Leaf Aid Assistant, embedded inside the Leaf Aid plant-disease-diagnosis app.
You help users understand plant leaf diseases, symptoms, treatment options, and prevention tips.
Keep answers concise (2-5 sentences unless asked for detail), practical, and friendly.
If asked something totally unrelated to plants, gardening, or the Leaf Aid app, gently redirect back to what you can help with.
If the user mentions a specific diagnosis Leaf Aid gave them, treat it as real and build your answer around it.`;

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
  const { message, context, lang } = body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing "message"' });
  }

  const contextLine = context
    ? `\nContext — the user's most recent Leaf Aid scan: ${String(context).slice(0, 300)}`
    : '';
  const langName = { te: 'Telugu', hi: 'Hindi' }[lang];
  const langLine =
    `\nReply in the same language and script the user wrote their message in (for example English, Telugu, Hindi or Tamil).` +
    (langName ? ` If the language is unclear, use ${langName}.` : '') +
    ` Use plain text only: no markdown, asterisks, bullet symbols or emojis, because replies may be read aloud.`;
  const prompt = `${SYSTEM_PROMPT}${langLine}${contextLine}\n\nUser: ${message.slice(0, 2000)}`;

  try {
    const out = await generate({
      apiKey,
      parts: [{ text: prompt }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
    });
    if (!out.ok) return res.status(out.status).json({ error: out.error });
    return res.status(200).json({ reply: out.text.trim() });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
