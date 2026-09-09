import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

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

    const { env } = getCloudflareContext();
    const clientId = (env as Record<string, string>).PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID;
    const secret = (env as Record<string, string>).PAYPAL_SECRET || process.env.PAYPAL_SECRET;
    const currency = ((env as Record<string, string>).PAYPAL_CURRENCY || "USD").toUpperCase();
    const apiBase = (env as Record<string, string>).PAYPAL_API_BASE || "https://api-m.paypal.com";

    if (!clientId || !secret) {
      return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
    }

    const auth = btoa(`${clientId}:${secret}`);

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
      const text = await res.text();
      return NextResponse.json(
        { error: "Could not create order", detail: `PayPal ${res.status}: ${text.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const order = await res.json();
    return NextResponse.json({ id: order.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Could not create order", detail: message }, { status: 500 });
  }
}

