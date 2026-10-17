import "../components/message-card.js"; // Web Component
import { toDate, msgTime } from "./utils.js";

const LIST_IDS = ["messages-list", "recent-messages"];

function timeOf(m) {
  return toDate(msgTime(m))?.getTime() ?? 0;
}

function buildCard(m) {
  const ts = toDate(msgTime(m));
  const card = document.createElement("message-card");
  card.setAttribute("data-id", m.id ?? "");
  card.setAttribute("data-name", m.name ?? "");
  card.setAttribute("data-email", m.email ?? "");
  card.setAttribute("data-timestamp", ts ? String(ts.getTime()) : "");
  card.setAttribute("data-message", m.message ?? "");
  card.setAttribute("data-read", m.read === true ? "true" : "false");
  return card;
}

function renderList(container, msgs) {
  if (!container) return;
  if (!msgs.length) {
    container.innerHTML = '<div class="empty-state">Henüz mesaj yok.</div>';
    return;
  }
  container.innerHTML = "";
  msgs.forEach((m) => container.appendChild(buildCard(m)));
}

export async function loadMessages() {
  const res = await window.ADMIN.getMessages();
  if (!res.ok) return;

  // En yeni mesaj en üstte
  const msgs = [...(res.messages || [])].sort((a, b) => timeOf(b) - timeOf(a));
  const unread = msgs.filter((m) => !m.read).length;

  updateMsgBadge(unread);
  const ovUnread = document.getElementById("ov-unread");
  if (ovUnread) ovUnread.textContent = unread;

  // Genel Bakış kartındaki sayaç (kart kapalıyken de görünür)
  const count = document.getElementById("recent-messages-count");
  if (count) {
    count.textContent = msgs.length
      ? `${msgs.length} mesaj${unread ? ` · ${unread} okunmamış` : ""}`
      : "mesaj yok";
  }

  // Hem "Mesajlar" menüsü hem Genel Bakış kartı aynı listeyi gösterir
  LIST_IDS.forEach((id) => renderList(document.getElementById(id), msgs));
}

export function updateMsgBadge(n) {
  const badge = document.getElementById("msg-badge");
  if (badge) {
    badge.textContent = n;
    badge.style.display = n > 0 ? "inline-block" : "none";
  }
}

export function initMessages() {
  LIST_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("mark-read", async (e) => {
      await window.ADMIN.markRead(e.detail.id);
      await loadMessages();
    });

    el.addEventListener("delete-message", async (e) => {
      if (!confirm("Mesajı silmek istiyor musun?")) return;
      await window.ADMIN.deleteMessage(e.detail.id);
      await loadMessages();
    });
  });

  // Auto reload every 30 seconds
  setInterval(() => loadMessages(), 30000);
}