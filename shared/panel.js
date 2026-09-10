/* ─── panel.js — Firebase tabanlı Admin Panel Controller ──────────────────────
   window.ADMIN arayüzü birebir korunur; panel-render.js değişmez.
   
   DÜZELTME: window.ADMIN portfolio verisine bağımlı değildir — hemen set edilir.
   Sadece portföy verilerini window.* değişkenlerine atayan kısım Promise içindedir.
────────────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────
   ADMIN BACKEND CONTROLLER
   Portfolio fetch'ini BEKLEMEZ — anında tanımlanır.
───────────────────────── */
window.ADMIN = {};
window.ADMIN.auth = { loggedIn: false };

window.ADMIN.checkAuth = async function () {
  try {
    const res = await API.checkAuth();
    window.ADMIN.auth.loggedIn = res.logged_in === true;
    return { ok: res.logged_in === true };
  } catch {
    window.ADMIN.auth.loggedIn = false;
    return { ok: false };
  }
};

window.ADMIN.login = async function (email, password) {
  try {
    await API.login(email, password);
    window.ADMIN.auth.loggedIn = true;
    return { ok: true };
  } catch (err) {
    window.ADMIN.auth.loggedIn = false;
    return { ok: false, error: err.message };
  }
};

window.ADMIN.logout = async function () {
  try {
    await API.logout();
    window.ADMIN.auth.loggedIn = false;
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.getData = async function () {
  try {
    const data = await API.getAllData();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.updateMeta = async function (data) {
  try {
    await API.updateMeta(data);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.updateStats = async function (data) {
  try {
    await API.updateStats(data);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.updateLanguages = async function (data) {
  try {
    await API.updateLanguages(data);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.updateProjects = async function (data) {
  try {
    await API.updateProjects(data);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.updateContact = async function (data) {
  try {
    await API.updateContact(data);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.getMessages = async function () {
  try {
    const res = await API.getMessages();
    return { ok: true, messages: res };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.markRead = async function (id) {
  try {
    await API.markMessageRead(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.deleteMessage = async function (id) {
  try {
    await API.deleteMessage(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.getThemes = async function () {
  try {
    const res = await API.getThemes();
    return { ok: true, themes: res };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.selectTheme = async function (id) {
  try {
    await API.selectTheme(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.triggerRestartLog = async function () {
  try {
    await API.triggerRestartLog();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

window.ADMIN.getStatsDetail = async function () {
  try {
    const res = await API.getStatsDetail();
    return { ok: true, data: res };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   Portfolio verileri — Firestore'dan çekilir, window.* değişkenlerine atanır.
   panel-loader.js bu Promise tamamlanana kadar panel-render.js'i yüklemez.
───────────────────────────────────────────────────────────────────────────── */
window.panelPromise = API.getPortfolio().then((portfolio) => {
  window.portfolio = portfolio;

  window.meta          = portfolio.meta;
  window.name          = portfolio.meta.name;
  window.title         = portfolio.meta.title;
  window.host          = portfolio.meta.host;
  window.domain        = portfolio.meta.domain;
  window.locate        = portfolio.meta.location;
  window.birthdate     = portfolio.meta.birthdate;
  window.status_text   = portfolio.meta.status_text;
  window.about_heading = portfolio.meta.about_heading;
  window.about_p1      = portfolio.meta.about_p1;
  window.about_p2      = portfolio.meta.about_p2;
  window.goal_quote    = portfolio.meta.goal_quote;
  window.goal_desc     = portfolio.meta.goal_desc;

  window.stats           = portfolio.stats;
  window.active_projects = portfolio.stats.active_projects;
  window.languages_count = portfolio.stats.languages_count;
  window.year            = portfolio.stats.year;
  window.message_limit   = portfolio.stats.message_limit;

  window.contact = portfolio.contact;
  window.email   = portfolio.contact.email;
  window.github  = portfolio.contact.github;
  window.website = portfolio.contact.website;

  window.languages   = portfolio.languages;
  window.stack_tools = portfolio.stack_tools;
  window.projects    = portfolio.projects;
  window.messages    = portfolio.messages;

  window.analytics        = portfolio.analytics || {};
  window.unique_visitors  = (portfolio.analytics || {}).unique_visitors  || 0;
  window.sessions         = (portfolio.analytics || {}).sessions         || {};
  window.avg_duration_sec = (portfolio.analytics || {}).avg_duration_sec || 0;
  window.last_updated     = (portfolio.analytics || {}).last_updated     || null;
});
