import { esc, previewImageHtml } from "./utils.js";

// Döngüsel import'tan kaçınmak için event ile loadThemes tetikleniyor
function loadThemes() {
  window.dispatchEvent(new Event("load-themes"));
}

export function updateRestartButtonVisibility(themes) {
  const btn = document.getElementById("btn-restart-apply");
  if (!btn) return;
  const hasPending = themes.some((t) => t.selected && !t.applied);
  btn.hidden = !hasPending;
}

export function openThemePreview(folder) {
  if (!folder) return;
  window.location.href = `/?preview=${encodeURIComponent(folder)}`;
}

export function renderThemesList(themes) {
  const container = document.getElementById("theme-list");
  if (!container) return;

  const tpl = document.getElementById("tpl-theme-card");

  if (tpl) {
    container.innerHTML = "";
    themes.forEach((theme) => {
      const clone = tpl.content.cloneNode(true);

      let badgeHtml = "";
      if (theme.applied && theme.selected) {
        badgeHtml = '<div class="theme-badge theme-badge--applied">Seçili · Uygulanıyor</div>';
      } else if (theme.applied) {
        badgeHtml = '<div class="theme-badge theme-badge--applied">Uygulanıyor</div>';
      } else if (theme.selected) {
        badgeHtml = '<div class="theme-badge theme-badge--pending">Seçildi (uygulanmadı)</div>';
      }

      const card = clone.querySelector(".theme-card");
      card.dataset.folder = theme.folder;

      const previewEl = clone.querySelector(".theme-preview");
      previewEl.innerHTML = previewImageHtml(theme.preview, theme.name);
      previewEl.style.cursor = "pointer";
      previewEl.title = "Önizlemek için tıkla";
      previewEl.addEventListener("click", () => openThemePreview(theme.folder));

      clone.querySelector(".theme-name").textContent = theme.name;
      clone.querySelector(".theme-badge-container").innerHTML = badgeHtml;

      const actionsContainer = clone.querySelector(".theme-actions");
      actionsContainer.innerHTML = "";

      // Önizle butonu doğrudan /?preview=tema ile yönlendirir
      const btnPreview = document.createElement("a");
      btnPreview.className = "btn-secondary btn-theme-preview";
      btnPreview.href = `/?preview=${encodeURIComponent(theme.folder)}`;
      btnPreview.textContent = "Önizle";
      btnPreview.style.textDecoration = "none";
      btnPreview.style.display = "inline-flex";
      btnPreview.style.alignItems = "center";
      btnPreview.style.justifyContent = "center";
      actionsContainer.appendChild(btnPreview);

      // Seç / Aktif butonu
      if (theme.selected && theme.applied) {
        const btnActive = document.createElement("button");
        btnActive.type = "button";
        btnActive.className = "btn-secondary";
        btnActive.style.marginTop = "10px";
        btnActive.style.fontWeight = "bold";
        btnActive.style.cursor = "default";
        btnActive.disabled = true;
        btnActive.textContent = "Aktif";
        actionsContainer.appendChild(btnActive);
      } else if (theme.selected) {
        const btnSelected = document.createElement("button");
        btnSelected.type = "button";
        btnSelected.className = "btn-secondary";
        btnSelected.style.marginTop = "10px";
        btnSelected.style.cursor = "default";
        btnSelected.disabled = true;
        btnSelected.textContent = "Seçildi";
        actionsContainer.appendChild(btnSelected);
      } else {
        const btnSelect = document.createElement("button");
        btnSelect.type = "button";
        btnSelect.className = "btn-primary btn-theme-select";
        btnSelect.dataset.folder = theme.folder;
        btnSelect.style.marginTop = "10px";
        btnSelect.textContent = "Seç";
        btnSelect.addEventListener("click", async () => {
          btnSelect.disabled = true;
          btnSelect.textContent = "Seçiliyor...";
          try {
            await window.ADMIN.selectTheme(theme.folder);
            await loadThemes();
          } catch (err) {
            console.error("[panel] Tema seçilemedi:", err);
            btnSelect.disabled = false;
            btnSelect.textContent = "Seç";
          }
        });
        actionsContainer.appendChild(btnSelect);
      }

      container.appendChild(clone);
    });
  } else {
    // Fallback
    container.innerHTML = themes
      .map((theme) => {
        let badge = "";
        if (theme.applied && theme.selected) {
          badge = '<div class="theme-badge theme-badge--applied">Seçili · Uygulanıyor</div>';
        } else if (theme.applied) {
          badge = '<div class="theme-badge theme-badge--applied">Uygulanıyor</div>';
        } else if (theme.selected) {
          badge = '<div class="theme-badge theme-badge--pending">Seçildi (uygulanmadı)</div>';
        }
        return `
      <div class="theme-card" data-folder="${esc(theme.folder)}">
        <div class="theme-preview" style="cursor: pointer;" title="Önizlemek için tıkla" data-folder="${esc(theme.folder)}">
          ${previewImageHtml(theme.preview, theme.name)}
        </div>
        <div class="theme-info">
          <div class="theme-name">${esc(theme.name)}</div>
          <div class="theme-badge-container">${badge}</div>
        </div>
        <div class="theme-actions">
          <a href="/?preview=${encodeURIComponent(theme.folder)}" class="btn-secondary btn-theme-preview" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;">Önizle</a>
          ${
            theme.selected && theme.applied
              ? `<button type="button" class="btn-secondary" style="margin-top:10px;font-weight:bold;cursor:default;" disabled>Aktif</button>`
              : theme.selected
              ? `<button type="button" class="btn-secondary" style="margin-top:10px;cursor:default;" disabled>Seçildi</button>`
              : `<button type="button" class="btn-primary btn-theme-select" data-folder="${esc(theme.folder)}" style="margin-top:10px;">Seç</button>`
          }
        </div>
      </div>
    `;
      })
      .join("");

    container.querySelectorAll(".theme-preview[data-folder]").forEach((el) => {
      el.addEventListener("click", () => {
        openThemePreview(el.getAttribute("data-folder"));
      });
    });

    container.querySelectorAll(".btn-theme-select").forEach((btn) => {
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        btn.textContent = "Seçiliyor...";
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
  }

  updateRestartButtonVisibility(themes);
}

export function initThemes() {
  const btnSync = document.getElementById("btn-refresh-themes");
  if (btnSync) {
    btnSync.addEventListener("click", async () => {
      const origText = btnSync.textContent;
      btnSync.disabled = true;
      btnSync.textContent = "Senkronize Ediliyor...";
      try {
        const res = await window.ADMIN.syncThemes();
        await loadThemes();
        if (res && res.ok) {
          if (res.added && res.added.length > 0) {
            btnSync.textContent = `✓ ${res.added.length} Yeni Tema Eklendi!`;
          } else {
            btnSync.textContent = "✓ Tüm Temalar Güncel";
          }
        } else {
          btnSync.textContent = "Hata Oluştu";
        }
      } catch (err) {
        console.error("[panel] Tema senkronizasyon hatası:", err);
        btnSync.textContent = "Hata Oluştu";
      } finally {
        setTimeout(() => {
          btnSync.disabled = false;
          btnSync.textContent = origText;
        }, 2500);
      }
    });
  }

  const btnRestartApply = document.getElementById("btn-restart-apply");
  if (btnRestartApply) {
    btnRestartApply.addEventListener("click", async () => {
      btnRestartApply.disabled = true;
      btnRestartApply.textContent = "Uygulanıyor...";
      try {
        await window.ADMIN.triggerRestartLog();
        await loadThemes();
        setTimeout(() => window.location.replace("/?r=" + Date.now()), 800);
      } catch (err) {
        console.error("[panel] Tema uygulanamadı:", err);
        btnRestartApply.disabled = false;
        btnRestartApply.textContent = "Temayı Uygula";
      }
    });
  }
}
