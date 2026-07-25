/* ─────────────────────────────────────────────
   GLASS THEME — panel.js
   Renders float-status card in hero
─────────────────────────────────────────────── */
(function () {
  "use strict";
  function trySetStatus() {
    const el = document.getElementById("float-status");
    const text = window.status_text;
    if (!el) return;
    if (!text) { setTimeout(trySetStatus, 100); return; }
    el.textContent = text;
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", trySetStatus);
  } else {
    trySetStatus();
  }
})();
