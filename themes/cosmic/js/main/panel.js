/* ─────────────────────────────────────────────
   COSMIC THEME — panel.js
   Animated starfield canvas
─────────────────────────────────────────────── */
(function () {
  "use strict";

  function initStars() {
    const canvas = document.getElementById("stars-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W, H, stars;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      createStars();
    }

    function createStars() {
      stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.7 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.1, // 10% gold stars
      }));
    }

    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      frame++;

      stars.forEach((s) => {
        const flicker = 0.5 + 0.5 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.opacity * flicker;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

        if (s.gold) {
          ctx.fillStyle = `rgba(240,192,96,${alpha})`;
          if (s.r > 0.8) {
            ctx.shadowColor = "rgba(240,192,96,0.8)";
            ctx.shadowBlur = 6;
          }
        } else {
          ctx.fillStyle = `rgba(200,210,255,${alpha})`;
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Slow drift
        s.y -= s.speed * 0.1;
        if (s.y < -2) {
          s.y = H + 2;
          s.x = Math.random() * W;
        }
      });

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    draw();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStars);
  } else {
    initStars();
  }
})();
