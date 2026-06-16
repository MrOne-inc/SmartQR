import QRCode from "qrcode";
import sharp from "sharp";

const SIZE = 600;
const LOGO_SIZE = 120;
const RING_PADDING = 12;
const MAX_LOGO_BYTES = 30000;

function isHexColor(s) {
  return typeof s === "string" && /^#[0-9a-fA-F]{6}$/.test(s);
}

function isLogoDataUrl(s) {
  return (
    typeof s === "string" &&
    s.length <= MAX_LOGO_BYTES &&
    /^data:image\/(png|jpe?g|webp);base64,/i.test(s)
  );
}

export default async function handler(req, res) {
  try {
    const dataParam = req.query?.data;
    if (typeof dataParam !== "string" || !dataParam) {
      res.statusCode = 400;
      res.end("Missing data param");
      return;
    }

    let payload = {};
    try {
      payload = JSON.parse(decodeURIComponent(dataParam));
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new Error("payload must be an object");
      }
    } catch {
      res.statusCode = 400;
      res.end("Invalid payload");
      return;
    }

    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const targetUrl = `https://${host}/view.html?data=${encodeURIComponent(dataParam)}`;

    const color = isHexColor(payload.color) ? payload.color : "#000000";

    const qrBuffer = await QRCode.toBuffer(targetUrl, {
      errorCorrectionLevel: "H",
      type: "png",
      width: SIZE,
      margin: 2,
      color: { dark: color, light: "#ffffff" },
    });

    const logoSrc = isLogoDataUrl(payload.innerLogo)
      ? payload.innerLogo
      : isLogoDataUrl(payload.logo)
      ? payload.logo
      : null;

    let finalBuffer = qrBuffer;
    if (logoSrc) {
      try {
        const b64 = logoSrc.split(",")[1];
        const logoInput = Buffer.from(b64, "base64");

        const logoResized = await sharp(logoInput)
          .resize(LOGO_SIZE, LOGO_SIZE, { fit: "cover" })
          .png()
          .toBuffer();

        const ringSize = LOGO_SIZE + RING_PADDING * 2;
        const ring = await sharp({
          create: {
            width: ringSize,
            height: ringSize,
            channels: 4,
            background: "#ffffff",
          },
        })
          .png()
          .toBuffer();

        finalBuffer = await sharp(qrBuffer)
          .composite([
            { input: ring, gravity: "center" },
            { input: logoResized, gravity: "center" },
          ])
          .png()
          .toBuffer();
      } catch (err) {
        console.warn("Logo overlay failed:", err.message);
      }
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.end(finalBuffer);
  } catch (err) {
    console.error("OG render error:", err);
    res.statusCode = 500;
    res.end("OG render failed");
  }
}
