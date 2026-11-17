/* ─── icon-store.js — Panel ikon kataloğu ──────────────────────────────────────
   Yeni beceri eklerken aranabilir ikon seçimi için kullanılır.
   URL'ler mevcut temaların kullandığı devicons/devicon CDN'i ile aynı kaynaktır.
   Seçilen URL beceri kaydına `icon` alanı olarak yazılır.
────────────────────────────────────────────────────────────────────────────── */

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
const icon = (path) => `${CDN}/${path}`;

export const ICON_CATEGORIES = [
  "Diller",
  "Framework & Kütüphane",
  "Araçlar",
  "Veritabanı",
  "Bulut & DevOps",
  "Tasarım & Diğer",
];

export const ICON_STORE = [
  // ── Diller ──
  { label: "JavaScript", category: "Diller", keywords: "js frontend web", url: icon("javascript/javascript-original.svg") },
  { label: "TypeScript", category: "Diller", keywords: "ts frontend web", url: icon("typescript/typescript-original.svg") },
  { label: "Python", category: "Diller", keywords: "py backend ai ml", url: icon("python/python-original.svg") },
  { label: "Java", category: "Diller", keywords: "jvm backend", url: icon("java/java-original.svg") },
  { label: "Kotlin", category: "Diller", keywords: "android jvm", url: icon("kotlin/kotlin-original.svg") },
  { label: "Scala", category: "Diller", keywords: "jvm functional", url: icon("scala/scala-original.svg") },
  { label: "C", category: "Diller", keywords: "sistem low-level", url: icon("c/c-original.svg") },
  { label: "C++", category: "Diller", keywords: "cpp sistem oyun", url: icon("cplusplus/cplusplus-original.svg") },
  { label: "C#", category: "Diller", keywords: "csharp dotnet unity", url: icon("csharp/csharp-original.svg") },
  { label: "Go", category: "Diller", keywords: "golang backend", url: icon("go/go-original.svg") },
  { label: "Rust", category: "Diller", keywords: "sistem güvenli", url: icon("rust/rust-original.svg") },
  { label: "Swift", category: "Diller", keywords: "ios apple", url: icon("swift/swift-original.svg") },
  { label: "Objective-C", category: "Diller", keywords: "ios apple", url: icon("objectivec/objectivec-plain.svg") },
  { label: "PHP", category: "Diller", keywords: "laravel backend web", url: icon("php/php-plain.svg") },
  { label: "Ruby", category: "Diller", keywords: "rails backend", url: icon("ruby/ruby-original.svg") },
  { label: "Dart", category: "Diller", keywords: "flutter mobile", url: icon("dart/dart-original.svg") },
  { label: "R", category: "Diller", keywords: "veri analiz istatistik", url: icon("r/r-original.svg") },
  { label: "Julia", category: "Diller", keywords: "bilimsel hesaplama", url: icon("julia/julia-original.svg") },
  { label: "MATLAB", category: "Diller", keywords: "mühendislik matematik", url: icon("matlab/matlab-original.svg") },
  { label: "Lua", category: "Diller", keywords: "script oyun", url: icon("lua/lua-original.svg") },
  { label: "Perl", category: "Diller", keywords: "script", url: icon("perl/perl-original.svg") },
  { label: "Haskell", category: "Diller", keywords: "functional", url: icon("haskell/haskell-original.svg") },
  { label: "Elixir", category: "Diller", keywords: "functional erlang", url: icon("elixir/elixir-original.svg") },
  { label: "Clojure", category: "Diller", keywords: "functional jvm", url: icon("clojure/clojure-original.svg") },
  { label: "Shell", category: "Diller", keywords: "bash terminal linux", url: icon("bash/bash-original.svg") },
  { label: "HTML5", category: "Diller", keywords: "html web frontend", url: icon("html5/html5-original.svg") },
  { label: "CSS3", category: "Diller", keywords: "css web frontend", url: icon("css3/css3-original.svg") },
  { label: "Solidity", category: "Diller", keywords: "blockchain ethereum", url: icon("solidity/solidity-original.svg") },
  { label: "Assembly", category: "Diller", keywords: "asm nasm low-level", url: icon("nasm/nasm-original.svg") },

  // ── Framework & Kütüphane ──
  { label: "React", category: "Framework & Kütüphane", keywords: "frontend js ui", url: icon("react/react-original.svg") },
  { label: "Next.js", category: "Framework & Kütüphane", keywords: "react ssr frontend", url: icon("nextjs/nextjs-original.svg") },
  { label: "Vue.js", category: "Framework & Kütüphane", keywords: "frontend js ui", url: icon("vuejs/vuejs-original.svg") },
  { label: "Nuxt.js", category: "Framework & Kütüphane", keywords: "vue ssr frontend", url: icon("nuxtjs/nuxtjs-original.svg") },
  { label: "Angular", category: "Framework & Kütüphane", keywords: "frontend typescript", url: icon("angularjs/angularjs-original.svg") },
  { label: "Svelte", category: "Framework & Kütüphane", keywords: "frontend js ui", url: icon("svelte/svelte-original.svg") },
  { label: "Node.js", category: "Framework & Kütüphane", keywords: "js backend runtime", url: icon("nodejs/nodejs-original.svg") },
  { label: "Express", category: "Framework & Kütüphane", keywords: "node backend api", url: icon("express/express-original.svg") },
  { label: "NestJS", category: "Framework & Kütüphane", keywords: "node backend api", url: icon("nestjs/nestjs-original.svg") },
  { label: "Django", category: "Framework & Kütüphane", keywords: "python backend web", url: icon("django/django-plain.svg") },
  { label: "Flask", category: "Framework & Kütüphane", keywords: "python backend web", url: icon("flask/flask-original.svg") },
  { label: "FastAPI", category: "Framework & Kütüphane", keywords: "python backend api", url: icon("fastapi/fastapi-original.svg") },
  { label: "Spring", category: "Framework & Kütüphane", keywords: "java backend", url: icon("spring/spring-original.svg") },
  { label: "Laravel", category: "Framework & Kütüphane", keywords: "php backend web", url: icon("laravel/laravel-original.svg") },
  { label: "Ruby on Rails", category: "Framework & Kütüphane", keywords: "ruby backend web", url: icon("rails/rails-original-wordmark.svg") },
  { label: ".NET", category: "Framework & Kütüphane", keywords: "csharp dotnet backend", url: icon("dotnetcore/dotnetcore-original.svg") },
  { label: "jQuery", category: "Framework & Kütüphane", keywords: "js frontend", url: icon("jquery/jquery-original.svg") },
  { label: "Bootstrap", category: "Framework & Kütüphane", keywords: "css ui frontend", url: icon("bootstrap/bootstrap-original.svg") },
  { label: "Tailwind CSS", category: "Framework & Kütüphane", keywords: "css ui frontend", url: icon("tailwindcss/tailwindcss-original.svg") },
  { label: "Sass", category: "Framework & Kütüphane", keywords: "css preprocessor", url: icon("sass/sass-original.svg") },
  { label: "Redux", category: "Framework & Kütüphane", keywords: "react state", url: icon("redux/redux-original.svg") },
  { label: "GraphQL", category: "Framework & Kütüphane", keywords: "api query", url: icon("graphql/graphql-plain.svg") },
  { label: "Flutter", category: "Framework & Kütüphane", keywords: "dart mobile ui", url: icon("flutter/flutter-original.svg") },
  { label: "Electron", category: "Framework & Kütüphane", keywords: "masaüstü desktop js", url: icon("electron/electron-original.svg") },
  { label: "Storybook", category: "Framework & Kütüphane", keywords: "ui component test", url: icon("storybook/storybook-original.svg") },
  { label: "TensorFlow", category: "Framework & Kütüphane", keywords: "ai ml derin öğrenme", url: icon("tensorflow/tensorflow-original.svg") },
  { label: "PyTorch", category: "Framework & Kütüphane", keywords: "ai ml derin öğrenme", url: icon("pytorch/pytorch-original.svg") },
  { label: "OpenCV", category: "Framework & Kütüphane", keywords: "görüntü işleme computer vision", url: icon("opencv/opencv-original.svg") },
  { label: "Pandas", category: "Framework & Kütüphane", keywords: "python veri analiz", url: icon("pandas/pandas-original.svg") },
  { label: "NumPy", category: "Framework & Kütüphane", keywords: "python veri bilim", url: icon("numpy/numpy-original.svg") },

  // ── Araçlar ──
  { label: "Git", category: "Araçlar", keywords: "version control", url: icon("git/git-original.svg") },
  { label: "GitHub", category: "Araçlar", keywords: "git repo", url: icon("github/github-original.svg") },
  { label: "GitLab", category: "Araçlar", keywords: "git repo ci", url: icon("gitlab/gitlab-original.svg") },
  { label: "Docker", category: "Araçlar", keywords: "container konteyner", url: icon("docker/docker-original.svg") },
  { label: "Kubernetes", category: "Araçlar", keywords: "k8s container orkestrasyon", url: icon("kubernetes/kubernetes-original.svg") },
  { label: "Vite", category: "Araçlar", keywords: "build frontend", url: icon("vite/vite-original.svg") },
  { label: "Webpack", category: "Araçlar", keywords: "build bundler", url: icon("webpack/webpack-original.svg") },
  { label: "Babel", category: "Araçlar", keywords: "build transpiler", url: icon("babel/babel-original.svg") },
  { label: "npm", category: "Araçlar", keywords: "package manager", url: icon("npm/npm-original-wordmark.svg") },
  { label: "Yarn", category: "Araçlar", keywords: "package manager", url: icon("yarn/yarn-original.svg") },
  { label: "VS Code", category: "Araçlar", keywords: "editör editor ide", url: icon("vscode/vscode-original.svg") },
  { label: "Visual Studio", category: "Araçlar", keywords: "ide editör", url: icon("visualstudio/visualstudio-original.svg") },
  { label: "Android Studio", category: "Araçlar", keywords: "android ide", url: icon("androidstudio/androidstudio-original.svg") },
  { label: "Xcode", category: "Araçlar", keywords: "ios apple ide", url: icon("xcode/xcode-original.svg") },
  { label: "Vim", category: "Araçlar", keywords: "editör terminal", url: icon("vim/vim-original.svg") },
  { label: "Linux", category: "Araçlar", keywords: "unix işletim sistemi", url: icon("linux/linux-original.svg") },
  { label: "Jenkins", category: "Araçlar", keywords: "ci cd otomasyon", url: icon("jenkins/jenkins-original.svg") },
  { label: "Jira", category: "Araçlar", keywords: "proje yönetimi issue", url: icon("jira/jira-original.svg") },
  { label: "Trello", category: "Araçlar", keywords: "proje yönetimi kanban", url: icon("trello/trello-original.svg") },
  { label: "Postman", category: "Araçlar", keywords: "api test", url: icon("postman/postman-original.svg") },
  { label: "Figma", category: "Araçlar", keywords: "ui ux tasarım", url: icon("figma/figma-original.svg") },

  // ── Veritabanı ──
  { label: "MongoDB", category: "Veritabanı", keywords: "nosql document", url: icon("mongodb/mongodb-original.svg") },
  { label: "PostgreSQL", category: "Veritabanı", keywords: "sql postgres db", url: icon("postgresql/postgresql-original.svg") },
  { label: "MySQL", category: "Veritabanı", keywords: "sql db", url: icon("mysql/mysql-original.svg") },
  { label: "SQLite", category: "Veritabanı", keywords: "sql db embedded", url: icon("sqlite/sqlite-original.svg") },
  { label: "MariaDB", category: "Veritabanı", keywords: "sql db", url: icon("mariadb/mariadb-original.svg") },
  { label: "Redis", category: "Veritabanı", keywords: "cache key value", url: icon("redis/redis-original.svg") },
  { label: "Elasticsearch", category: "Veritabanı", keywords: "arama search", url: icon("elasticsearch/elasticsearch-original.svg") },
  { label: "Firebase", category: "Veritabanı", keywords: "google backend realtime firestore", url: icon("firebase/firebase-original.svg") },
  { label: "Supabase", category: "Veritabanı", keywords: "postgres backend", url: icon("supabase/supabase-original.svg") },

  // ── Bulut & DevOps ──
  { label: "AWS", category: "Bulut & DevOps", keywords: "amazon cloud bulut", url: icon("amazonwebservices/amazonwebservices-original.svg") },
  { label: "Google Cloud", category: "Bulut & DevOps", keywords: "gcp cloud bulut", url: icon("googlecloud/googlecloud-original.svg") },
  { label: "Azure", category: "Bulut & DevOps", keywords: "microsoft cloud bulut", url: icon("azure/azure-original.svg") },
  { label: "Vercel", category: "Bulut & DevOps", keywords: "deploy hosting frontend", url: icon("vercel/vercel-original.svg") },
  { label: "Netlify", category: "Bulut & DevOps", keywords: "deploy hosting", url: icon("netlify/netlify-original.svg") },
  { label: "Nginx", category: "Bulut & DevOps", keywords: "web server proxy", url: icon("nginx/nginx-original.svg") },
  { label: "Apache", category: "Bulut & DevOps", keywords: "web server", url: icon("apache/apache-original.svg") },
  { label: "Cloudflare", category: "Bulut & DevOps", keywords: "cdn dns", url: icon("cloudflare/cloudflare-original.svg") },

  // ── Tasarım & Diğer ──
  { label: "Photoshop", category: "Tasarım & Diğer", keywords: "tasarım design görsel", url: icon("photoshop/photoshop-original.svg") },
  { label: "Illustrator", category: "Tasarım & Diğer", keywords: "tasarım design vektör", url: icon("illustrator/illustrator-original.svg") },
  { label: "Blender", category: "Tasarım & Diğer", keywords: "3d model animasyon", url: icon("blender/blender-original.svg") },
  { label: "Unity", category: "Tasarım & Diğer", keywords: "oyun game 3d", url: icon("unity/unity-original.svg") },
  { label: "Godot", category: "Tasarım & Diğer", keywords: "oyun game 3d", url: icon("godot/godot-original.svg") },
  { label: "Arduino", category: "Tasarım & Diğer", keywords: "iot elektronik donanım", url: icon("arduino/arduino-original.svg") },
  { label: "Raspberry Pi", category: "Tasarım & Diğer", keywords: "iot donanım", url: icon("raspberrypi/raspberrypi-original.svg") },
];

/** Arama sorgusuna uyan ikonları döndürür (kategori, etiket ve anahtar kelimelerde arar). */
export function searchIcons(query = "") {
  const q = String(query).trim().toLocaleLowerCase("tr");
  if (!q) return ICON_STORE;
  return ICON_STORE.filter((item) =>
    `${item.label} ${item.category} ${item.keywords}`
      .toLocaleLowerCase("tr")
      .includes(q)
  );
}

/** Beceri adına göre otomatik ikon önerisi (örn. "react" → React ikonu). */
export function findIconForName(name = "") {
  const n = String(name).trim().toLocaleLowerCase("tr");
  if (!n) return "";
  const exact = ICON_STORE.find((it) => it.label.toLocaleLowerCase("tr") === n);
  if (exact) return exact.url;
  const partial = ICON_STORE.find((it) =>
    it.keywords.toLocaleLowerCase("tr").split(/[\s,]+/).includes(n)
  );
  return partial ? partial.url : "";
}

/** İsim → varsayılan ikon URL'si (mevcut kayıtlar için fallback). */
export const ICON_MAP = Object.fromEntries(
  ICON_STORE.map((it) => [it.label.toLocaleLowerCase("tr"), it.url])
);

export function iconUrlForName(name = "") {
  return ICON_MAP[String(name).toLocaleLowerCase("tr")] || "";
}
