import { esc, fmtDate } from "../modules/utils.js";

export class MessageCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const id = this.getAttribute("data-id");
    const name = this.getAttribute("data-name");
    const email = this.getAttribute("data-email");
    const timestamp = this.getAttribute("data-timestamp");
    const message = this.getAttribute("data-message");
    const isRead = this.getAttribute("data-read") === "true";

    const nameHtml = isRead ? esc(name) : `<span class="unread-dot"></span>${esc(name)}`;
    const actionHtml = !isRead ? `<button class="btn-sm" data-action="mark-read">Okundu İşaretle</button>` : "";

    this.className = `msg-card ${isRead ? "" : "unread"}`;
    this.id = `msg-${id}`;

    this.innerHTML = `
      <div class="msg-meta">
          <span class="msg-name">${nameHtml}</span>
          <span class="msg-email">${esc(email)}</span>
          <span class="msg-time">${fmtDate(timestamp)}</span>
      </div>
      <div class="msg-body">${esc(message)}</div>
      <div class="msg-actions">
          ${actionHtml}
          <button class="btn-sm" data-action="delete" style="color:var(--red)">Sil</button>
      </div>
    `;

    // Bind events
    if (!isRead) {
      this.querySelector('[data-action="mark-read"]')?.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('mark-read', { bubbles: true, detail: { id } }));
      });
    }

    this.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-message', { bubbles: true, detail: { id } }));
    });
  }
}

customElements.define("message-card", MessageCard);
