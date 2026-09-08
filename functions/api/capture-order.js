// POST /api/capture-order
// Captures an approved PayPal order server-side and returns the result.
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const orderId = body && body.orderId;

    if (!orderId) {
      return Response.json({ error: "Missing orderId" }, { status: 400 });
    }

    const apiBase = env.PAYPAL_API_BASE || "https://api-m.paypal.com";
    const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);

    const res = await fetch(
      `${apiBase}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!res.ok) {
      return Response.json({ error: "Capture failed" }, { status: res.status });
    }

    const details = await res.json();
    return Response.json({ status: "COMPLETED", details });
  } catch (err) {
    console.error("capture-order failed:", err);
    return Response.json({ error: "Could not capture order" }, { status: 500 });
  }
}
