// ── CONSTANTS ─────────────────────────────────────────────────────────────────

export const STORE       = 'pulse_v2';
export const TASKS_STORE = 'pulse_v2_tasks';

export const TASK_COLORS = [
  '#f59e0b', '#3b82f6', '#a855f7', '#ec4899',
  '#14b8a6', '#f97316', '#84cc16', '#06b6d4',
  '#e879f9', '#fb7185',
];

// ── DATE HELPERS ──────────────────────────────────────────────────────────────

export function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ── SHARED STATE ──────────────────────────────────────────────────────────────

export const state = {
  viewDate:        getTodayStr(),
  selScore:        null,
  selHour:         new Date().getHours(),
  chart:           null,            
  collapsedGroups: new Set(),
};

// ── STORAGE — ENTRIES ─────────────────────────────────────────────────────────

export function loadAll() {
  try   { return JSON.parse(localStorage.getItem(STORE)) || {}; }
  catch { return {}; }
}

export function saveAll(d) {
  localStorage.setItem(STORE, JSON.stringify(d));
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

export function setEntry(k, h, score, detail, taskId) {
  const all = loadAll();
  if (!all[k]) all[k] = {};
  all[k][h] = { score, detail: detail || '', taskId: taskId || null };
  saveAll(all);
}

export function delEntry(k, h) {
  const all = loadAll();
  if (all[k]) {
    delete all[k][h];
    if (!Object.keys(all[k]).length) delete all[k];
  }
  saveAll(all);
}

export function updateEntryDetail(k, h, detail) {
  const all = loadAll();
  if (all[k]?.[h]) {
    all[k][h].detail = detail;
    saveAll(all);
  }
}

// ── STORAGE — TASKS ───────────────────────────────────────────────────────────

export function loadTasks() {
  try   { return JSON.parse(localStorage.getItem(TASKS_STORE)) || {}; }
  catch { return {}; }
}

export function saveTasks(t) {
  localStorage.setItem(TASKS_STORE, JSON.stringify(t));
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

// ── COLOR / MATH HELPERS ──────────────────────────────────────────────────────

export function scoreColor(score) {
  if (score < 0)   return '#ef4444';
  if (score === 0) return '#555555';
  if (score <= 2)  return '#f59e0b';
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