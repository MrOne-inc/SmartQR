let qrCode;

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
  "46":  [7, 9],   // Sweden
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
    ? `${min} digits (e.g. ${"7".repeat(min)})`
    : `${min}–${max} digits`;
}

const isValidUsername = (u) => /^[a-zA-Z0-9._]+$/.test(u);
const isValidWebsite = (u) =>
  u.startsWith("http://") || u.startsWith("https://");

function generateSmartQR() {
  const links = [];
  const bizNameInput =
    document.getElementById("bizName").value.trim() || "Our Business";

  if (document.getElementById("waCheck").checked) {
    const countryCode = document.getElementById("waCountry").value;
    const localNum = document.getElementById("waInput").value.trim().replace(/^0+/, "").replace(/\D/g, "");
    const [min, max] = getPhoneLength(countryCode);
    if (localNum.length < min || localNum.length > max) {
      const expect = min === max ? `${min}` : `${min}–${max}`;
      alert(`Phone number should be ${expect} digits (without country code)`);
      return;
    }
    links.push({ label: "WhatsApp", url: `https://wa.me/${countryCode}${localNum}` });
  }
  if (document.getElementById("igCheck").checked) {
    const val = document.getElementById("igInput").value.trim();
    if (!isValidUsername(val)) {
      alert("Invalid Instagram username");
      return;
    }
    links.push({ label: "Instagram", url: `https://instagram.com/${val}` });
  }
  if (document.getElementById("twCheck").checked) {
    const val = document.getElementById("twInput").value.trim();
    if (!isValidUsername(val)) {
      alert("Invalid Twitter username");
      return;
    }
    links.push({ label: "Twitter", url: `https://twitter.com/${val}` });
  }
  if (document.getElementById("webCheck").checked) {
    const val = document.getElementById("webInput").value.trim();
    if (!isValidWebsite(val)) {
      alert("Website must start with https://");
      return;
    }
    links.push({ label: "Website", url: val });
  }
  if (document.getElementById("fbCheck").checked) {
    const val = document.getElementById("fbInput").value.trim();
    if (!val) {
      alert("Invalid Facebook username/page");
      return;
    }
    links.push({ label: "Facebook", url: `https://facebook.com/${val}` });
  }
  if (document.getElementById("lnCheck").checked) {
    const val = document.getElementById("lnInput").value.trim();
    if (!val) {
      alert("Invalid LinkedIn username/page");
      return;
    }
    links.push({ label: "LinkedIn", url: `https://linkedin.com/in/${val}` });
  }
  if (document.getElementById("ttCheck").checked) {
    const val = document.getElementById("ttInput").value.trim();
    if (!val) {
      alert("Invalid TikTok username");
      return;
    }
    links.push({ label: "TikTok", url: `https://www.tiktok.com/@${val}` });
  }

  if (links.length === 0) {
    alert("Select at least one platform");
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
    };
    const encoded = encodeURIComponent(JSON.stringify(payload));
    qrURL = `https://mrone-inc.github.io/SmartQR/view.html?data=${encoded}`;
  }

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

  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.classList.remove("hidden");
  downloadBtn.onclick = () =>
    qrCode.download({ name: "business-qr", extension: "png" });
}
