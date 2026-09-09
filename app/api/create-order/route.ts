import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body?.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (amount > 10000) {
      return NextResponse.json({ error: "Amount is too large" }, { status: 400 });
    }

    const currency = (process.env.PAYPAL_CURRENCY || "USD").toUpperCase();
    const apiBase = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";
    const auth = btoa(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`);

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

    const order = await res.json();
    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error("create-order failed:", err);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
