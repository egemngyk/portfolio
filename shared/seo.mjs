// SEO için tek kaynak: shared/seo.config.json
// Hem tarayıcıda (index.html) hem Node'da (scripts/seo-sync.mjs) kullanılır.

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function buildJsonLd(c) {
  const home = `${c.siteUrl}/`;
  const host = new URL(c.siteUrl).hostname;
  const person = {
    "@type": "Person",
    "@id": `${c.siteUrl}/#person`,
    name: c.siteName,
    alternateName: c.alternateNames,
    url: home,
    mainEntityOfPage: home,
    jobTitle: c.jobTitle,
    sameAs: c.sameAs.map((l) => l.url),
  };
  if (c.image) person.image = c.siteUrl + c.image;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${c.siteUrl}/#website`,
        url: home,
        name: c.siteName,
        alternateName: [...c.alternateNames, host],
        inLanguage: c.lang,
        publisher: { "@id": `${c.siteUrl}/#person` },
      },
      person,
    ],
  };
}

export function buildHeadHTML(c) {
  const home = `${c.siteUrl}/`;
  const img = c.image ? c.siteUrl + c.image : "";
  const ld = JSON.stringify(buildJsonLd(c), null, 2).replace(/</g, "\\u003c");
  const lines = [
    `<title data-seo>${esc(c.title)}</title>`,
    `<meta data-seo name="description" content="${esc(c.description)}" />`,
    `<link data-seo rel="canonical" href="${esc(home)}" />`,
    `<meta data-seo property="og:type" content="website" />`,
    `<meta data-seo property="og:site_name" content="${esc(c.siteName)}" />`,
    `<meta data-seo property="og:title" content="${esc(c.siteName)}" />`,
    `<meta data-seo property="og:description" content="${esc(c.shortDescription || c.description)}" />`,
    `<meta data-seo property="og:url" content="${esc(home)}" />`,
    `<meta data-seo property="og:locale" content="${esc(c.locale)}" />`,
    `<meta data-seo name="twitter:card" content="${img ? "summary_large_image" : "summary"}" />`,
    `<meta data-seo name="twitter:title" content="${esc(c.siteName)}" />`,
    `<meta data-seo name="twitter:description" content="${esc(c.shortDescription || c.description)}" />`,
  ];
  if (img) {
    lines.push(`<meta data-seo property="og:image" content="${esc(img)}" />`);
    lines.push(`<meta data-seo name="twitter:image" content="${esc(img)}" />`);
  }
  if (c.googleSiteVerification) {
    lines.push(`<meta data-seo name="google-site-verification" content="${esc(c.googleSiteVerification)}" />`);
  }
  lines.push(`<script data-seo type="application/ld+json">\n${ld}\n</script>`);
  return lines.join("\n");
}

export function buildNoscriptHTML(c) {
  const links = c.sameAs
    .map((l) => `<li><a href="${esc(l.url)}">${esc(l.label)}</a></li>`)
    .join("");
  return (
    `<noscript>` +
    `<main style="max-width:640px;padding:40px;line-height:1.6">` +
    `<h1>${esc(c.siteName)}</h1>` +
    `<p>${esc(c.description)}</p>` +
    `<ul>${links}</ul>` +
    `</main></noscript>`
  );
}

export function buildTedxHTML(c, lang) {
  const currentLang = lang || (typeof window !== "undefined" && window.Lang ? window.Lang.get() : "tr");
  const isEn = currentLang === "en";
  const t = c.tedx || {};

  const heading = isEn ? (t.heading_en || t.heading) : t.heading;
  const text = isEn ? (t.text_en || t.text) : t.text;
  const sectionLabel = isEn ? (t.sectionLabel_en || t.sectionLabel || "06 / TEDx") : (t.sectionLabel || "06 / TEDx");

  // showInTedx: false olan bağlantılar bu bölümde gösterilmez
  const links = (c.sameAs || [])
    .filter((l) => l.showInTedx !== false)
    .map((l) => {
      const label = isEn ? (l.label_en || l.label) : l.label;
      return (
        `<a href="${esc(l.url)}" class="tedx-link" rel="me noopener" target="_blank">` +
        `<span>${esc(label)}</span>` +
        `<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>` +
        `</a>`
      );
    })
    .join("");

  return (
    `<section id="tedx" class="section-tedx" data-seo-section>` +
    `<style>` +
    `.section-tedx { max-width: 1200px; margin: 0 auto; padding: 100px 32px; box-sizing: border-box; }` +
    `.tedx-container { max-width: 900px; }` +
    `.tedx-desc { max-width: 680px; margin: 16px 0 28px; line-height: 1.8; color: var(--text-muted, var(--muted, rgba(255,255,255,0.7))); font-size: 0.95rem; }` +
    `.tedx-video-wrap { max-width: 800px; width: 100%; aspect-ratio: 16/9; margin-bottom: 24px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border, var(--border-2, rgba(255,255,255,0.12))); background: var(--surface, var(--surface-2, #111)); box-shadow: 0 16px 36px rgba(0,0,0,0.35); }` +
    `.tedx-video-wrap iframe { width: 100%; height: 100%; border: 0; display: block; }` +
    `.tedx-links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }` +
    `.tedx-link { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 6px; font-size: 0.8rem; font-family: inherit; text-decoration: none; border: 1px solid var(--border, rgba(255,255,255,0.18)); background: var(--surface-2, var(--surface, rgba(255,255,255,0.04))); color: var(--text, #fff); transition: all 0.2s ease; }` +
    `.tedx-link:hover { border-color: var(--accent, #c8ff00); color: var(--accent, #c8ff00); background: var(--accent-dim, rgba(200,255,0,0.08)); transform: translateY(-2px); }` +
    `@media (max-width: 768px) { .section-tedx { padding: 60px 20px; } }` +
    `</style>` +
    `<div class="tedx-container">` +
    `<div class="section-label">${esc(sectionLabel)}</div>` +
    `<h2 class="section-title reveal">${esc(heading)}</h2>` +
    `<p class="tedx-desc reveal">${esc(text)}</p>` +
    `<div class="tedx-video-wrap reveal">` +
    `<iframe src="https://www.youtube-nocookie.com/embed/${esc(t.youtubeId)}" ` +
    `title="${esc(heading)}" loading="lazy" ` +
    `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` +
    `</div>` +
    `<div class="tedx-links reveal">${links}</div>` +
    `</div>` +
    `</section>`
  );
}

// ---- Tarayıcı tarafı ----

export async function loadSeoConfig() {
  const res = await fetch("/shared/seo.config.json");
  if (!res.ok) throw new Error("seo.config.json okunamadı");
  return res.json();
}

// Tema HTML'i head'i değiştirdikten sonra çağrılır: temanın kendi etiketlerini silip
// config'ten üretilenleri ekler.
export function applySeo(c) {
  document.head
    .querySelectorAll(
      'title, meta[name="description"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"], meta[name="google-site-verification"], script[type="application/ld+json"]'
    )
    .forEach((el) => el.remove());
  document.head.insertAdjacentHTML("beforeend", buildHeadHTML(c));
}

// Navbar'a "TEDx" bağlantısı ekler (tema fark etmeksizin .nav-links veya nav ul bulunursa).
function addTedxNavLink(c) {
  const list = document.querySelector(".nav-links") || document.querySelector("nav ul");
  if (!list || list.querySelector('a[href="#tedx"]')) return;

  const currentLang = typeof window !== "undefined" && window.Lang ? window.Lang.get() : "tr";
  const isEn = currentLang === "en";
  const label = isEn ? (c.tedx?.navLabel_en || c.tedx?.navLabel || "TEDx") : (c.tedx?.navLabel || "TEDx");

  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = "#tedx";
  a.textContent = label;
  a.id = "nav-link-tedx";
  a.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("tedx")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  li.appendChild(a);
  list.appendChild(li);
}

// Temada #tedx yoksa footer'dan önce (footer yoksa body sonuna) TEDx bölümünü ekler.
export function injectTedx(c) {
  if (!c.tedx?.enabled) return;

  function renderOrUpdateTedx() {
    const lang = typeof window !== "undefined" && window.Lang ? window.Lang.get() : "tr";
    const existing = document.getElementById("tedx");

    // Eğer temada zaten özel tasarlanmış bir #tedx bölümü varsa (data-seo-section taşımıyorsa),
    // temanın kendi tasarımını ezme!
    if (existing && !existing.hasAttribute("data-seo-section")) {
      return;
    }

    const tpl = document.createElement("template");
    tpl.innerHTML = buildTedxHTML(c, lang);
    const newSection = tpl.content.firstElementChild;

    if (existing) {
      existing.replaceWith(newSection);
    } else {
      const footer = document.querySelector("footer");
      if (footer) footer.before(newSection);
      else document.body.appendChild(newSection);
    }

    // Navbar link metnini de güncelle
    const navTedx = document.getElementById("nav-link-tedx");
    if (navTedx) {
      const isEn = lang === "en";
      navTedx.textContent = isEn ? (c.tedx?.navLabel_en || c.tedx?.navLabel || "TEDx") : (c.tedx?.navLabel || "TEDx");
    }
  }

  renderOrUpdateTedx();
  addTedxNavLink(c);

  if (typeof window !== "undefined") {
    window.addEventListener("langChanged", () => {
      renderOrUpdateTedx();
    });
  }
}
