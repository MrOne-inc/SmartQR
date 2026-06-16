const ALLOWED_PROTOCOLS = ["https:", "http:"];

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return ALLOWED_PROTOCOLS.includes(url.protocol);
  } catch {
    return false;
  }
}

const PLATFORM_MAP = {
  WhatsApp:  { css: "whatsapp",  icon: "W" },
  Instagram: { css: "instagram", icon: "I" },
  Twitter:   { css: "twitter",   icon: "X" },
  Facebook:  { css: "facebook",  icon: "f" },
  LinkedIn:  { css: "linkedin",  icon: "in" },
  TikTok:    { css: "tiktok",    icon: "T" },
  Website:   { css: "website",   icon: "★" },
};

function vcardEscape(value) {
  return String(value).replace(/([\\,;])/g, "\\$1").replace(/\r?\n/g, "\\n");
}

function buildVCard(name, links) {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  if (name) {
    lines.push("FN:" + vcardEscape(name));
    lines.push("ORG:" + vcardEscape(name));
  }
  links.forEach((link) => {
    if (link.label === "WhatsApp") {
      const phone = link.url.replace(/^https?:\/\/wa\.me\//, "").replace(/\D/g, "");
      if (phone) {
        lines.push("TEL;TYPE=CELL,VOICE:+" + phone);
        lines.push("X-WHATSAPP:+" + phone);
      }
    } else if (link.label === "Website") {
      lines.push("URL:" + vcardEscape(link.url));
    } else {
      lines.push(
        "X-SOCIALPROFILE;TYPE=" + link.label.toLowerCase() + ":" + vcardEscape(link.url)
      );
    }
  });
  lines.push("END:VCARD");
  return lines.join("\r\n");
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

function setupActions(name, links) {
  const row = document.getElementById("actionRow");
  if (!row || !links.length) return;
  row.classList.remove("hidden");
  setupSaveContact(name, links);
  setupShare(name);
}

function setupSaveContact(name, links) {
  const btn = document.getElementById("saveContactBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const vcard = buildVCard(name, links);
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const safeName = (name || "contact").replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 40);
    const a = document.createElement("a");
    a.href = url;
    a.download = safeName + ".vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

function setupShare(name) {
  const btn = document.getElementById("shareBtn");
  const label = document.getElementById("shareBtnLabel");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const shareData = {
      title: name ? name + " — SmartQR" : "SmartQR",
      text: name ? t("view.shareText", { name }) : t("view.shareTextDefault"),
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    try {
      await copyToClipboard(window.location.href);
      label.removeAttribute("data-i18n");
      label.textContent = t("view.action.copied");
      setTimeout(() => {
        label.setAttribute("data-i18n", "view.action.share");
        label.textContent = t("view.action.share");
      }, 1800);
    } catch {
      prompt("Copy this link:", window.location.href);
    }
  });
}

let parsedPayload = null;
let validLinks = [];
let container;
let subtitleEl;

function renderError(key) {
  container.innerHTML = "";
  const p = document.createElement("p");
  p.className = "text-center text-danger";
  p.setAttribute("data-i18n", key);
  p.textContent = t(key);
  container.appendChild(p);
  subtitleEl.style.display = "none";
}

function renderLinks() {
  container.innerHTML = "";
  if (validLinks.length === 1) {
    container.classList.add("single-link");
    subtitleEl.textContent = t("view.subtitleSingle", {
      platform: validLinks[0].label,
    });
  } else {
    container.classList.remove("single-link");
    subtitleEl.textContent = t("view.subtitle");
  }

  validLinks.forEach((link) => {
    const fallbackIcon = (link.label[0] || "#").toUpperCase();
    const platform = PLATFORM_MAP[link.label] || { css: "default", icon: fallbackIcon };

    const a = document.createElement("a");
    a.href = link.url;
    a.className = "link-card " + platform.css;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", t("view.linkOpen", { platform: link.label }));

    const iconSpan = document.createElement("span");
    iconSpan.className = "link-icon";
    iconSpan.textContent = platform.icon;
    iconSpan.setAttribute("aria-hidden", "true");

    const labelSpan = document.createElement("span");
    labelSpan.textContent =
      validLinks.length === 1
        ? t("view.linkOpen", { platform: link.label })
        : link.label;

    a.appendChild(iconSpan);
    a.appendChild(labelSpan);
    container.appendChild(a);
  });
}

function updateDocTitle() {
  if (!parsedPayload) return;
  const countText =
    validLinks.length === 1
      ? t("view.linkCountOne")
      : t("view.linkCount", { n: validLinks.length });
  const head = parsedPayload.name || "SmartQR";
  document.title = validLinks.length
    ? `${head} — ${countText}`
    : t("view.title");
}

function onLangChange() {
  if (parsedPayload) {
    updateDocTitle();
    renderLinks();
  }
}

function initView() {
  container = document.getElementById("linksContainer");
  subtitleEl = document.getElementById("viewSubtitle");

  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");

  if (!data) {
    renderError("view.error.noData");
    return;
  }

  try {
    const raw = JSON.parse(data);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error("payload must be an object");
    }

    parsedPayload = {};
    if (typeof raw.name === "string") {
      parsedPayload.name = raw.name.trim().slice(0, 80);
    }
    if (Array.isArray(raw.links)) {
      parsedPayload.links = raw.links;
    }
    if (
      typeof raw.logo === "string" &&
      raw.logo.length <= 20000 &&
      /^data:image\/(png|jpe?g|webp);base64,/i.test(raw.logo)
    ) {
      parsedPayload.logo = raw.logo;
    }

    if (parsedPayload.name) {
      const titleEl = document.getElementById("bizTitle");
      titleEl.textContent = parsedPayload.name;
      titleEl.removeAttribute("data-i18n");

      const branding = document.getElementById("bizBranding");
      const logoWrapper = document.getElementById("bizLogoView");

      const hasLogo = !!parsedPayload.logo;

      if (hasLogo) {
        const img = document.createElement("img");
        img.src = parsedPayload.logo;
        img.alt = parsedPayload.name;
        logoWrapper.appendChild(img);
      } else {
        const initialsEl = document.createElement("div");
        initialsEl.className = "biz-initials";
        initialsEl.textContent = parsedPayload.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();
        logoWrapper.appendChild(initialsEl);
      }
      branding.classList.remove("hidden");
    }

    if (!Array.isArray(parsedPayload.links) || parsedPayload.links.length === 0) {
      throw new Error("No links found");
    }

    validLinks = parsedPayload.links.filter(
      (l) => l && typeof l.label === "string" && isValidUrl(l.url)
    );

    renderLinks();
    updateDocTitle();
    setupActions(parsedPayload.name, validLinks);
  } catch {
    renderError("view.error.invalid");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initView);
} else {
  initView();
}
