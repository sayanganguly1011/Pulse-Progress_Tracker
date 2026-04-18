import { injectStyles } from './styles.js';
import {
  appState,
  updateState,
  subscribe,
  getTodayKey,
  shiftDate,
  saveEntry,
  deleteEntry,
  getDay,
} from './lib.js';
import { Header, DayNav, Chart, Input, Stats, LogList, Footer } from './components.js';

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
injectStyles();

// ─────────────────────────────────────────
// INIT APP SHELL
// ─────────────────────────────────────────
const app = document.getElementById('app');
app.innerHTML = `
  <div class="shell">
    <header id="header"></header>
    <nav id="dayNav"></nav>
    <div class="main-grid">
      <div class="card">
        <div class="card-micro">hourly output</div>
        <div class="card-heading">DAILY PROGRESS GRAPH</div>
        <div class="chart-wrap"><canvas id="chartCanvas"></canvas></div>
      </div>
      <div class="right-panel">
        <div id="input"></div>
        <div id="stats"></div>
        <div id="logList"></div>
      </div>
    </div>
    <footer id="footer"></footer>
  </div>
  <div id="toast" class="toast"></div>
`;

// ─────────────────────────────────────────
// CREATE COMPONENT INSTANCES
// ─────────────────────────────────────────
const header = new Header(document.getElementById('header'));
const dayNav = new DayNav(document.getElementById('dayNav'));
const chart = new Chart(document.getElementById('chartCanvas'));
const input = new Input(document.getElementById('input'));
const stats = new Stats(document.getElementById('stats'));
const logList = new LogList(document.getElementById('logList'));
const footer = new Footer(document.getElementById('footer'));

// ─────────────────────────────────────────
// SUBSCRIBE ALL COMPONENTS TO STATE
// ─────────────────────────────────────────
subscribe(state => {
  dayNav.render(state);
  chart.render(state);
  stats.render(state);
  logList.render(state);
  footer.render(state);
});

// ─────────────────────────────────────────
// GLOBAL EVENT HANDLERS
// ─────────────────────────────────────────

// Navigate to previous day
window.shiftDay = (delta) => {
  const nk = shiftDate(appState.viewDate, delta);
  if (nk > getTodayKey()) return;
  updateState({ viewDate: nk });
};

// Go to today
window.goToday = () => {
  updateState({ viewDate: getTodayKey() });
};

// Hour selection changed
window.onHourChange = () => {
  const sel = document.getElementById('hourSel');
  document.getElementById('hourDisplay').textContent = sel.value + ':00';
};

// Pick a score button
window.pickScore = (score) => {
  updateState({ selectedScore: score });
  document.querySelectorAll('.score-btn').forEach(btn => {
    btn.classList.toggle('sel', parseInt(btn.dataset.score) === score);
  });
};

// Log entry to storage
window.logEntry = () => {
  if (appState.selectedScore === null) {
    toast('SELECT A SCORE (0–5) FIRST');
    return;
  }
  const hour = document.getElementById('hourSel').value;
  saveEntry(appState.viewDate, hour, appState.selectedScore);
  toast(`LOGGED ${hour}:00 → SCORE ${appState.selectedScore}`);
  flashBtn();
  
  // Update state to trigger re-renders
  updateState({ allData: getDay(appState.viewDate) });
};

// Delete entry
window.removeEntry = (hour) => {
  deleteEntry(appState.viewDate, hour);
  toast(`REMOVED ${hour}:00`);
  updateState({ allData: getDay(appState.viewDate) });
};

// Chart hour selection event
window.addEventListener('chartHourSelect', (e) => {
  const hour = e.detail.hour;
  const sel = document.getElementById('hourSel');
  if (sel) {
    sel.value = hour;
    document.getElementById('hourDisplay').textContent = hour + ':00';
  }
});

// ─────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────
let toastTimeout = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    el.classList.remove('show');
  }, 2200);
}

// ─────────────────────────────────────────
// BUTTON FLASH ANIMATION
// ─────────────────────────────────────────
function flashBtn() {
  const btn = document.getElementById('logBtn');
  btn.textContent = '✓ LOGGED';
  btn.classList.add('ok');
  setTimeout(() => {
    btn.textContent = 'LOG ENTRY';
    btn.classList.remove('ok');
  }, 1300);
}

// ─────────────────────────────────────────
// PERIODIC UPDATES
// ─────────────────────────────────────────
setInterval(() => {
  if (appState.viewDate === getTodayKey()) {
    input.render();
  }
}, 60000);
