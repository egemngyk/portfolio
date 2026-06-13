// ─── Firebase Başlatma & Yardımcı Fonksiyonlar ───────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  runTransaction,
  increment,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXzLzOwAbXx6npZRelr3iAlLm_fNgzspE",
  authDomain: "portfolio-database-31a1e.firebaseapp.com",
  projectId: "portfolio-database-31a1e",
  storageBucket: "portfolio-database-31a1e.firebasestorage.app",
  messagingSenderId: "611771864691",
  appId: "1:611771864691:web:1ff8ea6f67fa4929ddfc06",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ─── Auth Yardımcıları ────────────────────────────────────────────────────────

/** Giriş yap — email + şifre */
async function firebaseLogin(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

/** Çıkış yap */
async function firebaseLogout() {
  await signOut(auth);
}

/** Mevcut kullanıcıyı döndür (null = giriş yok) */
function getCurrentUser() {
  return auth.currentUser;
}

/** Auth durumu değişince çağrılan callback'i kaydeder. Promise olarak da kullanılabilir. */
function waitForAuth() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}

// ─── Firestore Yardımcıları ───────────────────────────────────────────────────

/** portfolio/main dokümanını oku */
async function getPortfolioMain() {
  const snap = await getDoc(doc(db, "portfolio", "main"));
  return snap.exists() ? snap.data() : null;
}

/** portfolio/config dokümanını oku */
async function getPortfolioConfig() {
  const snap = await getDoc(doc(db, "portfolio", "config"));
  return snap.exists() ? snap.data() : null;
}

/** Aktif temayı Firestore'dan oku */
async function getActiveTheme() {
  const config = await getPortfolioConfig();
  return config?.activeTheme || "claudemade";
}

/** portfolio/main dokümanını güncelle (partial update) */
async function updatePortfolioMain(data) {
  await updateDoc(doc(db, "portfolio", "main"), data);
}

/** portfolio/config dokümanını güncelle */
async function updatePortfolioConfig(data) {
  await updateDoc(doc(db, "portfolio", "config"), data);
}

/** messages koleksiyonuna yeni mesaj ekle */
async function addMessage(name, email, message) {
  const docRef = await addDoc(collection(db, "messages"), {
    name,
    email,
    message,
    createdAt: serverTimestamp(),
    read: false,
  });
  return docRef.id;
}

/** Tüm mesajları oku (admin) */
async function getMessages() {
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Mesajı okundu olarak işaretle */
async function markMessageRead(msgId) {
  await updateDoc(doc(db, "messages", msgId), { read: true });
}

/** Mesajı sil */
async function deleteMessage(msgId) {
  await deleteDoc(doc(db, "messages", msgId));
}

/** analytics/stats dokümanını oku */
async function getAnalyticsStats() {
  const snap = await getDoc(doc(db, "analytics", "stats"));
  return snap.exists() ? snap.data() : null;
}

/** Ziyaret kaydet — transaction ile güvenli güncelleme */
async function recordVisit({ visitor_id, new_session }) {
  if (!visitor_id) return;

  const statsRef = doc(db, "analytics", "stats");

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(statsRef);
    const now = new Date();
    const dayKey = now.toISOString().slice(0, 10);
    const weekKey = `${now.getFullYear()}-W${String(getISOWeek(now)).padStart(2, "0")}`;
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    if (!snap.exists()) {
      // İlk kez oluştur
      tx.set(statsRef, {
        unique_visitors: 1,
        visitor_ids: [visitor_id],
        sessions: {
          total: new_session ? 1 : 0,
          daily: new_session ? { [dayKey]: 1 } : {},
          weekly: new_session ? { [weekKey]: 1 } : {},
          monthly: new_session ? { [monthKey]: 1 } : {},
        },
        durations: [],
        avg_duration_sec: 0,
        last_updated: now.toISOString(),
      });
      return;
    }

    const data = snap.data();
    const visitor_ids = data.visitor_ids || [];
    const isNew = !visitor_ids.includes(visitor_id);

    const updates = {
      last_updated: now.toISOString(),
    };

    if (isNew) {
      updates.visitor_ids = [...visitor_ids, visitor_id];
      updates.unique_visitors = (data.unique_visitors || 0) + 1;
    }

    if (new_session) {
      const s = data.sessions || {};
      updates["sessions.total"] = (s.total || 0) + 1;
      updates[`sessions.daily.${dayKey}`] = ((s.daily || {})[dayKey] || 0) + 1;
      updates[`sessions.weekly.${weekKey}`] = ((s.weekly || {})[weekKey] || 0) + 1;
      updates[`sessions.monthly.${monthKey}`] = ((s.monthly || {})[monthKey] || 0) + 1;
    }

    tx.update(statsRef, updates);
  });
}

/** Süre kaydet (sadece "leave" tipi) */
async function recordDuration({ visitor_id, duration, type }) {
  if (!visitor_id || type !== "leave" || duration <= 0) return;

  const statsRef = doc(db, "analytics", "stats");

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(statsRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const durations = [...(data.durations || []), duration].slice(-1000);
    const avg = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);

    tx.update(statsRef, {
      durations,
      avg_duration_sec: avg,
      last_updated: new Date().toISOString(),
    });
  });
}

// ISO hafta numarası yardımcısı
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export {
  db,
  auth,
  // Auth
  firebaseLogin,
  firebaseLogout,
  getCurrentUser,
  waitForAuth,
  onAuthStateChanged,
  // Firestore
  getPortfolioMain,
  getPortfolioConfig,
  getActiveTheme,
  updatePortfolioMain,
  updatePortfolioConfig,
  addMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
  getAnalyticsStats,
  recordVisit,
  recordDuration,
};
