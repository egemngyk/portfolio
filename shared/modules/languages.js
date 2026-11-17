import { esc, showMsg, reloadData } from "./utils.js";
import {
  ICON_CATEGORIES,
  searchIcons,
  findIconForName,
  iconUrlForName,
} from "../icon-store.js";

// Eski kayıtların ikon alanı yoksa isimden varsayılan ikon üret.
const FALLBACK_LOGOS = {
  JavaScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  Python:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  TypeScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "C++":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  Rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
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

let _langs = [];
let _pendingIcon = "";
let _suggestedIcon = "";
let _addLevel = null;
let _confirmTimer = null;

function _iconFor(lang) {
  return lang.icon || FALLBACK_LOGOS[lang.name] || iconUrlForName(lang.name);
}

function _logoHtml(lang) {
  const url = _iconFor(lang);
  return url
    ? `<img src="${esc(url)}" alt="${esc(lang.name)}" onerror="this.style.display='none'">`
    : `<div class="logo-placeholder">${esc(lang.name?.[0] || "?")}</div>`;
}

/* ── Modern seviye kontrolü: range + sayısal input + değer balonu ── */
function _bindLevelControl(root) {
  if (!root) return null;
  const range = root.querySelector('input[type="range"]');
  const num = root.querySelector(".level-num");
  const bubble = root.querySelector(".level-bubble");
  if (!range || !num || !bubble) return null;

  const sync = (value) => {
    const v = Number.isFinite(Number(value))
      ? Math.max(0, Math.min(100, Math.round(Number(value))))
      : 0;
    range.value = v;
    num.value = v;
    bubble.textContent = `${v}%`;
    range.style.setProperty("--pct", `${v}%`);
    return v;
  };

  range.addEventListener("input", () => sync(range.value));
  num.addEventListener("input", () => {
    if (num.value !== "") sync(num.value);
  });
  num.addEventListener("change", () => sync(num.value));

  sync(range.value || 0);
  return { range, num, bubble, sync };
}

function _setRowHidden(row, hidden) {
  row.classList.toggle("is-hidden", hidden);
  row.querySelectorAll("input[type='range'], .level-num").forEach((el) => {
    el.disabled = hidden;
  });
}

/* ── Liste render ── */
export function renderLanguagesForm(langs) {
  _langs = (langs || []).map((l) => ({
    name: l.name || "",
    visible: l.visible !== false,
    level: Number.isFinite(Number(l.level))
      ? Math.max(0, Math.min(100, Math.round(Number(l.level))))
      : 0,
    icon: typeof l.icon === "string" ? l.icon : "",
    isProgrammingLanguage: l.isProgrammingLanguage !== false,
  }));

  const container = document.getElementById("lang-list");
  if (!container) return;
  container.innerHTML = "";

  _langs.forEach((lang, i) => {
    const tpl = document.getElementById("tpl-lang-row");
    let node;
    if (tpl) {
      node = tpl.content.cloneNode(true);
    } else {
      const wrap = document.createElement("div");
      wrap.innerHTML = `
        <div class="lang-row">
          <div class="lang-logo"></div>
          <div class="lang-info"><div class="lang-name"></div>
            <label class="lang-pl-check"><input type="checkbox" class="lang-pl"><span>Programlama dili</span></label>
          </div>
          <div class="lang-toggle"><input type="checkbox"><label></label></div>
          <div class="lang-level-wrap"><div class="level-control" data-level-control>
            <input type="range" min="0" max="100"><input type="number" min="0" max="100" class="level-num"><span class="level-bubble"></span>
          </div></div>
          <button type="button" class="lang-delete" title="Beceriyi sil">✕</button>
        </div>`;
      node = wrap;
    }

    const row = node.querySelector(".lang-row");
    row.querySelector(".lang-logo").innerHTML = _logoHtml(lang);
    row.querySelector(".lang-name").textContent = lang.name;

    // Görünürlük
    const vis = row.querySelector(".lang-toggle input");
    vis.id = `lt-${i}`;
    vis.checked = lang.visible;
    row.querySelector(".lang-toggle label").setAttribute("for", `lt-${i}`);
    vis.addEventListener("change", (e) => {
      _langs[i].visible = e.target.checked;
      _setRowHidden(row, !e.target.checked);
    });

    // Programlama dili tiki
    const pl = row.querySelector(".lang-pl");
    pl.id = `lang-pl-${i}`;
    pl.checked = lang.isProgrammingLanguage;
    row.querySelector(".lang-pl-check").setAttribute("for", pl.id);
    pl.addEventListener("change", (e) => {
      _langs[i].isProgrammingLanguage = e.target.checked;
    });

    // Seviye
    const ctrl = _bindLevelControl(row.querySelector(".lang-level-wrap"));
    if (ctrl) {
      ctrl.range.id = `lr-${i}`;
      ctrl.sync(lang.level);
      ctrl.range.addEventListener("change", () => {
        _langs[i].level = Number(ctrl.range.value);
      });
      ctrl.num.addEventListener("change", () => {
        _langs[i].level = Number(ctrl.num.value);
      });
    }

    // Silme — iki aşamalı onay
    const del = row.querySelector(".lang-delete");
    del.addEventListener("click", () => _handleDelete(row, i));

    _setRowHidden(row, !lang.visible);
    container.appendChild(node);
  });

  _updateLangCount();
}

function _updateLangCount() {
  const el = document.getElementById("lang-count");
  if (el) el.textContent = `${_langs.length} beceri`;
}

function _resetDeleteButtons() {
  document.querySelectorAll(".lang-delete.confirming").forEach((b) => {
    b.dataset.confirm = "0";
    b.textContent = "✕";
    b.classList.remove("confirming");
  });
}

function _handleDelete(row, i) {
  const btn = row.querySelector(".lang-delete");
  if (btn.dataset.confirm !== "1") {
    _resetDeleteButtons();
    btn.dataset.confirm = "1";
    btn.textContent = "Sil?";
    btn.classList.add("confirming");
    clearTimeout(_confirmTimer);
    _confirmTimer = setTimeout(_resetDeleteButtons, 3500);
    return;
  }
  clearTimeout(_confirmTimer);
  const removed = _langs[i]?.name || "Beceri";
  _langs.splice(i, 1);
  renderLanguagesForm(_langs);
  showMsg("lang-msg", `"${removed}" listeden kaldırıldı. Kaydet'i unutma.`, false);
}

/* ── Yeni beceri ekleme ── */
function _addSkill() {
  const nameInput = document.getElementById("new-skill-name");
  const name = (nameInput?.value || "").trim();
  if (!name) {
    showMsg("lang-msg", "Beceri adı gerekli.", true);
    nameInput?.focus();
    return;
  }
  if (_langs.some((l) => l.name.toLocaleLowerCase("tr") === name.toLocaleLowerCase("tr"))) {
    showMsg("lang-msg", `"${name}" zaten listede.`, true);
    return;
  }

  const levelInput = document.getElementById("new-skill-level");
  _langs.push({
    name,
    visible: true,
    level: Number.isFinite(Number(levelInput?.value))
      ? Math.max(0, Math.min(100, Number(levelInput.value)))
      : 0,
    icon: _pendingIcon || _suggestedIcon || findIconForName(name) || "",
    isProgrammingLanguage:
      document.getElementById("new-skill-is-lang")?.checked !== false,
  });

  if (nameInput) nameInput.value = "";
  _pendingIcon = "";
  _suggestedIcon = "";
  _updateIconPreview();
  if (_addLevel) _addLevel.sync(50);
  renderLanguagesForm(_langs);
  showMsg("lang-msg", `"${name}" eklendi. Kaydet ile kalıcı yap.`, false);
}

/* ── İkon deposu ── */
function _updateIconPreview() {
  const preview = document.getElementById("new-icon-preview");
  const label = document.getElementById("new-icon-label");
  const url = _pendingIcon || _suggestedIcon;
  if (preview) {
    preview.innerHTML = url
      ? `<img src="${esc(url)}" alt="" onerror="this.style.display='none'">`
      : "+";
    preview.classList.toggle("has-icon", !!url);
  }
  if (label) {
    label.textContent = _pendingIcon
      ? "Seçildi ✓"
      : _suggestedIcon
        ? "Önerilen ikon"
        : "İkon Seç";
    label.classList.toggle("is-suggested", !_pendingIcon && !!_suggestedIcon);
  }
}

function _renderIconGrid(query = "") {
  const grid = document.getElementById("icon-grid");
  if (!grid) return;

  const items = searchIcons(query);
  grid.innerHTML = items.length
    ? items
        .map(
          (it) => `
        <button type="button" class="icon-option${it.url === _pendingIcon ? " selected" : ""}"
          data-url="${esc(it.url)}" data-label="${esc(it.label)}" title="${esc(it.label)}">
          <img src="${esc(it.url)}" alt="" loading="lazy" onerror="this.style.display='none'">
          <span>${esc(it.label)}</span>
        </button>`
        )
        .join("")
    : `<div class="icon-empty">Bu aramaya uygun ikon bulunamadı.</div>`;

  grid.querySelectorAll(".icon-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      _pendingIcon = btn.dataset.url;
      _suggestedIcon = "";
      _updateIconPreview();
      _closeIconModal();
    });
  });
}

function _renderCategoryLegend() {
  const el = document.getElementById("icon-cat-legend");
  if (!el) return;
  el.innerHTML = ICON_CATEGORIES.map(
    (c) => `<button type="button" data-cat="${esc(c)}">${esc(c)}</button>`
  ).join("");
  el.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Kategori adı searchIcons() içinde category alanında aranıyor
      const search = document.getElementById("icon-search");
      if (search) search.value = btn.dataset.cat;
      _renderIconGrid(btn.dataset.cat);
    });
  });
}

let _iconModalReturnFocus = null;

function _openIconModal() {
  const modal = document.getElementById("icon-modal");
  if (!modal) return;
  _iconModalReturnFocus = document.activeElement;
  modal.style.display = "flex";
  const search = document.getElementById("icon-search");
  if (search) {
    search.value = "";
    _renderIconGrid("");
    setTimeout(() => search.focus(), 0);
  } else {
    _renderIconGrid("");
  }
}

function _closeIconModal() {
  const modal = document.getElementById("icon-modal");
  if (modal) modal.style.display = "none";
  _iconModalReturnFocus?.focus?.();
}

/* ── Kaydet ── */
async function saveLanguages() {
  const res = await window.ADMIN.updateLanguages({ languages: _langs });
  showMsg(
    "lang-msg",
    res.ok ? `Kaydedildi ✓ (${_langs.length} beceri)` : res.error || "Hata",
    !res.ok
  );
  if (res.ok) reloadData();
}

export function initLanguages() {
  document
    .getElementById("btn-save-langs")
    ?.addEventListener("click", saveLanguages);

  document.getElementById("btn-add-skill")?.addEventListener("click", _addSkill);
  document.getElementById("new-skill-name")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") _addSkill();
  });

  // Ekleme formunun seviye kontrolü ve hazır değerler
  const addWrap = document.querySelector(".skill-add-card [data-level-control]");
  _addLevel = _bindLevelControl(addWrap);
  document
    .querySelectorAll(".skill-add-card [data-level-presets] button")
    .forEach((btn) => {
      btn.addEventListener("click", () => _addLevel?.sync(btn.dataset.preset));
    });

  // İsim yazarken ikon önerisi
  document.getElementById("new-skill-name")?.addEventListener("input", (e) => {
    if (_pendingIcon) return;
    _suggestedIcon = findIconForName(e.target.value);
    _updateIconPreview();
  });

  // İkon modalı
  document.getElementById("btn-pick-icon")?.addEventListener("click", _openIconModal);
  document.getElementById("btn-icon-cancel")?.addEventListener("click", _closeIconModal);
  document.getElementById("icon-search")?.addEventListener("input", (e) => {
    _renderIconGrid(e.target.value);
  });
  document.getElementById("icon-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "icon-modal") _closeIconModal();
  });
  document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("icon-modal");
    if (e.key === "Escape" && modal && modal.style.display !== "none") {
      _closeIconModal();
    }
  });

  _renderCategoryLegend();
  _renderIconGrid("");
  _updateIconPreview();
}
