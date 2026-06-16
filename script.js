let qrCode;
let lastQrURL = "";
let lastBizName = "";

function togglePlatform(type) {
  const card = document.getElementById(type + "Card");
  const checkbox = document.getElementById(type + "Check");

  // WhatsApp has a grouped input (select + text)
  const toggle = document.getElementById(type + "InputGroup") ||
                 document.getElementById(type + "Input");

  toggle.classList.toggle("hidden");
  card.classList.toggle("active", checkbox.checked);

  if (checkbox.checked) {
    document.getElementById(type + "Input").focus();
  }
}

// Country code → local number length (min, max)
const PHONE_LENGTHS = {
  "255": [9, 9],   // Tanzania
  "254": [9, 9],   // Kenya
  "256": [9, 9],   // Uganda
  "250": [9, 9],   // Rwanda
  "257": [8, 8],   // Burundi
  "243": [9, 9],   // DR Congo
  "258": [9, 9],   // Mozambique
  "265": [9, 9],   // Malawi
  "260": [9, 9],   // Zambia
  "263": [9, 9],   // Zimbabwe
  "27":  [9, 9],   // South Africa
  "234": [10, 10], // Nigeria
  "233": [9, 9],   // Ghana
  "251": [9, 9],   // Ethiopia
  "20":  [10, 10], // Egypt
  "212": [9, 9],   // Morocco
  "1":   [10, 10], // USA/Canada
  "44":  [10, 10], // UK
  "91":  [10, 10], // India
  "971": [9, 9],   // UAE
  "966": [9, 9],   // Saudi Arabia
  "86":  [11, 11], // China
  "81":  [10, 10], // Japan
  "49":  [10, 11], // Germany
  "33":  [9, 9],   // France
  "55":  [10, 11], // Brazil
  "46":  [9, 9],   // Sweden
};

function getPhoneLength(code) {
  return PHONE_LENGTHS[code] || [7, 12];
}

function updateWaPlaceholder() {
  const code = document.getElementById("waCountry").value;
  const input = document.getElementById("waInput");
  const [min, max] = getPhoneLength(code);
  input.maxLength = max;
  input.placeholder = min === max
    ? t("placeholder.waPhone", { n: min, example: "7".repeat(min) })
    : t("placeholder.waPhoneRange", { min, max });
}

const USERNAME_PATTERNS = {
  ig: /^[a-zA-Z0-9._]{1,30}$/,
  tw: /^[a-zA-Z0-9_]{1,15}$/,
  fb: /^[a-zA-Z0-9.\-]{3,50}$/,
  ln: /^[a-zA-Z0-9\-]{3,100}$/,
  tt: /^[a-zA-Z0-9._]{2,24}$/,
};
const isValidUsername = (platform, u) => USERNAME_PATTERNS[platform].test(u);
const isValidWebsite = (u) =>
  u.startsWith("http://") || u.startsWith("https://");

function compressImage(file, size, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("image decode failed"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        const scale = Math.min(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function generateSmartQR() {
  const links = [];
  const bizNameInput =
    document.getElementById("bizName").value.trim() || t("default.bizName");

  if (document.getElementById("waCheck").checked) {
    const countryCode = document.getElementById("waCountry").value;
    let digits = document.getElementById("waInput").value.replace(/\D/g, "");
    if (digits.startsWith(countryCode)) digits = digits.slice(countryCode.length);
    digits = digits.replace(/^0+/, "");
    const [min, max] = getPhoneLength(countryCode);
    if (digits.length < min || digits.length > max) {
      const expect = min === max ? `${min}` : `${min}–${max}`;
      alert(t("alert.phoneLength", { expect }));
      return;
    }
    links.push({ label: "WhatsApp", url: `https://wa.me/${countryCode}${digits}` });
  }
  if (document.getElementById("igCheck").checked) {
    const val = document.getElementById("igInput").value.trim().replace(/^@/, "");
    if (!isValidUsername("ig", val)) {
      alert(t("alert.invalidUsername", { platform: "Instagram" }));
      return;
    }
    links.push({ label: "Instagram", url: `https://instagram.com/${val}` });
  }
  if (document.getElementById("twCheck").checked) {
    const val = document.getElementById("twInput").value.trim().replace(/^@/, "");
    if (!isValidUsername("tw", val)) {
      alert(t("alert.invalidUsername", { platform: "Twitter" }));
      return;
    }
    links.push({ label: "Twitter", url: `https://twitter.com/${val}` });
  }
  if (document.getElementById("webCheck").checked) {
    const val = document.getElementById("webInput").value.trim();
    if (!isValidWebsite(val)) {
      alert(t("alert.invalidWebsite"));
      return;
    }
    links.push({ label: "Website", url: val });
  }
  if (document.getElementById("fbCheck").checked) {
    const val = document.getElementById("fbInput").value.trim().replace(/^@/, "");
    if (!isValidUsername("fb", val)) {
      alert(t("alert.invalidUsernameOrPage", { platform: "Facebook" }));
      return;
    }
    links.push({ label: "Facebook", url: `https://facebook.com/${val}` });
  }
  if (document.getElementById("lnCheck").checked) {
    const val = document.getElementById("lnInput").value.trim().replace(/^@/, "");
    if (!isValidUsername("ln", val)) {
      alert(t("alert.invalidUsernameOrPage", { platform: "LinkedIn" }));
      return;
    }
    links.push({ label: "LinkedIn", url: `https://linkedin.com/in/${val}` });
  }
  if (document.getElementById("ttCheck").checked) {
    const val = document.getElementById("ttInput").value.trim().replace(/^@/, "");
    if (!isValidUsername("tt", val)) {
      alert(t("alert.invalidUsername", { platform: "TikTok" }));
      return;
    }
    links.push({ label: "TikTok", url: `https://www.tiktok.com/@${val}` });
  }

  if (links.length === 0) {
    alert(t("alert.selectPlatform"));
    return;
  }

  let qrURL;

  if (links.length === 1) {
    // Single link — QR points directly to the platform URL
    qrURL = links[0].url;
  } else {
    // Multiple links — QR points to the view page
    const payload = {
      name: bizNameInput,
      links: links,
      color: document.getElementById("qrColor").value,
    };

    const bizLogoFile = document.getElementById("bizLogo").files[0];
    if (bizLogoFile) {
      try {
        payload.logo = await compressImage(bizLogoFile, 64, 0.65);
      } catch (e) {
        console.warn("Logo compression failed; omitting from payload.", e);
      }
    }

    const innerLogoFile = document.getElementById("logoInput").files[0];
    if (innerLogoFile) {
      try {
        payload.innerLogo = await compressImage(innerLogoFile, 48, 0.7);
      } catch (e) {
        console.warn("Inner logo compression failed; omitting from payload.", e);
      }
    }

    const encoded = encodeURIComponent(JSON.stringify(payload));
    qrURL = new URL(`view.html?data=${encoded}`, window.location.href).toString();
  }

  if (qrURL.length > 1500) {
    const ok = confirm(t("confirm.longUrl", { n: qrURL.length }));
    if (!ok) return;
  }

  lastQrURL = qrURL;
  lastBizName = bizNameInput;

  showBusinessLogo();
  buildQR(qrURL);
}

function showBusinessLogo() {
  const bizLogoInput = document.getElementById("bizLogo");
  const preview = document.getElementById("bizLogoPreview");
  preview.innerHTML = "";

  if (bizLogoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "Business Logo";
      img.style.maxWidth = "120px";
      img.style.maxHeight = "120px";
      preview.appendChild(img);
    };
    reader.readAsDataURL(bizLogoInput.files[0]);
  }
}

function buildQR(qrURL) {
  const qrBox = document.getElementById("qrBox");
  const logoInput = document.getElementById("logoInput");
  const qrColor = document.getElementById("qrColor");
  qrBox.innerHTML = "";

  qrCode = new QRCodeStyling({
    width: 280,
    height: 280,
    data: qrURL,
    dotsOptions: { color: qrColor.value, type: "rounded" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { crossOrigin: "anonymous", margin: 5, image: null },
  });

  if (logoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 60;
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, maxSize, maxSize);
        qrCode.update({ image: canvas.toDataURL("image/png") });
        qrCode.append(qrBox);
      };
    };
    reader.readAsDataURL(logoInput.files[0]);
  } else {
    qrCode.append(qrBox);
  }

  const actions = document.getElementById("qrActions");
  if (actions) actions.classList.remove("hidden");

  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.onclick = () =>
    qrCode.download({ name: "business-qr", extension: "png" });

  const shareBtn = document.getElementById("shareBtn");
  if (shareBtn) shareBtn.onclick = shareSmartQR;

  const copyBtn = document.getElementById("copyLinkBtn");
  if (copyBtn) copyBtn.onclick = copySmartQRLink;

  document.body.classList.add("qr-shown");
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(ta);
    }
  });
}

async function shareSmartQR() {
  if (!qrCode || !lastQrURL) return;
  const title = t("share.title", { name: lastBizName });
  const text = t("share.text");

  try {
    const blob = await qrCode.getRawData("png");
    if (blob) {
      const file = new File([blob], "smart-qr.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title, text });
        return;
      }
    }
  } catch (err) {
    if (err && err.name === "AbortError") return;
    console.warn("File share failed; falling back to link share.", err);
  }

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: lastQrURL });
      return;
    } catch (err) {
      if (err && err.name === "AbortError") return;
    }
  }

  copySmartQRLink();
}

async function copySmartQRLink() {
  if (!lastQrURL) return;
  const label = document.getElementById("copyLinkLabel");
  try {
    await copyToClipboard(lastQrURL);
    if (label) {
      label.removeAttribute("data-i18n");
      label.textContent = t("btn.copied");
      setTimeout(() => {
        label.setAttribute("data-i18n", "btn.copyLink");
        label.textContent = t("btn.copyLink");
      }, 1800);
    }
  } catch {
    prompt("Copy this link:", lastQrURL);
  }
}
