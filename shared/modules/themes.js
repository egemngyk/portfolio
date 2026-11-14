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

let currentPreviewFolder = null;

export function openThemePreview(folder, name) {
  if (!folder) return;
  currentPreviewFolder = folder;

  const modal = document.getElementById("theme-preview-modal");
  const iframe = document.getElementById("tp-iframe");
  const titleEl = document.getElementById("tp-theme-name");
  const externalLink = document.getElementById("tp-btn-external");
  const loading = document.getElementById("tp-loading");

  if (!modal || !iframe) return;

  if (titleEl) titleEl.textContent = name || folder;

  const previewUrl = `/?preview=${encodeURIComponent(folder)}`;
  if (externalLink) externalLink.href = previewUrl;

  if (loading) loading.classList.remove("hidden");

  iframe.onload = () => {
    if (loading) loading.classList.add("hidden");
    _applyTouchMode();
  };

  iframe.src = `${previewUrl}&t=${Date.now()}`;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

export function closeThemePreview() {
  const modal = document.getElementById("theme-preview-modal");
  const iframe = document.getElementById("tp-iframe");
  if (!modal) return;

  modal.style.display = "none";
  if (iframe) iframe.src = "about:blank";
  currentPreviewFolder = null;
  document.body.style.overflow = "";
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
      previewEl.title = "Canlı Önizlemek için tıkla";
      previewEl.addEventListener("click", () => openThemePreview(theme.folder, theme.name));

      clone.querySelector(".theme-name").textContent = theme.name;
      clone.querySelector(".theme-badge-container").innerHTML = badgeHtml;

      const actionsContainer = clone.querySelector(".theme-actions");
      actionsContainer.innerHTML = "";

      // Önizle butonu her temada yer alır
      const btnPreview = document.createElement("button");
      btnPreview.type = "button";
      btnPreview.className = "btn-secondary btn-theme-preview";
      btnPreview.textContent = "Önizle";
      btnPreview.dataset.folder = theme.folder;
      btnPreview.dataset.name = theme.name;
      btnPreview.addEventListener("click", () => openThemePreview(theme.folder, theme.name));
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
        <div class="theme-preview" style="cursor: pointer;" title="Canlı Önizlemek için tıkla" data-folder="${esc(theme.folder)}" data-name="${esc(theme.name)}">
          ${previewImageHtml(theme.preview, theme.name)}
        </div>
        <div class="theme-info">
          <div class="theme-name">${esc(theme.name)}</div>
          <div class="theme-badge-container">${badge}</div>
        </div>
        <div class="theme-actions">
          <button type="button" class="btn-secondary btn-theme-preview" data-folder="${esc(theme.folder)}" data-name="${esc(theme.name)}">Önizle</button>
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

    container.querySelectorAll(".btn-theme-preview").forEach((btn) => {
      btn.addEventListener("click", () => {
        openThemePreview(btn.getAttribute("data-folder"), btn.getAttribute("data-name"));
      });
    });

    container.querySelectorAll(".theme-preview[data-folder]").forEach((el) => {
      el.addEventListener("click", () => {
        openThemePreview(el.getAttribute("data-folder"), el.getAttribute("data-name"));
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

  // Live Preview Modal Etkileşimleri
  const btnClosePreview = document.getElementById("tp-btn-close");
  btnClosePreview?.addEventListener("click", closeThemePreview);

  // ESC ile kapatma
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("theme-preview-modal");
      if (modal && modal.style.display !== "none") {
        closeThemePreview();
      }
    }
  });

  // Modal içindeki "Bu Temayı Uygula" butonu
  const btnApplyModal = document.getElementById("tp-btn-apply");
  if (btnApplyModal) {
    btnApplyModal.addEventListener("click", async () => {
      if (!currentPreviewFolder) return;
      btnApplyModal.disabled = true;
      btnApplyModal.textContent = "Uygulanıyor...";
      try {
        await window.ADMIN.selectTheme(currentPreviewFolder);
        await window.ADMIN.triggerRestartLog();
        await loadThemes();
        btnApplyModal.textContent = "✓ Uygulandı!";
        setTimeout(() => {
          closeThemePreview();
          btnApplyModal.disabled = false;
          btnApplyModal.textContent = "Bu Temayı Uygula";
        }, 800);
      } catch (err) {
        console.error("[panel] Tema uygulanamadı:", err);
        btnApplyModal.disabled = false;
        btnApplyModal.textContent = "Hata Oluştu";
        setTimeout(() => {
          btnApplyModal.textContent = "Bu Temayı Uygula";
        }, 2000);
      }
    });
  }

  // Cihaz simülasyon butonları (Masaüstü, Tablet, Mobil)
  const deviceBtns = document.querySelectorAll(".tp-device-btn");
  const iframeWrap = document.getElementById("tp-iframe-wrap");
  deviceBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      deviceBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const device = btn.dataset.device;
      if (iframeWrap) {
        iframeWrap.className = `tp-iframe-wrap device-${device}`;
      }
      _applyTouchMode();
    });
  });
}

// --- Touch/finger cursor simülasyonu ---
function _applyTouchMode() {
  const iframe = document.getElementById("tp-iframe");
  const iframeWrap = document.getElementById("tp-iframe-wrap");
  if (!iframe || !iframeWrap) return;

  const isTouch =
    iframeWrap.classList.contains("device-tablet") ||
    iframeWrap.classList.contains("device-mobile");

  // Mevcut finger elementi varsa kaldır
  let finger = document.getElementById("tp-touch-finger");
  if (!finger) {
    finger = document.createElement("div");
    finger.id = "tp-touch-finger";
    finger.innerHTML = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="10" r="7" fill="rgba(30,30,30,0.75)" stroke="white" stroke-width="2"/>
      <rect x="17" y="16" width="6" height="18" rx="3" fill="rgba(30,30,30,0.75)" stroke="white" stroke-width="2"/>
    </svg>`;
    document.body.appendChild(finger);
  }

  // iframe içi stil inject
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Önceki inject'i temizle
    doc.getElementById("__tp_touch_style__")?.remove();

    if (isTouch) {
      const style = doc.createElement("style");
      style.id = "__tp_touch_style__";
      style.textContent = `
        * { cursor: none !important; }
        ::-webkit-scrollbar { display: none !important; }
        html, body { scrollbar-width: none !important; overflow-x: hidden !important; }
      `;
      doc.head.appendChild(style);
    }
  } catch (e) {
    // cross-origin guard — no-op
  }

  // Parmak imlecini iframe üzerinde takip et
  if (iframeWrap._tpMouseHandler) {
    iframeWrap.removeEventListener("mousemove", iframeWrap._tpMouseHandler);
    iframeWrap.removeEventListener("mouseleave", iframeWrap._tpMouseLeave);
  }

  if (isTouch) {
    finger.style.display = "block";
    const handler = (e) => {
      finger.style.left = e.clientX + "px";
      finger.style.top = e.clientY + "px";
    };
    const leaveHandler = () => {
      finger.style.display = "none";
    };
    const enterHandler = () => {
      finger.style.display = "block";
    };
    iframeWrap._tpMouseHandler = handler;
    iframeWrap._tpMouseLeave = leaveHandler;
    iframeWrap.addEventListener("mousemove", handler);
    iframeWrap.addEventListener("mouseleave", leaveHandler);
    iframeWrap.addEventListener("mouseenter", enterHandler);
    // iframe içinde de takip et
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.addEventListener("mousemove", (e) => {
          const rect = iframe.getBoundingClientRect();
          finger.style.left = rect.left + e.clientX + "px";
          finger.style.top = rect.top + e.clientY + "px";
        });
      }
    } catch (e) {}
  } else {
    finger.style.display = "none";
  }
}
