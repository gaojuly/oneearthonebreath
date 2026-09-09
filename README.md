# One Earth One Breath (1e1b.org)

A dynamic, high-performance web app for **One Earth One Breath** — a global mindfulness initiative by Dr Junling Gao (The University of Hong Kong), connecting people through breathing, meditation, neuroscience, and AI. Built with **Next.js 16 (App Router) + TypeScript**, deployed on Cloudflare.

> One planet. One atmosphere. One shared breath.

## ✨ Features

- **8 pages** — Home, Vision, Science, Practice, Community, Roadmap, Support, Contact
- **3D Earth globe** in the hero, with a visitor-location marker
- **Fully responsive** mobile-first layout
- **Dark / light mode** with persisted preference + system detection
- **Animated impact counters**, scroll-reveal animations, and an animated hero
- **Accessible** — semantic HTML, ARIA labels, keyboard focus states, reduced-motion support
- **Real PayPal donations** — Smart Donation Buttons on the Donate page, wired to the selected amount
- **SEO-ready** — per-page metadata, Open Graph, `sitemap.xml`, `robots.txt`
- **Dynamic** — server-rendered pages, API route handlers, and a live time-zone schedule

## 📁 Structure

```
1e1b.org/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout (fonts, metadata, Header/Footer)
│   ├── page.tsx          # Home
│   ├── globals.css       # Design system
│   ├── vision/…contact/  # The 7 content pages
│   └── api/              # PayPal route handlers (create/capture)
├── components/           # Header, Footer, Globe, PayPalButton, SiteEffects
├── lib/data.ts           # Typed content (practices, roadmap, regions, partners)
├── public/               # favicon, manifest, robots.txt, sitemap.xml
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 🚀 Run locally

```bash
cd "1e1b.org"
npm install
npm run dev     # http://localhost:3000
# or build + start:
npm run build && npm start
```

## ☁️ Deploy to Cloudflare Pages

1. Push this folder to a Git repository.
2. In the Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repo, set **Build command** to `(none)` and **Output directory** to `/`.
4. Deploy, then attach the `1e1b.org` custom domain.

The included `_headers` file automatically applies security and caching headers.

## 💳 PayPal Donations

The **Support** page uses PayPal's official **Smart Payment Buttons** to process real donations.

- **Client ID** — public and safe; it's set in the PayPal SDK `<script>` tag at the bottom of `support.html`.
- **Amount** — the button charges whatever the visitor enters. Preset buttons, giving-level links, and the custom amount field all feed the same value, which is read live from `#amount` in `assets/js/paypal.js`.
- **Currency** — defaults to **USD**. To change it, edit (1) the `currency=` query param in the PayPal SDK `<script>` tag in `support.html`, and (2) the `currency` value at the top of `assets/js/paypal.js`. Then update the `$` symbols on the page to match.

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
- Participation figures (people, practices, regions) are editable placeholders in the markup.
