export const styles = `
  :root {
    --bg: #080808;
    --surface: #101010;
    --surface2: #181818;
    --border: #252525;
    --accent: #f59e0b;
    --accent-dim: rgba(245,158,11,0.12);
    --red: #ef4444;
    --green: #22c55e;
    --text: #c8c8c8;
    --text-dim: #4a4a4a;
    --text-bright: #f0f0f0;
    --mono: 'JetBrains Mono', monospace;
    --display: 'Bebas Neue', cursive;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--mono); font-size: 13px; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .shell {
    max-width: 1120px;
    margin: 0 auto;
    padding: 28px 24px 48px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 100vh;
  }

  /* HEADER */
  header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    padding-bottom: 16px;
  }
  .logo {
    font-family: var(--display);
    font-size: 52px;
    letter-spacing: 6px;
    color: var(--accent);
    line-height: 1;
  }
  .logo-sub {
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--text-dim);
    margin-top: 4px;
  }
  .header-right { text-align: right; }
  .date-big {
    font-family: var(--display);
    font-size: 24px;
    letter-spacing: 2px;
    color: var(--text-bright);
  }
  .time-live {
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 1px;
    margin-top: 3px;
  }

  /* DAY NAV */
  .day-nav {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .nav-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--mono);
    font-size: 11px;
    padding: 6px 14px;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.15s;
  }
  .nav-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .nav-btn:disabled { opacity: 0.25; cursor: not-allowed; }
  .nav-btn.today-btn {
    background: var(--accent-dim);
    border-color: var(--accent);
    color: var(--accent);
  }
  .nav-date-label {
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 1px;
    min-width: 150px;
    text-align: center;
  }

  /* MAIN GRID */
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 290px;
    gap: 20px;
  }

  /* CARDS */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 22px;
  }
  .card-micro {
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--text-dim);
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .card-heading {
    font-family: var(--display);
    font-size: 19px;
    letter-spacing: 2px;
    color: var(--text-bright);
    margin-bottom: 18px;
  }

  /* CHART */
  .chart-wrap { position: relative; height: 300px; }

  /* RIGHT PANEL */
  .right-panel { display: flex; flex-direction: column; gap: 16px; }

  /* INPUT CARD */
  .hour-big {
    font-family: var(--display);
    font-size: 42px;
    color: var(--accent);
    letter-spacing: 4px;
    line-height: 1;
    margin-bottom: 14px;
  }
  .field-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--text-dim);
    text-transform: uppercase;
    margin-bottom: 7px;
  }
  .hour-select {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--mono);
    font-size: 12px;
    padding: 9px 10px;
    outline: none;
    cursor: pointer;
    margin-bottom: 16px;
    appearance: none;
    transition: border-color 0.15s;
  }
  .hour-select:focus { border-color: var(--accent); }
  .score-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;
    margin-bottom: 16px;
  }
  .score-btn {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text-dim);
    font-family: var(--display);
    font-size: 22px;
    padding: 10px 4px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
  }
  .score-btn:hover { border-color: var(--accent); color: var(--accent); }
  .score-btn.sel { background: var(--accent); border-color: var(--accent); color: #000; }
  .log-btn {
    width: 100%;
    background: var(--accent);
    border: none;
    color: #000;
    font-family: var(--display);
    font-size: 24px;
    letter-spacing: 3px;
    padding: 13px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .log-btn:hover { background: #fbbf24; transform: translateY(-1px); }
  .log-btn:active { transform: translateY(0); }
  .log-btn.ok { background: var(--green); animation: pulse 0.4s ease; }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }

  /* STATS CARD */
  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }
  .stat-row:last-child { border-bottom: none; }
  .stat-name { font-size: 10px; letter-spacing: 1px; color: var(--text-dim); text-transform: uppercase; }
  .stat-val { font-family: var(--display); font-size: 24px; color: var(--accent); letter-spacing: 1px; }
  .stat-val.sm { font-size: 16px; color: var(--text); }

  /* LOG LIST */
  .log-list { max-height: 130px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
  .log-entry {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px;
    background: var(--surface2);
    border-left: 2px solid var(--border);
    font-size: 11px;
    animation: slidein 0.2s ease;
  }
  @keyframes slidein { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
  .log-hour { color: var(--text-dim); min-width: 38px; }
  .log-bar { flex: 1; height: 2px; background: var(--border); }
  .log-bar-fill { height: 100%; background: var(--accent); transition: width 0.4s ease; }
  .log-score { font-family: var(--display); font-size: 18px; color: var(--accent); min-width: 18px; text-align: right; }
  .del-btn {
    background: none; border: none; color: var(--text-dim);
    cursor: pointer; font-size: 10px; padding: 0 2px;
    opacity: 0; transition: opacity 0.15s;
  }
  .log-entry:hover .del-btn { opacity: 1; }
  .del-btn:hover { color: var(--red); }
  .empty-log { color: var(--text-dim); font-size: 11px; padding: 8px; letter-spacing: 1px; }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--text-dim);
    letter-spacing: 1px;
  }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 24px; right: 24px;
    background: var(--surface2);
    border: 1px solid var(--accent);
    color: var(--accent);
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 1px;
    padding: 10px 18px;
    transform: translateY(60px);
    opacity: 0;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    pointer-events: none;
    z-index: 999;
  }
  .toast.show { transform: translateY(0); opacity: 1; }

  /* RESPONSIVE */
  @media (max-width: 800px) {
    .main-grid { grid-template-columns: 1fr; }
    .right-panel { flex-direction: row; flex-wrap: wrap; }
    .card { flex: 1 1 260px; }
  }
`;

export function injectStyles() {
  const style = document.createElement('style');
  style.textContent = styles;
  document.head.appendChild(style);
}
