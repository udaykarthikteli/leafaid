const SYSTEM_PROMPT = `You are the Leaf Aid Assistant, embedded inside the Leaf Aid plant-disease-diagnosis app.
You help users understand plant leaf diseases, symptoms, treatment options, and prevention tips.
Keep answers concise (2-5 sentences unless asked for detail), practical, and friendly.
If asked something totally unrelated to plants, gardening, or the Leaf Aid app, gently redirect back to what you can help with.
If the user mentions a specific diagnosis Leaf Aid gave them, treat it as real and build your answer around it.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server is missing GEMINI_API_KEY' }) };
  }

  let message, context;
  try {
    ({ message, context } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }
  if (!message || typeof message !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing "message"' }) };
  }

  const contextLine = context ? `\nContext — the user's most recent Leaf Aid scan: ${context}` : '';
  const prompt = `${SYSTEM_PROMPT}${contextLine}\n\nUser: ${message}`;

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
        })
      }
    );

    const data = await resp.json();

    if (!resp.ok) {
      return { statusCode: resp.status, body: JSON.stringify({ error: data?.error?.message || 'Gemini API error' }) };
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "Sorry, I couldn't come up with a reply just now — try asking again.";

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};