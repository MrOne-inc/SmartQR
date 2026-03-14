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
├── view.html         # Landing page displayed when QR is scanned
├── script.js         # QR generation logic and input validation
├── style.css         # Custom styling and responsive layout
├── manifest.json     # PWA manifest
├── sw.js             # Service Worker for offline caching
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
2. Open `index.html` in a browser — no server required.
3. To deploy, push to GitHub and enable GitHub Pages on the `main` branch.

---

## Privacy & Security

- Zero server-side processing — everything runs in the browser
- No cookies, no tracking, no analytics
- All link data is encoded directly into the QR code URL
- URLs are validated to prevent injection of malicious protocols

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
