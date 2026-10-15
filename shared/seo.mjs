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

export function buildTedxHTML(c) {
  const t = c.tedx;
  // showInTedx: false olan bağlantılar bu bölümde gösterilmez (JSON-LD'de yine yer alır)
  const links = c.sameAs
    .filter((l) => l.showInTedx !== false)
    .map((l) => `<a href="${esc(l.url)}" rel="me noopener" target="_blank">${esc(l.label)}</a>`)
    .join(" · ");
  return (
    `<section id="tedx" data-seo-section style="max-width:960px;margin:0 auto;padding:80px 24px;color:inherit;font-family:inherit;">` +
    `<h2 style="margin-bottom:16px;">${esc(t.heading)}</h2>` +
    `<p style="max-width:640px;margin-bottom:28px;line-height:1.7;opacity:.8;">${esc(t.text)}</p>` +
    `<div style="max-width:720px;aspect-ratio:16/9;">` +
    `<iframe src="https://www.youtube-nocookie.com/embed/${esc(t.youtubeId)}" ` +
    `title="${esc(t.heading)}" loading="lazy" ` +
    `style="width:100%;height:100%;border:0;border-radius:12px;" ` +
    `allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe>` +
    `</div>` +
    `<p style="margin-top:20px;line-height:1.9;">${links}</p>` +
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

// Temada #tedx yoksa footer'dan önce (footer yoksa body sonuna) TEDx bölümünü ekler.
export function injectTedx(c) {
  if (!c.tedx?.enabled || document.getElementById("tedx")) return;
  const tpl = document.createElement("template");
  tpl.innerHTML = buildTedxHTML(c);
  const section = tpl.content.firstElementChild;
  const footer = document.querySelector("footer");
  if (footer) footer.before(section);
  else document.body.appendChild(section);
}