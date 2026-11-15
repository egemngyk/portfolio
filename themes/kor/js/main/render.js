/* ─────────────────────────────────────────────
   KOR — render.js
   Veri sözleşmesi orijinal temayla aynıdır (window.name, window.projects,
   window.languages, window.sendMessage, window.Lang ...).
   i18n: window.Lang.get() → "tr" | "en"
───────────────────────────────────────────── */
(function () {
  "use strict";

  /* Hero'daki canlı saat hangi saat dilimini göstersin */
  const OWNER_TZ = "Europe/Istanbul";

  /* ══ I18N SÖZLÜK ════════════════════════════ */
  const T = {
    tr: {
      nav_about: "Hakkımda",
      nav_stack: "Stack",
      nav_projects: "Projeler",
      nav_tedx: "TEDx",
      nav_contact: "İletişim",
      hero_age_suffix: "yaşında",
      hero_age_label: "Yaş",
      hero_cta: "Projelere bak",
      meta_host: "sunucu",
      meta_domain: "alan adı",
      meta_loc: "konum",
      meta_time: "yerel saat",
      section_about: "Hakkımda",
      section_stack: "Teknoloji Stack",
      stack_title: "Araçlarım",
      stack_tools_title: "Araç çantası",
      section_projects: "Projeler",
      projects_title: "Ne İnşa Ettim",
      section_goal: "Hedef",
      section_tedx: "TEDx",
      tedx_title: "TEDx Konuşması",
      tedx_desc: "Muhammed Egemen Geyik'in TEDx sahnesinde yaptığı \"İnovasyon\" başlıklı konuşma.",
      tedx_link_talk: "TEDx Konuşması",
      tedx_link_yt: "YouTube",
      tedx_link_fb: "Facebook Paylaşımı",
      section_contact: "İletişim",
      contact_heading: "Birlikte bir şeyler<br><em>üretelim.</em>",
      form_title: "Doğrudan Yaz",
      form_name: "Ad Soyad",
      form_email: "E-posta",
      form_message: "Mesaj",
      form_send: "Gönder",
      form_name_ph: "Adın",
      form_email_ph: "email@ornek.com",
      form_message_ph: "Merhaba Egemen...",
      stat_projects: "Aktif Proje",
      stat_langs: "Programlama Dili",
      stat_year: "Yıl",
      status_active: "Aktif Geliştirme",
      status_hold: "Beklemede",
      status_done: "Tamamlandı",
      form_err_empty: "Lütfen tüm alanları doldur.",
      form_err_long: "Mesaj çok uzun. Maksimum {n} karakter.",
      form_sending: "Gönderiliyor...",
      form_ok: "Mesajın alındı, teşekkürler!",
      form_fail: "Bir hata oluştu, tekrar dene.",
      footer_online: "Çevrimiçi",
      footer_top: "Başa dön",
      groups: ["Diller", "Kütüphane & Framework", "Uzmanlıklar"],
      // Bayrak: mevcut dil TR ise EN bayrağı göster (geçiş için)
      lang_flag: "🇬🇧",
      lang_title: "Switch to English",
    },
    en: {
      nav_about: "About",
      nav_stack: "Stack",
      nav_projects: "Projects",
      nav_tedx: "TEDx",
      nav_contact: "Contact",
      hero_age_suffix: "years old",
      hero_age_label: "Age",
      hero_cta: "See projects",
      meta_host: "host",
      meta_domain: "domain",
      meta_loc: "location",
      meta_time: "local time",
      section_about: "About",
      section_stack: "Tech Stack",
      stack_title: "My Tools",
      stack_tools_title: "Toolbox",
      section_projects: "Projects",
      projects_title: "What I've Built",
      section_goal: "Goal",
      section_tedx: "TEDx",
      tedx_title: "TEDx Talk",
      tedx_desc: "Muhammed Egemen Geyik's speech titled \"Innovation\" on the TEDx stage.",
      tedx_link_talk: "TEDx Talk",
      tedx_link_yt: "YouTube",
      tedx_link_fb: "Facebook Post",
      section_contact: "Contact",
      contact_heading: "Let's build something<br><em>together.</em>",
      form_title: "Write Directly",
      form_name: "Full Name",
      form_email: "Email",
      form_message: "Message",
      form_send: "Send",
      form_name_ph: "Your name",
      form_email_ph: "email@example.com",
      form_message_ph: "Hi Egemen...",
      stat_projects: "Active Projects",
      stat_langs: "Languages",
      stat_year: "Year",
      status_active: "Active Development",
      status_hold: "On Hold",
      status_done: "Completed",
      form_err_empty: "Please fill in all fields.",
      form_err_long: "Message too long. Maximum {n} characters.",
      form_sending: "Sending...",
      form_ok: "Message received, thank you!",
      form_fail: "An error occurred, please try again.",
      footer_online: "Online",
      footer_top: "Back to top",
      groups: ["Languages", "Libraries & Frameworks", "Specializations"],
      lang_flag: "🇹🇷",
      lang_title: "Türkçeye geç",
    },
  };

  const lang = window.Lang.get();
  const t = T[lang] || T["tr"];

  window.addEventListener("langChanged", () => {
    location.reload();
  });

  /* ══ LANG LOGO MAP ══════════════════════════ */
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

  /* ══ UTILS ══════════════════════════════════ */
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el && val != null) el.textContent = val;
  }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ══ STATİK METİNLER ════════════════════════
     data-i18n niteliği olan tüm elementleri doldurur.
  ═══════════════════════════════════════════ */
  function applyStaticTranslations() {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (t[key] === undefined) return;
      if (key === "contact_heading") el.innerHTML = t[key]; // <em> içerir
      else el.textContent = t[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    const btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.textContent = t.lang_flag;
      btn.title = t.lang_title;
      btn.addEventListener("click", () => window.Lang.toggle());
    }
  }

  /* ══ ZORUNLU UI GARANTİSİ ═══════════════════ */
  function ensureMandatoryUI() {
    if (!document.getElementById("lang-toggle")) {
      const btn = document.createElement("button");
      btn.id = "lang-toggle";
      btn.className = "lang-toggle";
      btn.setAttribute("aria-label", "Switch language");
      btn.title = "Switch language";
      btn.style.cssText =
        "position:fixed;right:16px;bottom:16px;z-index:9999;padding:10px 12px;border:1px solid #2a2a2a;border-radius:999px;background:#111;color:#fff;cursor:pointer;";
      document.body.appendChild(btn);
    }

    if (!document.getElementById("contact")) {
      const section = document.createElement("section");
      section.id = "contact";
      section.className = "section-contact";
      section.style.cssText = "padding:32px 20px;";
      section.innerHTML = `
        <div class="section-label" data-i18n="section_contact">İletişim</div>
        <div class="contact-grid">
          <div class="contact-left">
            <h2 data-i18n="contact_heading">Birlikte bir şeyler<br><em>üretelim.</em></h2>
            <div id="contact-links" class="contact-links-list"></div>
          </div>
          <div class="contact-right">
            <div class="contact-form-wrap">
              <div class="form-title" data-i18n="form_title">Doğrudan Yaz</div>
              <div class="form-group">
                <label data-i18n="form_name">Ad Soyad</label>
                <input type="text" id="form-name" data-i18n-placeholder="form_name_ph" placeholder="Adın" />
              </div>
              <div class="form-group">
                <label data-i18n="form_email">E-posta</label>
                <input type="email" id="form-email" data-i18n-placeholder="form_email_ph" placeholder="email@ornek.com" />
              </div>
              <div class="form-group">
                <label data-i18n="form_message">Mesaj</label>
                <textarea id="form-message" rows="5" data-i18n-placeholder="form_message_ph" placeholder="Merhaba Egemen..."></textarea>
              </div>
              <button class="form-submit" id="form-submit">
                <span data-i18n="form_send">Gönder</span>
              </button>
              <div class="form-feedback" id="form-feedback"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(section);
    }
  }

  /* ══ ISINAN METİN MOTORU ════════════════════
     .heat elementlerinin üstündeki kızıl kopya, imlecin
     etrafında maske ile görünür. Sayfa açılırken bir kez
     "tarama" yapar; sonra imleci (veya dokunuşu) izler.
  ═══════════════════════════════════════════ */
  function initHeat() {
    const els = Array.from(document.querySelectorAll(".heat"));
    if (!els.length) return;

    const baseRadius = () => Math.round(clamp(innerWidth * 0.17, 120, 250));
    let tx = -9999, ty = -9999, cx = -9999, cy = -9999;
    let power = 0, powerT = 0;
    let raf = 0;
    let sweeping = false, sweepStart = 0, sweepRects = null;
    let userSeen = false;
    let fadeTimer = 0;
    const SWEEP_MS = 2800;

    const smooth = (x) => {
      x = clamp(x, 0, 1);
      return x * x * (3 - 2 * x);
    };

    function sweepPoint(p) {
      const [a, b] = sweepRects;
      const L = a.left - 30;
      const R = Math.max(a.right, b.right) + 30;
      const y1 = a.top + a.height * 0.5;
      const y2 = b.top + b.height * 0.5;
      const seg = p < 0.5 ? p / 0.5 : (p - 0.5) / 0.5;
      const e = seg < 0.5 ? 2 * seg * seg : 1 - Math.pow(-2 * seg + 2, 2) / 2;
      const x = p < 0.5 ? L + (R - L) * e : R - (R - L) * e;
      const y = y1 + (y2 - y1) * smooth((p - 0.42) / 0.16);
      return [x, y];
    }

    function frame(now) {
      raf = 0;

      if (sweeping) {
        const p = (now - sweepStart) / SWEEP_MS;
        if (p >= 1) {
          sweeping = false;
          if (!userSeen) powerT = 0;
        } else {
          const [sx, sy] = sweepPoint(p);
          tx = cx = sx;
          ty = cy = sy;
          powerT = 1;
        }
      }

      if (!sweeping) {
        if (cx < -9000) {
          cx = tx;
          cy = ty;
        }
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
      }
      power += (powerT - power) * 0.12;

      const R = Math.max(1, baseRadius() * power);
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -R || r.top > innerHeight + R) continue;
        el.style.setProperty("--hx", (cx - r.left).toFixed(1) + "px");
        el.style.setProperty("--hy", (cy - r.top).toFixed(1) + "px");
        el.style.setProperty("--hr", R.toFixed(1) + "px");
      }

      const busy =
        sweeping ||
        Math.abs(tx - cx) > 0.4 ||
        Math.abs(ty - cy) > 0.4 ||
        Math.abs(powerT - power) > 0.004;
      if (busy) raf = requestAnimationFrame(frame);
    }

    function kick() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function onPointer(e) {
      userSeen = true;
      sweeping = false;
      clearTimeout(fadeTimer);
      tx = e.clientX;
      ty = e.clientY;
      powerT = 1;
      kick();
    }
    addEventListener("pointermove", onPointer, { passive: true });
    addEventListener("pointerdown", onPointer, { passive: true });
    addEventListener(
      "pointerup",
      (e) => {
        if (e.pointerType === "touch") {
          clearTimeout(fadeTimer);
          fadeTimer = setTimeout(() => {
            powerT = 0;
            kick();
          }, 1100);
        }
      },
      { passive: true },
    );
    document.documentElement.addEventListener("mouseleave", () => {
      powerT = 0;
      kick();
    });
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);

    /* açılış taraması */
    if (!reduceMotion) {
      const lines = Array.from(document.querySelectorAll(".hero-name .heat"));
      const start = () => {
        if (userSeen || !lines.length) return;
        const a = lines[0].getBoundingClientRect();
        const b = (lines[1] || lines[0]).getBoundingClientRect();
        sweepRects = [a, b];
        sweeping = true;
        sweepStart = performance.now();
        kick();
      };
      const ready = document.fonts && document.fonts.ready;
      (ready || Promise.resolve()).then(() => setTimeout(start, 450));
    }
  }

  /* ══ ALT YAZI DEV İSİM: genişliğe sığdır ═══ */
  function fitWordmark() {
    const el = document.getElementById("footer-wordmark");
    if (!el || !el.textContent) return;
    const fit = () => {
      const box = el.parentElement;
      el.style.width = "max-content";
      el.style.fontSize = "100px";
      const w = el.getBoundingClientRect().width || 1;
      el.style.width = "";
      el.style.fontSize = (100 * (box.clientWidth * 0.985)) / w + "px";
    };
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    addEventListener("resize", fit);
  }

  /* ══ CANLI SAAT ═════════════════════════════ */
  function initClock() {
    const el = document.getElementById("meta-time");
    if (!el) return;
    const opts = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    let fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: OWNER_TZ });
    } catch (_) {
      fmt = new Intl.DateTimeFormat("en-GB", opts);
    }
    const tick = () => (el.textContent = fmt.format(new Date()));
    tick();
    setInterval(tick, 1000);
  }

  /* ══ SCROLL: ölçer, nav, hedef ══════════════ */
  let goalWords = [];
  let goalSection = null;
  let goalLit = -1;

  function updateGoal() {
    if (!goalSection || !goalWords.length || goalSection.classList.contains("static"))
      return;
    const r = goalSection.getBoundingClientRect();
    const total = r.height - innerHeight;
    if (total <= 0) return;
    const p = clamp(-r.top / total, 0, 1);
    const n = goalWords.length;
    const count = Math.min(n, Math.round(p * 1.15 * n));
    if (count === goalLit) return;
    goalLit = count;
    const done = count >= n;
    goalWords.forEach((w, i) => {
      w.classList.toggle("lit", done || i < count - 1);
      w.classList.toggle("edge", !done && i === count - 1);
    });
  }

  function initScroll() {
    const nav = document.getElementById("nav");
    const fill = document.getElementById("gauge-fill");
    const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
    const targets = navLinks
      .map((l) => document.querySelector(l.getAttribute("href")))
      .filter(Boolean);
    let ticking = false;

    function update() {
      ticking = false;
      if (nav) nav.classList.toggle("scrolled", scrollY > 60);

      if (fill) {
        const max = document.documentElement.scrollHeight - innerHeight;
        fill.style.height = (max > 0 ? clamp(scrollY / max, 0, 1) * 100 : 0) + "%";
      }

      let current = "";
      targets.forEach((s) => {
        if (s.getBoundingClientRect().top <= innerHeight * 0.4) current = s.id;
      });
      navLinks.forEach((l) =>
        l.classList.toggle("active", l.getAttribute("href") === "#" + current),
      );

      updateGoal();
    }

    addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    addEventListener("resize", update);
    update();
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    });
  }

  /* ══ SAYAÇ ANİMASYONU ═══════════════════════ */
  function animateCount(el, target, duration = 1400) {
    // yıl gibi sayılarda binlik ayırıcı olmasın (2026, "2.026" değil)
    const fmt = (n) =>
      el.id === "stat-year"
        ? String(n)
        : n.toLocaleString(lang === "en" ? "en-US" : "tr");
    if (reduceMotion) {
      el.textContent = fmt(target);
      return;
    }
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * e));
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  const statObs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target, parseInt(e.target.dataset.count) || 0);
          statObs.unobserve(e.target);
        }
      }),
    { threshold: 0.5 },
  );

  /* ══ GÖSTERGE YANMA ANİMASYONU ══════════════ */
  const meterObs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("animated");
          meterObs.unobserve(e.target);
        }
      }),
    { threshold: 0.4 },
  );

  /* ══ DAKTİLO ════════════════════════════════ */
  function typeText(el, text, speed = 32, delay = 350) {
    el.textContent = "";
    if (reduceMotion) {
      el.textContent = text;
      return;
    }
    let i = 0;
    el.classList.add("typing");
    setTimeout(() => {
      const timer = setInterval(() => {
        el.textContent = text.slice(0, ++i);
        if (i >= text.length) {
          clearInterval(timer);
          el.classList.remove("typing");
        }
      }, speed);
    }, delay);
  }

  /* ══ RENDER: META ═══════════════════════════ */
  function renderMeta() {
    /* İsim: ilk kelime / kalan kelimeler → iki satır, her satır .heat */
    const nameEl = document.getElementById("hero-name");
    const full = String(window.name || "Egemen Geyik").trim();
    const parts = full.split(/\s+/);
    const lines = parts.length > 2 ? [parts[0], parts.slice(1).join(" ")] : parts;
    if (nameEl) {
      nameEl.setAttribute("aria-label", full);
      nameEl.innerHTML = lines
        .map(
          (w) =>
            `<span class="heat" lang="tr" aria-hidden="true" data-text="${esc(w)}">${esc(w)}</span>`,
        )
        .join("");
    }

    // Yaş
    let age = 15;
    if (window.birthdate) {
      const birth = new Date(window.birthdate);
      const today = new Date();
      age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    }
    setText("hero-age", age);
    const ageEl = document.getElementById("hero-age");
    if (ageEl) ageEl.dataset.text = String(age);
    setText("meta-age", age);
    setText("meta-host", window.host);
    setText("meta-domain", window.domain);
    setText("meta-location", window.locate);
    setText("nav-status-text", window.status_text);

    // About başlığı — \n desteği, son satır çerçeveli (outline)
    const headEl = document.getElementById("about-heading");
    if (headEl && window.about_heading) {
      const hp = window.about_heading.split("\\n");
      headEl.innerHTML = hp
        .map((p, i) => (i === hp.length - 1 ? `<em>${esc(p)}</em>` : esc(p)))
        .join("<br>");
    }
    setText("about-p1", window.about_p1);
    setText("about-p2", window.about_p2);

    // Footer
    const firstName = (window.name || "egemen").split(" ")[0];
    const footCopy = document.getElementById("footer-copy");
    if (footCopy)
      footCopy.textContent = `${firstName.toLowerCase()} © ${new Date().getFullYear()}`;
    setText("footer-host", window.host);
    setText("footer-domain", window.domain);
    const wm = document.getElementById("footer-wordmark");
    if (wm) {
      wm.textContent = firstName;
      wm.dataset.text = firstName;
      wm.setAttribute("lang", "tr");
    }

    if (window.name) document.title = `${window.name} — Portfolio`;
  }

  /* ══ RENDER: HEDEF ══════════════════════════ */
  function renderGoal() {
    goalSection = document.getElementById("goal");
    const q = document.getElementById("goal-quote");
    setText("goal-desc", window.goal_desc);
    if (!q) return;
    if (!window.goal_quote) {
      if (goalSection) goalSection.remove();
      goalSection = null;
      return;
    }
    const words = String(window.goal_quote).trim().split(/\s+/);
    q.setAttribute("aria-label", window.goal_quote);
    q.innerHTML = words
      .map((w) => `<span class="w" aria-hidden="true">${esc(w)}</span>`)
      .join("");
    goalWords = Array.from(q.querySelectorAll(".w"));
    if (reduceMotion) {
      goalSection.classList.add("static");
      goalWords.forEach((w) => w.classList.add("lit"));
    }
    updateGoal();
  }

  /* ══ RENDER: STATS ══════════════════════════ */
  function renderStats() {
    const pEl = document.getElementById("stat-projects");
    const lEl = document.getElementById("stat-langs");
    const yEl = document.getElementById("stat-year");
    if (pEl) pEl.dataset.count = window.active_projects ?? 0;
    if (lEl) lEl.dataset.count = window.languages_count ?? 0;
    if (yEl) yEl.dataset.count = window.year ?? new Date().getFullYear();
    document
      .querySelectorAll(".stat-num[data-count]")
      .forEach((el) => statObs.observe(el));
  }

  /* ══ RENDER: STACK ══════════════════════════ */
  const METER_CELLS = 20;

  function renderStack() {
    const langs = (window.languages || []).filter((l) => l.visible !== false);
    const tools = (window.stack_tools || []).filter((x) => x.visible !== false);
    const grid = document.getElementById("stack-grid");
    const badges = document.getElementById("tech-badges");

    if (grid) {
      const groups = [];
      for (let i = 0; i < langs.length; i += 3)
        groups.push(langs.slice(i, i + 3));

      grid.innerHTML = groups
        .map(
          (group, gi) => `
        <div class="stack-group">
          <div class="stack-group-title">${esc(t.groups[gi] || "Tools")}</div>
          <div class="stack-items">
            ${group
              .map((l) => {
                const lvl = clamp(Math.round(Number(l.level) || 0), 0, 100);
                const lit = Math.round((lvl / 100) * METER_CELLS);
                const logo = LANG_LOGOS[l.name];
                const logoHtml = logo
                  ? `<img class="logo-mono" src="${logo}" alt="" onerror="this.style.display='none'">`
                  : "";
                const cells = Array.from(
                  { length: METER_CELLS },
                  (_, k) => `<i class="${k < lit ? "on" : ""}" style="--i:${k}"></i>`,
                ).join("");
                return `
                <div class="stack-item">
                  <span class="stack-name">${logoHtml}${esc(l.name)}</span>
                  <span class="stack-level tnum">${lvl}%</span>
                  <div class="meter" role="img" aria-label="${esc(l.name)} ${lvl}%">${cells}</div>
                </div>`;
              })
              .join("")}
          </div>
        </div>`,
        )
        .join("");

      grid.querySelectorAll(".meter").forEach((m) => meterObs.observe(m));
    }

    const toolsWrap = document.getElementById("tools-wrap");
    if (badges) {
      if (!tools.length) {
        if (toolsWrap) toolsWrap.hidden = true;
      } else {
        badges.innerHTML = tools
          .map((tool) => {
            const logo = LANG_LOGOS[tool.name];
            const img = logo
              ? `<img src="${logo}" alt="" onerror="this.style.display='none'">`
              : "";
            return `<span class="badge">${img}${esc(tool.name)}</span>`;
          })
          .join("");
      }
    }
  }

  /* ══ RENDER: PROJELER (açılır defter) ═══════ */
  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    grid.innerHTML = (window.projects || [])
      .map((p, i) => {
        const open = i === 0;
        const hasGithub = p.github && p.github.trim() !== "";
        const tags = (p.tags || []).map((x) => `<span>${esc(x)}</span>`).join("");

        let statusLabel = t.status_done;
        let statusClass = "";
        if (p.status === "active") {
          statusLabel = t.status_active;
          statusClass = " active";
        } else if (p.status === "hold" || p.status === "on-hold" || p.status === "beklemede") {
          statusLabel = t.status_hold;
          statusClass = " hold";
        }

        const statusHtml = (cls) =>
          `<span class="ledger-status${statusClass}${cls}"><span class="dot"></span>${esc(statusLabel)}</span>`;
        const linkHtml = hasGithub
          ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" class="project-link">GitHub</a>`
          : "";

        return `
        <article class="ledger-row${open ? " open" : ""}">
          <button class="ledger-head" type="button" id="proj-head-${i}"
                  aria-expanded="${open}" aria-controls="proj-body-${i}">
            <span class="ledger-num">${esc(p.num)}</span>
            <span class="ledger-title">${esc(p.title)}</span>
            <span class="ledger-tags">${tags}</span>
            ${statusHtml("")}
            <span class="ledger-toggle" aria-hidden="true"></span>
          </button>
          <div class="ledger-body" id="proj-body-${i}" role="region" aria-labelledby="proj-head-${i}">
            <div class="ledger-body-inner">
              <div class="ledger-tags-inline">${tags}</div>
              <p>${esc(p.description)}</p>
              <div class="ledger-foot">${statusHtml("")}${linkHtml}</div>
            </div>
          </div>
        </article>`;
      })
      .join("");

    grid.addEventListener("click", (e) => {
      const head = e.target.closest(".ledger-head");
      if (!head) return;
      const row = head.parentElement;
      const willOpen = !row.classList.contains("open");
      grid.querySelectorAll(".ledger-row.open").forEach((r) => {
        r.classList.remove("open");
        r.querySelector(".ledger-head").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        row.classList.add("open");
        head.setAttribute("aria-expanded", "true");
      }
    });
  }

  /* ══ RENDER: TEDX ═══════════════════════════ */
  function renderTedx() {
    const linksEl = document.getElementById("tedx-links");
    if (!linksEl) return;

    const links = [
      { label: t.tedx_link_talk, url: "https://www.ted.com/talks/muhammed_egemen_geyik_inovasyon" },
      { label: t.tedx_link_yt,   url: "https://www.youtube.com/watch?v=BgNjGG_GllA" },
      { label: t.tedx_link_fb,   url: "https://www.facebook.com/adiyamanmem/posts/tedxin-en-k%C3%BC%C3%A7%C3%BCk-konu%C5%9Fmac%C4%B1s%C4%B1-muhammed-egemen-geyik-kendisinin-yapt%C4%B1%C4%9F%C4%B1-oyuncak-ara/150071992387567/" },
    ];

    linksEl.innerHTML = links
      .map((l) => `
      <a href="${esc(l.url)}" class="tedx-link" target="_blank" rel="noopener">
        <span class="contact-type">${esc(l.label)}</span>
        <i class="contact-mark" aria-hidden="true"></i>
      </a>`)
      .join("");
  }

  /* ══ RENDER: İLETİŞİM ═══════════════════════ */
  function renderContact() {    const c = window.contact || {};
    const linksEl = document.getElementById("contact-links");
    if (!linksEl) return;

    const links = [
      { type: "Email", val: c.email, href: c.email ? `mailto:${c.email}` : null },
      { type: "GitHub", val: c.github, href: c.github || null },
      { type: "Website", val: c.website, href: c.website || null },
    ].filter((l) => l.val && l.href);

    linksEl.innerHTML = links
      .map(
        (l) => `
      <a href="${esc(l.href)}" ${l.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} class="contact-link">
        <span class="contact-type">${esc(l.type)}</span>
        <span class="contact-val">${esc(l.val)}</span>
        <i class="contact-mark" aria-hidden="true"></i>
      </a>`,
      )
      .join("");
  }

  /* ══ İLETİŞİM FORMU ═════════════════════════ */
  function initContactForm() {
    const submitBtn = document.getElementById("form-submit");
    const feedback = document.getElementById("form-feedback");
    if (!submitBtn) return;

    function showFeedback(msg, type) {
      if (!feedback) return;
      feedback.textContent = msg;
      feedback.dataset.type = type;
    }

    submitBtn.addEventListener("click", async () => {
      const name = document.getElementById("form-name")?.value.trim();
      const email = document.getElementById("form-email")?.value.trim();
      const message = document.getElementById("form-message")?.value.trim();

      if (!name || !email || !message) {
        showFeedback(t.form_err_empty, "error");
        return;
      }
      const limit = window.message_limit;
      if (limit && message.length > limit) {
        showFeedback(t.form_err_long.replace("{n}", limit), "error");
        return;
      }

      const span =
        submitBtn.querySelector("span[data-i18n]") ||
        submitBtn.querySelector("span");
      const origText = span ? span.textContent : t.form_send;
      submitBtn.disabled = true;
      if (span) span.textContent = t.form_sending;

      const result = await window.sendMessage({ name, email, message });

      if (result && result.ok) {
        showFeedback(t.form_ok, "success");
        document.getElementById("form-name").value = "";
        document.getElementById("form-email").value = "";
        document.getElementById("form-message").value = "";
      } else {
        showFeedback(t.form_fail, "error");
      }

      submitBtn.disabled = false;
      if (span) span.textContent = origText;
    });
  }

  /* ══ HERO ETİKETİ ───────────────────────────
     window.title backend'den gelir (main.js set eder).
  ═══════════════════════════════════════════ */
  function renderHeroTag() {
    const heroTag = document.getElementById("hero-tag");
    if (!heroTag) return;
    const text = window.title
      ? `[ ${window.title} ]`
      : "[ Software Developer · AI Builder · System Explorer ]";
    typeText(heroTag, text);
  }

  /* ══ MAIN INIT ══════════════════════════════ */
  function init() {
    ensureMandatoryUI();
    applyStaticTranslations();
    initSmoothScroll();

    renderMeta();
    renderStats();
    renderStack();
    renderProjects();
    renderTedx();
    renderContact();
    renderGoal();
    renderHeroTag();
    initContactForm();

    initScroll();
    initClock();
    fitWordmark();
    initHeat();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
