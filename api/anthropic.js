export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

    const startTime = Date.now();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    const elapsed = Date.now() - startTime;
    const data = await response.json();
    
    console.log(`[proxy] model=${body.model} status=${response.status} ${elapsed}ms`);
    if (data.error) console.error(`[proxy] error: ${JSON.stringify(data.error)}`);

    return res.status(response.status).json(data);
  } catch (err) {
    console.error(`[proxy] exception: ${err.message}`);
    return res.status(500).json({ error: err.message, type: "proxy_error" });
  }
}
