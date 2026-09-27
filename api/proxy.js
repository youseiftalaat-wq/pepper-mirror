export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const auth = req.headers['authorization'] || '';
    
    const response = await fetch('https://orders.pepper.deliveryhero.io/graphql?crunch=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
        'X-Requested-With': 'gfs-order-management@8.81.1',
        'Accept': '*/*',
        'Origin': 'https://orders.pepper.deliveryhero.io',
        'Referer': 'https://orders.pepper.deliveryhero.io/',
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      return res.status(500).json({ error: 'Invalid JSON from Pepper', raw: text.substring(0, 500) });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
