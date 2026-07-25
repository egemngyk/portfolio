import "../components/message-card.js"; // Import Web Component

export async function loadMessages() {
  const res = await window.ADMIN.getMessages();
  if (!res.ok) return;
  const msgs = res.messages || [];
  const unread = msgs.filter((m) => !m.read).length;
  updateMsgBadge(unread);
  const ovUnread = document.getElementById("ov-unread");
  if (ovUnread) ovUnread.textContent = unread;

  const container = document.getElementById("messages-list");
  if (!container) return;

  if (!msgs.length) {
    container.innerHTML = '<div class="empty-state">Henüz mesaj yok.</div>';
    return;
  }

  container.innerHTML = "";
  [...msgs].reverse().forEach(m => {
    const card = document.createElement("message-card");
    card.setAttribute("data-id", m.id);
    card.setAttribute("data-name", m.name);
    card.setAttribute("data-email", m.email);
    card.setAttribute("data-timestamp", m.timestamp);
    card.setAttribute("data-message", m.message);
    card.setAttribute("data-read", m.read);
    container.appendChild(card);
  });
}

export function updateMsgBadge(n) {
  const badge = document.getElementById("msg-badge");
  if (badge) {
    badge.textContent = n;
    badge.style.display = n > 0 ? "inline-block" : "none";
  }
}

export function initMessages() {
  // Listen to Web Component events
  document.getElementById("messages-list")?.addEventListener('mark-read', async (e) => {
    await window.ADMIN.markRead(e.detail.id);
    await loadMessages();
  });
  
  document.getElementById("messages-list")?.addEventListener('delete-message', async (e) => {
    if (!confirm("Mesajı silmek istiyor musun?")) return;
    await window.ADMIN.deleteMessage(e.detail.id);
    await loadMessages();
  });

  // Auto reload every 30 seconds
  setInterval(() => loadMessages(), 30000);
}
