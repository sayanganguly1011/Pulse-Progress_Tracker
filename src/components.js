import {
  appState,
  updateState,
  getTodayKey,
  formatHeaderDate,
  formatTime,
  shiftDate,
  computeStats,
  getDay,
  loadAll,
  deleteEntry,
  initChart,
  updateChart,
} from './lib.js';

// ─────────────────────────────────────────
// HEADER — Logo, date, live clock
// ─────────────────────────────────────────
export class Header {
  constructor(el) {
    this.el = el;
    this.clockInterval = null;
    this.render();
  }

  render() {
    this.el.innerHTML = `
      <div>
        <div class="logo">PULSE</div>
        <div class="logo-sub">// DAILY PROGRESS TRACKER</div>
      </div>
      <div class="header-right">
        <div class="date-big" id="headerDate">${formatHeaderDate(getTodayKey())}</div>
        <div class="time-live" id="headerTime">${formatTime()}</div>
      </div>
    `;
    this.startClock();
  }

  startClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = setInterval(() => {
      const time = document.getElementById('headerTime');
      if (time) time.textContent = formatTime();
    }, 1000);
  }

  destroy() {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }
}

// ─────────────────────────────────────────
// DAYNAV — Previous/Next/Today buttons
// ─────────────────────────────────────────
export class DayNav {
  constructor(el) {
    this.el = el;
  }

  render(state) {
    const isToday = state.viewDate === getTodayKey();
    this.el.innerHTML = `
      <div class="day-nav">
        <button class="nav-btn" onclick="window.shiftDay(-1)">◀ PREV</button>
        <span class="nav-date-label" id="navLabel">
          ${isToday ? `TODAY — ${state.viewDate}` : state.viewDate}
        </span>
        <button class="nav-btn" id="nextBtn" onclick="window.shiftDay(1)" ${isToday ? 'disabled' : ''}>NEXT ▶</button>
        <button class="nav-btn today-btn" onclick="window.goToday()">TODAY</button>
      </div>
    `;
  }
}

// ─────────────────────────────────────────
// CHART — 24-hour progress bar visualization
// ─────────────────────────────────────────
export class Chart {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    initChart(this.canvas);
  }

  render(state) {
    const dayData = getDay(state.viewDate);
    updateChart(dayData, state.viewDate);
  }
}

// ─────────────────────────────────────────
// INPUT — Hour select, score buttons, log button
// ─────────────────────────────────────────
export class Input {
  constructor(el) {
    this.el = el;
    this.selectedScore = null;
    this.currentHour = String(new Date().getHours()).padStart(2, '0');
    this.render();
    this.attachListeners();
  }

  render() {
    const isToday = appState.viewDate === getTodayKey();
    const curH = new Date().getHours();

    let hourOptions = '';
    for (let h = 0; h < 24; h++) {
      const hh = String(h).padStart(2, '0');
      const selected = isToday && h === curH ? 'selected' : '';
      const marker = isToday && h === curH ? ' ← NOW' : '';
      hourOptions += `<option value="${hh}" ${selected}>${hh}:00 – ${hh}:59${marker}</option>`;
    }

    let scoreButtons = '';
    for (let s = 0; s <= 5; s++) {
      scoreButtons += `<button class="score-btn" data-score="${s}" onclick="window.pickScore(${s})">${s}</button>`;
    }

    this.el.innerHTML = `
      <div class="card">
        <div class="card-micro">log entry</div>
        <div class="hour-big" id="hourDisplay">${this.currentHour}:00</div>

        <div class="field-label">select hour</div>
        <select class="hour-select" id="hourSel" onchange="window.onHourChange()">${hourOptions}</select>

        <div class="field-label">score &nbsp;0 — 5</div>
        <div class="score-grid" id="scoreGrid">${scoreButtons}</div>

        <button class="log-btn" id="logBtn" onclick="window.logEntry()">LOG ENTRY</button>
      </div>
    `;
    this.attachListeners();
  }

  attachListeners() {
    const sel = document.getElementById('hourSel');
    if (sel) {
      sel.addEventListener('change', () => {
        this.currentHour = sel.value;
        document.getElementById('hourDisplay').textContent = sel.value + ':00';
      });
    }

    const hourSelect = document.getElementById('hourSel');
    if (hourSelect && appState.viewDate === getTodayKey()) {
      const curH = new Date().getHours();
      hourSelect.value = String(curH).padStart(2, '0');
      this.currentHour = String(curH).padStart(2, '0');
    }
  }

  setSelectedScore(score) {
    this.selectedScore = score;
    document.querySelectorAll('.score-btn').forEach(btn => {
      const btnScore = parseInt(btn.dataset.score);
      btn.classList.toggle('sel', btnScore === score);
    });
  }
}

// ─────────────────────────────────────────
// STATS — Average, peak, total calculations
// ─────────────────────────────────────────
export class Stats {
  constructor(el) {
    this.el = el;
  }

  render(state) {
    const dayData = getDay(state.viewDate);
    const stats = computeStats(dayData);

    let html = `
      <div class="card">
        <div class="card-micro">daily stats</div>
    `;

    if (stats.logged === 0) {
      html += `
        <div class="stat-row">
          <span class="stat-name">Avg Score</span>
          <span class="stat-val">—</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Peak Hour</span>
          <span class="stat-val sm">—</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Hours Logged</span>
          <span class="stat-val">0</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Total Points</span>
          <span class="stat-val">0</span>
        </div>
      `;
    } else {
      html += `
        <div class="stat-row">
          <span class="stat-name">Avg Score</span>
          <span class="stat-val">${stats.average}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Peak Hour</span>
          <span class="stat-val sm">${stats.peakHour}:00 (${stats.peak})</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Hours Logged</span>
          <span class="stat-val">${stats.logged}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Total Points</span>
          <span class="stat-val">${stats.total}</span>
        </div>
      `;
    }

    html += `</div>`;
    this.el.innerHTML = html;
  }
}

// ─────────────────────────────────────────
// LOGLIST — Entry log with delete buttons
// ─────────────────────────────────────────
export class LogList {
  constructor(el) {
    this.el = el;
  }

  render(state) {
    const dayData = getDay(state.viewDate);
    const entries = Object.entries(dayData).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    let logHtml = '';
    if (entries.length === 0) {
      logHtml = '<div class="empty-log">NO ENTRIES YET</div>';
    } else {
      logHtml = entries
        .map(
          ([h, s]) => `
        <div class="log-entry">
          <span class="log-hour">${h}:00</span>
          <div class="log-bar"><div class="log-bar-fill" style="width:${(s / 5) * 100}%"></div></div>
          <span class="log-score">${s}</span>
          <button class="del-btn" onclick="window.removeEntry('${h}')" title="Remove">✕</button>
        </div>
      `
        )
        .join('');
    }

    this.el.innerHTML = `
      <div class="card">
        <div class="card-micro" style="margin-bottom:10px">entry log</div>
        <div class="log-list">${logHtml}</div>
      </div>
    `;
  }
}

// ─────────────────────────────────────────
// FOOTER — Stats summary
// ─────────────────────────────────────────
export class Footer {
  constructor(el) {
    this.el = el;
  }

  render(state) {
    const all = loadAll();
    const days = Object.keys(all).length;
    const entries = Object.values(all).reduce(
      (s, d) => s + Object.keys(d).length,
      0
    );

    this.el.innerHTML = `
      <span>PULSE — DATA STORED LOCALLY</span>
      <span id="footerInfo">${days} DAY${days !== 1 ? 'S' : ''} TRACKED — ${entries} TOTAL ENTRIES</span>
    `;
  }
}
