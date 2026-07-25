import { getVal, setVal, showMsg, reloadData } from "./utils.js";

export function renderStatsForm(s) {
  setVal("s-projects", s.active_projects);
  setVal("s-langs", s.languages_count);
  setVal("s-year", s.year);
  setVal("s-message-limit", s.message_limit);
}

async function saveStats() {
  const body = {
    active_projects: parseInt(getVal("s-projects")) || 0,
    languages_count: parseInt(getVal("s-langs")) || 0,
    year: parseInt(getVal("s-year")) || new Date().getFullYear(),
    message_limit: parseInt(getVal("s-message-limit")) || 2500,
  };
  const res = await window.ADMIN.updateStats(body);
  showMsg(
    "stats-msg",
    res.ok ? "Kaydedildi ✓" : res.error || "Hata",
    !res.ok
  );
  if (res.ok) reloadData();
}

let _currentFilter = "daily";

export function renderStats() {
  const containers = [
    document.getElementById("stats-overview"),
  ].filter(Boolean);

  if (!containers.length) return;

  const analytics = window.analytics || {};
  const sessions = analytics.sessions || {};

  const buildHTML = (s) => `
  <div class="filter-bar">
    <span class="filter-label">Görünüm:</span>
    <button class="filter-btn active" data-filter="daily" data-s="${s}">Günlük</button>
    <button class="filter-btn" data-filter="weekly" data-s="${s}">Haftalık</button>
    <button class="filter-btn" data-filter="monthly" data-s="${s}">Aylık</button>
    <button class="filter-btn" data-filter="all" data-s="${s}" style="margin-left:8px;">Tümü</button>
  </div>
  <div class="stat-grid">
    <div class="stat-card accent">
      <div class="stat-label">Tekil Ziyaretçi</div>
      <div class="stat-val" id="sv-unique${s}">${analytics.unique_visitors ?? 0}</div>
      <div class="stat-sub">toplam</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Toplam Oturum</div>
      <div class="stat-val" id="sv-sessions${s}">${sessions.total ?? 0}</div>
      <div class="stat-sub" id="sv-sessions-sub${s}">tüm zamanlar</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Ort. Süre</div>
      <div class="stat-val" id="sv-duration${s}">${Math.round(analytics.avg_duration_sec ?? 0)}</div>
      <div class="stat-sub">saniye</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Dönem Girişi</div>
      <div class="stat-val" id="sv-period${s}">—</div>
      <div class="stat-sub" id="sv-period-sub${s}">günlük kayıt</div>
    </div>
  </div>
  <div class="charts-grid">
    <div class="chart-card full">
      <div class="chart-title">Oturum Trendi <span id="chart-period-label${s}">günlük</span></div>
      <div style="position:relative;width:100%;height:200px;">
        <canvas id="sv-session-chart${s}"></canvas>
      </div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Dönem Dağılımı <span>oturum sayısı</span></div>
      <div id="sv-breakdown${s}"></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Süre Dağılımı <span>saniye aralığı</span></div>
      <div style="position:relative;width:100%;height:200px;">
        <canvas id="sv-duration-chart${s}"></canvas>
      </div>
    </div>
  </div>
  <div class="last-updated" id="sv-last-updated${s}"></div>
`;

  containers.forEach((el, i) => {
    const s = i === 0 ? "" : "-2";
    el.innerHTML = buildHTML(s);
    _updateStatsView(s);

    // Add event listeners for filters
    el.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setStatsFilter(btn.dataset.filter, btn.dataset.s);
      });
    });
  });
}

export function setStatsFilter(f, s = "") {
  _currentFilter = f;
  const labels = {
    daily: "günlük",
    weekly: "haftalık",
    monthly: "aylık",
    all: "tümü",
  };
  const container = document.getElementById("stats-overview");
  if (container) {
    container.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.toggle(
        "active",
        b.textContent.trim().toLowerCase() === labels[f]
      );
    });
  }
  _updateStatsView(s);
}

function _updateStatsView(s = "") {
  const analytics = window.analytics || {};
  const sessions = analytics.sessions || {};
  const map = {
    daily: sessions.daily,
    weekly: sessions.weekly,
    monthly: sessions.monthly,
  };
  const periodLabel = {
    daily: "günlük",
    weekly: "haftalık",
    monthly: "aylık",
    all: "günlük (tüm)",
  };
  const data =
    _currentFilter === "all"
      ? sessions.daily || {}
      : map[_currentFilter] || {};
  const cnt = Object.values(data).reduce((a, b) => a + b, 0);

  const el = (id) => document.getElementById(id + s);

  if (el("sv-sessions")) el("sv-sessions").textContent = cnt;
  if (el("sv-sessions-sub"))
    el("sv-sessions-sub").textContent =
      periodLabel[_currentFilter] + " toplamı";
  if (el("sv-period")) el("sv-period").textContent = Object.keys(data).length;
  if (el("sv-period-sub"))
    el("sv-period-sub").textContent =
      "kayıtlı " + periodLabel[_currentFilter];
  if (el("chart-period-label"))
    el("chart-period-label").textContent = periodLabel[_currentFilter];

  if (analytics.last_updated && el("sv-last-updated")) {
    el("sv-last-updated").textContent =
      "Son güncelleme: " +
      new Date(analytics.last_updated).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  }

  _renderBreakdown(data, s);
  _renderSessionChart(data, s);
  _renderDurationChart(analytics.durations || [], s);
}

function _renderBreakdown(data, s = "") {
  const el = document.getElementById("sv-breakdown" + s);
  if (!el) return;
  const entries = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);
  if (!entries.length) {
    el.innerHTML = '<div class="no-data">Veri yok</div>';
    return;
  }
  const max = Math.max(...entries.map((e) => e[1]));
  el.innerHTML = entries
    .map(
      ([k, v]) => `
  <div class="detail-row">
    <div class="detail-key">${k}</div>
    <div class="detail-bar-wrap">
      <div class="detail-bar" style="width:${Math.round((v / max) * 100)}%"></div>
    </div>
    <div class="detail-val">${v}</div>
  </div>`
    )
    .join("");
}

function _renderSessionChart(data, s = "") {
  if (!window.Chart) return;
  const canvas = document.getElementById("sv-session-chart" + s);
  if (!canvas) return;

  if (window["_sessionChart" + s]) {
    window["_sessionChart" + s].destroy();
    window["_sessionChart" + s] = null;
  }

  const entries = Object.entries(data).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  if (!entries.length) return;

  window["_sessionChart" + s] = new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: entries.map((e) => e[0]),
      datasets: [
        {
          data: entries.map((e) => e[1]),
          borderColor: "#c8ff00",
          backgroundColor: "rgba(200,255,0,0.12)",
          borderWidth: 2,
          pointBackgroundColor: "#c8ff00",
          pointRadius: 4,
          tension: 0.35,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: {
            color: "#555",
            font: { size: 10, family: "DM Mono,monospace" },
            maxRotation: 45,
            maxTicksLimit: 8,
          },
          grid: { color: "#1e1e1e" },
          border: { color: "#1e1e1e" },
        },
        y: {
          ticks: { color: "#555", font: { size: 10 } },
          grid: { color: "#1a1a1a" },
          border: { color: "#1e1e1e" },
          beginAtZero: true,
        },
      },
    },
  });
}

function _renderDurationChart(durations, s = "") {
  if (!window.Chart) return;
  const canvas = document.getElementById("sv-duration-chart" + s);
  if (!canvas) return;

  if (window["_durationChart" + s]) {
    window["_durationChart" + s].destroy();
    window["_durationChart" + s] = null;
  }

  const buckets = {
    "0-30": 0,
    "30-60": 0,
    "60-120": 0,
    "120-300": 0,
    "300+": 0,
  };
  durations.forEach((d) => {
    if (d < 30) buckets["0-30"]++;
    else if (d < 60) buckets["30-60"]++;
    else if (d < 120) buckets["60-120"]++;
    else if (d < 300) buckets["120-300"]++;
    else buckets["300+"]++;
  });

  window["_durationChart" + s] = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: Object.keys(buckets),
      datasets: [
        {
          data: Object.values(buckets),
          backgroundColor: Object.keys(buckets).map((_, i) =>
            i === 1 ? "#c8ff00" : "rgba(200,255,0,0.22)"
          ),
          borderColor: "transparent",
          borderRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: {
            color: "#555",
            font: { size: 10, family: "DM Mono,monospace" },
          },
          grid: { color: "#1e1e1e" },
          border: { color: "#1e1e1e" },
        },
        y: {
          ticks: { color: "#555", font: { size: 10 }, stepSize: 1 },
          grid: { color: "#1a1a1a" },
          border: { color: "#1e1e1e" },
          beginAtZero: true,
        },
      },
    },
  });
}

export function initStats() {
  document
    .getElementById("btn-save-stats")
    ?.addEventListener("click", saveStats);
}
