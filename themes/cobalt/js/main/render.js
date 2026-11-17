/* ─────────────────────────────────────────────────────────────
   COBALT — Portfolio Frontend Engine & Telemetry Renderer
   Integrates with portfolio shared API, i18n, stats and real-time backend.
───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /* ══ I18N DICTIONARY ════════════════════════════ */
  const T = {
    tr: {
      nav_about: "Hakkımda",
      nav_stack: "Stack",
      nav_projects: "Projeler",
      nav_tedx: "TEDx",
      section_tedx: "06 / TEDx",
      tedx_title: "TEDx Konuşması",
      tedx_desc: "Muhammed Egemen Geyik'in TEDx sahnesinde yaptığı \"İnovasyon\" başlıklı konuşma.",
      tedx_link_talk: "TEDx Konuşması",
      tedx_link_yt: "YouTube",
      tedx_link_fb: "Facebook Paylaşımı",

      nav_contact: "İletişim",
      hero_age_suffix: "yaşında",
      hero_age_label: "SYS_AGE",
      hero_cta: "Projelere Bak",
      section_about: "01 / Hakkımda",
      section_stack: "02 / Teknoloji Stack",
      stack_title: "Araçlarım",
      section_projects: "03 / Projeler",
      projects_title: "Ne İnşa Ettim",
      section_goal: "04 / Hedef",
      section_contact: "05 / İletişim",
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
      form_ok: "✓ Mesaj iletildi, bağlantı sağlandı!",
      form_fail: "Bağlantı hatası oluştu, lütfen tekrar dene.",
      lang_flag: "🇬🇧",
      lang_title: "Switch to English",
    },
    en: {
      nav_about: "About",
      nav_stack: "Stack",
      nav_projects: "Projects",
      nav_tedx: "TEDx",
      section_tedx: "06 / TEDx",
      tedx_title: "TEDx Talk",
      tedx_desc: "Muhammed Egemen Geyik's speech titled \"Innovation\" on the TEDx stage.",
      tedx_link_talk: "TEDx Talk",
      tedx_link_yt: "YouTube",
      tedx_link_fb: "Facebook Post",

      nav_contact: "Contact",
      hero_age_suffix: "years old",
      hero_age_label: "SYS_AGE",
      hero_cta: "View Projects",
      section_about: "01 / About",
      section_stack: "02 / Tech Stack",
      stack_title: "My Tools",
      section_projects: "03 / Projects",
      projects_title: "What I've Built",
      section_goal: "04 / Goal",
      section_contact: "05 / Contact",
      contact_heading: "Let's build something<br><em>together.</em>",
      form_title: "Direct Uplink",
      form_name: "Full Name",
      form_email: "Email Address",
      form_message: "Message",
      form_send: "Transmit",
      form_name_ph: "Your name",
      form_email_ph: "email@example.com",
      form_message_ph: "Hi Egemen...",
      stat_projects: "Active Projects",
      stat_langs: "Languages",
      stat_year: "Year",
      status_active: "Active Build",
      status_hold: "On Hold",
      status_done: "Deployed",
      form_err_empty: "Please fill in all telemetry fields.",
      form_err_long: "Message payload too long. Max {n} chars.",
      form_sending: "Transmitting...",
      form_ok: "✓ Uplink established, message received!",
      form_fail: "Transmission error, please retry.",
      lang_flag: "🇹🇷",
      lang_title: "Türkçeye geç",
    },
  };

  const lang = (window.Lang && typeof window.Lang.get === "function") ? window.Lang.get() : "tr";
  const t = T[lang] || T["tr"];

  window.addEventListener("langChanged", () => {
    location.reload();
  });

  /* ══ DEV ICONS MAP ══════════════════════════ */
  const LANG_LOGOS = {
    JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    Rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
    Go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    Kotlin: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
    Swift: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
    "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg",
    Ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
    Dart: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
    Lua: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg",
    Shell: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
  };

  /* ══ HELPER UTILS ════════════════════════════ */
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el && val != null) el.textContent = val;
  }

  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ══ MANDATORY UI COMPLIANCE ═════════════════ */
  function ensureMandatoryUI() {
    if (!document.getElementById("lang-toggle")) {
      const btn = document.createElement("button");
      btn.id = "lang-toggle";
      btn.className = "lang-toggle";
      btn.setAttribute("aria-label", "Switch language");
      btn.title = "Switch language";
      btn.style.cssText =
        "position:fixed;right:20px;bottom:20px;z-index:9999;padding:10px 14px;border:1px solid #142442;border-radius:8px;background:#070e1c;color:#fff;cursor:pointer;";
      document.body.appendChild(btn);
    }
  }

  /* ══ STATIC I18N BINDING ═════════════════════ */
  function applyStaticTranslations() {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (t[key] !== undefined) {
        if (key === "contact_heading") {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    const btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.textContent = t.lang_flag;
      btn.title = t.lang_title;
      btn.addEventListener("click", () => {
        if (window.Lang && typeof window.Lang.toggle === "function") {
          window.Lang.toggle();
        }
      });
    }
  }

  

  /* ══ NEON SCROLL PROGRESS ════════════════════ */
  function initScrollProgress() {
    const bar = document.createElement("div");
    bar.style.cssText =
      "position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#2563eb,#38bdf8);box-shadow:0 0 10px #38bdf8;z-index:9999;width:0%;transition:width .15s ease;pointer-events:none;";
    document.body.appendChild(bar);

    window.addEventListener(
      "scroll",
      () => {
        const docH = document.body.scrollHeight - innerHeight;
        const pct = docH > 0 ? (scrollY / docH) * 100 : 0;
        bar.style.width = pct + "%";
      },
      { passive: true }
    );
  }

  /* ══ NAVIGATION DYNAMICS ═════════════════════ */
  function initNav() {
    const nav = document.getElementById("nav");
    if (!nav) return;

    window.addEventListener(
      "scroll",
      () => nav.classList.toggle("scrolled", scrollY > 40),
      { passive: true }
    );

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener(
      "scroll",
      () => {
        let current = "";
        sections.forEach((s) => {
          if (scrollY >= s.offsetTop - 120) current = s.id;
        });
        navLinks.forEach((l) => {
          const match = l.getAttribute("href") === `#${current}`;
          l.style.color = match ? "var(--cyan)" : "";
        });
      },
      { passive: true }
    );
  }

  /* ══ INTERSECTION REVEAL ═════════════════════ */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  function observeReveal() {
    document.querySelectorAll(".reveal:not(.observed)").forEach((el) => {
      el.classList.add("observed");
      revealObs.observe(el);
    });
  }

  /* ══ COUNTER TELEMETRY ANIMATION ═════════════ */
  function animateCount(el, target, duration = 1400) {
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString(
        lang === "en" ? "en-US" : "tr"
      );
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  const statObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target, parseInt(e.target.dataset.count) || 0);
          statObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  function observeStats() {
    document.querySelectorAll(".stat-value[data-count]").forEach((el) => statObs.observe(el));
  }

  /* ══ STACK BARS ANIMATION ════════════════════ */
  const stackObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("animated");
          stackObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  function observeStackBars() {
    document.querySelectorAll(".stack-fill").forEach((el) => stackObs.observe(el));
  }

  /* ══ 3D PROJECT TILT ═════════════════════════ */
  function attachTilt(card) {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(850px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform .5s cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.transform = "";
      setTimeout(() => {
        card.style.transition = "";
      }, 500);
    });
  }

  /* ══ PARALLAX RADIAL BEAMS ═══════════════════ */
  function initParallax() {
    const beam1 = document.querySelector(".radial-beam-1");
    const beam2 = document.querySelector(".radial-beam-2");
    document.addEventListener(
      "mousemove",
      (e) => {
        const x = (e.clientX / innerWidth - 0.5) * 40;
        const y = (e.clientY / innerHeight - 0.5) * 40;
        if (beam1) beam1.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
        if (beam2) beam2.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
      },
      { passive: true }
    );
  }

  /* ══ TYPEWRITER EFFECT ═══════════════════════ */
  function typeText(el, text, speed = 30, delay = 350) {
    el.textContent = "";
    let i = 0;
    setTimeout(() => {
      const timer = setInterval(() => {
        el.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(timer);
      }, speed);
    }, delay);
  }

  /* ══ RENDER: META ════════════════════════════ */
  function renderMeta() {
    const nameEl = document.getElementById("hero-name");
    if (nameEl) nameEl.textContent = window.name || "Egemen Geyik";

    // Age calculation
    let age = 15;
    if (window.birthdate) {
      const birth = new Date(window.birthdate);
      const today = new Date();
      age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    }
    setText("hero-age", age);
    setText("meta-age", age);
    setText("meta-host", window.host || "vercel");
    setText("meta-domain", window.domain || "egemen.is-a.dev");
    setText("meta-location", window.locate || "Adıyaman, TR");
    setText("nav-status-text", window.status_text || "ONLINE");
    setText("hero-sub", window.sub_title || "");

    // About heading
    const headEl = document.getElementById("about-heading");
    if (headEl && window.about_heading) {
      const parts = window.about_heading.split("\\n");
      headEl.innerHTML = parts
        .map((p, i) => (i === parts.length - 1 ? `<em>${esc(p)}</em>` : esc(p)))
        .join("<br>");
    }
    setText("about-p1", window.about_p1 || "");
    setText("about-p2", window.about_p2 || "");

    // Goal
    const goalQ = document.getElementById("goal-quote");
    if (goalQ && window.goal_quote) {
      goalQ.textContent = `"${window.goal_quote}"`;
    }
    setText("goal-desc", window.goal_desc || "");

    // Footer
    const footCopy = document.getElementById("footer-copy");
    if (footCopy) {
      const firstName = (window.name || "Egemen").split(" ")[0].toUpperCase();
      footCopy.textContent = `${firstName} // COBALT ARCHITECTURE © ${new Date().getFullYear()}`;
    }
    setText("footer-host", window.host || "VERCEL");
    setText("footer-domain", window.domain || "EGEMEN.IS-A.DEV");

    if (window.name) document.title = `${window.name} — Cobalt`;
  }

  /* ══ RENDER: HERO TAG ════════════════════════ */
  function renderHeroTag() {
    const heroTag = document.getElementById("hero-tag");
    if (!heroTag) return;
    const text = window.title
      ? `// ${window.title}`
      : "// SOFTWARE ARCHITECT · INNOVATOR · SYSTEM DESIGNER";
    typeText(heroTag, text);
  }

  /* ══ RENDER: STATS ═══════════════════════════ */
  function renderStats() {
    const pEl = document.getElementById("stat-projects");
    const lEl = document.getElementById("stat-langs");
    const yEl = document.getElementById("stat-year");
    if (pEl) pEl.dataset.count = window.active_projects ?? 0;
    if (lEl) lEl.dataset.count = window.languages_count ?? 0;
    if (yEl) yEl.dataset.count = window.year ?? new Date().getFullYear();
    observeStats();
  }

  /* ══ RENDER: STACK ═══════════════════════════ */
  function renderStack() {
    const langs = (window.languages || []).filter((l) => l.visible !== false);
    const tools = (window.stack_tools || []).filter((t) => t.visible !== false);
    const grid = document.getElementById("stack-grid");
    const badges = document.getElementById("tech-badges");

    const groupNames =
      lang === "en"
        ? ["Core Languages", "Frameworks & Engine", "Specializations"]
        : ["Temel Diller", "Framework & Altyapı", "Uzmanlık Alanları"];

    if (grid) {
      const groups = [];
      for (let i = 0; i < langs.length; i += 3) {
        groups.push(langs.slice(i, i + 3));
      }
      grid.innerHTML = groups
        .map(
          (group, gi) => `
        <div class="stack-group reveal">
          <div class="stack-group-title">${groupNames[gi] || "Capabilities"}</div>
          <div class="stack-items">
            ${group
              .map((l) => {
                const logo = l.icon || LANG_LOGOS[l.name];
                const logoHtml = logo
                  ? `<img src="${logo}" alt="${esc(l.name)}"
                         onerror="this.style.display='none'"
                         style="width:17px;height:17px;object-fit:contain;vertical-align:middle;margin-right:8px;">`
                  : "";
                return `
                <div class="stack-item">
                  <div class="stack-header-line">
                    <span class="stack-name">${logoHtml}${esc(l.name)}</span>
                    <span class="stack-val-pct">${l.level}%</span>
                  </div>
                  <div class="stack-bar">
                    <div class="stack-fill" style="--target:${l.level}%"></div>
                  </div>
                </div>`;
              })
              .join("")}
          </div>
        </div>`
        )
        .join("");
    }

    if (badges) {
      const all = [...langs, ...tools];
      badges.innerHTML = all
        .map((item) => {
          const logo = item.icon || LANG_LOGOS[item.name];
          const img = logo
            ? `<img src="${logo}" alt="${esc(item.name)}"
                   style="width:14px;height:14px;object-fit:contain;vertical-align:middle;margin-right:6px;"
                   onerror="this.style.display='none'">`
            : "";
          return `<span class="badge">${img}${esc(item.name)}</span>`;
        })
        .join("");
    }

    observeReveal();
    observeStackBars();
  }

  /* ══ RENDER: PROJECTS ════════════════════════ */
  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    grid.innerHTML = (window.projects || [])
      .map((p, idx) => {
        const hasGithub = p.github && p.github.trim() !== "";
        const linkHtml = hasGithub ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" class="project-link" aria-label="GitHub Repository">
              <svg class="project-link-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              <span>GitHub</span>
              <svg class="project-link-arrow" width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>` : `<span style="font-size:.72rem;color:var(--text-dim)">PROPRIETARY // ARCHIVE</span>`;

        let statusLabel = t.status_done;
        let statusClass = "";
        if (p.status === "active") {
          statusLabel = t.status_active;
          statusClass = "active";
        } else if (p.status === "hold" || p.status === "on-hold") {
          statusLabel = t.status_hold;
          statusClass = "hold";
        }
        const num = String(idx + 1).padStart(2, "0");

        return `
        <div class="project-card reveal">
          <div class="project-header">
            <div class="project-num">${esc(p.num || num)}</div>
            <div class="project-tags">
              ${(p.tags || []).map((tag) => `<span>${esc(tag)}</span>`).join("")}
            </div>
          </div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
          <div class="project-footer">
            <div class="project-status ${statusClass}">
              <span class="dot"></span>
              <span>${statusLabel}</span>
            </div>
            ${linkHtml}
          </div>
        </div>`;
      })
      .join("");

    grid.querySelectorAll(".project-card").forEach(attachTilt);
    observeReveal();
  }

  /* ══ RENDER: TEDX ════════════════════════════ */
  function renderTedx() {
    const linksEl = document.getElementById("tedx-links");
    if (!linksEl) return;

    const links = [
      { label: t.tedx_link_talk, url: "https://www.ted.com/talks/muhammed_egemen_geyik_inovasyon" },
      { label: t.tedx_link_yt, url: "https://www.youtube.com/watch?v=BgNjGG_GllA" },
      { label: t.tedx_link_fb, url: "https://www.facebook.com/adiyamanmem/posts/tedxin-en-k%C3%BC%C3%A7%C3%BCk-konu%C5%9Fmac%C4%B1s%C4%B1-muhammed-egemen-geyik-kendisinin-yapt%C4%B1%C4%9F%C4%B1-oyuncak-ara/150071992387567/" },
    ];

    linksEl.innerHTML = links
      .map(
        (l) => `
      <a href="${esc(l.url)}" class="tedx-link" target="_blank" rel="noopener">
        <span>${esc(l.label)}</span>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>`
      )
      .join("");
  }

  /* ══ RENDER: CONTACT ═════════════════════════ */
  function renderContact() {
    const c = window.contact || {};
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
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>`
      )
      .join("");
  }

  /* ══ CONTACT FORM UPLINK ═════════════════════ */
  function initContactForm() {
    const submitBtn = document.getElementById("form-submit");
    const feedback = document.getElementById("form-feedback");
    if (!submitBtn) return;

    function showFeedback(msg, type) {
      if (!feedback) return;
      feedback.textContent = msg;
      feedback.style.color = type === "error" ? "#f43f5e" : "#38bdf8";
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

      const span = submitBtn.querySelector("span[data-i18n]") || submitBtn.querySelector("span");
      const origText = span ? span.textContent : t.form_send;
      submitBtn.disabled = true;
      if (span) span.textContent = t.form_sending;

      try {
        const result = (typeof window.sendMessage === "function")
          ? await window.sendMessage({ name, email, message })
          : { ok: true };

        if (result && result.ok) {
          showFeedback(t.form_ok, "success");
          document.getElementById("form-name").value = "";
          document.getElementById("form-email").value = "";
          document.getElementById("form-message").value = "";
        } else {
          showFeedback(t.form_fail, "error");
        }
      } catch {
        showFeedback(t.form_fail, "error");
      }

      submitBtn.disabled = false;
      if (span) span.textContent = origText;
    });
  }

  /* ══ SYSTEM INIT ═════════════════════════════ */
    /* ══ SMOOTH SCROLL ══════════════════════════ */
  function initSmoothScroll() {
    document.addEventListener("click", (e) => {
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
    });
  }

function init() {
    initSmoothScroll();
    ensureMandatoryUI();
    applyStaticTranslations();
    initScrollProgress();
    initNav();
    initParallax();

    renderMeta();
    renderHeroTag();
    renderStats();
    renderStack();
    renderProjects();
    renderTedx();
    renderContact();
    initContactForm();
    observeReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

