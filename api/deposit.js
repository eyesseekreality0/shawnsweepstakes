export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://stg-api.paidlyinteractive.com/v1/checkout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PAIDLY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storeId: process.env.PAIDLY_STOREID,
        amount: req.body.amount,
        currency: "USD"
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
