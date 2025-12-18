export default async function handler(req, res) {
  // Simple health endpoint for debugging deploy/env without exposing secrets
  return res.status(200).json({
    ok: true,
    hasGroqKey: Boolean(process.env.GROQ_API_KEY),
    runtime: 'vercel-node',
    ts: Date.now(),
  });
}


