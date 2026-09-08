# One Earth One Breath (1e1b.org)

A modern, high-performance website for the **One Earth One Breath** climate action collective.

> One planet. One atmosphere. One shared breath.

## ✨ Features

- **7 pages** — Home, About, Issues, Take Action, Donate, News, Contact
- **Fully responsive** mobile-first layout
- **Dark / light mode** with persisted preference + system detection
- **Animated impact counters**, scroll-reveal animations, and an animated hero
- **Accessible** — semantic HTML, ARIA labels, keyboard focus states, reduced-motion support
- **Interactive forms** — newsletter, contact, pledge, and donation (client-side demo wiring)
- **SEO-ready** — meta descriptions, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`
- **Zero build step** — plain HTML/CSS/JS, deployable anywhere

## 📁 Structure

```
1e1b.org/
├── index.html          # Home
├── about.html          # Story, values, timeline, team
├── issues.html         # Climate crises deep-dive
├── take-action.html    # Personal / community / advocacy actions
├── donate.html         # Monthly tiers + one-time giving
├── news.html           # Updates & wins
├── contact.html        # Contact form + details
├── assets/
│   ├── css/styles.css  # Design system
│   └── js/main.js      # Interactivity
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

## 🎨 Customisation

- **Brand colours** — edit the CSS variables at the top of `assets/css/styles.css`.
- **Content** — the page copy is plain HTML and easy to edit.
- **Forms** — the forms are wired with a demo success message in `assets/js/main.js`. To collect real submissions, connect them to a form backend (e.g. Cloudflare Workers, Formspree, or your CMS).

## 📝 Notes

- Fonts load from Google Fonts with a full system-font fallback (works offline).
- All icons and illustrations are inline SVG — no external image dependencies.
- Impact figures (supporters, trees, CO₂) are editable placeholders in the markup.
