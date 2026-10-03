// Vercel serverless function: /api/diagnose
// Receives a leaf photo (data URL) and asks Gemini to analyse it.
// Requires env var GEMINI_API_KEY.

const MODELS = [
  process.env.GEMINI_MODEL || 'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
];

const RETRYABLE = new Set([429, 500, 502, 503, 504]);

const PROMPT = `You are a plant pathology assistant inside the Leaf Aid app.
Look at the photo and decide what it shows. Reply with ONLY a JSON object (no markdown, no extra text) with exactly these keys:

{
  "is_plant_leaf": boolean,   // false if the image is not a plant leaf/plant (person, object, animal, blurry/unusable, etc.)
  "healthy": boolean,         // true if the leaf looks healthy with no visible disease or pest damage
  "disease_name": string,     // English. Most likely disease/pest/disorder, or "Healthy leaf" if healthy. Empty string if not a leaf.
  "crop": string,             // English. Most likely plant/crop (e.g. "Tomato"). "Unknown" if you can't tell.
  "confidence": integer,      // 0-100, your honest estimate. Use lower numbers when the photo is unclear or several causes are possible.
  "severity": "low" | "medium" | "high",  // "low" for healthy leaves
  "reasons": [string, string, string],    // 3 short visual observations from THIS photo that support your answer
  "symptoms": string,         // 1-2 sentences: typical symptoms of this condition
  "treatment": string,        // 1-3 sentences: practical treatment steps (or "No treatment needed" if healthy)
  "prevention": string        // 1-2 sentences: prevention tips
}

Rules:
- Base your answer only on what is visible. Do not invent details. If unsure, lower the confidence.
- Never claim certainty; this is an AI estimate.
- If the image is not a plant leaf, set is_plant_leaf=false, healthy=false, disease_name="", reasons=[], and leave the text fields as empty strings.`;

async function callGemini(model, apiKey, mimeType, base64, langLine) {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT + langLine },
              { inline_data: { mime_type: mimeType, data: base64 } },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 4096, // thinking tokens count toward this limit
          temperature: 0.3,
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

const str = (v, max = 600) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

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

  const { image, lang } = body;
  const match = typeof image === 'string' && image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    return res.status(400).json({ error: 'Please upload a JPG, PNG or WebP image.' });
  }
  const [, mimeType, base64] = match;
  if (base64.length > 4_000_000) {
    return res.status(413).json({ error: 'Image is too large. Try a smaller photo.' });
  }

  const langName = { te: 'Telugu', hi: 'Hindi' }[lang];
  const langLine = langName
    ? `\n\nWrite "reasons", "symptoms", "treatment" and "prevention" in ${langName} (use ${langName} script). Keep "disease_name", "crop" and "severity" in English.`
    : '';

  let lastStatus = 503;
  let lastError = 'The analysis service is busy right now. Please try again in a moment.';

  try {
    for (const model of MODELS) {
      const { resp, data } = await callGemini(model, apiKey, mimeType, base64, langLine);

      if (resp.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('');
        const raw = parseJson(text);
        if (!raw) {
          lastStatus = 502;
          lastError = 'Could not read the analysis result. Please try again.';
          continue; // try the next model
        }

        const isLeaf = raw.is_plant_leaf !== false;
        if (!isLeaf) {
          return res.status(200).json({ is_plant_leaf: false });
        }

        const healthy = raw.healthy === true;
        const severity = ['low', 'medium', 'high'].includes(raw.severity) ? raw.severity : (healthy ? 'low' : 'medium');
        let confidence = Math.round(Number(raw.confidence));
        if (!Number.isFinite(confidence)) confidence = 60;
        confidence = Math.max(1, Math.min(99, confidence));

        return res.status(200).json({
          is_plant_leaf: true,
          healthy,
          name: str(raw.disease_name, 80) || (healthy ? 'Healthy leaf' : 'Unidentified issue'),
          crop: str(raw.crop, 60) || 'Unknown',
          confidence,
          severity: healthy ? 'low' : severity,
          reasons: Array.isArray(raw.reasons) ? raw.reasons.map((r) => str(r, 200)).filter(Boolean).slice(0, 4) : [],
          symptoms: str(raw.symptoms),
          treatment: str(raw.treatment),
          prevention: str(raw.prevention),
        });
      }

      console.error(`Gemini ${model}:`, resp.status, data?.error?.message);
      lastStatus = resp.status;
      lastError = data?.error?.message || lastError;

      if (resp.status === 404 || RETRYABLE.has(resp.status)) continue; // next model
      return res.status(resp.status).json({ error: lastError }); // bad key / bad request: stop
    }

    return res.status(lastStatus).json({ error: lastError });
  } catch (err) {
    console.error('Diagnose handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
