export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://api.paidlyinteractive.com/v1/checkout-link", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PAIDLY_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        storeId: process.env.PAIDLY_STOREID,
        amount: req.body.amount,
        currency: "USD",
        successUrl: "https://shawnsweepstakes.vercel.app/success",
        cancelUrl: "https://shawnsweepstakes.vercel.app/cancel"
      }),
    });

    const text = await response.text();
    console.log("Paidly prod raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Fetch failed:", err);
    return res.status(500).json({ error: "Fetch failed: " + err.message });
  }
}
