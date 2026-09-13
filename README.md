# One Earth One Breath (1e1b.org)

A dynamic, high-performance web app for **One Earth One Breath** — a global mindfulness initiative by Dr Junling Gao (The University of Hong Kong), connecting people through breathing, meditation, neuroscience, and AI. Built with **Next.js 16 (App Router) + TypeScript**, internationalised with **next-intl**, and deployed on **Cloudflare Workers** via **OpenNext**.

> One planet. One atmosphere. One shared breath.

## ✨ Features

- **8 pages** — Home, Vision, Science, Practice, Community, Roadmap, Support, Contact
- **🌐 Internationalisation** — English + 繁體中文 (Traditional Chinese), with automatic locale detection by visitor country (see below)
- **3D Earth globe** in the hero, with a visitor-location marker
- **Fully responsive** mobile-first layout, dark/light mode, animated counters & scroll-reveal
- **Accessible** — semantic HTML, ARIA labels, keyboard focus, reduced-motion support
- **Real PayPal donations** — Smart Donation Buttons on the Support page
- **SEO-ready** — per-page (localised) metadata, Open Graph, `sitemap.xml`, `robots.txt`

## 🌐 Internationalisation

Localisation is powered by [`next-intl`](https://next-intl.dev):

- **Locales**: `en` (default) and `zh-Hant` (Traditional Chinese) — defined in `i18n/routing.ts`.
- **Messages**: all copy lives in `messages/en.json` and `messages/zh-Hant.json`.
- **Routing**: locale-prefixed URLs — English uses clean paths (`/`, `/vision`), Chinese uses `/zh-Hant/...`.
- **Region detection** (`proxy.ts`): locale is chosen in this order:
  1. The user's explicit choice (stored in the `NEXT_LOCALE` cookie, set by the language toggle in the header)
  2. **Visitor country** via Cloudflare's `request.cf.country` — Taiwan/Hong Kong/Macau → `zh-Hant`, everything else → `en`
  3. `Accept-Language` header
  4. `en` fallback

### Adding another language

1. Add the locale code to `locales` in `i18n/routing.ts`.
2. Create `messages/<locale>.json` (copy `en.json` and translate).
3. Optionally map a country to the locale in `countryToLocale` in `proxy.ts`.

No code changes are required — everything is data-driven.

## 📁 Structure

```
1e1b.org/
├── app/
│   ├── layout.tsx             # Root layout (pass-through)
│   ├── [locale]/              # Locale-routed pages
│   │   ├── layout.tsx         # <html>/<body>, Header/Footer, NextIntlClientProvider
│   │   ├── page.tsx           # Home
│   │   └── vision/…contact/   # The 7 content pages
│   ├── globals.css            # Design system
│   └── api/                   # PayPal route handlers (create/capture)
├── i18n/
│   ├── routing.ts             # Locales + routing config
│   ├── request.ts             # getRequestConfig (loads messages)
│   └── navigation.ts          # Locale-aware Link/usePathname helpers
├── messages/                  # en.json, zh-Hant.json (all copy)
├── components/                # Header, Footer, Globe, PayPalButton, SiteEffects
├── proxy.ts                   # next-intl middleware + country detection
├── public/                    # favicon, manifest, robots.txt, sitemap.xml
├── next.config.ts
├── open-next.config.ts
├── wrangler.jsonc
└── tsconfig.json
```

## 🚀 Run locally

```bash
npm install
npm run dev     # http://localhost:3000
```

## ☁️ Deploy to Cloudflare Workers

```bash
npm run deploy      # OpenNext bundle (.open-next/worker.js) + `wrangler deploy`
```

Equivalent, step by step (both are fine):

```bash
npm run build                       # Next.js build (TypeScript check included)
npx opennextjs-cloudflare build     # bundle the Worker → .open-next/worker.js
npx wrangler deploy                 # deploy to Cloudflare Workers
```

`npx wrangler deploy` also runs the build command configured in `wrangler.jsonc`
(`build.command`) first, so a bare `wrangler deploy` is enough on CI.

### Continuous deployment (Workers Builds)

The Worker is connected to this GitHub repository through **Cloudflare Workers
Builds**, which builds and deploys on every push to `main`. If the project's
build settings are ever reset in the Cloudflare dashboard, use:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npm run deploy` |

Secrets (set once, kept out of the repo):

```bash
wrangler secret put PAYPAL_CLIENT_ID
wrangler secret put PAYPAL_SECRET
wrangler secret put PAYPAL_CURRENCY   # e.g. USD
```

## 💳 PayPal Donations

The **Support** page uses PayPal's Smart Payment Buttons. Orders are created/captured **server-side** by route handlers in `app/api/` (Client ID + Secret stored as Cloudflare secrets), so the secret never reaches the browser. Set `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, and optionally `PAYPAL_CURRENCY` as Worker secrets.
