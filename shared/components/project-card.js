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
    const index = parseInt(this.getAttribute("data-index") || "0", 10);
    const total = parseInt(this.getAttribute("data-total") || "1", 10);

    const isFirst = index === 0;
    const isLast = index >= total - 1;

    const statusBadge =
      status === "active"
        ? '<span class="proj-status-badge active">Aktif</span>'
        : '<span class="proj-status-badge done">Tamamlandı</span>';

    const tagsHtml = tags.map((t) => `<span class="proj-tag">${esc(t)}</span>`).join("");

    this.innerHTML = `
      <div class="proj-row" draggable="true" data-id="${esc(id)}">
          <div class="proj-drag-handle" title="Sıralamak için sürükleyin" aria-label="Sürükle">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="5" cy="4" r="1.5"/>
              <circle cx="11" cy="4" r="1.5"/>
              <circle cx="5" cy="8" r="1.5"/>
              <circle cx="11" cy="8" r="1.5"/>
              <circle cx="5" cy="12" r="1.5"/>
              <circle cx="11" cy="12" r="1.5"/>
            </svg>
          </div>
          <div class="proj-reorder-btns">
            <button type="button" class="btn-icon btn-reorder" data-action="move-up" title="Yukarı taşı" ${isFirst ? "disabled" : ""}>↑</button>
            <button type="button" class="btn-icon btn-reorder" data-action="move-down" title="Aşağı taşı" ${isLast ? "disabled" : ""}>↓</button>
          </div>
          <div class="proj-num">${esc(num)}</div>
          <div class="proj-info">
              <div class="proj-title">${esc(title)}</div>
              <div class="proj-tags-sm">${tagsHtml}</div>
          </div>
          ${statusBadge}
          <div class="proj-actions">
              <button type="button" class="btn-icon" data-action="edit">Düzenle</button>
              <button type="button" class="btn-icon del" data-action="delete">Sil</button>
          </div>
      </div>
    `;

    const row = this.querySelector(".proj-row");

    // Reorder butonları (Yukarı / Aşağı)
    this.querySelector('[data-action="move-up"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.dispatchEvent(
        new CustomEvent("reorder-project", {
          bubbles: true,
          detail: { id: parseInt(id, 10), direction: "up" },
        })
      );
    });

    this.querySelector('[data-action="move-down"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.dispatchEvent(
        new CustomEvent("reorder-project", {
          bubbles: true,
          detail: { id: parseInt(id, 10), direction: "down" },
        })
      );
    });

    // Drag and Drop (Sürükle & Bırak)
    row.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
      row.classList.add("dragging");
    });

    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
      document.querySelectorAll(".proj-row").forEach((el) => {
        el.classList.remove("drag-over-top", "drag-over-bottom");
      });
    });

    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const rect = row.getBoundingClientRect();
      const isTopHalf = e.clientY - rect.top < rect.height / 2;
      row.classList.toggle("drag-over-top", isTopHalf);
      row.classList.toggle("drag-over-bottom", !isTopHalf);
    });

    row.addEventListener("dragleave", () => {
      row.classList.remove("drag-over-top", "drag-over-bottom");
    });

    row.addEventListener("drop", (e) => {
      e.preventDefault();
      const fromId = e.dataTransfer.getData("text/plain");
      const rect = row.getBoundingClientRect();
      const isTopHalf = e.clientY - rect.top < rect.height / 2;
      row.classList.remove("drag-over-top", "drag-over-bottom");

      if (fromId && fromId !== id) {
        this.dispatchEvent(
          new CustomEvent("reorder-project", {
            bubbles: true,
            detail: {
              fromId: parseInt(fromId, 10),
              toId: parseInt(id, 10),
              position: isTopHalf ? "before" : "after",
            },
          })
        );
      }
    });

    // Düzenle & Sil butonları
    this.querySelector('[data-action="edit"]').addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("edit-project", {
          bubbles: true,
          detail: { id: parseInt(id, 10) },
        })
      );
    });

    this.querySelector('[data-action="delete"]').addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("delete-project", {
          bubbles: true,
          detail: { id: parseInt(id, 10) },
        })
      );
    });
  }
}

customElements.define("project-card", ProjectCard);
