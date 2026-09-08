# One Earth One Breath (1e1b.org)

A modern, high-performance website for the **One Earth One Breath** climate action collective.

> One planet. One atmosphere. One shared breath.

## ✨ Features

- **7 pages** — Home, About, Issues, Take Action, Donate, News, Contact
- **Fully responsive** mobile-first layout
- **Dark / light mode** with persisted preference + system detection
- **Animated impact counters**, scroll-reveal animations, and an animated hero
- **Accessible** — semantic HTML, ARIA labels, keyboard focus states, reduced-motion support
- **Real PayPal donations** — Smart Donation Buttons on the Donate page, wired to the selected amount
- **SEO-ready** — meta descriptions, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`
- **Zero build step** — plain HTML/CSS/JS, deployable anywhere

## 📁 Structure

```
1e1b.org/
├── index.html          # Home
├── about.html          # Story, values, timeline, team
├── issues.html         # Climate crises deep-dive
├── take-action.html    # Personal / community / advocacy actions
├── donate.html         # Giving levels + PayPal donation button
├── news.html           # Updates & wins
├── contact.html        # Contact form + details
├── assets/
│   ├── css/styles.css  # Design system
│   ├── js/main.js      # Interactivity
│   └── js/paypal.js    # PayPal Smart Buttons
├── favicon.svg
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
└── _headers            # Cloudflare Pages security headers
```

## 🚀 Run locally

No dependencies required — just open `index.html` in a browser, or serve the folder:

```bash
cd "1e1b.org"
python3 -m http.server 8000
# then visit http://localhost:8000
```

## ☁️ Deploy to Cloudflare Pages

1. Push this folder to a Git repository.
2. In the Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repo, set **Build command** to `(none)` and **Output directory** to `/`.
4. Deploy, then attach the `1e1b.org` custom domain.

The included `_headers` file automatically applies security and caching headers.

## 💳 PayPal Donations

The **Donate** page uses PayPal's official **Smart Payment Buttons** to process real donations.

- **Client ID** — public and safe; it's set in the PayPal SDK `<script>` tag at the bottom of `donate.html`.
- **Amount** — the button charges whatever the visitor enters. Preset buttons, giving-level links, and the custom amount field all feed the same value, which is read live from `#amount` in `assets/js/paypal.js`.
- **Currency** — defaults to **USD**. To change it, edit (1) the `currency=` query param in the PayPal SDK `<script>` tag in `donate.html`, and (2) the `currency` value at the top of `assets/js/paypal.js`. Then update the `$` symbols on the page to match.

### 🔒 Keep the secret safe

The PayPal **Client ID** can live in the browser, but the **Secret Key must never be committed to this repo or embedded in front-end code** — anyone who can read it could make API calls on your behalf.

Orders are created and captured **server-side** by Cloudflare Pages Functions in `functions/api/` (using the Client ID + Secret, stored as Cloudflare secrets), so the secret never reaches the browser. The front-end only sends the amount and the approved order ID.

Set these secrets in Cloudflare (see below): `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, and optionally `PAYPAL_CURRENCY` (defaults to `USD`).

```bash
wrangler pages secret put PAYPAL_CLIENT_ID --project-name=oneearthonebreath
wrangler pages secret put PAYPAL_SECRET    --project-name=oneearthonebreath
wrangler pages secret put PAYPAL_CURRENCY  --project-name=oneearthonebreath  # e.g. USD
```

### Testing

To test without moving real money, create a sandbox app at developer.paypal.com, then temporarily change the SDK URL host from `www.paypal.com` to `www.sandbox.paypal.com`.

## 🎨 Customisation

- **Brand colours** — edit the CSS variables at the top of `assets/css/styles.css`.
- **Content** — the page copy is plain HTML and easy to edit.
- **Forms** — newsletter, contact, and pledge forms are wired with a demo success message in `assets/js/main.js`. To collect real submissions, connect them to a form backend (e.g. Cloudflare Workers, Formspree, or your CMS). Donations are handled by PayPal — see below.

## 📝 Notes

- Fonts load from Google Fonts with a full system-font fallback (works offline).
- All icons and illustrations are inline SVG — no external image dependencies.
- Impact figures (supporters, trees, CO₂) are editable placeholders in the markup.
