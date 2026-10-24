export default async function handler(req, res) {
  // Set CORS headers so frontend can call it from any domain / preview
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const response = await fetch('https://scanner.tradingview.com/egypt/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(body || {
        filter: [{ left: 'type', operation: 'in_range', right: ['stock', 'dr', 'index'] }],
        sort: { sortBy: 'volume', sortOrder: 'desc' },
        range: [0, 350]
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'TradingView scanner responded with ' + response.status });
    }

    const data = await response.json();
    // Cache for 10 seconds to keep it super fast and fresh
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Proxy error' });
  }
}
