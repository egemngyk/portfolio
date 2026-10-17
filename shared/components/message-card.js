import { esc, fmtDate } from "../modules/utils.js";

/** Gönderene cevap yazmak için mailto bağlantısı üretir (e-posta geçersizse boş döner). */
function buildMailto({ name, email, message, dateText }) {
  const to = String(email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return "";

  const subject = "Re: İletişim formu mesajınız";
  const quoted = String(message || "")
    .slice(0, 400) // mailto adresi çok uzamasın
    .split(/\r?\n/)
    .map((line) => "> " + line)
    .join("\r\n");
  const body =
    `Merhaba ${name || ""},\r\n\r\n\r\n\r\n---\r\n` +
    `${dateText ? dateText + " tarihli mesajınız:" : "Mesajınız:"}\r\n${quoted}`;

  const toEncoded = encodeURIComponent(to).replace(/%40/g, "@");
  return `mailto:${toEncoded}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export class MessageCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const id = this.getAttribute("data-id");
    const name = this.getAttribute("data-name");
    const email = this.getAttribute("data-email");
    const timestamp = this.getAttribute("data-timestamp"); // milisaniye ya da ISO; boş olabilir
    const message = this.getAttribute("data-message");
    const isRead = this.getAttribute("data-read") === "true";

    const dateText = fmtDate(timestamp);
    const mailto = buildMailto({ name, email, message, dateText });

    const nameHtml = isRead ? esc(name) : `<span class="unread-dot"></span>${esc(name)}`;
    const readBtn = !isRead
      ? `<button type="button" class="btn-sm" data-action="mark-read">Okundu İşaretle</button>`
      : "";
    const replyBtn = mailto
      ? `<a class="btn-sm btn-reply" data-action="reply" href="${esc(mailto)}">Cevap Ver</a>`
      : "";

    this.className = `msg-card ${isRead ? "" : "unread"}`;
    this.style.display = "block"; // özel elementler varsayılan olarak inline gelir
    this.id = `msg-${id}`;

    this.innerHTML = `
      <div class="msg-meta">
          <span class="msg-name">${nameHtml}</span>
          <span class="msg-email">${esc(email)}</span>
          <span class="msg-time">${dateText ? esc(dateText) : "—"}</span>
      </div>
      <div class="msg-body">${esc(message)}</div>
      <div class="msg-actions">
          ${replyBtn}
          ${readBtn}
          <button type="button" class="btn-sm" data-action="delete" style="color:var(--red)">Sil</button>
      </div>
    `;

    // Bind events
    if (!isRead) {
      this.querySelector('[data-action="mark-read"]')?.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("mark-read", { bubbles: true, detail: { id } }));
      });
    }

    this.querySelector('[data-action="delete"]')?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("delete-message", { bubbles: true, detail: { id } }));
    });
  }
}

if (!customElements.get("message-card")) {
  customElements.define("message-card", MessageCard);
}