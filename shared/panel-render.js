/* ─────────────────────────────────────────────
   PANEL-RENDER.JS — Admin Panel Renderer
   Tüm API işlemleri window.ADMIN.* üzerinden gider (panel.js).
   Bu dosya sadece DOM'u yönetir: render, event, form.
───────────────────────────────────────────── */
(function () {
  "use strict";

  /* ══ LANG LOGO MAP ══════════════════════════ */
  const LANG_LOGOS = {
    JavaScript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    Python:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    TypeScript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    "C++":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    Rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
    Go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    Kotlin:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
    Swift:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
    "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg",
    Ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
    Dart: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
    Lua: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg",
    Shell:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
  };

  /* ══ UTILS ══════════════════════════════════ */
  /** Sadece /, http(s): veya data:image ile başlayan adreslerde <img src> kullan (aa → /aa isteği olmasın) */
  function previewImageHtml(preview, alt) {
    const s = String(preview || "").trim();
    if (
      !s ||
      (!s.startsWith("/") &&
        !/^https?:\/\//i.test(s) &&
        !s.startsWith("data:image/"))
    ) {
      return `<div class="theme-preview-placeholder" aria-hidden="true"></div>`;
    }
    const safe = s
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
    return `<img src="${safe}" alt="${esc(alt)}" loading="lazy" onerror="this.style.display='none'">`;
  }

  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val ?? "";
  }
  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }
  function showMsg(id, text, isError = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? "var(--red)" : "var(--green)";
    setTimeout(() => {
      el.textContent = "";
    }, 3000);
  }
  function calcAge(bd) {
    if (!bd) return "?";
    const b = new Date(bd);
    const t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    if (
      t.getMonth() < b.getMonth() ||
      (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())
    )
      age--;
    return age;
  }
  function fmtDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* ══ ADMIN HAZIR OLANA KADAR BEKLE ══════════ */
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

  /* ══ AUTH ════════════════════════════════════ */
  async function init() {
    await waitForADMIN();
    const res = await window.ADMIN.checkAuth();
    if (res.ok) showPanel();
  }

  document.getElementById("login-btn").addEventListener("click", async () => {
    const pw = getVal("login-pw");
    const err = document.getElementById("login-error");
    err.textContent = "";
    const res = await window.ADMIN.login(pw);
    if (res.ok) {
      showPanel();
    } else {
      err.textContent = res.error || "Giriş başarısız.";
    }
  });

  document.getElementById("login-pw").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("login-btn").click();
  });

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await window.ADMIN.logout();
    location.reload();
  });

  function showPanel() {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("panel").style.display = "grid";
    loadAllData();
    // Mesajları 30 saniyede bir otomatik yenile (gerçek zamanlı hissi)
    setInterval(() => loadMessages(), 30000);
  }

  /* ══ TABS ════════════════════════════════════ */
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = item.dataset.tab;
      document
        .querySelectorAll(".nav-item")
        .forEach((n) => n.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((t) => t.classList.remove("active"));
      item.classList.add("active");
      document.getElementById(`tab-${tab}`).classList.add("active");
      if (tab === "messages") loadMessages();
      if (tab === "themes") loadThemes();
    });
  });

  /* ══ LOAD ALL DATA ═══════════════════════════ */
  async function loadAllData() {
    const res = await window.ADMIN.getData();
    if (!res.ok) return;
    const d = res.data;

    window.portfolio = d;
    window.languages = d.languages;
    window.stack_tools = d.stack_tools;
    window.projects = d.projects;
    window.messages = d.messages;

    // Analytics globallerini set et
    window.analytics = d.analytics;

    renderOverview(d);
    renderMetaForm(d.meta);
    renderStatsForm(d.stats);
    renderLanguagesForm(d.languages);
    renderProjectsList(d.projects);
    renderContactForm(d.contact);
    renderStats(); // ← bunu ekle

    await loadMessages();
    await loadThemes();
  }

  /* ══ OVERVIEW ════════════════════════════════ */
  function renderOverview(d) {
    const age = calcAge(d.meta.birthdate);
    const unread = (d.messages || []).filter((m) => !m.read).length;

    document.getElementById("ov-age").textContent = age;
    document.getElementById("ov-projects").textContent =
      d.stats.active_projects;
    document.getElementById("ov-langs").textContent = d.languages.filter(
      (l) => l.visible,
    ).length;
    document.getElementById("ov-unread").textContent = unread;
    updateMsgBadge(unread);

    // Son 3 mesaj
    const msgs = (d.messages || []).slice(-3).reverse();
    const el = document.getElementById("recent-messages");
    if (!msgs.length) {
      el.innerHTML = '<div class="empty-state">Henüz mesaj yok.</div>';
      return;
    }
    el.innerHTML = msgs
      .map(
        (m) => `
            <div class="msg-card ${m.read ? "" : "unread"}">
                <div class="msg-meta">
                    <span class="msg-name">${m.read ? "" : '<span class="unread-dot"></span>'}${esc(m.name)}</span>
                    <span class="msg-email">${esc(m.email)}</span>
                    <span class="msg-time">${fmtDate(m.timestamp)}</span>
                </div>
                <div class="msg-body">${esc(m.message).substring(0, 120)}${m.message.length > 120 ? "…" : ""}</div>
            </div>
        `,
      )
      .join("");
  }

  /* ══ META FORM ═══════════════════════════════ */
  function renderMetaForm(m) {
    // TR alanlar
    setVal("m-name",          m.name          || "");
    setVal("m-title",         m.title         || "");
    setVal("m-birthdate",     m.birthdate      || "");
    setVal("m-location",      m.location      || "");
    setVal("m-host",          m.host          || "");
    setVal("m-domain",        m.domain        || "");
    setVal("m-status",        m.status_text   || "");
    setVal("m-about-heading", m.about_heading || "");
    setVal("m-about-p1",      m.about_p1      || "");
    setVal("m-about-p2",      m.about_p2      || "");
    setVal("m-goal-quote",    m.goal_quote    || "");
    setVal("m-goal-desc",     m.goal_desc     || "");
    // EN alanlar
    setVal("m-title-en",         m.title_en         || "");
    setVal("m-status-en",        m.status_text_en   || "");
    setVal("m-about-heading-en", m.about_heading_en || "");
    setVal("m-about-p1-en",      m.about_p1_en      || "");
    setVal("m-about-p2-en",      m.about_p2_en      || "");
    setVal("m-goal-quote-en",    m.goal_quote_en    || "");
    setVal("m-goal-desc-en",     m.goal_desc_en     || "");
  }

  async function saveMeta() {
    const body = {
      name:          getVal("m-name"),
      title:         getVal("m-title"),
      birthdate:     getVal("m-birthdate"),
      location:      getVal("m-location"),
      host:          getVal("m-host"),
      domain:        getVal("m-domain"),
      status_text:   getVal("m-status"),
      about_heading: getVal("m-about-heading"),
      about_p1:      getVal("m-about-p1"),
      about_p2:      getVal("m-about-p2"),
      goal_quote:    getVal("m-goal-quote"),
      goal_desc:     getVal("m-goal-desc"),
      // EN versiyonlar
      title_en:          getVal("m-title-en"),
      status_text_en:    getVal("m-status-en"),
      about_heading_en:  getVal("m-about-heading-en"),
      about_p1_en:       getVal("m-about-p1-en"),
      about_p2_en:       getVal("m-about-p2-en"),
      goal_quote_en:     getVal("m-goal-quote-en"),
      goal_desc_en:      getVal("m-goal-desc-en"),
    };
    const res = await window.ADMIN.updateMeta(body);
    showMsg("meta-msg", res.ok ? "Kaydedildi ✓" : res.error || "Hata", !res.ok);
    if (res.ok) await loadAllData();
  }

  // Aynı saveMeta'yı 3 butona bağla
  ["btn-save-meta-1", "btn-save-meta-2", "btn-save-meta-3"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", saveMeta);
  });

  /* ══ STATS FORM ══════════════════════════════ */
  function renderStatsForm(s) {
    setVal("s-projects", s.active_projects);
    setVal("s-langs", s.languages_count);
    setVal("s-year", s.year);
    setVal("s-message-limit", s.message_limit);
  }

  document
    .getElementById("btn-save-stats")
    .addEventListener("click", async () => {
      const body = {
        active_projects: parseInt(getVal("s-projects")) || 0,
        languages_count: parseInt(getVal("s-langs")) || 0,
        year: parseInt(getVal("s-year")) || new Date().getFullYear(),
        message_limit: parseInt(getVal("s-message-limit")) || 2500,
      };
      const res = await window.ADMIN.updateStats(body);
      showMsg(
        "stats-msg",
        res.ok ? "Kaydedildi ✓" : res.error || "Hata",
        !res.ok,
      );
      if (res.ok) await loadAllData();
    });

  /* ══ LANGUAGES FORM ══════════════════════════ */
  function renderLanguagesForm(langs) {
    const container = document.getElementById("lang-list");
    container.innerHTML = langs
      .map((lang, i) => {
        const logo = LANG_LOGOS[lang.name];
        const logoHtml = logo
          ? `<img src="${logo}" alt="${esc(lang.name)}" onerror="this.style.display='none'">`
          : `<div class="logo-placeholder">${esc(lang.name[0])}</div>`;
        return `
            <div class="lang-row">
                <div class="lang-logo">${logoHtml}</div>
                <div class="lang-name">${esc(lang.name)}</div>
                <div class="lang-toggle">
                    <input type="checkbox" id="lt-${i}" ${lang.visible ? "checked" : ""}>
                    <label for="lt-${i}"></label>
                </div>
                <div class="lang-level-wrap">
                    <input type="range" min="0" max="100" value="${lang.level}"
                        id="lr-${i}"
                        oninput="document.getElementById('lp-${i}').textContent=this.value+'%'">
                    <span class="lang-pct" id="lp-${i}">${lang.level}%</span>
                </div>
            </div>`;
      })
      .join("");
  }

  document
    .getElementById("btn-save-langs")
    .addEventListener("click", async () => {
      const langs = window.languages || [];
      const updates = langs.map((lang, i) => ({
        name: lang.name,
        visible: document.getElementById(`lt-${i}`)?.checked ?? lang.visible,
        level: parseInt(
          document.getElementById(`lr-${i}`)?.value ?? lang.level,
        ),
      }));
      const res = await window.ADMIN.updateLanguages({ languages: updates });
      showMsg(
        "lang-msg",
        res.ok ? "Kaydedildi ✓" : res.error || "Hata",
        !res.ok,
      );
      if (res.ok) await loadAllData();
    });

  /* ══ PROJECTS LIST ═══════════════════════════ */
  function renderProjectsList(projects) {
    const container = document.getElementById("project-list");
    if (!projects.length) {
      container.innerHTML =
        '<div class="empty-state">Proje yok. Yeni ekleyin.</div>';
      return;
    }
    container.innerHTML = projects
      .map(
        (p) => `
            <div class="proj-row">
                <div class="proj-num">${esc(p.num)}</div>
                <div class="proj-info">
                    <div class="proj-title">${esc(p.title)}</div>
                    <div class="proj-tags-sm">
                        ${(p.tags || []).map((t) => `<span class="proj-tag">${esc(t)}</span>`).join("")}
                    </div>
                </div>
                <span class="proj-status-badge ${p.status === "active" ? "active" : ""}">
                    ${p.status === "active" ? "Aktif" : "Tamamlandı"}
                </span>
                <div class="proj-actions">
                    <button class="btn-icon" data-edit="${p.id}">Düzenle</button>
                    <button class="btn-icon del" data-delete="${p.id}">Sil</button>
                </div>
            </div>
        `,
      )
      .join("");

    // Event delegation — her render'da yeniden bağla
    container.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () =>
        openEditProject(parseInt(btn.dataset.edit)),
      );
    });
    container.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () =>
        deleteProject(parseInt(btn.dataset.delete)),
      );
    });
  }

  /* ══ PROJECT MODAL ═══════════════════════════ */
  function openModal() {
    document.getElementById("proj-modal").style.display = "flex";
  }
  function closeModal() {
    document.getElementById("proj-modal").style.display = "none";
  }

  function openAddProject() {
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

  function openEditProject(id) {
    const p = (window.projects || []).find((x) => x.id === id);
    if (!p) return;
    document.getElementById("modal-title").textContent = "Projeyi Düzenle";
    setVal("proj-id",      p.id);
    setVal("proj-title",   p.title);
    setVal("proj-desc",    p.description);
    setVal("proj-desc-en", p.description_en || "");
    setVal("proj-tags",    (p.tags || []).join(", "));
    setVal("proj-status",  p.status);
    setVal("proj-github",  p.github || "");
    openModal();
  }

  async function saveProject() {
    const id = getVal("proj-id");
    const proj = {
      title:          getVal("proj-title"),
      description:    getVal("proj-desc"),
      description_en: getVal("proj-desc-en"),
      tags:           getVal("proj-tags"),
      status:         getVal("proj-status"),
      github:         getVal("proj-github"),
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
      await loadAllData();
    }
  }

  async function deleteProject(id) {
    if (!confirm("Bu projeyi silmek istediğinden emin misin?")) return;
    const res = await window.ADMIN.updateProjects({ action: "delete", id });
    if (res.ok) await loadAllData();
  }

  document
    .getElementById("btn-add-project")
    .addEventListener("click", openAddProject);
  document
    .getElementById("btn-modal-cancel")
    .addEventListener("click", closeModal);
  document
    .getElementById("btn-modal-save")
    .addEventListener("click", saveProject);

  // Modal dışına tıklayınca kapat
  document.getElementById("proj-modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("proj-modal")) closeModal();
  });

  /* ══ CONTACT FORM ════════════════════════════ */
  function renderContactForm(c) {
    setVal("c-email", c.email || "");
    setVal("c-github", c.github || "");
    setVal("c-website", c.website || "");
  }

  document
    .getElementById("btn-save-contact")
    .addEventListener("click", async () => {
      const body = {
        email: getVal("c-email"),
        github: getVal("c-github"),
        website: getVal("c-website"),
      };
      const res = await window.ADMIN.updateContact(body);
      showMsg(
        "contact-msg",
        res.ok ? "Kaydedildi ✓" : res.error || "Hata",
        !res.ok,
      );
      if (res.ok) await loadAllData();
    });

  /* ══ MESSAGES ════════════════════════════════ */
  async function loadMessages() {
    const res = await window.ADMIN.getMessages();
    if (!res.ok) return;
    const msgs = res.messages || [];
    const unread = msgs.filter((m) => !m.read).length;
    updateMsgBadge(unread);
    document.getElementById("ov-unread").textContent = unread;

    const container = document.getElementById("messages-list");
    if (!msgs.length) {
      container.innerHTML = '<div class="empty-state">Henüz mesaj yok.</div>';
      return;
    }

    container.innerHTML = [...msgs]
      .reverse()
      .map(
        (m) => `
            <div class="msg-card ${m.read ? "" : "unread"}" id="msg-${m.id}">
                <div class="msg-meta">
                    <span class="msg-name">${m.read ? "" : '<span class="unread-dot"></span>'}${esc(m.name)}</span>
                    <span class="msg-email">${esc(m.email)}</span>
                    <span class="msg-time">${fmtDate(m.timestamp)}</span>
                </div>
                <div class="msg-body">${esc(m.message)}</div>
                <div class="msg-actions">
                    ${!m.read ? `<button class="btn-sm" data-mark="${m.id}">Okundu İşaretle</button>` : ""}
                    <button class="btn-sm" data-del="${m.id}" style="color:var(--red)">Sil</button>
                </div>
            </div>
        `,
      )
      .join("");

    // Event delegation — Firestore ID'leri string olduğu için parseInt KULLANMA
    container.querySelectorAll("[data-mark]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        await window.ADMIN.markRead(btn.dataset.mark);
        await loadMessages();
      });
    });
    container.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Mesajı silmek istiyor musun?")) return;
        btn.disabled = true;
        await window.ADMIN.deleteMessage(btn.dataset.del);
        await loadMessages();
      });
    });
  }

  function updateMsgBadge(n) {
    const badge = document.getElementById("msg-badge");
    badge.textContent = n;
    badge.style.display = n > 0 ? "inline-block" : "none";
  }

  async function loadThemes() {
    let themes;
    try {
      const result = await window.ADMIN.getThemes();
      // ADMIN.getThemes() dizi döndürüyor (res.ok/res.themes wrap'lı değil)
      themes = Array.isArray(result) ? result : (result.themes || []);
    } catch (err) {
      console.error("[panel] Temalar yüklenemedik:", err);
      return;
    }
    renderThemesList(themes);
  }

  /* ══ THEMES ════════════════════════════════ */
  function updateRestartButtonVisibility(themes) {
    const btn = document.getElementById("btn-restart-apply");
    if (!btn) return;
    // Seçili tema ile uygulanmış tema farklıysa butonu göster
    const hasPending = themes.some((t) => t.selected && !t.applied);
    btn.hidden = !hasPending;
  }

  function renderThemesList(themes) {
    const container = document.getElementById("theme-list");
    const selected = themes.find((t) => t.selected) || themes[0];
    container.innerHTML = themes
      .map((theme) => {
        let badge = "";
        if (theme.applied && theme.selected) {
          badge =
            '<div class="theme-badge theme-badge--applied">Seçili · Uygulanıyor</div>';
        } else if (theme.applied) {
          badge =
            '<div class="theme-badge theme-badge--applied">Uygulanıyor</div>';
        } else if (theme.selected) {
          badge =
            '<div class="theme-badge theme-badge--pending">Seçildi (uygulanmadı)</div>';
        }
        return `
      <div class="theme-card" data-folder="${esc(theme.folder)}">
        <div class="theme-preview">
          ${previewImageHtml(theme.preview, theme.name)}
        </div>
        <div class="theme-info">
          <div class="theme-name">${esc(theme.name)}</div>
          ${badge}
        </div>
        ${
          theme.selected && theme.applied
            ? `<button type="button" class="btn-secondary" style="margin-top:10px;font-weight:bold;cursor:default;" disabled>Aktif</button>`
            : theme.selected
            ? `<button type="button" class="btn-secondary" style="margin-top:10px;cursor:default;" disabled>Seçildi</button>`
            : `<button type="button" class="btn-primary btn-theme-select" data-folder="${esc(theme.folder)}" style="margin-top:10px;">Seç</button>`
        }
      </div>
    `;
      })
      .join("");

    container.querySelectorAll(".btn-theme-select").forEach((btn) => {
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        btn.textContent = "Seçiliyor...";
        // Folder adını (string) doğrudan gönder
        const folder = btn.getAttribute("data-folder");
        try {
          await window.ADMIN.selectTheme(folder);
          await loadThemes();
        } catch (err) {
          console.error("[panel] Tema seçilemedi:", err);
          btn.disabled = false;
          btn.textContent = "Seç";
        }
      });
    });

    updateRestartButtonVisibility(themes);
  }

  document
    .getElementById("btn-refresh-themes")
    .addEventListener("click", async () => {
      await loadThemes();
    });

  const btnRestartApply = document.getElementById("btn-restart-apply");
  if (btnRestartApply) {
    btnRestartApply.addEventListener("click", async () => {
      btnRestartApply.disabled = true;
      btnRestartApply.textContent = "Uygulanıyor...";
      try {
        await window.ADMIN.triggerRestartLog();
        await loadThemes(); // listeyi güncelle
        // Kullanıcıyı anasayfaya gönder — yeni tema aktif olacak
        setTimeout(() => window.location.replace("/?r=" + Date.now()), 800);
      } catch (err) {
        console.error("[panel] Tema uygulanamadı:", err);
        btnRestartApply.disabled = false;
        btnRestartApply.textContent = "Temayı Uygula";
      }
    });
  }

  /* ══ STATS ════════════════════════════════ */
  let _currentFilter = "daily";

  function renderStats() {
    const containers = [
      document.getElementById("stats-overview"),
      document.getElementById("stats-overview-2"),
    ].filter(Boolean);

    if (!containers.length) return;

    const analytics = window.analytics || {};
    const sessions = analytics.sessions || {};

    const buildHTML = (s) => `
    <div class="filter-bar">
      <span class="filter-label">Görünüm:</span>
      <button class="filter-btn active" onclick="setStatsFilter('daily','${s}')">Günlük</button>
      <button class="filter-btn" onclick="setStatsFilter('weekly','${s}')">Haftalık</button>
      <button class="filter-btn" onclick="setStatsFilter('monthly','${s}')">Aylık</button>
      <button class="filter-btn" onclick="setStatsFilter('all','${s}')" style="margin-left:8px;">Tümü</button>
    </div>
    <div class="stat-grid">
      <div class="stat-card accent">
        <div class="stat-label">Tekil Ziyaretçi</div>
        <div class="stat-val" id="sv-unique${s}">${analytics.unique_visitors ?? 0}</div>
        <div class="stat-sub">toplam</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Toplam Oturum</div>
        <div class="stat-val" id="sv-sessions${s}">${sessions.total ?? 0}</div>
        <div class="stat-sub" id="sv-sessions-sub${s}">tüm zamanlar</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Ort. Süre</div>
        <div class="stat-val" id="sv-duration${s}">${Math.round(analytics.avg_duration_sec ?? 0)}</div>
        <div class="stat-sub">saniye</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Dönem Girişi</div>
        <div class="stat-val" id="sv-period${s}">—</div>
        <div class="stat-sub" id="sv-period-sub${s}">günlük kayıt</div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card full">
        <div class="chart-title">Oturum Trendi <span id="chart-period-label${s}">günlük</span></div>
        <div style="position:relative;width:100%;height:200px;">
          <canvas id="sv-session-chart${s}"></canvas>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Dönem Dağılımı <span>oturum sayısı</span></div>
        <div id="sv-breakdown${s}"></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Süre Dağılımı <span>saniye aralığı</span></div>
        <div style="position:relative;width:100%;height:200px;">
          <canvas id="sv-duration-chart${s}"></canvas>
        </div>
      </div>
    </div>
    <div class="last-updated" id="sv-last-updated${s}"></div>
  `;

    containers.forEach((el, i) => {
      const s = i === 0 ? "" : "-2";
      el.innerHTML = buildHTML(s);
      _updateStatsView(s);
    });
  }

  window.setStatsFilter = function (f, s = "") {
    _currentFilter = f;
    const labels = {
      daily: "günlük",
      weekly: "haftalık",
      monthly: "aylık",
      all: "tümü",
    };
    const container = document.getElementById(
      s === "" ? "stats-overview" : "stats-overview-2",
    );
    if (container) {
      container.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.toggle(
          "active",
          b.textContent.trim().toLowerCase() === labels[f],
        );
      });
    }
    _updateStatsView(s);
  };

  function _updateStatsView(s = "") {
    const analytics = window.analytics || {};
    const sessions = analytics.sessions || {};
    const map = {
      daily: sessions.daily,
      weekly: sessions.weekly,
      monthly: sessions.monthly,
    };
    const periodLabel = {
      daily: "günlük",
      weekly: "haftalık",
      monthly: "aylık",
      all: "günlük (tüm)",
    };
    const data =
      _currentFilter === "all"
        ? sessions.daily || {}
        : map[_currentFilter] || {};
    const cnt = Object.values(data).reduce((a, b) => a + b, 0);

    const el = (id) => document.getElementById(id + s);

    if (el("sv-sessions")) el("sv-sessions").textContent = cnt;
    if (el("sv-sessions-sub"))
      el("sv-sessions-sub").textContent =
        periodLabel[_currentFilter] + " toplamı";
    if (el("sv-period")) el("sv-period").textContent = Object.keys(data).length;
    if (el("sv-period-sub"))
      el("sv-period-sub").textContent =
        "kayıtlı " + periodLabel[_currentFilter];
    if (el("chart-period-label"))
      el("chart-period-label").textContent = periodLabel[_currentFilter];

    if (analytics.last_updated && el("sv-last-updated")) {
      el("sv-last-updated").textContent =
        "Son güncelleme: " +
        new Date(analytics.last_updated).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
    }

    _renderBreakdown(data, s);
    _renderSessionChart(data, s);
    _renderDurationChart(analytics.durations || [], s);
  }

  function _renderBreakdown(data, s = "") {
    const el = document.getElementById("sv-breakdown" + s);
    if (!el) return;
    const entries = Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);
    if (!entries.length) {
      el.innerHTML = '<div class="no-data">Veri yok</div>';
      return;
    }
    const max = Math.max(...entries.map((e) => e[1]));
    el.innerHTML = entries
      .map(
        ([k, v]) => `
    <div class="detail-row">
      <div class="detail-key">${k}</div>
      <div class="detail-bar-wrap">
        <div class="detail-bar" style="width:${Math.round((v / max) * 100)}%"></div>
      </div>
      <div class="detail-val">${v}</div>
    </div>`,
      )
      .join("");
  }

  function _renderSessionChart(data, s = "") {
    const canvas = document.getElementById("sv-session-chart" + s);
    if (!canvas) return;

    if (window["_sessionChart" + s]) {
      window["_sessionChart" + s].destroy();
      window["_sessionChart" + s] = null;
    }

    const entries = Object.entries(data).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
    if (!entries.length) return;

    window["_sessionChart" + s] = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: entries.map((e) => e[0]),
        datasets: [
          {
            data: entries.map((e) => e[1]),
            borderColor: "#c8ff00",
            backgroundColor: "rgba(200,255,0,0.12)",
            borderWidth: 2,
            pointBackgroundColor: "#c8ff00",
            pointRadius: 4,
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: {
              color: "#555",
              font: { size: 10, family: "DM Mono,monospace" },
              maxRotation: 45,
              maxTicksLimit: 8,
            },
            grid: { color: "#1e1e1e" },
            border: { color: "#1e1e1e" },
          },
          y: {
            ticks: { color: "#555", font: { size: 10 } },
            grid: { color: "#1a1a1a" },
            border: { color: "#1e1e1e" },
            beginAtZero: true,
          },
        },
      },
    });
  }

  function _renderDurationChart(durations, s = "") {
    const canvas = document.getElementById("sv-duration-chart" + s);
    if (!canvas) return;

    if (window["_durationChart" + s]) {
      window["_durationChart" + s].destroy();
      window["_durationChart" + s] = null;
    }

    const buckets = {
      "0-30": 0,
      "30-60": 0,
      "60-120": 0,
      "120-300": 0,
      "300+": 0,
    };
    durations.forEach((d) => {
      if (d < 30) buckets["0-30"]++;
      else if (d < 60) buckets["30-60"]++;
      else if (d < 120) buckets["60-120"]++;
      else if (d < 300) buckets["120-300"]++;
      else buckets["300+"]++;
    });

    window["_durationChart" + s] = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: Object.keys(buckets),
        datasets: [
          {
            data: Object.values(buckets),
            backgroundColor: Object.keys(buckets).map((_, i) =>
              i === 1 ? "#c8ff00" : "rgba(200,255,0,0.22)",
            ),
            borderColor: "transparent",
            borderRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: {
              color: "#555",
              font: { size: 10, family: "DM Mono,monospace" },
            },
            grid: { color: "#1e1e1e" },
            border: { color: "#1e1e1e" },
          },
          y: {
            ticks: { color: "#555", font: { size: 10 }, stepSize: 1 },
            grid: { color: "#1a1a1a" },
            border: { color: "#1e1e1e" },
            beginAtZero: true,
          },
        },
      },
    });
  }

  /* ══ BAŞLAT ══════════════════════════════════ */
  /* ══ AUTO-TRANSLATE ══════════════════════════
     MyMemory ücretsiz API ile TR → EN otomatik çeviri.
     Çevrilen alan disabled yapılır; "🔓 Kilidi Aç" ile
     kullanıcı manuel düzenleyebilir.
  ═══════════════════════════════════════════ */
  async function autoTranslate(srcId, dstId) {
    const srcEl = document.getElementById(srcId);
    const dstEl = document.getElementById(dstId);
    if (!srcEl || !dstEl) return;

    const text = srcEl.value.trim();
    if (!text) { dstEl.disabled = false; dstEl.value = ""; return; }

    const btn = document.querySelector(
      `.btn-auto-translate[data-src="${srcId}"][data-dst="${dstId}"]`
    );
    const origLabel = btn ? btn.textContent : "🌐 Çevir";

    if (btn) { btn.textContent = "⏳"; btn.disabled = true; }
    dstEl.disabled = true;
    dstEl.value = "Çevriliyor...";

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|en`;
      const res  = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const json = await res.json();
      const translated = json?.responseData?.translatedText || "";
      if (translated && json?.responseStatus === 200) {
        dstEl.value    = translated;
        dstEl.disabled = true;
        if (btn) btn.textContent = "🔓 Kilidi Aç";
      } else {
        dstEl.value    = "";
        dstEl.disabled = false;
        if (btn) btn.textContent = origLabel;
      }
    } catch {
      dstEl.value    = "";
      dstEl.disabled = false;
      if (btn) btn.textContent = origLabel;
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-auto-translate");
    if (!btn) return;
    if (btn.textContent.trim() === "🔓 Kilidi Aç") {
      const dstEl = document.getElementById(btn.dataset.dst);
      if (dstEl) dstEl.disabled = false;
      btn.textContent = "🌐 Çevir";
      return;
    }
    autoTranslate(btn.dataset.src, btn.dataset.dst);
  });

  init();
})();
