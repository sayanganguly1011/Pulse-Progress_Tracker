# 📊 PULSE — Progress Tracker

PULSE is a sleek, interactive web-based productivity tracker designed to help you monitor, analyze, and improve your daily performance. It allows users to log hourly activity scores, organize tasks, and visualize progress through dynamic charts and summaries.

---

## 🚀 Features

* ⏱️ **Hourly Logging**

* 📈 **Dynamic Progress Visualization**
  Real-time charts showing daily momentum and performance trends.

* 🗂️ **Task Management**
  Create, assign, and organize tasks with color-coded grouping.

* 📅 **Date Navigation**
  Track productivity across different days with easy navigation.

* ⚡ **Multilog (Batch Entry)**
  Log multiple hours at once for faster data entry.

* 📊 **Performance Metrics**

  * Efficiency (%)
  * Average Score
  * Net Points
  * Total Logged Hours

* 📆 **7-Day History View**
  Analyze weekly productivity patterns.

* 🔄 **Drag & Drop Interaction**
  Reassign entries between tasks seamlessly.

* 💾 **Local Storage Persistence**
  All data is stored in the browser (no backend required).

---

## 🖥️ Tech Stack

* **HTML5**
* **CSS3**
* **JavaScript (Vanilla)**
* **Chart.js**

---

## 📂 File Manifest

FILE MANIFEST
─────────────
✓ package.json              (root config)
✓ package-lock.json         (root config)
✓ vite.config.js            (root config)
✓ .gitignore                (root config)
✓ index.html                (minimal HTML entry)
✓ src/main.js               (app initialization & wiring)
✓ src/styles.js             (all CSS exported as string)
✓ src/lib.js                (6 libraries: storage, state, dateUtils, statsEngine, chartEngine, constants)
✓ src/components.js         (7 components: Header, DayNav, Chart, Input, Stats, LogList, Footer)

---

## ⚙️ Installation & Usage

1. Create a folder: mkdir pulse-tracker
2. Move all 8 files into it, maintaining the folder structure:
   pulse-tracker/
   ├── package.json
   ├── package-lock.json
   ├── vite.config.js
   ├── index.html
   ├── .gitignore
   └── src/
       ├── main.js
       ├── styles.js
       ├── lib.js
       └── components.js

3. Install dependencies:
   cd pulse-tracker
   npm install

4. Start dev server:
   npm run dev
   (Opens http://localhost:5173 automatically)

5. Build for production:
   npm run build
   Output: dist/index.html (single optimized file)
---

## 📌 How It Works

1. Select an **hour**
2. Assign a **score (-5 to +5)**
3. Optionally add:

   * Task
   * Description
4. Click **LOG ENTRY**
5. View insights in:

   * Daily graph
   * Stats panel
   * Weekly overview

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
