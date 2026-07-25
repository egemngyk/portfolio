import { esc, fmtDate, getVal, calcAge } from "./utils.js";
import { renderMetaForm, initMeta } from "./meta.js";
import { renderStatsForm, renderStats, initStats } from "./stats.js";
import { renderLanguagesForm, initLanguages } from "./languages.js";
import { renderProjectsList, initProjects } from "./projects.js";
import { renderContactForm, initContact } from "./contact.js";
import { loadMessages, initMessages, updateMsgBadge } from "./messages.js";
import { renderThemesList, initThemes } from "./themes.js";
import "../components/message-card.js";

function waitForADMIN() {
  return new Promise((resolve) => {
    if (window.ADMIN && typeof window.ADMIN.checkAuth === "function") {
      return resolve();
    }
    const interval = setInterval(() => {
      if (window.ADMIN && typeof window.ADMIN.checkAuth === "function") {
        clearInterval(interval);
        resolve();
      }
    }, 20);
  });
}

function renderOverview(d) {
  const age = calcAge(d.meta?.birthdate);
  const unread = (d.messages || []).filter((m) => !m.read).length;

  const ovAge = document.getElementById("ov-age");
  if (ovAge) ovAge.textContent = age;
  
  const ovProjects = document.getElementById("ov-projects");
  if (ovProjects && d.stats) ovProjects.textContent = d.stats.active_projects;
  
  const ovLangs = document.getElementById("ov-langs");
  if (ovLangs && d.languages) ovLangs.textContent = d.languages.filter(l => l.visible).length;
  
  const ovUnread = document.getElementById("ov-unread");
  if (ovUnread) ovUnread.textContent = unread;
  
  updateMsgBadge(unread);

  // Son 3 mesaj (Component kullanmadan veya Component kullanarak)
  const msgs = (d.messages || []).slice(-3).reverse();
  const el = document.getElementById("recent-messages");
  if (!el) return;
  
  if (!msgs.length) {
    el.innerHTML = '<div class="empty-state">Henüz mesaj yok.</div>';
    return;
  }
  
  el.innerHTML = "";
  msgs.forEach(m => {
    const card = document.createElement("message-card");
    card.setAttribute("data-id", m.id);
    card.setAttribute("data-name", m.name);
    card.setAttribute("data-email", m.email);
    card.setAttribute("data-timestamp", m.timestamp);
    card.setAttribute("data-message", m.message.substring(0, 120) + (m.message.length > 120 ? "…" : ""));
    card.setAttribute("data-read", m.read);
    el.appendChild(card);
  });
}

export async function loadAllData() {
  const res = await window.ADMIN.getData();
  if (!res.ok) return;
  const d = res.data;

  window.portfolio = d;
  window.languages = d.languages;
  window.stack_tools = d.stack_tools;
  window.projects = d.projects;
  window.messages = d.messages;
  window.analytics = d.analytics;

  renderOverview(d);
  if (d.meta) renderMetaForm(d.meta);
  if (d.stats) renderStatsForm(d.stats);
  if (d.languages) renderLanguagesForm(d.languages);
  if (d.projects) renderProjectsList(d.projects);
  if (d.contact) renderContactForm(d.contact);
  renderStats();

  await loadMessages();
  
  try {
    const themesRes = await window.ADMIN.getThemes();
    const themes = Array.isArray(themesRes) ? themesRes : (themesRes.themes || []);
    renderThemesList(themes);
  } catch (err) {
    console.error("[panel] Temalar yüklenemedi:", err);
  }
}

export async function loadThemes() {
  try {
    const result = await window.ADMIN.getThemes();
    const themes = Array.isArray(result) ? result : (result.themes || []);
    renderThemesList(themes);
  } catch (err) {
    console.error("[panel] Temalar yüklenemedik:", err);
  }
}

function showPanel() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("panel").style.display = "grid";
  loadAllData();
}

async function init() {
  await waitForADMIN();
  const res = await window.ADMIN.checkAuth();
  if (res.ok) showPanel();

  // Login events
  document.getElementById("login-btn")?.addEventListener("click", async () => {
    const pw = getVal("login-pw");
    const err = document.getElementById("login-error");
    if (err) err.textContent = "";
    const loginRes = await window.ADMIN.login(pw);
    if (loginRes.ok) {
      showPanel();
    } else if (err) {
      err.textContent = loginRes.error || "Giriş başarısız.";
    }
  });

  document.getElementById("login-pw")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("login-btn")?.click();
  });

  document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await window.ADMIN.logout();
    location.reload();
  });

  // Tabs
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = item.dataset.tab;
      document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
      item.classList.add("active");
      document.getElementById(`tab-${tab}`)?.classList.add("active");
      
      if (tab === "messages") loadMessages();
      if (tab === "themes") loadThemes();
    });
  });

  // Initialize modules
  initMeta();
  initStats();
  initLanguages();
  initProjects();
  initContact();
  initMessages();
  initThemes();

  // Listen to reload data event
  window.addEventListener('reload-data', loadAllData);
  // themes.js döngüsel import'tan kaçınmak için bu event'i dinler
  window.addEventListener('load-themes', loadThemes);
  
  // Expose loadThemes for themes.js
  window.loadThemes = loadThemes;
}

// panel-loader.js bu dosyayı dinamik olarak yüklediği için
// DOMContentLoaded zaten geçmiş olabilir — doğrudan çalıştır.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
