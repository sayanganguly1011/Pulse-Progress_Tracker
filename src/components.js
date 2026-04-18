import Chart from 'chart.js/auto';
import {
  state,
  getTodayStr,
  getDay,
  loadAll,
  loadTasks,
  scoreColor,
  effPct,
  effClass,
  signStr,
} from './lib.js';

// ── TOAST ─────────────────────────────────────────────────────────────────────

export function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(el._tid);
  el._tid = setTimeout(() => el.classList.remove('show'), 2200);
}

// ── HOUR NAVIGATOR ────────────────────────────────────────────────────────────

export function updateHourDisplay() {
  const hh  = String(state.selHour).padStart(2, '0');
  const now = new Date().getHours();

  document.getElementById('hourDisplay').textContent = `${hh}:00`;
  document.getElementById('hourNowTag').textContent  =
    (state.viewDate === getTodayStr() && state.selHour === now)
      ? '← CURRENT HOUR'
      : '';
  document.getElementById('prevHourBtn').disabled = state.selHour === 0;
  document.getElementById('nextHourBtn').disabled = state.selHour === 23;
}

export function changeHour(delta) {
  state.selHour = Math.max(0, Math.min(23, state.selHour + delta));
  updateHourDisplay();
}

// ── SCORE BUTTONS ─────────────────────────────────────────────────

export function buildScoreBtns() {
  const negRow = document.getElementById('negScoreRow');
  const posRow = document.getElementById('posScoreRow');
  negRow.innerHTML = '';
  posRow.innerHTML = '';

  for (let s = -5; s <= 5; s++) {
    const btn  = document.createElement('button');
    const sign = s > 0 ? '+' : '';

    btn.className   = 'score-btn';
    btn.textContent = sign + s;
    btn.dataset.s   = s;

    if (s < 0)        btn.classList.add('neg-btn');
    else if (s === 0) btn.classList.add('zero-btn');
    else if (s <= 2)  btn.classList.add('mid-btn');
    else              btn.classList.add('pos-btn');

    btn.addEventListener('click', () => {
      state.selScore = s;
      document.querySelectorAll('.score-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
    });

    if (s < 0) negRow.appendChild(btn);
    else       posRow.appendChild(btn);
  }
}

// ── CHART ─────────────────────────────────────────────────────────────────────

export function initChart() {
  const ctx = document.getElementById('chart').getContext('2d');

  state.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels:   Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}h`),
      datasets: [{ data: Array(24).fill(null), borderRadius: 2 }],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min:  -5,
          max:   5,
          grid:  { color: '#1a1a1a' },
          ticks: {
            color:    '#444',
            callback: v => (v > 0 ? '+' : '') + v,
            stepSize: 1,
          },
        },
        x: {
          grid:  { display: false },
          ticks: { color: '#444', font: { size: 10 } },
        },
      },
      onClick: (_, els) => {
        if (!els.length) return;
        state.selHour = els[0].index;
        updateHourDisplay();
        toast(`HOUR SELECTED: ${String(state.selHour).padStart(2, '00')}:00`);
      },
    },
  });
}

export function refreshChart() {
  const day    = getDay(state.viewDate);
  const scores = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, '0');
    return day[h] !== undefined ? day[h].score : null;
  });

  state.chart.data.datasets[0].data            = scores;
  state.chart.data.datasets[0].backgroundColor = scores.map(v =>
    v === null ? '#141414' : scoreColor(v),
  );
  state.chart.update('none');
}

// ── STATS CARD ────────────────────────────────────────────────────────────────

export function refreshStats() {
  const day     = getDay(state.viewDate);
  const entries = Object.values(day);
  const total   = entries.reduce((a, e) => a + e.score, 0);
  const avg     = entries.length ? total / entries.length : null;
  const eff     = effPct(entries);

  const set = (id, text, cls) => {
    const el      = document.getElementById(id);
    el.textContent = text;
    el.className   = `stat-val ${cls}`;
  };

  set('sPct',   eff !== null ? signStr(eff) + '%'  : '—', effClass(eff));
  set('sAvg',   avg !== null ? signStr(avg, 1)      : '—', effClass(avg !== null ? avg * 20 : null));
  set('sTotal', entries.length ? signStr(total)     : '—', effClass(total));

  const sHours      = document.getElementById('sHours');
  sHours.textContent = entries.length;
  sHours.className   = 'stat-val';
}

// ── TASK LIST ( manager panel ) ───────────────────────────────────────────────

export function refreshTaskList() {
  const tasks   = loadTasks();
  const list    = document.getElementById('taskList');
  const entries = Object.entries(tasks);

  if (!entries.length) {
    list.innerHTML = '<span style="color:var(--text-dim); font-size:11px;">NO TASKS YET — ADD ONE ABOVE</span>';
    return;
  }

  list.innerHTML = entries.map(([id, t]) => `
    <div class="task-pill">
      <div class="task-dot" style="background:${t.color}"></div>
      <span class="task-pill-name">${t.name}</span>
      <button class="task-del" data-id="${id}">✕</button>
    </div>
  `).join('');
}

// ── TASK SELECT ( log entry card ) ────────────────────────────────────────────

export function refreshTaskSel() {
  const tasks = loadTasks();
  const sel   = document.getElementById('taskSel');
  const cur   = sel.value;

  sel.innerHTML =
    '<option value="">— unassigned —</option>' +
    Object.entries(tasks)
      .map(([id, t]) => `<option value="${id}" ${id === cur ? 'selected' : ''}>${t.name}</option>`)
      .join('');
}

// ── ACTIVITY LOG ( grouped by task ) ─────────────────────────────────────────

export function refreshLogGroups() {
  const day     = getDay(state.viewDate);
  const tasks   = loadTasks();
  const groups  = document.getElementById('logGroups');
  const entries = Object.entries(day).sort((a, b) => a[0].localeCompare(b[0]));

  if (!entries.length) {
    groups.innerHTML = '<div style="color:var(--text-dim); padding:10px 0; font-size:11px; letter-spacing:1px;">NO DATA LOGGED FOR THIS DATE</div>';
    return;
  }

  // Group entries by taskId
  const grouped = {};
  for (const [h, e] of entries) {
    const key = e.taskId || '__unassigned__';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push([h, e]);
  }

  // Defined tasks
  const orderedKeys = [
    ...Object.keys(tasks).filter(id => grouped[id]),
    ...(grouped['__unassigned__'] ? ['__unassigned__'] : []),
  ];

  groups.innerHTML = orderedKeys.map(gKey => {
    const isUnassigned = gKey === '__unassigned__';
    const task         = isUnassigned ? null : tasks[gKey];
    const groupEntries = grouped[gKey];
    const groupName    = isUnassigned ? 'UNASSIGNED' : task.name.toUpperCase();
    const color        = isUnassigned ? '#555' : task.color;
    const isCollapsed  = state.collapsedGroups.has(gKey);
    const gEff         = effPct(groupEntries.map(([, e]) => e));
    const gEffClass    = effClass(gEff);

    const entriesHTML = groupEntries.map(([h, e]) => {
      const col    = scoreColor(e.score);
      const sign   = e.score > 0 ? '+' : '';
      const mag    = Math.abs(e.score / 5) * 100;
      const isNeg  = e.score < 0;

      // Negative scores fill from right, positive from left
      const barStyle = isNeg
        ? `width:${mag}%; background:${col}; right:0; left:auto;`
        : `width:${mag}%; background:${col}; left:0;`;

      return `
        <div class="log-entry">
          <span class="log-hour">${h}:00</span>
          <div class="log-bar-wrap">
            <div class="log-bar-fill" style="${barStyle}"></div>
          </div>
          <span class="log-score" style="color:${col}">${sign}${e.score}</span>
          <input
            class="entry-detail-field"
            value="${(e.detail || '').replace(/"/g, '&quot;')}"
            placeholder="add details..."
            data-date="${state.viewDate}"
            data-hour="${h}"
          >
          <button class="entry-del" data-hour="${h}">✕</button>
        </div>`;
    }).join('');

    return `
      <div class="log-group">
        <div class="group-header" data-group="${gKey}" style="border-left-color:${color}">
          <span class="group-arrow">${isCollapsed ? '▶' : '▼'}</span>
          <span class="group-name" style="color:${color}">${groupName}</span>
          <span class="group-meta">${groupEntries.length} ${groupEntries.length === 1 ? 'ENTRY' : 'ENTRIES'}</span>
          <span class="group-eff ${gEffClass}">${gEff !== null ? signStr(gEff) + '%' : '—'}</span>
        </div>
        ${isCollapsed ? '' : `<div class="group-entries">${entriesHTML}</div>`}
      </div>`;
  }).join('');
}

export function toggleGroup(gKey) {
  if (state.collapsedGroups.has(gKey)) state.collapsedGroups.delete(gKey);
  else state.collapsedGroups.add(gKey);
  refreshLogGroups();
}

// ── WEEKLY VELOCITY ───────────────────────────────────────────────────────────

/**
 * @param {(key: string) => void} onDayClick  
 */
export function refreshWeekly(onDayClick) {
  const grid    = document.getElementById('weeklyGrid');
  grid.innerHTML = '';
  const allData = loadAll();
  const end     = new Date(state.viewDate + 'T00:00:00');

  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const key    = d.toISOString().slice(0, 10);
    const dayRaw = allData[key] || {};
    const scores = Object.values(dayRaw).map(v =>
      typeof v === 'number' ? v : (v?.score ?? 0),
    );

    const eff   = scores.length
      ? Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length * 5)) * 100)
      : null;
    const label = eff !== null ? signStr(eff) + '%' : '—';

    const box = document.createElement('div');
    box.className = `week-day${key === state.viewDate ? ' active' : ''}`;
    box.innerHTML = `
      <div class="wd-label">${d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
      <div class="wd-pct ${effClass(eff)}">${label}</div>
      <div class="wd-date">${key.slice(5)}</div>`;
    box.addEventListener('click', () => onDayClick(key));
    grid.appendChild(box);
  }
}
