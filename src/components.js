import Chart from 'chart.js/auto';
import {
  state,
  getTodayStr,
  getDay,
  loadAll,
  loadTasks,
  saveTimeFormat,
  formatHour,
  getChartLabels,
  scoreColor,
  effPct,
  effClass,
  signStr,
  escapeHtml,
} from './lib.js';

// ── TOAST ─────────────────────────────────────────────────────────────────────

export function toast(message, isError = false) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.toggle('error', isError);
  el.classList.add('show');
  clearTimeout(el._tid);
  el._tid = setTimeout(() => el.classList.remove('show'), 2200);
}

// ── TIME FORMAT TOGGLE ────────────────────────────────────────────────────────

export function updateFormatButton() {
  document.getElementById('formatToggleBtn').textContent =
    state.timeFormat === '24h' ? '24H' : '12H';
}

export function toggleTimeFormat(renderAllFn) {
  state.timeFormat = state.timeFormat === '24h' ? '12h' : '24h';
  saveTimeFormat();
  updateFormatButton();


  initHourDropdown();


  const hourGrid = document.getElementById('multilogHourGrid');
  if (hourGrid && hourGrid.children.length) {
    hourGrid.innerHTML = Array.from({ length: 24 }, (_, i) => {
      const h = String(i).padStart(2, '00');
      const isChecked = state.multilogSelectedHours.has(h) ? 'checked' : '';
      return `<label class="hour-checkbox">
        <input type="checkbox" data-modal-hour="${h}" ${isChecked}>
        <span>${formatHour(h)}</span>
      </label>`;
    }).join('');
  }

  renderAllFn(false);
}

// ── HOUR NAVIGATOR ────────────────────────────────────────────────────────────

export function initHourDropdown() {
  const sel = document.getElementById('hourSelect');
  sel.innerHTML = Array.from({ length: 24 }, (_, i) =>
    `<option value="${i}">${formatHour(String(i).padStart(2, '0'))}</option>`,
  ).join('');
}

export function updateHourDisplay() {
  const now = new Date().getHours();
  document.getElementById('hourSelect').value = state.selHour;
  document.getElementById('hourNowTag').textContent =
    (state.viewDate === getTodayStr() && state.selHour === now)
      ? '← CURRENT SYSTEM TIME'
      : '';
}

export function adjustHour(delta) {
  state.selHour = (state.selHour + delta + 24) % 24;
  updateHourDisplay();
  toast(`HOUR: ${formatHour(String(state.selHour).padStart(2, '0'))}`);
}

export function jumpHour(val) {
  state.selHour = parseInt(val, 10);
  updateHourDisplay();
  toast(`HOUR: ${formatHour(String(state.selHour).padStart(2, '0'))}`);
}

// ── SCORE BUTTONS ─────────────────────────────────────────────────

export function buildScoreBtns() {
  const negRow = document.getElementById('negScoreRow');
  const posRow = document.getElementById('posScoreRow');
  negRow.innerHTML = '';
  posRow.innerHTML = '';

  for (let s = -5; s <= 5; s++) {
    const btn  = document.createElement('button');
    btn.className   = 'score-btn';
    btn.textContent = (s > 0 ? '+' : '') + s;

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
    data: {
      labels: getChartLabels(),
      datasets: [
        {
          // Momentum line overlay
          type:                'line',
          label:               'Momentum',
          data:                Array(24).fill(null),
          borderColor:         'rgba(245, 158, 11, 1)',
          borderWidth:         3,
          tension:             0.35,
          pointRadius:         5,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor:    '#080808',
          pointBorderWidth:    2,
          spanGaps:            true,
          order:               1,
        },
        {
          // Score bars
          type:         'bar',
          label:        'Score',
          data:         Array(24).fill(null),
          borderRadius: 3,
          base:         0,
          order:        2,
        },
      ],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min:  -5,
          max:   5,
          grid: {
            color:     c => c.tick.value === 0 ? 'rgba(245, 158, 11, 0.4)' : '#1a1a1a',
            lineWidth: c => c.tick.value === 0 ? 2 : 1,
          },
          ticks: {
            color:    '#444',
            callback: v => (v > 0 ? '+' : '') + v,
            stepSize: 1,
          },
        },
        x: {
          position: { y: 0 },
          grid:     { display: false },
          offset:   state.timeFormat === '12h',
          ticks:    { color: '#888', font: { size: 9, weight: '600' }, padding: 5 },
        },
      },
      onClick: (_, els) => {
        if (els.length) jumpHour(els[0].index);
      },
    },
  });
}

export function refreshChart() {
  const day    = getDay(state.viewDate);
  const scores = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, '00');
    return day[h] !== undefined ? day[h].score : null;
  });

  state.chart.data.labels                      = getChartLabels();
  state.chart.data.datasets[1].data            = scores;
  state.chart.data.datasets[1].backgroundColor = scores.map(v => {
    if (v === null) return 'rgba(20, 20, 20, 0.5)';
    return v < 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)';
  });
  state.chart.data.datasets[0].data       = scores;
  state.chart.options.scales.x.offset     = state.timeFormat === '12h';
  state.chart.update({ duration: 0 });
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

  const el      = document.getElementById('sHours');
  el.textContent = entries.length;
  el.className   = 'stat-val';
}

// ── TASK LIST ( manager panel ) ───────────────────────────────────────────────

export function refreshTaskList() {
  const tasks   = loadTasks();
  const list    = document.getElementById('taskList');
  const entries = Object.entries(tasks);

  if (!entries.length) {
    list.innerHTML = '<span style="color:var(--text-dim); font-size:11px;">NO TASKS YET</span>';
    return;
  }

  list.innerHTML = entries.map(([id, t]) => `
    <div class="task-pill">
      <div class="task-dot" style="background:${t.color}"></div>
      <span class="task-pill-name">${escapeHtml(t.name)}</span>
      <button class="task-del" data-id="${id}">✕</button>
    </div>`).join('');
}

// ── TASK SELECT ────────────────────────────────────────────

export function refreshTaskSel() {
  const tasks = loadTasks();
  const sel   = document.getElementById('taskSel');
  const cur   = sel.value;

  sel.innerHTML =
    '<option value="">— unassigned —</option>' +
    Object.entries(tasks)
      .map(([id, t]) =>
        `<option value="${id}" ${id === cur ? 'selected' : ''}>${escapeHtml(t.name)}</option>`)
      .join('');
}

// ── ACTIVITY LOG ──────────────────────────────────────────────────────────────

export function renderLogGroups() {
  const day     = getDay(state.viewDate);
  const tasks   = loadTasks();
  const groups  = document.getElementById('logGroups');

  // Sort entries chronologically by hour
  const entries = Object.entries(day).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  if (!entries.length) {
    groups.innerHTML = '<div style="color:var(--text-dim); padding:10px 0;">NO DATA</div>';
    return;
  }

  const taskOptions = Object.entries(tasks)
    .map(([tid, tt]) => `<option value="${tid}">${escapeHtml(tt.name)}</option>`)
    .join('');

  const entriesHTML = entries.map(([h, e]) => {
    const t         = e.taskId ? tasks[e.taskId] : null;
    const taskColor = t ? t.color : '#555';
    const isU       = !e.taskId;
    const barPct    = Math.abs(e.score / 5) * 100;
    const barSide   = e.score < 0 ? 'right:0' : 'left:0';
    const isSelected = state.selectedEntries.has(h);

    return `
      <div class="log-entry${isSelected ? ' selected' : ''}" data-hour="${h}">
        <input
          type="checkbox"
          class="entry-checkbox"
          data-action="select"
          data-hour="${h}"
          ${isSelected ? 'checked' : ''}
        >
        <div
          class="drag-handle"
          draggable="true"
          data-action="drag-handle"
          data-hour="${h}"
        >::::</div>
        <span class="log-hour">${formatHour(h)}</span>

        <select
          class="entry-task-mini"
          data-action="assign-task"
          data-hour="${h}"
          style="color:${taskColor}; border-color:${taskColor}"
        >
          <option disabled>Assign to...</option>
          <option value="__u__" ${isU ? 'selected' : ''}>Unassigned</option>
          ${taskOptions.replace(`value="${e.taskId}"`, `value="${e.taskId}" selected`)}
        </select>

          <div class="log-bar-wrap">
          <div class="log-bar-fill" style="width:${barPct}%; background:${scoreColor(e.score)}; ${barSide}"></div>
          </div>
        <span class="log-score" style="color:${scoreColor(e.score)}">${e.score > 0 ? '+' : ''}${e.score}</span>

          <input
            class="entry-detail-field"
            placeholder="add details..."
          value="${escapeHtml(e.detail)}"
          data-action="update-detail"
            data-date="${state.viewDate}"
            data-hour="${h}"
          >
        <button class="entry-del" data-action="delete-entry" data-hour="${h}">✕</button>
      </div>`;
  }).join('');

  groups.innerHTML = `<div class="group-entries">${entriesHTML}</div>`;
}

export { renderLogGroups as refreshLogGroups };

// ── TOOLBAR ( multi-select ) ──────────────────────────────────────────────────

export function updateToolbar() {
  document.getElementById('logToolbar')
    .classList.toggle('hidden', state.selectedEntries.size === 0);
}

// ── WEEKLY PROGRESS ───────────────────────────────────────────────────────────

/** @param {(key: string) => void} onDayClick */
export function refreshWeekly(onDayClick) {
  const grid    = document.getElementById('weeklyGrid');
  grid.innerHTML = '';
  const allData = loadAll();
  const end     = new Date(state.viewDate + 'T00:00:00');

  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);

    const key    = d.getFullYear() + '-' +
                   String(d.getMonth() + 1).padStart(2, '0') + '-' +
                   String(d.getDate()).padStart(2, '0');
    const dayRaw = allData[key] || {};
    const scores = Object.values(dayRaw).map(v =>
      typeof v === 'number' ? v : (v?.score ?? 0),
    );
    const eff   = scores.length
      ? Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length * 5)) * 100)
      : null;

    const box = document.createElement('div');
    box.className = `week-day${key === state.viewDate ? ' active' : ''}`;
    box.innerHTML = `
      <div class="wd-label">${d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
      <div class="wd-pct ${effClass(eff)}">${eff !== null ? signStr(eff) + '%' : '—'}</div>
      <div class="wd-date">${key.slice(5)}</div>`;
    box.addEventListener('click', () => onDayClick(key));
    grid.appendChild(box);
  }
}

// ── MULTILOG MODAL ────────────────────────────────────────────────────────────

export function openMultilog() {
  state.multilogSelectedHours.clear();
  state.multilogScore = null;
  document.getElementById('multilogDetail').value = '';
  document.getElementById('multilogTaskSel').value = '';

  // Build 24-hour grid
  const hourGrid = document.getElementById('multilogHourGrid');
  hourGrid.innerHTML = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, '00');
    return `
      <label class="hour-checkbox">
        <input type="checkbox" data-modal-hour="${h}">
        <span>${formatHour(h)}</span>
      </label>`;
  }).join('');

  buildMultilogScoreBtns();
  refreshMultilogTaskSel();
  document.getElementById('multilogModal').classList.add('show');
}

export function closeMultilog() {
  document.getElementById('multilogModal').classList.remove('show');
  state.multilogSelectedHours.clear();
  state.multilogScore = null;
}

export function buildMultilogScoreBtns() {
  const negRow = document.getElementById('multilogNegScore');
  const posRow = document.getElementById('multilogPosScore');
  negRow.innerHTML = '';
  posRow.innerHTML = '';

  for (let s = -5; s <= 5; s++) {
    const btn = document.createElement('button');
    btn.className   = 'modal-score-btn';
    btn.textContent = (s > 0 ? '+' : '') + s;

    btn.addEventListener('click', () => {
      state.multilogScore = s;
      document.querySelectorAll('.modal-score-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
    });

    if (s < 0) negRow.appendChild(btn);
    else       posRow.appendChild(btn);
  }
}

export function refreshMultilogTaskSel() {
  const tasks = loadTasks();
  const sel   = document.getElementById('multilogTaskSel');
  sel.innerHTML =
    '<option value="">— unassigned —</option>' +
    Object.entries(tasks)
      .map(([id, t]) => `<option value="${id}">${escapeHtml(t.name)}</option>`)
      .join('');
}
