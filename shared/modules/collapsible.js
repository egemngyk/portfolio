/* Açılır/kapanır kartlar.
   Kullanım (HTML):
     <button data-collapse-toggle aria-expanded="false" aria-controls="BODY_ID">…</button>
     <div id="BODY_ID" hidden>…</div>
   Açılınca BODY elementinde "collapsible-open" olayı tetiklenir (grafikler yeniden çizilsin diye). */

function setOpen(btn, body, open) {
  btn.setAttribute("aria-expanded", String(open));
  body.hidden = !open;
  if (open) {
    body.dispatchEvent(new CustomEvent("collapsible-open", { bubbles: true }));
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
  }
}

export function initCollapsibles() {
  document.querySelectorAll("[data-collapse-toggle]").forEach((btn) => {
    if (btn.dataset.bound === "1") return;
    const body = document.getElementById(btn.getAttribute("aria-controls"));
    if (!body) return;
    btn.dataset.bound = "1";

    // Varsayılan: kapalı
    setOpen(btn, body, btn.getAttribute("aria-expanded") === "true");

    btn.addEventListener("click", () => {
      setOpen(btn, body, btn.getAttribute("aria-expanded") !== "true");
    });
  });
}