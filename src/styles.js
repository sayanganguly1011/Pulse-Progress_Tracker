const css = /* css */ `
  /* ── DESIGN TOKENS ────────────────────────────────────────────────────────── */
  :root {
    --bg:          #080808;
    --surface:     #101010;
    --surface2:    #181818;
    --surface3:    #1e1e1e;
    --border:      #252525;
    --accent:      #f59e0b;
    --accent-dim:  rgba(245, 158, 11, 0.10);
    --red:         #ef4444;
    --red-dim:     rgba(239, 68, 68, 0.10);
    --green:       #22c55e;
    --green-dim:   rgba(34, 197, 94, 0.10);
    --text:        #c8c8c8;
    --text-dim:    #4a4a4a;
    --text-bright: #f0f0f0;
    --mono:        'JetBrains Mono', monospace;
    --display:     'Bebas Neue', cursive;
  }

  /* ── RESET ─────────────────────────────────────────────────────────────────── */
  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    height: 100%;
    background:  var(--bg);
    color:       var(--text);
    font-family: var(--mono);
    font-size:   13px;
  }

  ::-webkit-scrollbar             { width: 4px; }
  ::-webkit-scrollbar-track       { background: var(--bg); }
  ::-webkit-scrollbar-thumb       { background: var(--border); border-radius: 2px; }

  /* ── LAYOUT SHELL ──────────────────────────────────────────────────────────── */
  .shell {
    max-width:      1140px;
    margin:         0 auto;
    padding:        28px 24px 64px;
    display:        flex;
    flex-direction: column;
    gap:            20px;
  }

  /* ── STATUS COLOURS ────────────────────────────────────────────────────────── */
  .status-low  { color: var(--red)    !important; }
  .status-mid  { color: var(--accent) !important; }
  .status-high { color: var(--green)  !important; }

  /* ── HEADER ─────────────────────────────────────────────────────────────────── */
  header {
    display:         flex;
    align-items:     flex-end;
    justify-content: space-between;
    border-bottom:   1px solid var(--border);
    padding-bottom:  16px;
  }
  .logo       { font-family: var(--display); font-size: 52px; letter-spacing: 6px; color: var(--accent); line-height: 1; }
  .logo-sub   { font-size: 10px; letter-spacing: 3px; color: var(--text-dim); margin-top: 4px; }
  .header-right { text-align: right; }
  .date-big   { font-family: var(--display); font-size: 24px; letter-spacing: 2px; color: var(--text-bright); }
  .time-live  { font-size: 11px; color: var(--text-dim); letter-spacing: 1px; margin-top: 3px; }

  /* ── DAY NAV ────────────────────────────────────────────────────────────────── */
  .day-nav { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  .nav-btn {
    background:   var(--surface);
    border:       1px solid var(--border);
    color:        var(--text);
    font-family:  var(--mono);
    font-size:    11px;
    padding:      6px 14px;
    cursor:       pointer;
    letter-spacing: 1px;
    transition:   all 0.15s;
  }
  .nav-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .nav-btn:disabled              { opacity: 0.12; cursor: not-allowed; }
  .nav-btn.today-btn             { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }

  .nav-date-input {
    background:   var(--surface2);
    border:       1px solid var(--border);
    color:        var(--accent);
    font-family:  var(--mono);
    font-size:    11px;
    padding:      5px 10px;
    cursor:       pointer;
    outline:      none;
    width:        180px;
  }
  .nav-date-input::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; opacity: 0.4; }

  /* ── MAIN GRID ───────────────────────────────────────────────────────────────── */
  .main-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }

  /* ── CARDS ───────────────────────────────────────────────────────────────────── */
  .card          { background: var(--surface); border: 1px solid var(--border); padding: 22px; position: relative; }
  .card-micro    { font-size: 10px; letter-spacing: 2px; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px; }
  .card-heading  { font-family: var(--display); font-size: 19px; letter-spacing: 2px; color: var(--text-bright); margin-bottom: 18px; }
  .chart-wrap    { position: relative; height: 300px; }

  /* ── RIGHT PANEL ──────────────────────────────────────────────────────────────── */
  .right-panel { display: flex; flex-direction: column; gap: 16px; }

  /* ── INPUT CARD ───────────────────────────────────────────────────────────────── */
  .field-label { font-size: 10px; letter-spacing: 2px; color: var(--text-dim); text-transform: uppercase; margin-bottom: 7px; }

  .hour-nav {
    display:         flex;
    align-items:     center;
    justify-content: space-between;
    margin-bottom:   18px;
    background:      var(--surface2);
    border:          1px solid var(--border);
    padding:         10px 12px;
  }
  .hour-arrow {
    background:    none;
    border:        1px solid var(--border);
    color:         var(--text-dim);
    font-family:   var(--mono);
    font-size:     12px;
    padding:       4px 10px;
    cursor:        pointer;
    transition:    all 0.15s;
  }
  .hour-arrow:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .hour-arrow:disabled              { opacity: 0.12; cursor: not-allowed; }
  .hour-center { text-align: center; }
  .hour-big    { font-family: var(--display); font-size: 36px; color: var(--accent); letter-spacing: 4px; line-height: 1; }
  .hour-label  { font-size: 9px; color: var(--text-dim); letter-spacing: 2px; margin-top: 2px; }

  /* ── SCORE GRID ( -5 … +5 ) ───────────────────────────────────────────────── */
  .score-section   { margin-bottom: 14px; }
  .score-zone-label { font-size: 9px; letter-spacing: 2px; color: var(--text-dim); margin-bottom: 5px; }
  .score-row       { display: grid; gap: 5px; margin-bottom: 5px; }
  .score-row.neg-row { grid-template-columns: repeat(5, 1fr); }
  .score-row.pos-row { grid-template-columns: repeat(6, 1fr); }

  .score-btn {
    background:     var(--surface2);
    border:         1px solid var(--border);
    color:          var(--text-dim);
    font-family:    var(--display);
    font-size:      18px;
    padding:        8px 2px;
    cursor:         pointer;
    transition:     all 0.15s;
    text-align:     center;
    line-height:    1;
  }
  .score-btn.neg-btn:hover  { border-color: var(--red);   color: var(--red);   background: var(--red-dim); }
  .score-btn.zero-btn:hover { border-color: var(--text-dim); color: var(--text); }
  .score-btn.pos-btn:hover  { border-color: var(--green); color: var(--green); background: var(--green-dim); }

  .score-btn.sel.neg-btn  { background: var(--red);    border-color: var(--red);    color: #fff; }
  .score-btn.sel.zero-btn { background: var(--surface3); border-color: #555;        color: var(--text-bright); }
  .score-btn.sel.pos-btn  { background: var(--green);  border-color: var(--green);  color: #000; }
  .score-btn.sel.mid-btn  { background: var(--accent);  border-color: var(--accent); color: #000; }

  /* ── TEXT INPUTS ──────────────────────────────────────────────────────────────── */
  .text-input {
    width:        100%;
    background:   var(--surface2);
    border:       1px solid var(--border);
    color:        var(--text);
    font-family:  var(--mono);
    font-size:    11px;
    padding:      8px 10px;
    outline:      none;
    margin-bottom: 12px;
    transition:   border-color 0.15s;
  }
  .text-input:focus        { border-color: var(--accent); }
  .text-input::placeholder { color: var(--text-dim); }

  /* ── TASK ASSIGNMENT ROW ──────────────────────────────────────────────────────── */
  .task-assign-row { display: flex; gap: 6px; margin-bottom: 14px; }

  .task-sel {
    flex:        1;
    background:  var(--surface2);
    border:      1px solid var(--border);
    color:       var(--text);
    font-family: var(--mono);
    font-size:   11px;
    padding:     8px 10px;
    outline:     none;
    cursor:      pointer;
    appearance:  none;
  }
  .new-task-btn {
    background:    var(--surface2);
    border:        1px solid var(--border);
    color:         var(--text-dim);
    font-family:   var(--mono);
    font-size:     10px;
    padding:       0 10px;
    cursor:        pointer;
    white-space:   nowrap;
    letter-spacing: 1px;
    transition:    all 0.15s;
  }
  .new-task-btn:hover { border-color: var(--accent); color: var(--accent); }

  .log-btn {
    width:          100%;
    background:     var(--accent);
    border:         none;
    color:          #000;
    font-family:    var(--display);
    font-size:      24px;
    letter-spacing: 3px;
    padding:        12px;
    cursor:         pointer;
    transition:     background 0.2s;
  }
  .log-btn:hover { background: #fbbf24; }

  /* ── STATS CARD ────────────────────────────────────────────────────────────────── */
  .stat-row { display: flex; justify-content: space-between; align-items: baseline; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .stat-row:last-child { border-bottom: none; }
  .stat-name { font-size: 10px; letter-spacing: 1px; color: var(--text-dim); text-transform: uppercase; }
  .stat-val  { font-family: var(--display); font-size: 24px; letter-spacing: 1px; transition: color 0.3s; }

  /* ── TASK MANAGER ──────────────────────────────────────────────────────────────── */
  .task-add-row { display: flex; gap: 8px; margin-bottom: 14px; }

  .task-add-input {
    flex:        1;
    background:  var(--surface2);
    border:      1px solid var(--border);
    color:       var(--text);
    font-family: var(--mono);
    font-size:   11px;
    padding:     8px 10px;
    outline:     none;
    transition:  border-color 0.15s;
  }
  .task-add-input:focus        { border-color: var(--accent); }
  .task-add-input::placeholder { color: var(--text-dim); }

  .task-add-btn {
    background:    var(--accent-dim);
    border:        1px solid var(--accent);
    color:         var(--accent);
    font-family:   var(--mono);
    font-size:     10px;
    padding:       0 14px;
    cursor:        pointer;
    letter-spacing: 1px;
    white-space:   nowrap;
    transition:    all 0.15s;
  }
  .task-add-btn:hover { background: var(--accent); color: #000; }

  .task-list { display: flex; flex-wrap: wrap; gap: 8px; }

  .task-pill       { display: flex; align-items: center; gap: 6px; background: var(--surface2); border: 1px solid var(--border); padding: 5px 10px; font-size: 11px; }
  .task-dot        { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .task-pill-name  { color: var(--text); letter-spacing: 0.5px; }
  .task-del        { background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 9px; padding: 0 0 0 4px; transition: color 0.15s; }
  .task-del:hover  { color: var(--red); }

  /* ── WEEKLY VELOCITY ───────────────────────────────────────────────────────────── */
  .weekly-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-top: 10px; }

  .week-day         { background: var(--surface2); border: 1px solid var(--border); padding: 12px 8px; text-align: center; cursor: pointer; transition: border-color 0.15s; }
  .week-day:hover   { border-color: var(--text-dim); }
  .week-day.active  { border-color: var(--accent); background: var(--accent-dim); }
  .wd-label         { font-size: 9px; color: var(--text-dim); text-transform: uppercase; margin-bottom: 5px; }
  .wd-pct           { font-family: var(--display); font-size: 20px; line-height: 1; }
  .wd-date          { font-size: 7px; color: var(--text-dim); margin-top: 4px; }

  /* ── ACTIVITY LOG ( GROUPED ) ─────────────────────────────────────────────────── */
  .log-groups  { display: flex; flex-direction: column; gap: 2px; }
  .log-group   { border: 1px solid var(--border); }

  .group-header {
    display:        flex;
    align-items:    center;
    gap:            10px;
    padding:        10px 14px;
    background:     var(--surface2);
    cursor:         pointer;
    border-left:    3px solid var(--text-dim);
    transition:     background 0.15s;
    user-select:    none;
  }
  .group-header:hover { background: var(--surface3); }
  .group-arrow  { font-size: 9px; color: var(--text-dim); min-width: 10px; }
  .group-name   { font-family: var(--display); font-size: 15px; letter-spacing: 1.5px; flex: 1; }
  .group-meta   { font-size: 9px; color: var(--text-dim); letter-spacing: 1px; }
  .group-eff    { font-family: var(--display); font-size: 16px; letter-spacing: 1px; min-width: 48px; text-align: right; }

  .group-entries { display: flex; flex-direction: column; }

  .log-entry {
    display:     flex;
    align-items: center;
    gap:         8px;
    padding:     7px 14px;
    background:  var(--surface);
    border-top:  1px solid var(--border);
  }
  .log-hour      { color: var(--text-dim); min-width: 42px; font-size: 11px; }
  .log-bar-wrap  { flex: 0 0 80px; height: 3px; background: var(--border); position: relative; }
  .log-bar-fill  { height: 100%; position: absolute; top: 0; }
  .log-score     { font-family: var(--display); font-size: 20px; min-width: 32px; text-align: center; }

  .entry-detail-field {
    flex:        1;
    background:  transparent;
    border:      none;
    border-bottom: 1px solid transparent;
    color:       var(--text-dim);
    font-family: var(--mono);
    font-size:   10px;
    outline:     none;
    padding:     2px 4px;
    transition:  all 0.15s;
  }
  .entry-detail-field:focus        { border-bottom-color: var(--border); color: var(--text); }
  .entry-detail-field::placeholder { color: var(--text-dim); opacity: 0.4; }

  .entry-del {
    background:  none;
    border:      none;
    color:       var(--text-dim);
    cursor:      pointer;
    font-size:   9px;
    opacity:     0;
    transition:  all 0.15s;
    padding:     2px 4px;
  }
  .log-entry:hover .entry-del { opacity: 1; }
  .entry-del:hover             { color: var(--red); }

  /* ── FOOTER ──────────────────────────────────────────────────────────────────────── */
  footer { border-top: 1px solid var(--border); padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: var(--text-dim); }

  /* ── TOAST ───────────────────────────────────────────────────────────────────────── */
  .toast {
    position:      fixed;
    bottom:        24px;
    right:         24px;
    background:    var(--surface2);
    border:        1px solid var(--accent);
    color:         var(--accent);
    font-family:   var(--mono);
    font-size:     11px;
    padding:       10px 18px;
    transform:     translateY(60px);
    opacity:       0;
    transition:    all 0.25s;
    z-index:       999;
    pointer-events: none;
    letter-spacing: 1px;
  }
  .toast.show { transform: translateY(0); opacity: 1; }

  /* ── CHART ZERO LINE ──────────────────────────────────────────────────────────────── */
  .chart-zero { position: absolute; left: 0; right: 0; pointer-events: none; }

  /* ── RESPONSIVE ─────────────────────────────────────────────────────────────────── */
  @media (max-width: 820px) {
    .main-grid   { grid-template-columns: 1fr; }
    .weekly-grid { grid-template-columns: repeat(4, 1fr); }
  }
`;

export function injectStyles() {
  const style = document.createElement('style');
  style.dataset.source = 'pulse-styles';
  style.textContent    = css;
  document.head.appendChild(style);
}