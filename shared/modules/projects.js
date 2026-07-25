import { getVal, setVal, reloadData } from "./utils.js";
import "../components/project-card.js"; // Import the Web Component

export function renderProjectsList(projects) {
  const container = document.getElementById("project-list");
  if (!container) return;

  if (!projects.length) {
    container.innerHTML = '<div class="empty-state">Proje yok. Yeni ekleyin.</div>';
    return;
  }

  container.innerHTML = "";
  projects.forEach(p => {
    const card = document.createElement("project-card");
    card.setAttribute("data-id", p.id);
    card.setAttribute("data-num", p.num);
    card.setAttribute("data-title", p.title);
    card.setAttribute("data-tags", JSON.stringify(p.tags || []));
    card.setAttribute("data-status", p.status);
    container.appendChild(card);
  });
}

function openModal() {
  document.getElementById("proj-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("proj-modal").style.display = "none";
}

export function openAddProject() {
  document.getElementById("modal-title").textContent = "Yeni Proje";
  setVal("proj-id", "");
  setVal("proj-title", "");
  setVal("proj-desc", "");
  setVal("proj-desc-en", "");
  setVal("proj-tags", "");
  setVal("proj-status", "active");
  setVal("proj-github", "");
  openModal();
}

export function openEditProject(id) {
  const p = (window.projects || []).find((x) => x.id === id);
  if (!p) return;
  document.getElementById("modal-title").textContent = "Projeyi Düzenle";
  setVal("proj-id", p.id);
  setVal("proj-title", p.title);
  setVal("proj-desc", p.description);
  setVal("proj-desc-en", p.description_en || "");
  setVal("proj-tags", (p.tags || []).join(", "));
  setVal("proj-status", p.status);
  setVal("proj-github", p.github || "");
  openModal();
}

export async function saveProject() {
  const id = getVal("proj-id");
  const proj = {
    title: getVal("proj-title"),
    description: getVal("proj-desc"),
    description_en: getVal("proj-desc-en"),
    tags: getVal("proj-tags").split(",").map(t => t.trim()).filter(Boolean),
    status: getVal("proj-status"),
    github: getVal("proj-github"),
  };
  
  let body;
  if (id) {
    proj.id = parseInt(id);
    body = { action: "update", project: proj };
  } else {
    body = { action: "add", project: proj };
  }
  const res = await window.ADMIN.updateProjects(body);
  if (res.ok) {
    closeModal();
    reloadData();
  }
}

export async function deleteProject(id) {
  if (!confirm("Bu projeyi silmek istediğinden emin misin?")) return;
  const res = await window.ADMIN.updateProjects({ action: "delete", id });
  if (res.ok) reloadData();
}

export function initProjects() {
  document.getElementById("btn-add-project")?.addEventListener("click", openAddProject);
  document.getElementById("btn-modal-cancel")?.addEventListener("click", closeModal);
  document.getElementById("btn-modal-save")?.addEventListener("click", saveProject);

  // Modal dışına tıklayınca kapat
  const modalOverlay = document.getElementById("proj-modal");
  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Listen to Web Component events
  document.getElementById("project-list")?.addEventListener('edit-project', (e) => {
    openEditProject(e.detail.id);
  });
  
  document.getElementById("project-list")?.addEventListener('delete-project', (e) => {
    deleteProject(e.detail.id);
  });
}
