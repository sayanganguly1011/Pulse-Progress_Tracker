# 📊 PULSE — Progress Tracker

PULSE is a sleek, interactive web-based productivity tracker designed to help you monitor, analyze, and improve your daily performance. It allows users to log hourly activity scores, organize tasks, and visualize progress through dynamic charts and summaries.

---

## 🚀 Features

* ⏱️ **Hourly Logging**
  Log a score (-5 to +5) for any hour of the day with optional task and description.

* 📈 **Dual-Chart Visualization**
  Real-time bar chart overlaid with an amber momentum line showing daily performance trends.

* 🗂️ **Task Management**
  Create, assign, and color-code tasks. Reassign entries inline directly from the log.

* 📅 **Date Navigation**
  Track productivity across different days with prev/next buttons, a date picker, and a Today shortcut.

* ⚡ **Multilog (Batch Entry)**
  Log multiple hours at once — select individual hours or autofill a range (empty only or overwrite).

* 🗑️ **Multi-Select & Bulk Delete**
  Check multiple log entries and delete them all at once via the toolbar.

* 🧹 **Clear Controls**
  Clear a single hour slot or purge all data for the current day.

* 📊 **Performance Metrics**
  * Efficiency (%)
  * Average Score
  * Net Points
  * Total Logged Hours

* 📆 **7-Day History View**
  Analyze weekly productivity patterns. Click any day to jump to it.

* 🔄 **Drag & Drop Interaction**
  Grab the handle on any log entry to reassign it between tasks.

* 💾 **Local Storage Persistence**
  All data is stored in the browser — no backend required.

---

## 🖥️ Tech Stack

* **HTML5**
* **CSS3**
* **JavaScript**
* **Chart.js**
* **Vite** (build tool & dev server)

---

## ⚙️ Installation & Usage

1. Create a folder:
   ```
   mkdir pulse-tracker
   ```

2. Move all files into it, maintaining the folder structure:
   ```
   pulse-tracker/
   ├── src/
   │   ├── components.js     # All DOM rendering, Chart.js, and UI builders
   │   ├── lib.js            # Constants, shared state, storage, pure utilities
   │   ├── main.js           # Entry point — event wiring, action handlers, init
   │   └── styles.js         # All CSS injected at runtime
   ├── index.html            # App shell — zero inline event handlers
   ├── vite.config.js        # Vite configuration
   ├── package.json          # Project dependencies & scripts
   ├── package-lock.json     # Locked dependency versions
   └── .gitignore            # Excludes node_modules from Git
   ```

3. Install dependencies:
   ```
   cd pulse-tracker
   npm install
   ```

4. Start the dev server:
   ```
   npm run dev
   ```
   Opens automatically at `http://localhost:5173`

5. Build for production:
   ```
   npm run build
   ```
   Output: `dist/` folder with optimized files including a separate vendor chunk for Chart.js.

6. Preview the production build locally:
   ```
   npm run preview
   ```

---

## 📌 How It Works

1. Select an **hour** using the dropdown or prev/next arrows
2. Assign a **score** (-5 to +5)
3. Optionally add:
   * A task
   * A description
4. Click **LOG ENTRY**
5. View insights in:
   * Daily dual-chart graph
   * Stats panel
   * Weekly overview
   * Entry log with inline controls

---

## 🎯 Use Cases

* Personal productivity tracking
* Study/work performance monitoring
* Habit tracking with scoring
* Time management improvement

---

## 🔮 Future Improvements

* Cloud sync / backend integration
* User authentication
* Export data (CSV / JSON)
* Mobile responsiveness
* Advanced analytics

---

## 👨‍💻 Author

**Sayan Ganguly**
GitHub: [https://github.com/sayanganguly1011](https://github.com/sayanganguly1011)