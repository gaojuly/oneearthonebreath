/* =========================================================
   ONE EARTH ONE BREATH — PayPal Donations (Smart Buttons)
   ---------------------------------------------------------
   SECURITY NOTE
   The PayPal Client ID is public and safe to ship in the browser.
   The PayPal SECRET must NEVER be placed in front-end code — it is
   only ever used on a secure server (e.g. a Cloudflare Worker) to
   create/capture orders. Orders are created and captured server-side
   via Cloudflare Pages Functions (/api/create-order, /api/capture-order).
   ========================================================= */
(function () {
  "use strict";

  // Keep this in sync with the currency= query param on the PayPal SDK
  // <script> tag in donate.html.
  var PAYPAL_CONFIG = {
    defaultAmount: "25.00"
  };

  var container = document.getElementById("paypal-button-container");
  if (!container) return;

  var amountInput = document.getElementById("amount");

  // Pre-fill the amount when a preset button or giving-level link is chosen.
  // (main.js handles the "selected" highlight for preset buttons; this keeps
  // the amount input in sync for both presets and tier links.)
  document.querySelectorAll("[data-donate-option]").forEach(function (el) {
    el.addEventListener("click", function () {
      var amount = el.getAttribute("data-donate-option");
      if (amountInput && amount) amountInput.value = amount;
    });
  });

  function currentAmount() {
    var raw = amountInput ? amountInput.value : PAYPAL_CONFIG.defaultAmount;
    var value = parseFloat(raw);
    if (!isFinite(value) || value <= 0) value = parseFloat(PAYPAL_CONFIG.defaultAmount);
    return value.toFixed(2);
  }

  function showThanks(details) {
    var msg = document.getElementById("paypal-success");
    if (!msg) return;
    var given = "friend";
    try {
      if (details && details.payer && details.payer.name && details.payer.name.given_name) {
        given = details.payer.name.given_name;
      }
    } catch (e) { /* ignore */ }
    msg.textContent = "Thank you, " + given + "! Your donation is already making a difference. 🌱";
    msg.classList.add("show");
    msg.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function render() {
    window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "pill",
        label: "donate",
        tagline: false
      },
      // Called when the button is clicked — reads the amount live.
      createOrder: function () {
        return fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: currentAmount() })
        })
          .then(function (res) { return res.json(); })
          .then(function (data) { return data.id; });
      },
      onApprove: function (data) {
        return fetch("/api/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID })
        })
          .then(function (res) { return res.json(); })
          .then(function (result) {
            if (result.status === "COMPLETED") {
              showThanks(result.details);
            } else {
              throw new Error(result.error || "Payment could not be completed.");
            }
          });
      },
      onCancel: function () {
        // Payer closed the popup without completing.
      },
      onError: function (err) {
        console.error("PayPal error:", err);
      }
    }).render("#paypal-button-container");
  }

  // The PayPal SDK loads asynchronously, so wait until window.paypal exists.
  var attempts = 0;
  (function waitForSdk() {
    if (window.paypal) {
      render();
    } else if (attempts++ < 120) {
      setTimeout(waitForSdk, 100);
    } else {
      console.error("PayPal SDK failed to load.");
    }
  })();
})();
