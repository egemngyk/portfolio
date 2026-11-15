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

});
