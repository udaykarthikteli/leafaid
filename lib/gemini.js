// Shared Gemini caller for all /api functions.
// Fixes: (1) thinking tokens eating the output budget (truncated/empty answers),
//        (2) no timeout -> slow chain of retries that blows Vercel's 30s limit.

export const MODELS = [
  process.env.GEMINI_MODEL || 'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
];

const RETRYABLE = new Set([429, 500, 502, 503, 504]);

// Keep reasoning minimal so the output budget is used for the actual answer.
function thinkingFor(model) {
  if (/2\.5/.test(model)) return { thinkingBudget: 0 };
  return { thinkingLevel: 'low' };
}

async function post(model, apiKey, body, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      }
    );
    const data = await resp.json().catch(() => ({}));
    return { resp, data };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Try models in order within an overall time budget.
 * accept(text) -> true if the text is usable (e.g. valid JSON); otherwise next model.
 * Returns { ok:true, text } or { ok:false, status, error }.
 */
export async function generate({ apiKey, parts, generationConfig, accept = () => true, budgetMs = 24000, perCallMs = 14000 }) {
  const deadline = Date.now() + budgetMs;
  let status = 503;
  let error = 'The service is busy right now. Please try again in a moment.';

  for (const model of MODELS) {
    const left = deadline - Date.now();
    if (left < 3000) break;
    const timeout = Math.min(perCallMs, left);

    for (const useThinking of [true, false]) {
      const cfg = { ...generationConfig };
      if (useThinking) cfg.thinkingConfig = thinkingFor(model);
      let result;
      try {
        result = await post(model, apiKey, { contents: [{ parts }], generationConfig: cfg }, timeout);
      } catch (err) {
        status = err.name === 'AbortError' ? 504 : 500;
        error = err.name === 'AbortError' ? 'The analysis took too long. Please try again.' : err.message;
        console.error(`Gemini ${model}:`, error);
        break; // next model
      }
      const { resp, data } = result;

      if (resp.ok) {
        const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text).filter(Boolean).join('');
        if (text && accept(text)) return { ok: true, text };
        console.error(`Gemini ${model}: unusable output, finishReason=`, data?.candidates?.[0]?.finishReason);
        status = 502;
        error = 'Could not read the result. Please try again.';
        break; // next model
      }

      const msg = data?.error?.message || '';
      console.error(`Gemini ${model}:`, resp.status, msg);
      // This model doesn't accept our thinking setting -> retry same model without it.
      if (useThinking && resp.status === 400 && /think/i.test(msg)) continue;

      status = resp.status;
      error = msg || error;
      if (resp.status === 404 || RETRYABLE.has(resp.status)) break; // next model
      return { ok: false, status, error }; // bad key / bad request: stop
    }
  }
  return { ok: false, status, error };
}
