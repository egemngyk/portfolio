(function () {
  "use strict";

  const VISITOR_COOKIE = "vs_id";
  const SESSION_COOKIE = "vs_sess";
  const COOKIE_DAYS = 365;
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const HEARTBEAT_EVERY = 60 * 1000;

  function setCookie(name, value, days) {
    const exp = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${exp};path=/;SameSite=Lax`;
  }

  function getCookie(name) {
    const m = document.cookie.match("(?:^|; )" + name + "=([^;]*)");
    return m ? decodeURIComponent(m[1]) : null;
  }

  async function buildFingerprint() {
    const parts = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      screen.colorDepth,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.hardwareConcurrency || "",
      navigator.platform || "",
    ];

    try {
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("fingerprint", 2, 15);
      parts.push(c.toDataURL());
    } catch (_) {}

    const raw = parts.join("|");
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(raw)
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 32);
  }

  async function getVisitorId() {
    let id = getCookie(VISITOR_COOKIE);
    if (!id) {
      id = await buildFingerprint();
      setCookie(VISITOR_COOKIE, id, COOKIE_DAYS);
    }
    return id;
  }

  function isNewSession() {
    const last = getCookie(SESSION_COOKIE);
    if (!last) return true;
    return Date.now() - parseInt(last, 10) > SESSION_TIMEOUT;
  }

  function touchSession() {
    setCookie(SESSION_COOKIE, Date.now().toString(), 1);
  }

  let _visitorId = null;
  let _sessionStart = null;
  let _heartbeatTimer = null;

  async function init() {
    // API hazır olana kadar bekle
    let tries = 0;
    while (!window.API && tries < 50) {
      await new Promise((r) => setTimeout(r, 100));
      tries++;
    }
    if (!window.API) return;

    _visitorId = await getVisitorId();
    const _newSession = isNewSession();
    touchSession();
    _sessionStart = Date.now();

    // Firebase'e ziyaret bildir
    try {
      await window.API.recordVisit({
        visitor_id: _visitorId,
        new_visitor: _newSession,
        new_session: _newSession,
        path: location.pathname,
        referrer: document.referrer || null,
        ts: _sessionStart,
      });
    } catch (_) {}

    _heartbeatTimer = setInterval(() => {
      touchSession();
      // Heartbeat'i sadece süre takibi için kaydediyoruz; Firebase'e göndermiyoruz
    }, HEARTBEAT_EVERY);

    function onLeave() {
      clearInterval(_heartbeatTimer);
      const duration = Math.round((Date.now() - _sessionStart) / 1000);
      // sendBeacon Firebase SDK ile çalışmaz; navigator.sendBeacon yerine API kullanıyoruz
      try {
        window.API.recordDuration({
          visitor_id: _visitorId,
          duration,
          type: "leave",
        }).catch(() => {});
      } catch (_) {}
    }

    window.addEventListener("pagehide", onLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") onLeave();
    });
  }

  window.Stats = {
    init,
    getVisitorId: () => _visitorId,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
