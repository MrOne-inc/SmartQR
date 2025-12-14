let qrCode;

function toggleInput(type) {
  document.getElementById(type + "Input").classList.toggle("hidden");
}

const isValidPhone = (p) => /^255\d{9}$/.test(p);
const isValidUsername = (u) => /^[a-zA-Z0-9._]+$/.test(u);
const isValidWebsite = (u) =>
  u.startsWith("http://") || u.startsWith("https://");

function generateSmartQR() {
  const links = [];
  const color = qrColor.value;
  const bizNameInput = document.getElementById("bizName").value || "Our Business";
  const darkModeChecked = document.getElementById("darkMode").checked;
  const lang = document.getElementById("lang").value;

  if (waCheck.checked) {
    const val = waInput.value.trim();
    if (!isValidPhone(val)) {
      alert("WhatsApp number must start with 255");
      return;
    }
    links.push({ label: "WhatsApp", url: `https://wa.me/${val}` });
  }
  if (igCheck.checked) {
    const val = igInput.value.trim();
    if (!isValidUsername(val)) {
      alert("Invalid Instagram username");
      return;
    }
    links.push({ label: "Instagram", url: `https://instagram.com/${val}` });
  }
  if (twCheck.checked) {
    const val = twInput.value.trim();
    if (!isValidUsername(val)) {
      alert("Invalid Twitter username");
      return;
    }
    links.push({ label: "Twitter", url: `https://twitter.com/${val}` });
  }
  if (webCheck.checked) {
    const val = webInput.value.trim();
    if (!isValidWebsite(val)) {
      alert("Website must start with https://");
      return;
    }
    links.push({ label: "Website", url: val });
  }

  if (links.length === 0) {
    alert("Select at least one platform");
    return;
  }

  // Payload for scan page (view.html) only, not inside QR
  const payload = {
    name: bizNameInput,
    links: links,
    theme: darkModeChecked ? "dark" : "light",
    lang: lang
  };

  // Encode payload JSON into short URL
  const encoded = encodeURIComponent(JSON.stringify(payload));
  const qrURL = `https://mrone-inc.github.io/qr-generator/view.html?data=${encoded}`;

  buildQR(qrURL);
}

function buildQR(qrURL) {
  const qrBox = document.getElementById("qrBox");
  qrBox.innerHTML = "";

  // QR Code Styling
  qrCode = new QRCodeStyling({
    width: 280,
    height: 280,
    data: qrURL,
    dotsOptions: { color: qrColor.value, type: "rounded" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { crossOrigin: "anonymous", margin: 5, image: null }
  });

  // Add logo if uploaded (resized to max 60px)
  if (logoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        // Resize large images to max 60px
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

  // Enable download
  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.classList.remove("hidden");
  downloadBtn.onclick = () => qrCode.download({ name: "business-qr", extension: "png" });
}
