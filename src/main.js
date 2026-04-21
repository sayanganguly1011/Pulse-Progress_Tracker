import { injectStyles } from './styles.js';
import {
  state,
  getTodayStr,
  loadAll,
  saveAll,
  getDay,
  loadTasks,
  saveTasks,
  loadTimeFormat,
  TASK_COLORS,
} from './lib.js';
import {
  toast,
  updateFormatButton,
  toggleTimeFormat,
  initHourDropdown,
  buildScoreBtns,
  adjustHour,
  jumpHour,
  updateHourDisplay,
  initChart,
  refreshChart,
  refreshStats,
  refreshTaskList,
  refreshTaskSel,
  renderLogGroups,
  updateToolbar,
  refreshWeekly,
  openMultilog,
  closeMultilog,
} from './components.js';

// ── INJECT STYLES ─────────────────────────────────────────────────────────────
injectStyles();

// ─────────────────────────────────────────────────────────────────────────────
//  RENDER LOOP
// ─────────────────────────────────────────────────────────────────────────────

function renderAll(dateChanged = false) {
  const today = getTodayStr();

  if (dateChanged) {
    document.getElementById('dateJump').value = state.viewDate;
    document.getElementById('headerDate').textContent = new Date(state.viewDate + 'T00:00:00')
      .toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: '2-digit', year: 'numeric',
      })
      .toUpperCase();
  }

  document.getElementById('nextBtn').disabled = (state.viewDate >= today);
  updateHourDisplay();
  refreshChart();
  refreshStats();
  renderLogGroups();
  refreshTaskList();
  refreshTaskSel();
  refreshWeekly(jumpToDate);

  const all = loadAll();
  document.getElementById('footerInfo').textContent =
    `${Object.keys(all).length} DAYS ARCHIVED`;
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
  const nk = d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
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
  state.selScore = null;
  document.querySelectorAll('.score-btn').forEach(b => b.classList.remove('sel'));
  state.selectedEntries.clear();
  renderAll(true);
}

// ─────────────────────────────────────────────────────────────────────────────
//  ENTRY ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

function logEntry() {
  if (state.selScore === null) { toast('SELECT A SCORE FIRST'); return; }
  const h      = String(state.selHour).padStart(2, '0');
  const detail = document.getElementById('detailInput').value.trim();
  const taskId = document.getElementById('taskSel').value || null;
  const all    = loadAll();

  if (!all[state.viewDate]) all[state.viewDate] = {};
  all[state.viewDate][h] = {
    score:  state.selScore,
    detail: detail || '',
    taskId: taskId || null,
  };

  try {
    saveAll(all);
    const sign = state.selScore > 0 ? '+' : '';
    toast(`LOGGED ${h}:00 @ ${sign}${state.selScore}`);
    document.getElementById('detailInput').value = '';
    renderAll();
  } catch {
    toast('STORAGE FULL — Data not saved!', true);
  }
}

function removeEntry(h) {
  const all = loadAll();
  if (all[state.viewDate]) {
    delete all[state.viewDate][h];
    if (!Object.keys(all[state.viewDate]).length) delete all[state.viewDate];
  }
  state.selectedEntries.delete(h);
  try { saveAll(all); renderAll(); }
  catch { toast('STORAGE FULL', true); }
}

function updateEntryDetail(date, h, val) {
  const all = loadAll();
  if (all[date]?.[h]) {
    all[date][h].detail = val;
    try { saveAll(all); } catch { toast('STORAGE FULL', true); }
  }
}

function clearHourSlot() {
  const h   = String(state.selHour).padStart(2, '0');
  const all = loadAll();
  if (all[state.viewDate]?.[h]) {
    delete all[state.viewDate][h];
    if (!Object.keys(all[state.viewDate]).length) delete all[state.viewDate];
    try { saveAll(all); toast(`CLEARED HOUR ${h}:00`); renderAll(); }
    catch { toast('STORAGE FULL', true); }
  } else {
    toast('NO DATA IN THIS SLOT');
  }
}

function clearFullDay() {
  if (!confirm('Permanently delete all logs for this day?')) return;
  const all = loadAll();
  if (all[state.viewDate]) {
    delete all[state.viewDate];
    try { saveAll(all); toast('DAY LOGS PURGED'); renderAll(); }
    catch { toast('STORAGE FULL', true); }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  DRAG & DROP (entry → task)
// ─────────────────────────────────────────────────────────────────────────────

function onEntryDragStart(e, h) {
  state.draggedHour = h;
  e.target.closest('.log-entry')?.classList.add('dragging');
  e.dataTransfer.setData('text/plain', h);
}

function onEntryDragEnd(e) {
  e.target.closest('.log-entry')?.classList.remove('dragging');
  document.querySelectorAll('.log-group').forEach(g => g.classList.remove('drag-over'));
}

// ─────────────────────────────────────────────────────────────────────────────
//  TASK ASSIGNMENT (inline mini-select)
// ─────────────────────────────────────────────────────────────────────────────

function moveEntryToTask(hour, targetTaskId) {
  const all = loadAll();
  if (all[state.viewDate]?.[hour]) {
    all[state.viewDate][hour].taskId = targetTaskId === '__u__' ? null : targetTaskId;
    try {
      saveAll(all);
      const tasks    = loadTasks();
      const taskName = targetTaskId === '__u__'
        ? 'UNASSIGNED'
        : (tasks[targetTaskId]?.name?.toUpperCase() || 'TASK');
      toast(`MOVED ${hour}:00 TO ${taskName}`);
      renderAll();
    } catch {
      toast('STORAGE FULL', true);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  MULTI-SELECT
// ─────────────────────────────────────────────────────────────────────────────

function toggleEntrySelect(h) {
  if (state.selectedEntries.has(h)) state.selectedEntries.delete(h);
  else state.selectedEntries.add(h);
  renderLogGroups();
  updateToolbar();
}

function bulkDeleteSelected() {
  if (state.selectedEntries.size === 0) { toast('NO ENTRIES SELECTED'); return; }
  const count = state.selectedEntries.size;
  if (!confirm(`Delete ${count} selected entr${count === 1 ? 'y' : 'ies'}?`)) return;

  const all = loadAll();
  state.selectedEntries.forEach(h => {
    if (all[state.viewDate]) delete all[state.viewDate][h];
  });
  if (all[state.viewDate] && !Object.keys(all[state.viewDate]).length) {
    delete all[state.viewDate];
  }
  try {
    saveAll(all);
    state.selectedEntries.clear();
    toast(`DELETED ${count} ENTR${count === 1 ? 'Y' : 'IES'}`);
    renderAll();
  } catch {
    toast('STORAGE FULL', true);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  TASK MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

function addTask() {
  const input = document.getElementById('newTaskInput');
  const name  = input.value.trim();
  if (!name) return;

  const tasks    = loadTasks();
  const id       = Date.now().toString(36);
  tasks[id]      = { name, color: TASK_COLORS[Object.keys(tasks).length % TASK_COLORS.length] };

  try {
    saveTasks(tasks);
    input.value = '';
    renderAll();
  } catch {
    toast('STORAGE FULL — Task not saved!', true);
  }
}

function deleteTask(id) {
  const tasks = loadTasks();
  delete tasks[id];
  try { saveTasks(tasks); } catch { toast('STORAGE FULL', true); return; }

  const all = loadAll();
  for (const day of Object.values(all)) {
    if (typeof day !== 'object') continue;
    for (const entry of Object.values(day)) {
      if (entry?.taskId === id) entry.taskId = null;
    }
  }
  try { saveAll(all); renderAll(); }
  catch { toast('STORAGE FULL', true); }
}

function focusTaskManager() {
  document.getElementById('taskManagerCard')
    .scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => document.getElementById('newTaskInput').focus(), 400);
}

// ─────────────────────────────────────────────────────────────────────────────
//  MULTILOG MODAL ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

function multilogLogToSelected() {
  if (state.multilogSelectedHours.size === 0) { toast('SELECT AT LEAST ONE HOUR'); return; }
  if (state.multilogScore === null)            { toast('SELECT A SCORE FIRST');    return; }

  const detail = document.getElementById('multilogDetail').value.trim();
  const taskId = document.getElementById('multilogTaskSel').value || null;
  const all    = loadAll();
  if (!all[state.viewDate]) all[state.viewDate] = {};

  state.multilogSelectedHours.forEach(h => {
    all[state.viewDate][h] = {
      score:  state.multilogScore,
      detail: detail || '',
      taskId,
    };
  });

  try {
    saveAll(all);
    const count = state.multilogSelectedHours.size;
    toast(`LOGGED TO ${count} HOUR${count === 1 ? '' : 'S'}`);
    renderAll();
  } catch {
    toast('STORAGE FULL', true);
  }
}

function multilogAutoFill(overwrite) {
  if (state.multilogSelectedHours.size === 0) { toast('SELECT AT LEAST ONE HOUR'); return; }
  if (state.multilogScore === null)            { toast('SELECT A SCORE FIRST');    return; }

  const detail  = document.getElementById('multilogDetail').value.trim();
  const taskId  = document.getElementById('multilogTaskSel').value || null;
  const all     = loadAll();
  if (!all[state.viewDate]) all[state.viewDate] = {};

  const hours   = Array.from(state.multilogSelectedHours, h => parseInt(h, 10));
  const minHour = Math.min(...hours);
  const maxHour = Math.max(...hours);
  let filled    = 0;

  for (let i = minHour; i <= maxHour; i++) {
    const hStr    = String(i).padStart(2, '0');
    const hasEntry = all[state.viewDate][hStr];
    if (overwrite || !hasEntry) {
      all[state.viewDate][hStr] = { score: state.multilogScore, detail: detail || '', taskId };
      filled++;
    }
  }

  try {
    saveAll(all);
    const mode = overwrite ? 'OVERWRITE' : 'EMPTY';
    toast(`AUTOFILLED ${filled} HOUR${filled === 1 ? '' : 'S'} (${mode})`);
    renderAll();
  } catch {
    toast('STORAGE FULL', true);
  }
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
  // ── Day navigation ────────────────────────────────────────────────────────
  document.getElementById('prevBtn').addEventListener('click',  () => shiftDay(-1));
  document.getElementById('nextBtn').addEventListener('click',  () => shiftDay(1));
  document.getElementById('todayBtn').addEventListener('click', goToday);
  document.getElementById('dateJump').addEventListener('change', e => jumpToDate(e.target.value));

  // ── Time format toggle ────────────────────────────────────────────────────
  document.getElementById('formatToggleBtn').addEventListener('click',
    () => toggleTimeFormat(renderAll),
  );

  // ── Hour navigator ────────────────────────────────────────────────────────
  document.getElementById('prevHourCtrl').addEventListener('click', () => adjustHour(-1));
  document.getElementById('nextHourCtrl').addEventListener('click', () => adjustHour(1));
  document.getElementById('hourSelect').addEventListener('change',  e => jumpHour(e.target.value));

  // ── Log entry ──────────────────────────────────────────────────────────────
  document.getElementById('logEntryBtn').addEventListener('click',    logEntry);
  document.getElementById('clearHourBtn').addEventListener('click',   clearHourSlot);
  document.getElementById('multilogOpenBtn').addEventListener('click', openMultilog);

  // ── Task manager ───────────────────────────────────────────────────────────
  document.getElementById('addTaskBtn').addEventListener('click',     addTask);
  document.getElementById('newTaskFocusBtn').addEventListener('click', focusTaskManager);
  document.getElementById('newTaskInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  // ── Bulk  clear ──────────────────────────────────────────────────────────
  document.getElementById('bulkDeleteBtn').addEventListener('click', bulkDeleteSelected);
  document.getElementById('clearDayBtn').addEventListener('click',   clearFullDay);

  // ── Multilog modal buttons ────────────────────────────────────────────────
  document.getElementById('multilogLogBtn').addEventListener('click',
    multilogLogToSelected);
  document.getElementById('multilogAutoFillEmptyBtn').addEventListener('click',
    () => multilogAutoFill(false));
  document.getElementById('multilogAutoFillAllBtn').addEventListener('click',
    () => multilogAutoFill(true));
  document.getElementById('multilogCloseBtn').addEventListener('click', closeMultilog);

  // Close modal when clicking the overlay backdrop
  document.getElementById('multilogModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeMultilog();
  });

  // ── Multilog hour checkboxes  ───────────────
  document.getElementById('multilogHourGrid').addEventListener('change', e => {
    const cb = e.target.closest('[data-modal-hour]');
    if (!cb) return;
    const h = cb.dataset.modalHour;
    if (cb.checked) state.multilogSelectedHours.add(h);
    else            state.multilogSelectedHours.delete(h);
  });

  // ── Log groups — event delegation ──────────────────────────────────────────
  const logGroups = document.getElementById('logGroups');

  logGroups.addEventListener('click', e => {
    const action = e.target.dataset.action ||
                   e.target.closest('[data-action]')?.dataset.action;

    if (action === 'delete-entry') {
      removeEntry(e.target.closest('[data-action]').dataset.hour);
      return;
    }

    // Bare row click (not on an interactive child) → toggle select
    const entry = e.target.closest('.log-entry');
    if (!entry) return;
    const isInteractive = e.target.closest(
      'input, select, button, .entry-detail-field, .drag-handle',
    );
    if (!isInteractive) toggleEntrySelect(entry.dataset.hour);
  });

  logGroups.addEventListener('change', e => {
    const action = e.target.dataset.action;
    if (action === 'select') {
      toggleEntrySelect(e.target.dataset.hour);
    }
    if (action === 'update-detail') {
      updateEntryDetail(e.target.dataset.date, e.target.dataset.hour, e.target.value);
    }
    if (action === 'assign-task') {
      const sel = e.target.closest('[data-action="assign-task"]');
      if (sel) moveEntryToTask(sel.dataset.hour, sel.value);
    }
  });

  // Drag events on entry drag handles
  logGroups.addEventListener('dragstart', e => {
    const handle = e.target.closest('[data-action="drag-handle"]');
    if (handle) onEntryDragStart(e, handle.dataset.hour);
  });
  logGroups.addEventListener('dragend', e => {
    if (e.target.closest('[data-action="drag-handle"]')) onEntryDragEnd(e);
  });

  // ── Task list — event delegation ──────────────────────────────────────────
  document.getElementById('taskList').addEventListener('click', e => {
    const del = e.target.closest('.task-del');
    if (del) deleteTask(del.dataset.id);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────────────────────

loadTimeFormat();          // restore persisted 12h/24h preference
updateFormatButton();      // reflect it on the toggle button
setupEventListeners();
initHourDropdown();
buildScoreBtns();
initChart();
renderAll(true);
setInterval(tick, 1000);
tick();
