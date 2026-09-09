import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = body?.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const clientId = (env as Record<string, string>).PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID;
    const secret = (env as Record<string, string>).PAYPAL_SECRET || process.env.PAYPAL_SECRET;
    const apiBase = (env as Record<string, string>).PAYPAL_API_BASE || "https://api-m.paypal.com";

    if (!clientId || !secret) {
      return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
    }

    const auth = btoa(`${clientId}:${secret}`);

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
      return NextResponse.json({ error: "Capture failed" }, { status: res.status });
    }

    const details = await res.json();
    return NextResponse.json({ status: "COMPLETED", details });
  } catch (err) {
    console.error("capture-order failed:", err);
    return NextResponse.json({ error: "Could not capture order" }, { status: 500 });
  }
}
