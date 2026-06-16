# SmartQR

**One QR Code. Multiple Smart Links.**

SmartQR lets businesses and individuals generate a single QR code that opens a landing page with multiple social media links — WhatsApp, Instagram, Facebook, TikTok, LinkedIn, Twitter (X), and custom websites.

Fully client-side. No backend, no database, no signup. Hosted free on GitHub Pages.

**[Live Demo](https://mrone-inc.github.io/SmartQR/)**

---

## Features

- Generate a single QR code linking to multiple platforms
- Supported platforms: WhatsApp, Instagram, Facebook, TikTok, Twitter (X), LinkedIn, Website
- Custom QR code color
- Upload a logo to embed inside the QR code
- Upload a business logo displayed above the QR
- Download QR as PNG
- Fully responsive (mobile, tablet, desktop)
- PWA-ready — installable with offline support via Service Worker
- Privacy-first: all data is encoded in the URL, nothing is stored on any server

---

## How It Works

1. Enter your business name and optionally upload logos
2. Select platforms and enter your usernames / phone number / URL
3. Click **Generate Smart QR** — a single QR code is created
4. When scanned, the QR opens a clean landing page with clickable buttons for each platform
5. Download the QR as PNG for use on business cards, posters, menus, social media, etc.

---

## Tech Stack

| Layer     | Technology                                                        |
| --------- | ----------------------------------------------------------------- |
| Markup    | HTML5                                                             |
| Styling   | CSS3 + Bootstrap 5.3                                              |
| Logic     | Vanilla JavaScript                                                |
| QR Engine | [QR Code Styling](https://github.com/nicolo-ribaudo/qr-code-styling) v1.5 |
| Hosting   | GitHub Pages                                                      |
| PWA       | Service Worker + Web Manifest                                     |

No build tools, no npm, no Node.js required.

---

## Project Structure

```
SmartQR/
├── index.html        # QR generator page
├── view.html         # Landing page template displayed when QR is scanned
├── script.js         # QR generation logic and input validation
├── view.js           # Scan-page logic: links, vCard, share
├── theme.js          # Shared theme switcher used by both pages
├── i18n.js           # English/Swahili strings + language switcher
├── style.css         # Custom styling and responsive layout
├── manifest.json     # PWA manifest
├── sw.js             # Service Worker for offline caching
├── api/
│   ├── og.js         # Vercel: dynamic styled QR PNG for social previews
│   └── view.js       # Vercel: view.html with per-payload og:image/og:title
├── vercel.json       # Vercel routing (rewrites view.html → api/view)
├── package.json      # qrcode + sharp dependencies for the API routes
├── LICENSE           # MIT License
└── README.md
```

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/mrone-inc/SmartQR.git
   cd SmartQR
   ```
2. Open `index.html` in a browser — no server required for the generator.
3. To deploy as a static site, push to GitHub and enable GitHub Pages on the `main` branch.

## Deploying to Vercel (recommended — enables dynamic OG previews)

When a SmartQR link is shared on WhatsApp / iMessage / Twitter, the preview should show the **actual generated QR**, not the brand logo. That requires server-side rendering of the OG image — which is what the `api/` folder provides.

1. Sign in to [vercel.com](https://vercel.com) (free).
2. Click **Add New… → Project**, import this repo.
3. Vercel detects `package.json` and the `api/` folder automatically — no build settings needed.
4. Hit **Deploy**. After ~30 seconds you'll get a URL like `https://smartqr-xxx.vercel.app`.

### What runs where

| Path | Handled by |
| --- | --- |
| `/`, `/index.html` and static files (`*.css`, `*.js`, icons) | Vercel CDN (static) |
| `/view.html?data=...` | `api/view.js` (Node) — injects dynamic `og:image` + `og:title` |
| `/api/og?data=...` | `api/og.js` (Node) — returns a PNG QR using the user's color and embedded logo |

`vercel.json` rewrites `/view.html` to `/api/view` so existing QR links keep working.

### Customising

- **Default OG when no `data` param**: edit fallback strings near the top of `api/view.js`.
- **OG QR size / margin / error-correction**: tweak constants at the top of `api/og.js`.
- **Custom domain**: in Vercel project settings, attach any domain you own (e.g. `smartqr.mrone-inc.com`). All existing routes work unchanged.

---

## Privacy & Security

- Zero server-side processing — everything runs in the browser
- No cookies, no tracking, no analytics
- All link data is encoded directly into the QR code URL
- URLs are validated to prevent injection of malicious protocols
- Theme preference and the "welcomed" flag are stored in `localStorage` (never sent anywhere)

## Offline Support

- The Service Worker precaches the app shell **and** the Bootstrap / qr-code-styling / Google Fonts CDN assets on first load
- After that, the generator and scan view work fully offline
- Note: scanned QRs pointing to external platform URLs (WhatsApp, Instagram, etc.) still need a connection to actually open

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

## Author

**Medrick Meshack** ([Mrone.Inc](https://mrone-inc.github.io))
Software Engineer | Ethical Hacker | Mobile & Web Developer

---

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.
