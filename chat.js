// Optional Vercel serverless endpoint for real AI chat.
// Add OPENAI_API_KEY in Vercel Project Settings > Environment Variables.
// Do NOT put the API key in app.js or index.html.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({error:"Method not allowed"});
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({error:"AI backend is not configured yet."});
  try {
    const {message} = req.body || {};
    if (!message) return res.status(400).json({error:"Message required"});
    const r = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},
      body:JSON.stringify({
        model:"gpt-5.6-mini",
        input:`You are NEXOVA's shopping assistant. Help customers with products, prices, ordering and payment options. Keep answers concise and friendly. Customer message: ${message}`
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({error:data.error?.message || "AI request failed"});
    return res.status(200).json({reply:data.output_text || "Sorry, I could not answer that right now."});
  } catch(e) { return res.status(500).json({error:"Server error"}); }
}
