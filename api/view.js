import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

async function loadTemplate() {
  const candidates = [
    path.join(process.cwd(), "view.html"),
    path.join(__dirname, "..", "view.html"),
    path.join(__dirname, "view.html"),
  ];
  for (const p of candidates) {
    try {
      return await fs.readFile(p, "utf8");
    } catch {}
  }
  throw new Error("view.html template not found");
}

export default async function handler(req, res) {
  try {
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const proto = req.headers["x-forwarded-proto"] || "https";
    const origin = `${proto}://${host}`;
    const dataParam = typeof req.query?.data === "string" ? req.query.data : "";

    let title = "SmartQR — Your links, one scan away";
    let description =
      "One scan opens all the links — WhatsApp, Instagram, website, and more.";
    let ogImage = `${origin}/icon-512.png`;
    let ogWidth = "512";
    let ogHeight = "512";
    let twitterCard = "summary";

    if (dataParam) {
      try {
        const payload = JSON.parse(decodeURIComponent(dataParam));
        if (payload && typeof payload === "object" && !Array.isArray(payload)) {
          if (typeof payload.name === "string" && payload.name.trim()) {
            const bizName = payload.name.trim().slice(0, 80);
            title = `${bizName} — SmartQR`;
          }
          if (Array.isArray(payload.links)) {
            const n = payload.links.length;
            description = `${n} link${n === 1 ? "" : "s"} · scan to connect`;
          }
        }
        ogImage = `${origin}/api/og?data=${encodeURIComponent(dataParam)}`;
        ogWidth = "600";
        ogHeight = "600";
        twitterCard = "summary_large_image";
      } catch {}
    }

    let html = await loadTemplate();

    const replacements = [
      [/<title[^>]*>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`],
      [
        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:title" content="${escapeHtml(title)}" />`,
      ],
      [
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:description" content="${escapeHtml(description)}" />`,
      ],
      [
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
      ],
      [
        /<meta\s+property="og:image:width"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:image:width" content="${ogWidth}" />`,
      ],
      [
        /<meta\s+property="og:image:height"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:image:height" content="${ogHeight}" />`,
      ],
      [
        /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/?>/,
        `<meta name="twitter:card" content="${twitterCard}" />`,
      ],
      [
        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
        `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
      ],
      [
        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
        `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
      ],
      [
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
        `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
      ],
    ];

    for (const [re, replacement] of replacements) {
      html = html.replace(re, replacement);
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    res.end(html);
  } catch (err) {
    console.error("View render error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("View render failed");
  }
}
