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
  const total = projects.length;
  projects.forEach((p, index) => {
    const card = document.createElement("project-card");
    card.setAttribute("data-id", p.id);
    card.setAttribute("data-num", p.num || String(index + 1).padStart(2, "0"));
    card.setAttribute("data-title", p.title);
    card.setAttribute("data-tags", JSON.stringify(p.tags || []));
    card.setAttribute("data-status", p.status);
    card.setAttribute("data-index", index);
    card.setAttribute("data-total", total);
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
    proj.id = parseInt(id, 10);
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

let isReordering = false;

async function handleReorder(detail) {
  if (isReordering) return;
  const projects = [...(window.projects || [])];
  if (!projects.length) return;

  let newProjects = [...projects];

  if (detail.direction) {
    const id = detail.id;
    const currentIndex = newProjects.findIndex((p) => Number(p.id) === Number(id));
    if (currentIndex === -1) return;

    const targetIndex = detail.direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    const [moved] = newProjects.splice(currentIndex, 1);
    newProjects.splice(targetIndex, 0, moved);
  } else if (detail.fromId != null && detail.toId != null) {
    const fromId = Number(detail.fromId);
    const toId = Number(detail.toId);
    if (fromId === toId) return;

    const fromIndex = newProjects.findIndex((p) => Number(p.id) === fromId);
    if (fromIndex === -1) return;

    const [moved] = newProjects.splice(fromIndex, 1);
    const targetIndexAfterRemoval = newProjects.findIndex((p) => Number(p.id) === toId);
    if (targetIndexAfterRemoval === -1) return;

    const insertIndex = detail.position === "after" ? targetIndexAfterRemoval + 1 : targetIndexAfterRemoval;
    newProjects.splice(insertIndex, 0, moved);
  } else {
    return;
  }

  // Anında UI optimistik güncelleme
  newProjects = newProjects.map((p, idx) => ({
    ...p,
    num: String(idx + 1).padStart(2, "0"),
  }));

  window.projects = newProjects;
  renderProjectsList(newProjects);

  isReordering = true;
  try {
    const order = newProjects.map((p) => p.id);
    const res = await window.ADMIN.updateProjects({ action: "reorder", order });
    if (!res || !res.ok) {
      reloadData();
    }
  } catch (err) {
    console.error("[projects] Sıralama hatası:", err);
    reloadData();
  } finally {
    isReordering = false;
  }
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
  const projectList = document.getElementById("project-list");
  projectList?.addEventListener("edit-project", (e) => {
    openEditProject(e.detail.id);
  });
  
  projectList?.addEventListener("delete-project", (e) => {
    deleteProject(e.detail.id);
  });

  projectList?.addEventListener("reorder-project", (e) => {
    handleReorder(e.detail);
  });
}
