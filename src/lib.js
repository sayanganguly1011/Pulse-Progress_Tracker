// ── CONSTANTS ─────────────────────────────────────────────────────────────────

export const STORE       = 'pulse';
export const TASKS_STORE = 'pulse_tasks';

export const TASK_COLORS = [
  '#f59e0b', '#3b82f6', '#a855f7', '#ec4899',
  '#14b8a6', '#f97316', '#84cc16', '#06b6d4',
  '#e879f9', '#fb7185',
];

// ── DATE HELPERS ──────────────────────────────────────────────────────────────

/** Returns today as "YYYY-MM-DD". */
export function getTodayStr() {
  const d = new Date();
  return (
    d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function formatDisplayDate(isoDate) {
  return new Date(isoDate + 'T00:00:00')
    .toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: '2-digit', year: 'numeric',
    })
    .toUpperCase();
}

// ── SHARED STATE ──────────────────────────────────────────────────────────────


export const state = {
  viewDate:             getTodayStr(),
  selScore:             null,
  selHour:              new Date().getHours(),
  chart:                null,           
  draggedHour:          null,           
  selectedEntries:      new Set(),      
  multilogSelectedHours: new Set(),     
  multilogScore:        null,           
};

// ── STORAGE — ENTRIES ─────────────────────────────────────────────────────────

export function loadAll() {
  try   { return JSON.parse(localStorage.getItem(STORE)) || {}; }
  catch { return {}; }
}

export function saveAll(d) {
  try {
  localStorage.setItem(STORE, JSON.stringify(d));
  } catch (e) {
    console.error('localStorage write error:', e);
    throw e; 
  }
}

export function getDay(k) {
  const raw = loadAll()[k] || {};
  const out = {};
  for (const [h, v] of Object.entries(raw)) {
    out[h] = typeof v === 'number'
      ? { score: v, detail: '', taskId: null }
      : v;
  }
  return out;
}

// ── STORAGE — TASKS ───────────────────────────────────────────────────────────

export function loadTasks() {
  try   { return JSON.parse(localStorage.getItem(TASKS_STORE)) || {}; }
  catch { return {}; }
}

export function saveTasks(t) {
  try {
  localStorage.setItem(TASKS_STORE, JSON.stringify(t));
  } catch (e) {
    console.error('localStorage write error:', e);
    throw e;
}
}

// ── COLOR / MATH HELPERS ──────────────────────────────────────────────────────

export function scoreColor(s) {
  if (s < 0)   return '#ef4444';
  if (s === 0) return '#555555';
  if (s <= 2)  return '#f59e0b';
  return '#22c55e';
}

export function effPct(entries) {
  if (!entries.length) return null;
  const total = entries.reduce((a, e) => a + e.score, 0);
  return Math.round((total / (entries.length * 5)) * 100);
}

export function effClass(pct) {
  if (pct === null) return '';
  if (pct < 0)     return 'status-low';
  if (pct < 40)    return 'status-mid';
  return 'status-high';
}

export function signStr(n, digits = 0) {
  if (n === null || n === undefined) return '—';
  const v = digits ? n.toFixed(digits) : n;
  return (n > 0 ? '+' : '') + v;
}

// ── STRING UTILITIES ──────────────────────────────────────────────────────────

export function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}
