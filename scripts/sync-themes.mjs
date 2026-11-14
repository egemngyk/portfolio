// Kullanım: node scripts/sync-themes.mjs
// themes/* klasörlerini tarar ve shared/themes.json dosyasını günceller.

import { readdir, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themesDir = path.join(root, "themes");
const targetJson = path.join(root, "shared", "themes.json");

try {
  const entries = await readdir(themesDir, { withFileTypes: true });
  const themeNames = [];

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      try {
        // html/index.html kontrolü (geçerli bir tema mı?)
        const indexHtml = path.join(themesDir, entry.name, "html", "index.html");
        const s = await stat(indexHtml);
        if (s.isFile()) {
          themeNames.push(entry.name);
        }
      } catch {
        // index.html yoksa tema sayma
      }
    }
  }

  themeNames.sort();
  await writeFile(targetJson, JSON.stringify(themeNames, null, 2) + "\n", "utf8");
  console.log(`Temalar senkronize edildi (${themeNames.length} tema):`, themeNames.join(", "));
} catch (err) {
  console.error("Tema senkronizasyon hatası:", err);
  process.exit(1);
}

