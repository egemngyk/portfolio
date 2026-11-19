/* ─── skill-categories.js — Becerileri gerçek kategorisine göre gruplar ───────
   Panel ikon kataloğundaki (icon-store.js) kategori bilgisi tek kaynaktır.

   Eski davranış: beceriler 3'erli sabit dilimlere bölünüp başlıklar pozisyondan
   alınıyordu (t.groups[0..2], sonrası "Tools"). Veri sırası değişince C++ gibi
   diller "Tools" başlığının altına düşüyordu. Burada eşleştirme ada göre yapılır.
───────────────────────────────────────────────────────────────────────────── */
import { ICON_STORE } from "/shared/icon-store.js";

// Verideki ad ile ikon kataloğundaki ad farklı olanlar
const ALIASES = {
  html: "HTML5",
  css: "CSS3",
  "visual studio code": "VS Code",
};

const ORDER = [
  "Diller",
  "Framework & Kütüphane",
  "Araçlar",
  "Veritabanı",
  "Bulut & DevOps",
  "Tasarım & Diğer",
];

const TITLES = {
  tr: {
    Diller: "Diller",
    "Framework & Kütüphane": "Kütüphane & Framework",
    Araçlar: "Araçlar",
    Veritabanı: "Veritabanı",
    "Bulut & DevOps": "Bulut & DevOps",
    "Tasarım & Diğer": "Diğer",
  },
  en: {
    Diller: "Languages",
    "Framework & Kütüphane": "Frameworks & Libraries",
    Araçlar: "Tools",
    Veritabanı: "Databases",
    "Bulut & DevOps": "Cloud & DevOps",
    "Tasarım & Diğer": "Other",
  },
};

const CATEGORY_BY_NAME = new Map();
for (const item of ICON_STORE) {
  CATEGORY_BY_NAME.set(String(item.label).toLowerCase(), item.category);
}

// Bir kategori 4'ten fazla beceri içeriyorsa aynı başlıkla yeni bir grup açılır;
// uzun tek bir liste yerine kısa, okunabilir bloklar oluşur.
const MAX_ITEMS_PER_GROUP = 4;

export function skillCategory(name) {
  const key = String(name || "").trim().toLowerCase();
  const resolved = ALIASES[key] || key;
  return CATEGORY_BY_NAME.get(resolved.toLowerCase()) || "Tasarım & Diğer";
}

/**
 * Becerileri kategoriye göre gruplar.
 * @returns {Array<{key:string, title:string, items:Array}>} boş gruplar atlanır
 */
export function groupSkillsByCategory(skills, lang = "tr") {
  const buckets = new Map();
  (skills || []).forEach((skill) => {
    const category = skillCategory(skill && skill.name);
    if (!buckets.has(category)) buckets.set(category, []);
    buckets.get(category).push(skill);
  });

  const labels = TITLES[lang] || TITLES.tr;
  const groups = [];
  for (const key of ORDER) {
    if (!buckets.has(key)) continue;
    const items = buckets.get(key);
    for (let i = 0; i < items.length; i += MAX_ITEMS_PER_GROUP) {
      groups.push({
        key,
        title: labels[key],
        items: items.slice(i, i + MAX_ITEMS_PER_GROUP),
      });
    }
  }
  return groups;
}
