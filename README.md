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

## ⚙️ Installation & Usage

1. Create a folder: mkdir pulse-tracker
2. Move all 9 files into it, maintaining the folder structure:
PULSE-PROGRESS-TRACKER/
├── src/
│   ├── components.js       # UI Components (Header, Chart, Stats, etc.)
│   ├── lib.js              # Core Logic (Storage, Stats Engine, Chart Engine)
│   ├── main.js             # App initialization & entry point
│   └── styles.js           # Global styles exported as JS strings
├── index.html              # Minimal HTML entry point
├── vite.config.js          # Vite configuration settings
├── package.json            # Project dependencies & scripts
├── package-lock.json       # Locked dependency versions
└── .gitignore              # Files excluded from Git (node_modules)

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
