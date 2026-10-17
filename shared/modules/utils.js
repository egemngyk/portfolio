export function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val ?? "";
}

export function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

export function showMsg(id, text, isError = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? "var(--red)" : "var(--green)";
  setTimeout(() => {
    el.textContent = "";
  }, 3000);
}

export function calcAge(bd) {
  if (!bd) return "?";
  const b = new Date(bd);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  if (
    t.getMonth() < b.getMonth() ||
    (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())
  )
    age--;
  return age;
}

/**
 * Firestore Timestamp, {seconds}, Date, ISO string veya sayı (sn/ms) → Date
 * Geçersizse null döner (böylece "Invalid Date" yazılmaz).
 */
export function toDate(value) {
  if (value === null || value === undefined || value === "" || value === "undefined" || value === "null") {
    return null;
  }
  let d;
  if (value instanceof Date) {
    d = value;
  } else if (typeof value.toDate === "function") {
    d = value.toDate();
  } else if (typeof value === "object" && ("seconds" in value || "_seconds" in value)) {
    const sec = value.seconds ?? value._seconds;
    const nano = value.nanoseconds ?? value._nanoseconds ?? 0;
    d = new Date(sec * 1000 + Math.floor(nano / 1e6));
  } else if (typeof value === "number" || (typeof value === "string" && /^\d{9,}$/.test(value))) {
    const n = Number(value);
    d = new Date(n < 1e11 ? n * 1000 : n); // 10 haneli = saniye, 13 haneli = milisaniye
  } else {
    d = new Date(value);
  }
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Mesaj dokümanındaki tarih alanı (Firestore: createdAt; eski veri: timestamp) */
export function msgTime(m) {
  return m?.createdAt ?? m?.timestamp ?? m?.date ?? null;
}

export function fmtDate(value) {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function previewImageHtml(preview, alt) {
  const s = String(preview || "").trim();
  if (
    !s ||
    (!s.startsWith("/") &&
      !/^https?:\/\//i.test(s) &&
      !s.startsWith("data:image/"))
  ) {
    return `<div class="theme-preview-placeholder" aria-hidden="true"></div>`;
  }
  const safe = s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
  return `<img src="${safe}" alt="${esc(alt)}" loading="lazy" onerror="this.style.display='none'">`;
}

// Auto-translate using MyMemory API
export async function autoTranslate(srcId, dstId) {
  const srcEl = document.getElementById(srcId);
  const dstEl = document.getElementById(dstId);
  if (!srcEl || !dstEl) return;

  const text = srcEl.value.trim();
  if (!text) {
    dstEl.disabled = false;
    dstEl.value = "";
    return;
  }

  const btn = document.querySelector(
    `.btn-auto-translate[data-src="${srcId}"][data-dst="${dstId}"]`
  );
  const origLabel = btn ? btn.textContent : "🌐 Çevir";

  if (btn) {
    btn.textContent = "⏳";
    btn.disabled = true;
  }
  dstEl.disabled = true;
  dstEl.value = "Çevriliyor...";

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|en`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    const translated = json?.responseData?.translatedText || "";
    if (translated && json?.responseStatus === 200) {
      dstEl.value = translated;
      dstEl.disabled = true;
      if (btn) btn.textContent = "🔓 Kilidi Aç";
    } else {
      dstEl.value = "";
      dstEl.disabled = false;
      if (btn) btn.textContent = origLabel;
    }
  } catch {
    dstEl.value = "";
    dstEl.disabled = false;
    if (btn) btn.textContent = origLabel;
  } finally {
    if (btn) btn.disabled = false;
  }
}

export function reloadData() {
  window.dispatchEvent(new Event('reload-data'));
}
