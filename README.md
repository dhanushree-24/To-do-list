# Interactive To-Do List with LocalStorage

> **Project 02 | Fullstack Web Development — InternCircle**  
> A dynamic, responsive task management application built with HTML5, CSS3, and Vanilla JavaScript, featuring complete `localStorage` persistence, state management, event delegation, and real-time task filtering.

---

## 🚀 Live Demo & Repository
- **GitHub Repository**: *(Add your repository link here upon pushing)*
- **Live Deployment**: *(Add your GitHub Pages / Netlify / Vercel link here)*

---

## 📋 Features Implemented

- ✅ **Add Tasks**: Seamless task creation with `<form>` submission (supports Enter key and click).
- ✅ **Toggle Complete / Undo**: Easily toggle tasks between active and completed states with custom check icons and strike-through styling.
- ✅ **Delete Tasks**: Remove individual tasks instantaneously.
- ✅ **Rejection of Empty Tasks**: Validates input using `.trim()`, preventing whitespace or empty tasks with a helpful warning message.
- ✅ **Data Persistence (`localStorage`)**:
  - Automatically saves tasks on every change using `JSON.stringify()`.
  - Automatically loads and parses stored data on startup using `JSON.parse()`.
  - Resilient against corrupted data using a safe `try...catch` fallback.
- ✅ **Live Task Counter**: Accurately tracks and displays active tasks remaining (`X tasks left`).
- ✅ **Filter Controls**: Real-time filtering by **All**, **Active**, and **Done** tabs.
- ✅ **Clear Completed**: One-click action to remove all completed tasks.
- ✅ **XSS Protection**: Securely displays user-generated text using `textContent` instead of vulnerable `innerHTML`.
- ✅ **Modern & Responsive UI**: Clean card design with smooth transitions, custom scrollbars, and mobile responsiveness.

---

## 🛠️ How Saving and Loading Data Works

*(You can copy this section for your InternCircle submission description)*

### 1. Saving Data (`save()` function)
Browser `localStorage` only stores string key-value pairs. Therefore:
- The entire application state is stored in a JavaScript array of objects called `tasks` (e.g., `[{ id: 1711200000000, text: 'Buy milk', done: false }]`).
- When any state-changing event occurs (adding, toggling, or deleting a task), `save()` serializes the `tasks` array into a JSON string via `JSON.stringify(tasks)` and stores it under the key `"tasks"`:
  ```javascript
  function save() {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (err) {
      console.error("Unable to save tasks to localStorage:", err);
    }
  }
  ```

### 2. Loading Data (`load()` function)
When the webpage loads:
- `load()` retrieves the stored string from `localStorage.getItem("tasks")`.
- It parses the string back into a JavaScript array using `JSON.parse()`.
- To prevent malformed or manually edited storage data from crashing the entire app, the parsing is wrapped in a `try...catch` block. If parsing fails or no data exists, it gracefully returns an empty array `[]`:
  ```javascript
  function load() {
    try {
      const data = localStorage.getItem("tasks");
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("Storage corrupted or unparseable. Falling back to empty task list.", err);
      return [];
    }
  }
  ```

---

## 🧪 Pre-Submission Checklist Verification

| Requirement | Status | How It Was Verified |
| :--- | :---: | :--- |
| **Tasks can be added, completed and deleted** | Pass | Form adds items to `tasks` array; event delegation handles toggle and deletion. |
| **Empty tasks are rejected** | Pass | Checked with `.trim()`; ignores empty strings and informs the user. |
| **Data survives a page reload** | Pass | All mutations write to `localStorage` and hydrate back on reload. |
| **Corrupted storage does not break the app** | Pass | `JSON.parse` is isolated inside a `try...catch` block returning `[]`. |
| **The remaining-tasks counter is always right** | Pass | Dynamically calculated using `tasks.filter(t => !t.done).length`. |
| **User text shown with `textContent`, not `innerHTML`** | Pass | `span.textContent = t.text` ensures safe DOM node text insertion. |

---

## 💻 Running the Project Locally

1. Open the project folder (`interactive-todo-list`) in **VS Code**.
2. Right-click `index.html` and select **"Open with Live Server"** (or simply double-click `index.html` to open it in any web browser).
3. Try adding tasks, checking them off, switching filter tabs, and refreshing the browser to verify data persistence!
