/* ─────────────────────────────────────────────
   RENDER.JS — Portfolio Frontend Renderer
   i18n: window._lang ("tr" | "en") üzerinden çalışır.
   Statik UI metinleri [data-i18n] nitelikleriyle HTML'de tanımlıdır.
   Dinamik metinler (proje durumu, form geri bildirimi) burada çevrilir.
───────────────────────────────────────────── */
(function () {
  "use strict";

  /* ══ I18N SÖZLÜK ════════════════════════════ */
  const T = {
    tr: {
      nav_about: "Hakkımda",
      nav_stack: "Stack",
      nav_projects: "Projeler",
      nav_contact: "İletişim",
      hero_age_suffix: "yaşında",
      hero_age_label: "YAŞ",
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
      status_done: "Tamamlandı",
      form_err_empty: "Lütfen tüm alanları doldur.",
      form_err_long: "Mesaj çok uzun. Maksimum {n} karakter.",
      form_sending: "Gönderiliyor...",
      form_ok: "✓ Mesajın alındı, teşekkürler!",
      form_fail: "Bir hata oluştu, tekrar dene.",
      // Bayrak: mevcut dil TR ise EN bayrağı göster (geçiş için)
      lang_flag: "🇬🇧",
      lang_title: "Switch to English",
    },
    en: {
      nav_about: "About",
      nav_stack: "Stack",
      nav_projects: "Projects",
      nav_contact: "Contact",
      hero_age_suffix: "years old",
      hero_age_label: "AGE",
      hero_cta: "View Projects",
      section_about: "01 / About",
      section_stack: "02 / Tech Stack",
      stack_title: "My Tools",
      section_projects: "03 / Projects",
      projects_title: "What I've Built",
      section_goal: "04 / Goal",
      section_contact: "05 / Contact",
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
      status_done: "Completed",
      form_err_empty: "Please fill in all fields.",
      form_err_long: "Message too long. Maximum {n} characters.",
      form_sending: "Sending...",
      form_ok: "✓ Message received, thank you!",
      form_fail: "An error occurred, please try again.",
      lang_flag: "🇹🇷",
      lang_title: "Türkçeye geç",
    },
  };

  const lang = window.Lang.get();
  const t = T[lang] || T["tr"];

  window.addEventListener("langChanged", () => {
    location.reload(); // veya sadece applyStaticTranslations()
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

  /* ══ STATIK METINLERI UYGULA ════════════════
     data-i18n niteliği olan tüm elementleri doldur.
     Yeni host eklendiğinde sadece HTML'e data-i18n="anahtar"
     eklemek yeterlidir — JS değişmez.
  ═══════════════════════════════════════════ */
  function applyStaticTranslations() {
    // html lang niteliği
    document.documentElement.lang = lang;

    // data-i18n → textContent (innerHTML gerekiyorsa data-i18n-html)
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (t[key] !== undefined) {
        if (key === "contact_heading") {
          el.innerHTML = t[key]; // <em> içerir
        } else {
          el.textContent = t[key];
        }
      }
    });

    // data-i18n-placeholder → placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Dil bayrak butonu
    const btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.textContent = t.lang_flag;
      btn.title = t.lang_title;
      btn.addEventListener("click", () => window.Lang.toggle());
    }
  }

  /* ══ MANDATORY UI GUARANTEE ════════════════ */
  function ensureMandatoryUI() {
    // Dil butonu temada yoksa sabit fallback olarak ekle
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

    // İletişim alanı temada kaldırılmışsa minimal fallback oluştur
    if (!document.getElementById("contact")) {
      const section = document.createElement("section");
      section.id = "contact";
      section.className = "section-contact";
      section.style.cssText = "padding:32px 20px;";
      section.innerHTML = `
        <div class="section-label" data-i18n="section_contact">05 / İletişim</div>
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

  /* ══ CUSTOM CURSOR ══════════════════════════ */
  function initCursor() {
    const cursor = document.createElement("div");
    const cursorRing = document.createElement("div");
    cursor.className = "cursor";
    cursorRing.className = "cursor-ring";
    document.body.append(cursor, cursorRing);

    let mouseX = 0,
      mouseY = 0,
      ringX = 0,
      ringY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    (function animateCursor() {
      ringX += (mouseX - ringX - 18) * 0.12;
      ringY += (mouseY - ringY - 18) * 0.12;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateCursor);
    })();

    const hoverTargets =
      "a,button,.card,.project-card,.badge,.stack-item,.contact-link,.form-submit,.lang-toggle";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.add("hover");
        cursorRing.classList.add("hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.remove("hover");
        cursorRing.classList.remove("hover");
      }
    });
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = 0;
      cursorRing.style.opacity = 0;
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = 1;
      cursorRing.style.opacity = 1;
    });
  }

  /* ══ SCROLL PROGRESS ════════════════════════ */
  function initScrollProgress() {
    const bar = document.createElement("div");
    bar.style.cssText =
      "position:fixed;top:0;left:0;height:2px;background:#c8ff00;z-index:9999;width:0;transition:width .2s ease;pointer-events:none;";
    document.body.appendChild(bar);
    addEventListener(
      "scroll",
      () => {
        const pct =
          document.body.scrollHeight - innerHeight > 0
            ? (scrollY / (document.body.scrollHeight - innerHeight)) * 100
            : 0;
        bar.style.width = pct + "%";
      },
      { passive: true },
    );
  }

  /* ══ NAV ════════════════════════════════════ */
  function initNav() {
    const nav = document.getElementById("nav");
    if (!nav) return;
    addEventListener(
      "scroll",
      () => nav.classList.toggle("scrolled", scrollY > 60),
      { passive: true },
    );

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");
    addEventListener(
      "scroll",
      () => {
        let current = "";
        sections.forEach((s) => {
          if (scrollY >= s.offsetTop - 100) current = s.id;
        });
        navLinks.forEach((l) => {
          l.style.color =
            l.getAttribute("href") === `#${current}` ? "#e8e8e8" : "";
        });
      },
      { passive: true },
    );
  }

  /* ══ SMOOTH SCROLL ══════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const t = document.querySelector(link.getAttribute("href"));
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  /* ══ SCROLL REVEAL ══════════════════════════ */
  const revealObs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );

  function observeReveal() {
    document.querySelectorAll(".reveal:not(.observed)").forEach((el) => {
      el.classList.add("observed");
      revealObs.observe(el);
    });
  }

  /* ══ COUNTER ANIMATION ══════════════════════ */
  function animateCount(el, target, duration = 1500) {
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString(
        lang === "en" ? "en-US" : "tr",
      );
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  const statObs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target, parseInt(e.target.dataset.count));
          statObs.unobserve(e.target);
        }
      }),
    { threshold: 0.5 },
  );

  function observeStats() {
    document
      .querySelectorAll(".stat-num[data-count]")
      .forEach((el) => statObs.observe(el));
  }

  /* ══ STACK BAR ANIMATION ════════════════════ */
  const stackObs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("animated");
          stackObs.unobserve(e.target);
        }
      }),
    { threshold: 0.3 },
  );

  function observeStackBars() {
    document
      .querySelectorAll(".stack-fill")
      .forEach((el) => stackObs.observe(el));
  }

  /* ══ PARALLAX ═══════════════════════════════ */
  function initParallax() {
    const glow1 = document.querySelector(".glow-1");
    const glow2 = document.querySelector(".glow-2");
    document.addEventListener(
      "mousemove",
      (e) => {
        const x = (e.clientX / innerWidth - 0.5) * 30;
        const y = (e.clientY / innerHeight - 0.5) * 30;
        if (glow1)
          glow1.style.transform = `translate(${x * 0.5}px,${y * 0.5}px)`;
        if (glow2)
          glow2.style.transform = `translate(${-x * 0.3}px,${-y * 0.3}px)`;
      },
      { passive: true },
    );
  }

  /* ══ PROJECT TILT ═══════════════════════════ */
  function attachTilt(card) {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform .5s ease";
      card.style.transform = "";
      setTimeout(() => {
        card.style.transition = "";
      }, 500);
    });
  }

  /* ══ TYPING EFFECT ══════════════════════════ */
  function typeText(el, text, speed = 35, delay = 400) {
    el.textContent = "";
    let i = 0;
    setTimeout(() => {
      const timer = setInterval(() => {
        el.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(timer);
      }, speed);
    }, delay);
  }

  /* ══ RENDER: META ═══════════════════════════ */
  function renderMeta() {
    const nameEl = document.getElementById("hero-name");
    if (nameEl) nameEl.textContent = window.name || "Egemen Geyik";

    // Yaş hesapla
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
    setText("meta-host", window.host);
    setText("meta-domain", window.domain);
    setText("meta-location", window.locate);
    setText("nav-status-text", window.status_text);

    // About heading — \n desteği
    const headEl = document.getElementById("about-heading");
    if (headEl && window.about_heading) {
      const parts = window.about_heading.split("\\n");
      headEl.innerHTML = parts
        .map((p, i) => (i === parts.length - 1 ? `<em>${esc(p)}</em>` : esc(p)))
        .join("<br>");
    }
    setText("about-p1", window.about_p1);
    setText("about-p2", window.about_p2);

    // Goal
    const goalQ = document.getElementById("goal-quote");
    if (goalQ && window.goal_quote)
      goalQ.textContent = `"${window.goal_quote}"`;
    setText("goal-desc", window.goal_desc);

    // Footer
    const footCopy = document.getElementById("footer-copy");
    if (footCopy) {
      const firstName = (window.name || "egemen").split(" ")[0].toLowerCase();
      footCopy.textContent = `${firstName} © ${new Date().getFullYear()}`;
    }
    setText("footer-host", window.host);
    setText("footer-domain", window.domain);

    // Title tag
    if (window.name) document.title = `${window.name} — Portfolio`;
  }

  /* ══ RENDER: STATS ══════════════════════════ */
  function renderStats() {
    const pEl = document.getElementById("stat-projects");
    const lEl = document.getElementById("stat-langs");
    const yEl = document.getElementById("stat-year");
    if (pEl) pEl.dataset.count = window.active_projects ?? 0;
    if (lEl) lEl.dataset.count = window.languages_count ?? 0;
    if (yEl) yEl.dataset.count = window.year ?? new Date().getFullYear();
    observeStats();
  }

  /* ══ RENDER: STACK ══════════════════════════ */
  function renderStack() {
    const langs = (window.languages || []).filter((l) => l.visible !== false);
    const tools = (window.stack_tools || []).filter((t) => t.visible !== false);
    const grid = document.getElementById("stack-grid");
    const badges = document.getElementById("tech-badges");

    const groupNames =
      lang === "en"
        ? ["Languages", "Libraries & Frameworks", "Specializations"]
        : ["Diller", "Kütüphane & Framework", "Uzmanlıklar"];

    if (grid) {
      const groups = [];
      for (let i = 0; i < langs.length; i += 3)
        groups.push(langs.slice(i, i + 3));
      grid.innerHTML = groups
        .map(
          (group, gi) => `
        <div class="stack-group reveal">
          <div class="stack-group-title">${groupNames[gi] || "Tools"}</div>
          <div class="stack-items">
            ${group
              .map((l) => {
                const logo = LANG_LOGOS[l.name];
                const logoHtml = logo
                  ? `<img class="stack-lang-logo" src="${logo}" alt="${esc(l.name)}"
                       onerror="this.style.display='none'"
                       style="width:18px;height:18px;object-fit:contain;vertical-align:middle;margin-right:8px;">`
                  : "";
                return `
                <div class="stack-item">
                  <span class="stack-name">${logoHtml}${esc(l.name)}</span>
                  <div class="stack-bar"><div class="stack-fill" style="--target:${l.level}%"></div></div>
                </div>`;
              })
              .join("")}
          </div>
        </div>`,
        )
        .join("");
    }

    if (badges) {
      const all = [...langs.map((l) => l.name), ...tools.map((t) => t.name)];
      badges.innerHTML = all
        .map((name) => {
          const logo = LANG_LOGOS[name];
          const img = logo
            ? `<img src="${logo}" alt="${esc(name)}"
                 style="width:14px;height:14px;object-fit:contain;vertical-align:middle;margin-right:5px;"
                 onerror="this.style.display='none'">`
            : "";
          return `<span class="badge">${img}${esc(name)}</span>`;
        })
        .join("");
    }

    observeReveal();
    observeStackBars();
  }

  /* ══ RENDER: PROJECTS ═══════════════════════ */
  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    grid.innerHTML = (window.projects || [])
      .map((p) => {
        const hasGithub = p.github && p.github.trim() !== "";
        const linkHtml = hasGithub
          ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" class="project-link">GitHub →</a>`
          : `<span class="project-link-none" style="font-size:.75rem;color:var(--text-dim)">—</span>`;
        const statusLabel =
          p.status === "active" ? t.status_active : t.status_done;

        return `
        <div class="project-card reveal">
          <div class="project-header">
            <div class="project-num">${esc(p.num)}</div>
            <div class="project-tags">
              ${(p.tags || []).map((tag) => `<span>${esc(tag)}</span>`).join("")}
            </div>
          </div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
          <div class="project-footer">
            <div class="project-status ${p.status === "active" ? "active" : ""}">
              <span class="dot"></span>${statusLabel}
            </div>
            ${linkHtml}
          </div>
        </div>`;
      })
      .join("");

    grid.querySelectorAll(".project-card").forEach(attachTilt);
    observeReveal();
  }

  /* ══ RENDER: CONTACT ════════════════════════ */
  function renderContact() {
    const c = window.contact || {};
    const linksEl = document.getElementById("contact-links");
    if (!linksEl) return;

    const links = [
      {
        type: "Email",
        val: c.email,
        href: c.email ? `mailto:${c.email}` : null,
      },
      { type: "GitHub", val: c.github, href: c.github || null },
      { type: "Website", val: c.website, href: c.website || null },
    ].filter((l) => l.val && l.href);

    linksEl.innerHTML = links
      .map(
        (l) => `
      <a href="${esc(l.href)}" ${l.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} class="contact-link">
        <span class="contact-type">${esc(l.type)}</span>
        <span class="contact-val">${esc(l.val)}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>`,
      )
      .join("");
  }



  /* ══ CONTACT FORM ═══════════════════════════ */
  function initContactForm() {
    const submitBtn = document.getElementById("form-submit");
    const feedback = document.getElementById("form-feedback");
    if (!submitBtn) return;

    function showFeedback(msg, type) {
      if (!feedback) return;
      feedback.textContent = msg;
      feedback.style.color = type === "error" ? "#ff4444" : "#22c55e";
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

  /* ══ HERO TAG ───────────────────────────────
     hero-tag içeriği window.title'dan alınır (backend'den gelir).
     main.js bunu window.title'a set eder.
  ═══════════════════════════════════════════ */
  function renderHeroTag() {
    const heroTag = document.getElementById("hero-tag");
    if (!heroTag) return;
    const text = window.title
      ? `[ ${window.title} ]`
      : "[ Software Developer · AI Builder · System Explorer ]";
    heroTag.textContent = "";
    typeText(heroTag, text);
  }

  /* ══ MAIN INIT ══════════════════════════════ */
  function init() {
    ensureMandatoryUI();
    applyStaticTranslations();
    initCursor();
    initScrollProgress();
    initNav();
    initSmoothScroll();
    initParallax();

    renderMeta();
    renderStats();
    renderStack();
    renderProjects();
    renderContact();
    renderHeroTag();
    initContactForm();
    observeReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
