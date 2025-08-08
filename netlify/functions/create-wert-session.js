const fetch = require('node-fetch');

const API_KEY = '776572742d70726f642d33343733656162352d653566312d343363352d626535312d616531336165643361643539';
const PARTNER_ID = '01K1T8VJJ8TY67M49FDXY865GF';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { amount, email, full_name, phone, game, username } = JSON.parse(event.body);

  const body = {
    flow_type: 'simple_full_restrict',
    wallet_address: '0x0118E8e2FCb391bCeb110F62b5B7B963477C1E0d',
    currency: 'USD',
    currency_amount: parseFloat(amount),
    commodity: 'USDC',
    network: 'ethereum',
    user_id: username,
    email: email,
    full_name: full_name,
    phone: phone || undefined,
    metadata: { game, username }
  };

  try {
    const response = await fetch('https://partner.wert.io/api/external/hpp/create-session', {
      method: 'POST',
      headers: { 'X-Api-Key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) return { statusCode: response.status, body: JSON.stringify({ error: data.message }) };

    return { statusCode: 200, body: JSON.stringify({ session_id: data.sessionId }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
