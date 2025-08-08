const crypto = require('crypto');

exports.handler = async (event) => {
  // Parse the incoming request
  const body = JSON.parse(event.body);

  // Validate required fields
  const { amount, email, full_name, phone, game, username } = body;
  if (!amount || !email || !full_name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  // Your Wert credentials (get these from Wert dashboard)
  const PARTNER_ID = '01K1T8VJJ8TY67M49FDXY865GF'; // ← Keep this public (it's safe)
  const SECRET_KEY = '776572742d70726f642d33343733656162352d653566312d343363352d626535312d616531336165643361643539';   // ← 🔐 KEEP THIS SECRET!

  // Generate unique session ID
  const session_id = crypto.randomBytes(16).toString('hex');

  // Payload for Wert (adjust according to their docs)
  const payload = {
    partner_id: PARTNER_ID,
    session_id: session_id,
    commodity: 'USDT',
    commodity_amount: parseFloat(amount),
    country_of_residence: 'US',
    currency: 'USD',
    lang: 'en',
    lock_commodity: 'USDT',
    only_cryptocurrency: true,
    origin: 'https://widget.wert.io',
    redirect_url: 'https://shawnsweeps.com/success', // Optional: your success page
    url: 'https://shawnsweeps.com',
    full_name: full_name,
    email: email,
    phone: phone || undefined,
    metadata: { game, username }, // Optional: track user/game info
  };

  // Create signature (Wert requires HMAC-SHA256)
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest('hex');

  // Return session data to frontend
  return {
    statusCode: 200,
    body: JSON.stringify({
      session_id,
      partner_id: PARTNER_ID,
      signature,
      payload,
    }),
  };
};
