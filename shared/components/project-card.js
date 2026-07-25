import { esc } from "../modules/utils.js";

export class ProjectCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Attributes
    const id = this.getAttribute("data-id");
    const num = this.getAttribute("data-num");
    const title = this.getAttribute("data-title");
    const tags = JSON.parse(this.getAttribute("data-tags") || "[]");
    const status = this.getAttribute("data-status");

    const statusBadge = status === "active" 
      ? '<span class="proj-status-badge active">Aktif</span>' 
      : '<span class="proj-status-badge done">Tamamlandı</span>';

    const tagsHtml = tags.map(t => `<span class="proj-tag">${esc(t)}</span>`).join("");

    this.innerHTML = `
      <div class="proj-row">
          <div class="proj-num">${esc(num)}</div>
          <div class="proj-info">
              <div class="proj-title">${esc(title)}</div>
              <div class="proj-tags-sm">${tagsHtml}</div>
          </div>
          ${statusBadge}
          <div class="proj-actions">
              <button class="btn-icon" data-action="edit">Düzenle</button>
              <button class="btn-icon del" data-action="delete">Sil</button>
          </div>
      </div>
    `;

    // Bind events
    this.querySelector('[data-action="edit"]').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('edit-project', { bubbles: true, detail: { id: parseInt(id) } }));
    });

    this.querySelector('[data-action="delete"]').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-project', { bubbles: true, detail: { id: parseInt(id) } }));
    });
  }
}

customElements.define("project-card", ProjectCard);
