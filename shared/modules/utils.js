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

export function reloadData() {
  window.dispatchEvent(new Event('reload-data'));
}
