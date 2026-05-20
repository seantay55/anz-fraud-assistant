export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { reason, details, reference, customer, transaction } = req.body;

    const makeResponse = await fetch(process.env.MAKE_DISPUTE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference,
        customer,
        reason,
        details,
        transaction,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!makeResponse.ok) throw new Error('Make webhook failed');

    return res.status(200).json({ success: true, reference });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit dispute' });
  }
}
