const STRINGS = {
  en: {
    "head.title": "SmartQR — One QR Code, Multiple Smart Links",
    "head.description":
      "Generate one QR code that links to all your social media — WhatsApp, Instagram, Facebook, TikTok, LinkedIn, Twitter, and your website.",

    "app.header": "SmartQR Generator",
    "app.subtitle": "One QR code. All your links.",
    "app.helpTitle": "How to use",

    "section.businessInfo": "Business Info",
    "section.platforms": "Select Platforms",

    "field.bizName.label": "Business Name",
    "field.bizName.placeholder": "e.g. NestaPay",
    "field.bizLogo.label": "Logo (above QR)",
    "field.logo.label": "Logo (inside QR)",
    "field.qrColor.label": "QR Color",

    "placeholder.username": "username",
    "placeholder.usernameOrPage": "username or page",
    "placeholder.website": "https://example.com",
    "placeholder.waPhone": "{n} digits (e.g. {example})",
    "placeholder.waPhoneRange": "{min}–{max} digits",

    "btn.generate": "Generate Smart QR",
    "btn.download": "Download PNG",
    "btn.share": "Share",
    "btn.copyLink": "Copy Link",
    "btn.copied": "Copied!",
    "share.title": "{name} — SmartQR",
    "share.text": "Scan this QR to see all my links",

    "modal.welcome.title": "Welcome to SmartQR",
    "modal.welcome.intro": "Create one QR code for all your links in 4 steps:",
    "modal.welcome.step1.strong": "Enter your business name",
    "modal.welcome.step1.tail":
      " — it shows as the heading when someone scans your QR.",
    "modal.welcome.step2.strong": "Select your platforms",
    "modal.welcome.step2.tail":
      " — tick the ones you use and enter your username or phone number.",
    "modal.welcome.step3.strong": "Customize",
    "modal.welcome.step3.tail":
      " — pick a QR color and optionally embed your logo inside it.",
    "modal.welcome.step4.strong": "Generate & Download",
    "modal.welcome.step4.tail":
      " — hit the button, then save your QR as a PNG.",
    "modal.welcome.tip.strong": "Tip:",
    "modal.welcome.tip.tail":
      " Print your QR on business cards, posters, menus, or share it on social media — one scan gives your customers all your links!",
    "modal.welcome.cta": "Get Started",

    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.silver": "Silver",
    "theme.gold": "Gold",

    "view.title": "Smart QR View",
    "view.description":
      "View your SmartQR links — one scan, multiple connections.",
    "view.defaultTitle": "Your Smart QR Links",
    "view.subtitle": "Tap a link to connect",
    "view.subtitleSingle": "Tap below to open {platform}",
    "view.linkOpen": "Open {platform}",
    "view.action.saveContact": "Save Contact",
    "view.action.share": "Share",
    "view.action.copied": "Link copied!",
    "view.error.noData": "No data found!",
    "view.error.invalid": "Invalid or corrupted QR data.",
    "view.poweredBy": "Powered by",
    "view.shareText": "Check out {name}",
    "view.shareTextDefault": "Check out my SmartQR",
    "view.linkCount": "{n} links",
    "view.linkCountOne": "1 link",

    "alert.phoneLength":
      "Phone number should be {expect} digits (without country code)",
    "alert.invalidUsername": "Invalid {platform} username",
    "alert.invalidUsernameOrPage": "Invalid {platform} username/page",
    "alert.invalidWebsite": "Website must start with https://",
    "alert.selectPlatform": "Select at least one platform",
    "confirm.longUrl":
      "This QR encodes {n} characters. Long QRs can be hard to scan when printed small. Continue anyway?",
    "default.bizName": "Our Business",
  },

  sw: {
    "head.title": "SmartQR — Msimbo Mmoja, Viungo Smart Vingi",
    "head.description":
      "Tengeneza msimbo mmoja wa QR unaounganisha mitandao yako yote ya kijamii — WhatsApp, Instagram, Facebook, TikTok, LinkedIn, Twitter, na tovuti yako.",

    "app.header": "Tengeneza SmartQR",
    "app.subtitle": "Msimbo mmoja. Viungo vyote.",
    "app.helpTitle": "Jinsi ya kutumia",

    "section.businessInfo": "Taarifa za Biashara",
    "section.platforms": "Chagua Mitandao",

    "field.bizName.label": "Jina la Biashara",
    "field.bizName.placeholder": "mfano: NestaPay",
    "field.bizLogo.label": "Nembo (juu ya QR)",
    "field.logo.label": "Nembo (ndani ya QR)",
    "field.qrColor.label": "Rangi ya QR",

    "placeholder.username": "jina la mtumiaji",
    "placeholder.usernameOrPage": "jina la mtumiaji au ukurasa",
    "placeholder.website": "https://mfano.com",
    "placeholder.waPhone": "tarakimu {n} (mfano: {example})",
    "placeholder.waPhoneRange": "tarakimu {min}–{max}",

    "btn.generate": "Tengeneza Smart QR",
    "btn.download": "Pakua PNG",
    "btn.share": "Shiriki",
    "btn.copyLink": "Nakili Kiungo",
    "btn.copied": "Imenakiliwa!",
    "share.title": "{name} — SmartQR",
    "share.text": "Scan QR hii kuona viungo vyangu vyote",

    "modal.welcome.title": "Karibu SmartQR",
    "modal.welcome.intro":
      "Tengeneza msimbo mmoja wa QR kwa viungo vyako vyote kwa hatua 4:",
    "modal.welcome.step1.strong": "Weka jina la biashara yako",
    "modal.welcome.step1.tail":
      " — linaonekana kama kichwa wakati mtu akiscan QR yako.",
    "modal.welcome.step2.strong": "Chagua mitandao yako",
    "modal.welcome.step2.tail":
      " — teua unayotumia kisha weka jina la mtumiaji au namba ya simu.",
    "modal.welcome.step3.strong": "Boresha muonekano",
    "modal.welcome.step3.tail":
      " — chagua rangi ya QR na ikipendwa weka nembo yako ndani yake.",
    "modal.welcome.step4.strong": "Tengeneza & Pakua",
    "modal.welcome.step4.tail":
      " — bonyeza kitufe, kisha hifadhi QR yako kama PNG.",
    "modal.welcome.tip.strong": "Kidokezo:",
    "modal.welcome.tip.tail":
      " Chapisha QR yako kwenye kadi za biashara, mabango, menyu, au shiriki kwenye mitandao ya kijamii — scan moja inawapa wateja viungo vyako vyote!",
    "modal.welcome.cta": "Anza",

    "theme.light": "Nyeupe",
    "theme.dark": "Giza",
    "theme.silver": "Fedha",
    "theme.gold": "Dhahabu",

    "view.title": "Onyesho la Smart QR",
    "view.description":
      "Tazama viungo vyako vya SmartQR — scan moja, miunganisho mingi.",
    "view.defaultTitle": "Viungo vyako vya Smart QR",
    "view.subtitle": "Gusa kiungo ili kuungana",
    "view.subtitleSingle": "Gusa hapa chini kufungua {platform}",
    "view.linkOpen": "Fungua {platform}",
    "view.action.saveContact": "Hifadhi Mawasiliano",
    "view.action.share": "Shiriki",
    "view.action.copied": "Kiungo kimenakiliwa!",
    "view.error.noData": "Hakuna data!",
    "view.error.invalid": "Data ya QR si sahihi au imeharibika.",
    "view.poweredBy": "Imeendeshwa na",
    "view.shareText": "Angalia {name}",
    "view.shareTextDefault": "Angalia SmartQR yangu",
    "view.linkCount": "Viungo {n}",
    "view.linkCountOne": "Kiungo 1",

    "alert.phoneLength":
      "Namba ya simu inapaswa kuwa na tarakimu {expect} (bila msimbo wa nchi)",
    "alert.invalidUsername": "Jina la mtumiaji la {platform} si sahihi",
    "alert.invalidUsernameOrPage":
      "Jina la mtumiaji au ukurasa wa {platform} si sahihi",
    "alert.invalidWebsite": "Tovuti lazima ianze na https://",
    "alert.selectPlatform": "Chagua angalau mtandao mmoja",
    "confirm.longUrl":
      "QR hii ina herufi {n}. QR ndefu zinaweza kushindwa kuscanwa zikichapishwa ndogo. Endelea?",
    "default.bizName": "Biashara Yetu",
  },
};

function detectLang() {
  const saved = localStorage.getItem("smartqr_lang");
  if (saved && STRINGS[saved]) return saved;
  const browser = (navigator.language || "en").toLowerCase();
  return browser.startsWith("sw") ? "sw" : "en";
}

let currentLang = detectLang();

function t(key, vars) {
  let str =
    (STRINGS[currentLang] && STRINGS[currentLang][key]) ||
    STRINGS.en[key] ||
    key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      str = str.split("{" + k + "}").join(vars[k]);
    });
  }
  return str;
}

function applyTranslations(root) {
  const scope = root || document;
  scope.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  scope.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });
  scope.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
  });
  scope.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute(
      "aria-label",
      t(el.getAttribute("data-i18n-aria-label"))
    );
  });
  if (document === scope) {
    document.documentElement.lang = currentLang;
    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) document.title = t(titleEl.getAttribute("data-i18n"));
  }
}

function setLang(lang) {
  if (!STRINGS[lang]) return;
  currentLang = lang;
  localStorage.setItem("smartqr_lang", lang);
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  applyTranslations();
  if (typeof onLangChange === "function") onLangChange(lang);
}

(function () {
  const init = () => {
    applyTranslations();
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === currentLang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();