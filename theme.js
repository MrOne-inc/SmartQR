const THEME_COLORS = {
  light: "#4a2c0a",
  dark: "#13131d",
  silver: "#0d0d12",
  gold: "#0a1428",
};

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("smartqr_theme", theme);
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    const active = btn.dataset.theme === theme;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && THEME_COLORS[theme]) {
    meta.setAttribute("content", THEME_COLORS[theme]);
  }
}

(function () {
  const saved = localStorage.getItem("smartqr_theme") || "light";
  setTheme(saved);
})();
