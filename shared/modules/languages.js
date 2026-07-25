import { esc, showMsg, reloadData } from "./utils.js";

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

export function renderLanguagesForm(langs) {
  const container = document.getElementById("lang-list");
  if (!container) return;

  // Template ile render etme (Phase 2 için hazırlık)
  const tpl = document.getElementById("tpl-lang-row");
  
  if (tpl) {
    container.innerHTML = "";
    langs.forEach((lang, i) => {
      const clone = tpl.content.cloneNode(true);
      const logoHtml = LANG_LOGOS[lang.name]
        ? `<img src="${LANG_LOGOS[lang.name]}" alt="${esc(lang.name)}" onerror="this.style.display='none'">`
        : `<div class="logo-placeholder">${esc(lang.name[0])}</div>`;
      
      clone.querySelector(".lang-logo").innerHTML = logoHtml;
      clone.querySelector(".lang-name").textContent = lang.name;
      
      const cb = clone.querySelector("input[type='checkbox']");
      cb.id = `lt-${i}`;
      cb.checked = lang.visible;
      clone.querySelector("label").setAttribute("for", `lt-${i}`);
      
      const range = clone.querySelector("input[type='range']");
      range.id = `lr-${i}`;
      range.value = lang.level;
      
      const pct = clone.querySelector(".lang-pct");
      pct.id = `lp-${i}`;
      pct.textContent = `${lang.level}%`;
      
      range.addEventListener("input", (e) => {
        pct.textContent = `${e.target.value}%`;
      });
      
      container.appendChild(clone);
    });
  } else {
    // Fallback if template is not yet in HTML
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
}

async function saveLanguages() {
  const langs = window.languages || [];
  const updates = langs.map((lang, i) => ({
    name: lang.name,
    visible: document.getElementById(`lt-${i}`)?.checked ?? lang.visible,
    level: parseInt(document.getElementById(`lr-${i}`)?.value ?? lang.level),
  }));
  const res = await window.ADMIN.updateLanguages({ languages: updates });
  showMsg(
    "lang-msg",
    res.ok ? "Kaydedildi ✓" : res.error || "Hata",
    !res.ok
  );
  if (res.ok) reloadData();
}

export function initLanguages() {
  document
    .getElementById("btn-save-langs")
    ?.addEventListener("click", saveLanguages);
}
