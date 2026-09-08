// POST /api/create-order
// Creates a PayPal order server-side using the Client ID + Secret, so the
// secret never touches the browser. Returns { id } for the PayPal JS SDK.
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const amount = Number(body && body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (amount > 10000) {
      return Response.json({ error: "Amount is too large" }, { status: 400 });
    }

    const currency = (env.PAYPAL_CURRENCY || "USD").toUpperCase();
    const order = await createPayPalOrder(env, amount, currency);

    return Response.json({ id: order.id });
  } catch (err) {
    console.error("create-order failed:", err);
    return Response.json({ error: "Could not create order" }, { status: 500 });
  }
}

async function createPayPalOrder(env, amount, currency) {
  const apiBase = env.PAYPAL_API_BASE || "https://api-m.paypal.com";
  const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);

  const res = await fetch(`${apiBase}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "One Earth One Breath — donation",
          amount: { currency_code: currency, value: amount.toFixed(2) },
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`PayPal create order failed (${res.status}): ${await res.text()}`);
  }

  return res.json();
}
