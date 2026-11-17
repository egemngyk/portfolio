// Eğer sayfa doğrudan /themes/.../html/ altından açılmışsa ana sayfaya temiz yönlendir
if (typeof window !== "undefined" && window.location.pathname.includes("/themes/")) {
  const match = window.location.pathname.match(/\/themes\/([^\/]+)\//);
  const themeName = match ? match[1] : "";
  const hash = window.location.hash || "";
  window.location.replace(`/${themeName ? `?theme=${themeName}` : ""}${hash}`);
}

// Sayfa içi navigasyon tıklamalarında URL'nin (base href nedeniyle) bozulmasını engelle
if (typeof document !== "undefined") {
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    const hashIdx = href.indexOf("#");
    if (hashIdx === -1) return;
    const hash = href.slice(hashIdx);
    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, true);
}

window.portfolioPromise = API.getPortfolio().then(portfolio => {

/* ROOT */
window.portfolio = portfolio;

/* META */
window.meta = portfolio.meta;
window.name = portfolio.meta.name;
window.title = portfolio.meta.title;
window.host = portfolio.meta.host;
window.domain = portfolio.meta.domain;
window.locate = portfolio.meta.location;
window.birthdate = portfolio.meta.birthdate;
window.status_text = portfolio.meta.status_text;
window.about_heading = portfolio.meta.about_heading;
window.about_p1 = portfolio.meta.about_p1;
window.about_p2 = portfolio.meta.about_p2;
window.goal_quote = portfolio.meta.goal_quote;
window.goal_desc = portfolio.meta.goal_desc;

/* STATS */
window.stats = portfolio.stats;
window.active_projects = portfolio.stats.active_projects;
window.languages_count = portfolio.stats.languages_count;
window.year = portfolio.stats.year;
window.message_limit = portfolio.stats.message_limit;

/* CONTACT */
window.contact = portfolio.contact;
window.email = portfolio.contact.email;
window.github = portfolio.contact.github;
window.website = portfolio.contact.website;

/* ARRAYS */
window.languages = portfolio.languages;
window.stack_tools = portfolio.stack_tools;
window.projects = portfolio.projects;
window.messages = portfolio.messages;

/* Mesaj gönderme */
window.sendMessage = async function ({ name, email, message }) {
  const limit = window.message_limit || 2000;
  if (!name || !email || !message || message.length > limit)
    return { ok: false };
  try {
    await API.sendContact({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
};

/* Favicon Güvencesi: Aktif/önizleme temasının ikonunu head'e garantile.
   Öncelik: ?preview / ?theme URL parametresi > <base href> > Firestore'dan gelen aktif tema. */
try {
  const params = new URLSearchParams(window.location.search);
  const urlTheme = params.get("preview") || params.get("theme");
  const baseEl = document.querySelector("base");
  const baseHref = baseEl ? baseEl.getAttribute("href") : "";
  const match = baseHref.match(/themes\/([^\/]+)/);
  const baseTheme = match ? match[1] : "";
  const valid = (t) => t && /^[\w-]+$/.test(t);

  function applyFavicon(theme) {
    if (!valid(theme)) return;
    // Cache-busting: tema değişince eski favicon önbellekten gelmesin
    const iconUrl = `/themes/${theme}/assets/favicon.png?v=${Date.now()}`;
    document.querySelectorAll("link[rel*='icon']").forEach((el) => el.remove());
    const l1 = document.createElement("link");
    l1.rel = "icon";
    l1.type = "image/png";
    l1.href = iconUrl;
    document.head.appendChild(l1);
    const l2 = document.createElement("link");
    l2.rel = "shortcut icon";
    l2.type = "image/png";
    l2.href = iconUrl;
    document.head.appendChild(l2);
    const l3 = document.createElement("link");
    l3.rel = "apple-touch-icon";
    l3.href = iconUrl;
    document.head.appendChild(l3);
  }

  if (valid(urlTheme)) {
    applyFavicon(urlTheme);
  } else if (valid(baseTheme)) {
    applyFavicon(baseTheme);
  } else if (window.portfolioPromise && typeof window.portfolioPromise.then === "function") {
    // base/URL yoksa aktif temayı Firestore verisinden al
    window.portfolioPromise
      .then((portfolio) => {
        const applied = portfolio?.themes?.find((t) => t.applied);
        if (applied?.folder) applyFavicon(applied.folder);
      })
      .catch(() => {});
  }
} catch {
  // no-op
}

});
