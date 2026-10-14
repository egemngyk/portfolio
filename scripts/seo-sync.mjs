// Kullanım: node scripts/seo-sync.mjs
// shared/seo.config.json -> index.html (head + noscript), robots.txt, sitemap.xml

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildHeadHTML, buildNoscriptHTML } from "../shared/seo.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(
  await readFile(path.join(root, "shared", "seo.config.json"), "utf8")
);

function replaceBlock(html, name, content) {
  const re = new RegExp(`(<!-- ${name}:START -->)[\\s\\S]*?(<!-- ${name}:END -->)`);
  if (!re.test(html)) throw new Error(`index.html içinde ${name} işaretçileri bulunamadı`);
  return html.replace(re, (_, start, end) => `${start}\n${content}\n${end}`);
}

// index.html
const indexPath = path.join(root, "index.html");
let html = await readFile(indexPath, "utf8");
html = replaceBlock(html, "SEO", buildHeadHTML(config));
html = replaceBlock(html, "SEO-NOSCRIPT", buildNoscriptHTML(config));
await writeFile(indexPath, html);

// robots.txt
await writeFile(
  path.join(root, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`
);

// sitemap.xml
const urls = (config.sitemapPaths ?? ["/"])
  .map((p) => `  <url>\n    <loc>${config.siteUrl}${p}</loc>\n  </url>`)
  .join("\n");
await writeFile(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

console.log("SEO senkronu tamam: index.html, robots.txt, sitemap.xml");