/* ─── panel-loader.js ────────────────────────────────────────────────────────
   Panel için script yükleme sırası:
   1. api.js      → window.API (Firebase tabanlı)
   2. panel.js    → window.ADMIN + window.portfolio bağlamaları
   3. panel-render.js → DOM render
────────────────────────────────────────────────────────────────────────────── */

// Admin Firebase email — Firebase Auth email+şifre gerektirir.
// Bu değeri değiştirmek için sadece bu satırı güncelleyin.
window._ADMIN_EMAIL = "%%ADMIN_EMAIL%%";

function scriptYukle(src, isModule = false) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    if (isModule) {
      script.type = "module";
    }
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

scriptYukle("/shared/api.js", true)
  .then(() => scriptYukle("/shared/panel.js", true))
  .then(() => window.panelPromise)
  .then(() => scriptYukle("/shared/modules/main.js", true))
  .then(() => {
    if (!window.API) throw new Error("API Missing");
    if (!window.ADMIN) throw new Error("ADMIN Missing");
  })
  .catch((err) => {
    console.error("[panel-loader] Yükleme hatası:", err);
  });
