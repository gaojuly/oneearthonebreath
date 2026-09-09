"use client";

import { useEffect, useRef, useState } from "react";

const CLIENT_ID = "BAACSXrUz2TKKSxbkOC02IqPecn9zaQBjcV1L366T5xa19vXKUpTwsTldzwStbHtTiKnASngfSpciizXBk";
const DEFAULT_AMOUNT = "25.00";

export default function PayPalButton() {
  const amountRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState("25");
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    function currentAmount() {
      const v = parseFloat(amountRef.current?.value || DEFAULT_AMOUNT);
      return (Number.isFinite(v) && v > 0 ? v : parseFloat(DEFAULT_AMOUNT)).toFixed(2);
    }

    function render() {
      const w = window as any;
      w.paypal
        .Buttons({
          style: { layout: "vertical", color: "gold", shape: "pill", label: "donate", tagline: false },
          createOrder: () =>
            fetch("/api/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: currentAmount() }),
            })
              .then((r) => r.json())
              .then((d) => d.id),
          onApprove: (data: any) =>
            fetch("/api/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            })
              .then((r) => r.json())
              .then((res: any) => {
                if (res.status === "COMPLETED") {
                  const given = res.details?.payer?.name?.given_name || "friend";
                  setSuccess(`Thank you, ${given}! Your gift supports the Spiritual Oasis mission. 🌿`);
                }
              }),
          onError: (err: any) => console.error("PayPal error:", err),
        })
        .render("#paypal-button-container");
    }

    let tries = 0;
    const wait = () => {
      if ((window as any).paypal) render();
      else if (tries++ < 120) setTimeout(wait, 100);
      else console.error("PayPal SDK failed to load.");
    };

    if (!(window as any).paypal && !document.querySelector('script[src*="paypal.com/sdk"]')) {
      const s = document.createElement("script");
      s.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD`;
      s.async = true;
      s.onload = wait;
      document.body.appendChild(s);
    } else {
      wait();
    }
  }, []);

  function choose(amount: string) {
    setSelected(amount);
    if (amountRef.current) amountRef.current.value = amount;
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div className="donate-options" style={{ justifyContent: "center" }}>
        {["25", "50", "100", "250"].map((a) => (
          <button
            key={a}
            type="button"
            className={selected === a ? "selected" : ""}
            onClick={() => choose(a)}
          >
            ${a}
          </button>
        ))}
      </div>
      <div className="field" style={{ marginTop: 22 }}>
        <label htmlFor="amount">Amount ($)</label>
        <input ref={amountRef} id="amount" name="amount" type="number" min={1} step="0.01" defaultValue={25} />
      </div>
      <div id="paypal-button-container" style={{ marginTop: 24 }}></div>
      {success && <p className="form-message show" style={{ marginTop: 14 }}>{success}</p>}
      <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 16 }}>
        Payments are processed securely by PayPal. No PayPal account needed.
      </p>
    </div>
  );
}
