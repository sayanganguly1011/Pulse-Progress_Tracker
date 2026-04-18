import { injectStyles } from './styles.js';
import {
  state,
  getTodayStr,
  setEntry,
  delEntry,
  updateEntryDetail,
  loadAll,
  loadTasks,
  saveTasks,
  saveAll,
  genId,
  TASK_COLORS,
} from './lib.js';
import {
  toast,
  buildScoreBtns,
  initChart,
  updateHourDisplay,
  changeHour,
  refreshChart,
  refreshStats,
  refreshTaskList,
  refreshTaskSel,
  refreshLogGroups,
  toggleGroup,
  refreshWeekly,
} from './components.js';

injectStyles();

// ─────────────────────────────────────────────────────────────────────────────
//  RENDER LOOP
// ─────────────────────────────────────────────────────────────────────────────

function renderAll(dateChanged = false) {
  if (dateChanged) {
    document.getElementById('dateJump').value = state.viewDate;
    document.getElementById('nextBtn').disabled = (state.viewDate === getTodayStr());
    document.getElementById('headerDate').textContent = new Date(state.viewDate + 'T00:00:00')
      .toLocaleDateString(undefined, {
        weekday: 'short',
        month:   'short',
        day:     '2-digit',
        year:    'numeric',
      })
      .toUpperCase();
  }

  updateHourDisplay();
  refreshChart();
  refreshStats();
  refreshLogGroups();
  refreshTaskList();
  refreshTaskSel();
  refreshWeekly(jumpToDate);

  const all = loadAll();
  document.getElementById('footerInfo').textContent = `${Object.keys(all).length} DAYS ARCHIVED`;
}

// ─────────────────────────────────────────────────────────────────────────────
//  DATE NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

function jumpToDate(val) {
  if (!val) return;
  if (val > getTodayStr()) {
    toast('CANNOT TRACK THE FUTURE');
    document.getElementById('dateJump').value = state.viewDate;
    return;
  }
  state.viewDate = val;
  onDateChange();
}

function shiftDay(delta) {
  const d = new Date(state.viewDate + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  const nk = d.toISOString().slice(0, 10);
  if (nk > getTodayStr()) return;
  state.viewDate = nk;
  onDateChange();
}

function goToday() {
  state.viewDate = getTodayStr();
  onDateChange();
}

function onDateChange() {
  state.selHour = (state.viewDate === getTodayStr()) ? new Date().getHours() : 0;
  renderAll(true);
}

// ─────────────────────────────────────────────────────────────────────────────
//  LOG ENTRY
// ─────────────────────────────────────────────────────────────────────────────

function logEntry() {
  if (state.selScore === null) { toast('SELECT A SCORE FIRST'); return; }
  const h      = String(state.selHour).padStart(2, '0');
  const detail = document.getElementById('detailInput').value.trim();
  const taskId = document.getElementById('taskSel').value || null;

  setEntry(state.viewDate, h, state.selScore, detail, taskId);
  toast(`LOGGED  ${h}:00  @  ${state.selScore > 0 ? '+' : ''}${state.selScore}`);
  document.getElementById('detailInput').value = '';
  renderAll();
}

function removeEntry(h) {
  delEntry(state.viewDate, h);
  renderAll();
}

// ─────────────────────────────────────────────────────────────────────────────
//  TASK MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

function addTask() {
  const input = document.getElementById('newTaskInput');
  const name  = input.value.trim();
  if (!name) { toast('ENTER A TASK NAME'); input.focus(); return; }

  const tasks    = loadTasks();
  const colorIdx = Object.keys(tasks).length % TASK_COLORS.length;
  const id       = genId();

  tasks[id] = { name, color: TASK_COLORS[colorIdx] };
  saveTasks(tasks);
  input.value = '';
  refreshTaskList();
  refreshTaskSel();
  toast('TASK ADDED: ' + name.toUpperCase());
}

function deleteTask(id) {
  const tasks = loadTasks();
  const name  = tasks[id]?.name || '';
  delete tasks[id];
  saveTasks(tasks);

  const all = loadAll();
  for (const day of Object.values(all)) {
    if (typeof day !== 'object') continue;
    for (const entry of Object.values(day)) {
      if (entry?.taskId === id) entry.taskId = null;
    }
  }
  saveAll(all);

  renderAll();
  toast('TASK REMOVED: ' + name.toUpperCase());
}

function focusTaskManager() {
  document.getElementById('taskManagerCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => document.getElementById('newTaskInput').focus(), 400);
}

// ─────────────────────────────────────────────────────────────────────────────
//  LIVE CLOCK
// ─────────────────────────────────────────────────────────────────────────────

function tick() {
  document.getElementById('headerTime').textContent =
    new Date().toLocaleTimeString(undefined, { hour12: true }).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────────────────────────────────────────

function setupEventListeners() {
  // ── Static navigation ────────────────────────────────────────────────────
  document.getElementById('prevBtn').addEventListener('click', () => shiftDay(-1));
  document.getElementById('nextBtn').addEventListener('click', () => shiftDay(1));
  document.getElementById('todayBtn').addEventListener('click', goToday);
  document.getElementById('dateJump').addEventListener('change', e => jumpToDate(e.target.value));

  // ── Hour navigator ───────────────────────────────────────────────────────
  document.getElementById('prevHourBtn').addEventListener('click', () => changeHour(-1));
  document.getElementById('nextHourBtn').addEventListener('click', () => changeHour(1));

  // ── Log entry ────────────────────────────────────────────────────────────
  document.getElementById('logEntryBtn').addEventListener('click', logEntry);

  // ── Task manager ─────────────────────────────────────────────────────────
  document.getElementById('addTaskBtn').addEventListener('click', addTask);
  document.getElementById('newTaskFocusBtn').addEventListener('click', focusTaskManager);
  document.getElementById('newTaskInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  // ── Event delegation — log groups ────────────────────────────────────────
  // Handles: toggle group collapse, delete entry
  document.getElementById('logGroups').addEventListener('click', e => {
    // Delete entry button
    const delBtn = e.target.closest('.entry-del');
    if (delBtn) { removeEntry(delBtn.dataset.hour); return; }

    // Group header toggle (guard against clicks inside .group-entries)
    const header = e.target.closest('.group-header');
    if (header) toggleGroup(header.dataset.group);
  });

  // Handles: update entry detail on blur/change
  document.getElementById('logGroups').addEventListener('change', e => {
    const field = e.target.closest('.entry-detail-field');
    if (field) updateEntryDetail(field.dataset.date, field.dataset.hour, field.value);
  });

  // ── Event delegation — task list ─────────────────────────────────────────
  document.getElementById('taskList').addEventListener('click', e => {
    const delBtn = e.target.closest('.task-del');
    if (delBtn) deleteTask(delBtn.dataset.id);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────────────────────

setupEventListeners();
buildScoreBtns();
initChart();
renderAll(true);
setInterval(tick, 1000);
tick();