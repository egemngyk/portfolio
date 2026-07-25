/* ─────────────────────────────────────────────
   TERMINAL THEME — panel.js
   Boot screen animation + Matrix canvas
─────────────────────────────────────────────── */
(function () {
  "use strict";

  /* ── MATRIX CANVAS ── */
  function initMatrix() {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, cols, drops;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cols = Math.floor(W / 16);
      drops = Array(cols).fill(1);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]|\\".split("");

    function draw() {
      ctx.fillStyle = "rgba(12,15,12,0.05)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#00ff41";
      ctx.font = "14px 'JetBrains Mono', monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 16, drops[i] * 16);
        if (drops[i] * 16 > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }

    setInterval(draw, 60);
  }

  /* ── BOOT SCREEN ── */
  function initBoot() {
    const screen = document.getElementById("boot-screen");
    const wrap = document.getElementById("main-wrap");
    if (!screen || !wrap) return;

    const lines = [0, 1, 2, 3, 4];
    let delay = 0;

    lines.forEach((i) => {
      delay += i === 0 ? 100 : 400 + Math.random() * 200;
      setTimeout(() => {
        const el = document.getElementById(`boot-${i}`);
        if (el) el.classList.add("show");
      }, delay);
    });

    setTimeout(() => {
      screen.classList.add("hide");
      wrap.style.transition = "opacity 0.5s ease";
      wrap.style.opacity = "1";
      setTimeout(() => screen.remove(), 600);
    }, delay + 800);
  }

  /* ── TERMINAL JSON RENDER ── */
  function renderTermJson() {
    const el = document.getElementById("term-json-out");
    if (!el) return;

    // Wait for window vars to be set by main.js/render.js
    function tryRender() {
      if (!window.name && !window.host) {
        setTimeout(tryRender, 100);
        return;
      }
      const age = window.birthdate
        ? (() => {
            const b = new Date(window.birthdate);
            const t = new Date();
            let a = t.getFullYear() - b.getFullYear();
            if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
            return a;
          })()
        : 15;

      el.innerHTML = `<span style="color:rgba(0,255,65,0.4)">{</span>
  <span style="color:#ffa800">"name"</span>: <span style="color:#80ffb4">"${window.name || ""}"</span>,
  <span style="color:#ffa800">"age"</span>: <span style="color:#64b5f6">${age}</span>,
  <span style="color:#ffa800">"host"</span>: <span style="color:#80ffb4">"${window.host || ""}"</span>,
  <span style="color:#ffa800">"location"</span>: <span style="color:#80ffb4">"${window.locate || ""}"</span>,
  <span style="color:#ffa800">"active_projects"</span>: <span style="color:#64b5f6">${window.active_projects || 0}</span>
<span style="color:rgba(0,255,65,0.4)">}</span>`;
    }

    tryRender();
  }

  function renderTermStatus() {
    const el = document.getElementById("term-status-out");
    const floatEl = document.getElementById("float-status");

    function tryRender() {
      const text = window.status_text;
      if (!text) { setTimeout(tryRender, 100); return; }
      if (el) el.textContent = text;
      if (floatEl) floatEl.textContent = text;
    }
    tryRender();
  }

  function renderTermProjectsPreview() {
    const el = document.getElementById("term-projects-preview");

    function tryRender() {
      if (!window.projects) { setTimeout(tryRender, 100); return; }
      el.innerHTML = window.projects
        .map((p) => `  <span style="color:rgba(0,255,65,0.4)">[${p.status === "active" ? "ACTIVE" : "DONE  "}]</span> ${p.title}`)
        .join("\n");
    }
    tryRender();
  }

  /* ── INIT ── */
  initMatrix();
  initBoot();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      renderTermJson();
      renderTermStatus();
      renderTermProjectsPreview();
    });
  } else {
    renderTermJson();
    renderTermStatus();
    renderTermProjectsPreview();
  }
})();
