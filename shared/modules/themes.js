import { esc, previewImageHtml } from "./utils.js";

// Döngüsel import'tan kaçınmak için event ile loadThemes tetikleniyor
function loadThemes() {
  window.dispatchEvent(new Event('load-themes'));
}

export function updateRestartButtonVisibility(themes) {
  const btn = document.getElementById("btn-restart-apply");
  if (!btn) return;
  const hasPending = themes.some((t) => t.selected && !t.applied);
  btn.hidden = !hasPending;
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

      clone.querySelector(".theme-card").dataset.folder = theme.folder;
      clone.querySelector(".theme-preview").innerHTML = previewImageHtml(theme.preview, theme.name);
      clone.querySelector(".theme-name").textContent = theme.name;
      clone.querySelector(".theme-badge-container").innerHTML = badgeHtml;

      const actionsContainer = clone.querySelector(".theme-actions");
      if (theme.selected && theme.applied) {
        actionsContainer.innerHTML = `<button type="button" class="btn-secondary" style="margin-top:10px;font-weight:bold;cursor:default;" disabled>Aktif</button>`;
      } else if (theme.selected) {
        actionsContainer.innerHTML = `<button type="button" class="btn-secondary" style="margin-top:10px;cursor:default;" disabled>Seçildi</button>`;
      } else {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-primary btn-theme-select";
        btn.dataset.folder = theme.folder;
        btn.style.marginTop = "10px";
        btn.textContent = "Seç";
        actionsContainer.appendChild(btn);
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
        <div class="theme-preview">
          ${previewImageHtml(theme.preview, theme.name)}
        </div>
        <div class="theme-info">
          <div class="theme-name">${esc(theme.name)}</div>
          <div class="theme-badge-container">${badge}</div>
        </div>
        <div class="theme-actions">
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
  }

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

  updateRestartButtonVisibility(themes);
}

export function initThemes() {
  document
    .getElementById("btn-refresh-themes")
    ?.addEventListener("click", async () => {
      await loadThemes();
    });

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
