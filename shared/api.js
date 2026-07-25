/* ─── api.js — Firebase tabanlı API katmanı ────────────────────────────────────
   window.API arayüzü birebir korunur.
   Tüm temalar ve panel bu dosyayı kullanır; hiçbir şeyi değiştirmeye gerek yok.
────────────────────────────────────────────────────────────────────────────── */

import {
  firebaseLogin,
  firebaseLogout,
  getCurrentUser,
  waitForAuth,
  getPortfolioMain,
  getPortfolioConfig,
  getActiveTheme,
  updatePortfolioMain,
  updatePortfolioConfig,
  addMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
  getAnalyticsStats,
  recordVisit,
  recordDuration,
} from "/firebase/firebase.js";

// ─── Dil Yönetimi ─────────────────────────────────────────────────────────────
const LANG_KEY = "portfolio_lang";

function _detectBrowserLang() {
  const nav =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    "en";
  return nav.toLowerCase().startsWith("en") ? "en" : "tr";
}

function getLang() {
  return localStorage.getItem(LANG_KEY) || _detectBrowserLang();
}

function toggleLang() {
  const next = getLang() === "tr" ? "en" : "tr";
  localStorage.setItem(LANG_KEY, next);
  window.dispatchEvent(new Event("langChanged"));
}

window.Lang = { get: getLang, toggle: toggleLang };

// ─── i18n Uygulama ────────────────────────────────────────────────────────────

/**
 * portfolio/main dokümanından dil bazlı veri türetir.
 * Flask'taki PortfolioFlesh.get_portfolio_data() ile birebir aynı mantık.
 */
function applyI18n(data, lang) {
  const I18N_META_FIELDS = [
    "title", "status_text",
    "about_heading", "about_p1", "about_p2",
    "goal_quote", "goal_desc",
  ];

  const meta = { ...(data.meta || {}) };

  if (lang === "en") {
    for (const field of I18N_META_FIELDS) {
      const enVal = meta[`${field}_en`];
      if (enVal) meta[field] = enVal;
    }
  }

  // _en anahtarlarını frontend'den gizle
  for (const key of Object.keys(meta)) {
    if (key.endsWith("_en")) delete meta[key];
  }

  // Yaş hesapla
  if (meta.birthdate) {
    meta.age = calcAge(meta.birthdate);
  }

  // Görünür olmayanları filtrele
  const languages = (data.languages || []).filter((l) => l.visible !== false);
  const stack_tools = (data.stack_tools || []).filter((t) => t.visible !== false);

  // Projeler: _en alanlarını uygula ve temizle
  const projects = (data.projects || []).map((proj) => {
    const p = { ...proj };
    if (lang === "en" && p.description_en) {
      p.description = p.description_en;
    }
    delete p.description_en;
    return p;
  });

  return {
    ...data,
    meta,
    languages,
    stack_tools,
    projects,
    _lang: lang,
  };
}

function calcAge(birthdateStr) {
  try {
    const bd = new Date(birthdateStr);
    const today = new Date();
    let age = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
    return age;
  } catch {
    return 0;
  }
}

// ─── Tema ID → İsim dönüşümü (eski sayısal ID sistemi kaldırıldı) ─────────────
// Tema seçimi artık string folder adıyla yapılır.
// panel-render.js theme.id beklediği için temalar objeye id alanı eklenecek.

function themesToPanelFormat(themes, activeTheme, selectedTheme) {
  const sel = selectedTheme || activeTheme;
  return themes.map((name, index) => ({
    id: index + 1,
    name,
    folder: name,
    selected: name === sel,
    applied: name === activeTheme,
    preview: `/themes/${name}/assets/preview.png`,
  }));
}

// ─── Auth Yardımcısı ─────────────────────────────────────────────────────────
// getCurrentUser() senkron olduğu için bazen null dönebilir.
// ensureAuth() waitForAuth() kullanarak auth durumunu güvenli şekilde bekler.
async function ensureAuth() {
  const user = await waitForAuth();
  if (!user) throw new Error("Unauthorized");
  return user;
}

// ─── API Nesnesi ──────────────────────────────────────────────────────────────

const API = {
  /** Portfolio verisini getir (dil bazlı) */
  async getPortfolio() {
    const lang = getLang();
    const [mainData, configData, analyticsData] = await Promise.all([
      getPortfolioMain(),
      getPortfolioConfig(),
      getAnalyticsStats().catch(() => null),
    ]);

    if (!mainData) throw new Error("Portfolio verisi bulunamadı.");

    const processed = applyI18n(mainData, lang);

    // Panel için mesajlar — sadece admin erişebilir, hata olursa boş dizi
    let messages = [];
    try {
      const user = getCurrentUser();
      if (user) {
        messages = await getMessages();
      }
    } catch {
      messages = [];
    }

    return {
      ...processed,
      messages,
      analytics: analyticsData || {},
      themes: themesToPanelFormat(
        configData?.themes || [],
        configData?.activeTheme || "claudemade",
        configData?.selectedTheme
      ),
    };
  },

  /** İletişim formu mesajı gönder */
  async sendContact({ name, email, message }) {
    if (!name || !email || !message) {
      throw new Error("Tüm alanlar zorunlu.");
    }
    if (message.length > 2000) {
      throw new Error("Mesaj çok uzun.");
    }
    await addMessage(name.trim(), email.trim(), message.trim());
    return { ok: true, message: "Mesajın alındı, teşekkürler!" };
  },

  /** Auth durumunu kontrol et */
  async checkAuth() {
    const user = await waitForAuth();
    return { logged_in: !!user };
  },

  /** Giriş yap — email veya sadece şifre ile */
  async login(passwordOrEmail, passwordArg) {
    // Geriye dönük uyumluluk: eski sistem sadece şifre alırdı.
    // Yeni sistem email + şifre bekler.
    // panel.js login(password) çağırırsa, email ADMIN_EMAIL sabitinden gelir.
    let email, password;
    if (passwordArg !== undefined) {
      email = passwordOrEmail;
      password = passwordArg;
    } else {
      // Sadece şifre verilmişse sabit admin email kullan
      email = window._ADMIN_EMAIL || "admin@portfolio.dev";
      password = passwordOrEmail;
    }
    await firebaseLogin(email, password);
    return { ok: true };
  },

  /** Çıkış yap */
  async logout() {
    await firebaseLogout();
    return { ok: true };
  },

  /** Tüm portfolio verisini admin için getir (ham, i18n uygulanmamış) */
  async getAllData() {
    await ensureAuth();

    const [mainData, configData, analyticsData, messages] = await Promise.all([
      getPortfolioMain(),
      getPortfolioConfig(),
      getAnalyticsStats().catch(() => null),
      getMessages(),
    ]);

    return {
      ...(mainData || {}),
      messages,
      analytics: analyticsData || {},
      themes: themesToPanelFormat(
        configData?.themes || [],
        configData?.activeTheme || "claudemade"
      ),
    };
  },

  /** Meta bilgilerini güncelle */
  async updateMeta(body) {
    await ensureAuth();

    const allowed = [
      "name", "title", "host", "domain", "location", "birthdate",
      "status_text", "about_heading", "about_p1", "about_p2",
      "goal_quote", "goal_desc",
      "title_en", "status_text_en",
      "about_heading_en", "about_p1_en", "about_p2_en",
      "goal_quote_en", "goal_desc_en",
    ];

    const updates = {};
    for (const k of allowed) {
      if (k in body) updates[`meta.${k}`] = body[k];
    }

    await updatePortfolioMain(updates);
    return { ok: true };
  },

  /** Sayısal stats güncelle */
  async updateStats(body) {
    await ensureAuth();

    const updates = {};
    for (const k of ["active_projects", "languages_count", "year", "message_limit"]) {
      if (k in body) {
        const val = parseInt(body[k], 10);
        if (!isNaN(val)) updates[`stats.${k}`] = val;
      }
    }

    await updatePortfolioMain(updates);
    return { ok: true };
  },

  /** İletişim bilgilerini güncelle */
  async updateContact(body) {
    await ensureAuth();

    const updates = {};
    for (const k of ["email", "github", "website"]) {
      if (k in body) updates[`contact.${k}`] = body[k];
    }

    await updatePortfolioMain(updates);
    return { ok: true };
  },

  /** Dilleri güncelle */
  async updateLanguages(body) {
    await ensureAuth();

    const mainData = await getPortfolioMain();
    const langMap = {};
    for (const l of mainData.languages || []) langMap[l.name] = { ...l };

    for (const upd of body.languages || []) {
      const name = upd.name;
      if (name in langMap) {
        if ("visible" in upd) langMap[name].visible = Boolean(upd.visible);
        if ("level" in upd) langMap[name].level = Math.max(0, Math.min(100, parseInt(upd.level, 10)));
      }
    }

    await updatePortfolioMain({ languages: Object.values(langMap) });
    return { ok: true };
  },

  /** Projeleri güncelle (add / update / delete) */
  async updateProjects(body) {
    await ensureAuth();

    const mainData = await getPortfolioMain();
    let projects = [...(mainData.projects || [])];
    const action = body.action;

    if (action === "add") {
      const proj = body.project || {};
      const newId = Math.max(0, ...projects.map((p) => p.id || 0)) + 1;
      let tags = proj.tags || [];
      if (typeof tags === "string") tags = tags.split(",").map((t) => t.trim()).filter(Boolean);
      projects.push({
        id: newId,
        num: String(newId).padStart(2, "0"),
        title: proj.title || "Yeni Proje",
        description: proj.description || "",
        description_en: proj.description_en || "",
        tags,
        status: proj.status || "active",
        github: proj.github || "",
      });
    } else if (action === "update") {
      const proj = body.project || {};
      const pid = proj.id;
      projects = projects.map((p) => {
        if (p.id !== pid) return p;
        let tags = proj.tags !== undefined ? proj.tags : p.tags;
        if (typeof tags === "string") tags = tags.split(",").map((t) => t.trim()).filter(Boolean);
        return {
          ...p,
          title: proj.title !== undefined ? proj.title : p.title,
          description: proj.description !== undefined ? proj.description : p.description,
          description_en: proj.description_en !== undefined ? proj.description_en : (p.description_en || ""),
          tags,
          status: proj.status !== undefined ? proj.status : p.status,
          github: proj.github !== undefined ? proj.github : p.github,
        };
      });
    } else if (action === "delete") {
      const pid = body.id;
      projects = projects.filter((p) => p.id !== pid);
    }

    await updatePortfolioMain({ projects });
    return { ok: true };
  },

  /** Mesajları getir (admin) */
  async getMessages() {
    await ensureAuth();
    return await getMessages();
  },

  /** Mesajı okundu olarak işaretle */
  async markMessageRead(id) {
    await ensureAuth();
    await markMessageRead(String(id));
    return { ok: true };
  },

  /** Mesajı sil */
  async deleteMessage(id) {
    await ensureAuth();
    await deleteMessage(String(id));
    return { ok: true };
  },

  /** Tema listesini getir */
  async getThemes() {
    await ensureAuth();

    const config = await getPortfolioConfig();
    return themesToPanelFormat(
      config?.themes || [],
      config?.activeTheme || "claudemade",
      config?.selectedTheme
    );
  },

  /** Tema seç (sadece selected günceller, apply ayrı adım) */
  async selectTheme(folder) {
    await ensureAuth();

    const config = await getPortfolioConfig();
    const themes = config?.themes || [];

    // String folder adı doğrudan kabul et
    if (!folder || !themes.includes(folder)) {
      throw new Error(`Geçersiz tema: ${folder}`);
    }

    await updatePortfolioConfig({ selectedTheme: folder });
    return { ok: true };
  },

  /** Temayı uygula — Flask'taki restart-trigger'ın yerini alır. Sunucu yok, sadece Firestore güncellenir. */
  async triggerRestartLog() {
    await ensureAuth();

    const config = await getPortfolioConfig();
    const selected = config?.selectedTheme;

    if (!selected) throw new Error("Seçili tema yok");

    await updatePortfolioConfig({ activeTheme: selected });
    return { ok: true };
  },

  /** Genel analytics stats */
  async getStats() {
    const data = await getAnalyticsStats();
    if (!data) return { ok: true, unique_visitors: 0, sessions: {}, avg_duration_sec: 0, last_updated: null };
    return {
      ok: true,
      unique_visitors: data.unique_visitors || 0,
      sessions: data.sessions || { total: 0, daily: {}, weekly: {}, monthly: {} },
      avg_duration_sec: data.avg_duration_sec || 0,
      last_updated: data.last_updated || null,
    };
  },

  /** Detaylı analytics (admin) */
  async getStatsDetail() {
    await ensureAuth();

    const data = await getAnalyticsStats();
    if (!data) return { ok: true, unique_visitors: 0, sessions: {}, avg_duration_sec: 0, total_durations: 0, last_updated: null };
    return {
      ok: true,
      unique_visitors: data.unique_visitors || 0,
      sessions: data.sessions || {},
      avg_duration_sec: data.avg_duration_sec || 0,
      total_durations: (data.durations || []).length,
      last_updated: data.last_updated || null,
    };
  },

  /** Ziyaret kaydet */
  async recordVisit(data) {
    await recordVisit(data);
    return { ok: true };
  },

  /** Süre kaydet */
  async recordDuration(data) {
    await recordDuration(data);
    return { ok: true };
  },
};

window.API = API;
