export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body || {};

    const fallbackReply =
      "Hi! I can help with leaf disease symptoms, treatment, and prevention. " +
      "Ask me about early blight, powdery mildew, rust, or crop care.";

    const reply =
      context
        ? `I see your recent diagnosis was ${context}. For this case, I recommend checking the affected area, removing infected leaves, and following a crop-specific treatment plan.`
        : fallbackReply;

    return res.status(200).json({
      reply: reply
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Chat failed',
      reply: "I'm having trouble connecting right now — please try again in a moment."
    });
  }
}
