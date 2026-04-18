import Chart from 'chart.js/auto';

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
export const STORE_KEY = 'pulse_v1';
export const COLORS = {
  accent: '#f59e0b',
  green: '#22c55e',
  red: '#ef4444',
};

// ─────────────────────────────────────────
// STORAGE — localStorage CRUD
// ─────────────────────────────────────────
export function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveAll(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function getDay(dateKey) {
  return loadAll()[dateKey] || {};
}

export function saveEntry(dateKey, hour, score) {
  const all = loadAll();
  if (!all[dateKey]) all[dateKey] = {};
  all[dateKey][hour] = score;
  saveAll(all);
}

export function deleteEntry(dateKey, hour) {
  const all = loadAll();
  if (all[dateKey]) {
    delete all[dateKey][hour];
    if (Object.keys(all[dateKey]).length === 0) delete all[dateKey];
  }
  saveAll(all);
}

// ─────────────────────────────────────────
// STATE MANAGEMENT
// ─────────────────────────────────────────
export const appState = {
  viewDate: getTodayKey(),
  selectedScore: null,
  allData: loadAll(),
  listeners: [],
};

export function updateState(patch) {
  Object.assign(appState, patch);
  appState.listeners.forEach(fn => fn(appState));
}

export function subscribe(fn) {
  appState.listeners.push(fn);
  fn(appState); // Call immediately with current state
}

// ─────────────────────────────────────────
// DATE UTILITIES
// ─────────────────────────────────────────
export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function formatHeaderDate(dateKey) {
  const d = new Date(dateKey + 'T00:00:00');
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
}

export function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).toUpperCase();
}

export function shiftDate(dateKey, delta) {
  const d = new Date(dateKey + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────
// STATS ENGINE — Calculations
// ─────────────────────────────────────────
export function computeStats(dayData) {
  const entries = Object.entries(dayData || {});
  
  if (entries.length === 0) {
    return {
      average: null,
      peak: null,
      peakHour: null,
      logged: 0,
      total: 0,
    };
  }

  const scores = entries.map(([, v]) => v);
  const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  const max = Math.max(...scores);
  const peakHour = entries.find(([, v]) => v === max)?.[0];
  const total = scores.reduce((a, b) => a + b, 0);

  return {
    average: avg,
    peak: max,
    peakHour,
    logged: entries.length,
    total,
  };
}

// ─────────────────────────────────────────
// CHART ENGINE — Chart.js wrapper
// ─────────────────────────────────────────
let chartInstance = null;

export function initChart(canvasEl) {
  const labels = Array.from({ length: 24 }, (_, i) =>
    `${String(i).padStart(2, '0')}h`
  );

  chartInstance = new Chart(canvasEl, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Progress',
          data: Array(24).fill(null),
          backgroundColor: Array(24).fill('rgba(255,255,255,0.03)'),
          borderColor: Array(24).fill('rgba(255,255,255,0.07)'),
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 450, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a1a',
          borderColor: 'rgba(245,158,11,0.4)',
          borderWidth: 1,
          titleColor: '#f59e0b',
          bodyColor: '#c8c8c8',
          titleFont: { family: "'JetBrains Mono',monospace", size: 11 },
          bodyFont: { family: "'JetBrains Mono',monospace", size: 12 },
          callbacks: {
            title: (i) => `HOUR ${i[0].label}`,
            label: (i) =>
              i.raw !== null ? `SCORE: ${i.raw} / 5` : 'NOT LOGGED',
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            color: '#4a4a4a',
            font: { family: "'JetBrains Mono',monospace", size: 10 },
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: '#252525' },
        },
        x: {
          ticks: {
            color: '#4a4a4a',
            font: { family: "'JetBrains Mono',monospace", size: 9 },
            maxRotation: 0,
          },
          grid: { display: false },
          border: { color: '#252525' },
        },
      },
      onClick(_, els) {
        if (!els.length) return;
        const idx = els[0].index;
        const event = new CustomEvent('chartHourSelect', {
          detail: { hour: String(idx).padStart(2, '0') },
        });
        window.dispatchEvent(event);
      },
    },
  });

  return chartInstance;
}

export function updateChart(dayData, viewDate) {
  if (!chartInstance) return;

  const isToday = viewDate === getTodayKey();
  const curH = new Date().getHours();

  const data = Array.from({ length: 24 }, (_, i) => {
    const k = String(i).padStart(2, '0');
    return dayData[k] !== undefined ? dayData[k] : null;
  });

  const bg = data.map((v, i) => {
    if (v === null)
      return isToday && i === curH
        ? 'rgba(245,158,11,0.1)'
        : 'rgba(255,255,255,0.03)';
    return `rgba(245,158,11,${0.28 + (v / 5) * 0.72})`;
  });

  const bc = data.map((v, i) => {
    if (v === null)
      return isToday && i === curH
        ? 'rgba(245,158,11,0.45)'
        : 'rgba(255,255,255,0.07)';
    return 'rgba(245,158,11,0.9)';
  });

  chartInstance.data.datasets[0].data = data;
  chartInstance.data.datasets[0].backgroundColor = bg;
  chartInstance.data.datasets[0].borderColor = bc;
  chartInstance.update();
}
