// =========================================================
// TaskMaster - Interactive To-Do List with LocalStorage
// InternCircle Fullstack Web Development - Project 02
// =========================================================

// --- 1. State Management ---
let tasks = load();
let currentFilter = "all"; // 'all' | 'active' | 'done'

// --- 2. DOM Elements ---
const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const countDisplay = document.getElementById("count");
const statsDisplay = document.getElementById("completion-stats");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyState = document.getElementById("empty-state");
const inputError = document.getElementById("input-error");
const currentDateBadge = document.getElementById("current-date");

// Display today's date
if (currentDateBadge) {
  const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
  currentDateBadge.textContent = new Date().toLocaleDateString(undefined, options);
}

// --- 3. LocalStorage Handlers ---

/**
 * Loads tasks from localStorage safely.
 * Uses JSON.parse inside try/catch so corrupted or invalid data will not break the app.
 * @returns {Array} Array of task objects
 */
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

/**
 * Persists the current tasks array to localStorage as a JSON string.
 */
function save() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (err) {
    console.error("Unable to save tasks to localStorage:", err);
  }
}

// --- 4. Render Function ---

/**
 * Rebuilds the DOM from the tasks array based on the active filter.
 * Ensures all user-supplied text is safely assigned via textContent (preventing XSS).
 */
function render() {
  // Clear the list before repopulating
  list.innerHTML = "";

  // Filter tasks based on currentFilter
  const filteredTasks = tasks.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true; // 'all'
  });

  // Toggle empty state visibility
  if (filteredTasks.length === 0) {
    emptyState.classList.remove("hidden");
    if (tasks.length === 0) {
      emptyState.querySelector(".empty-title").textContent = "No tasks yet";
      emptyState.querySelector(".empty-subtitle").textContent = "Add your first task above to get started!";
    } else {
      emptyState.querySelector(".empty-title").textContent = `No ${currentFilter} tasks`;
      emptyState.querySelector(".empty-subtitle").textContent = `You don't have any tasks in the "${currentFilter}" category.`;
    }
  } else {
    emptyState.classList.add("hidden");
  }

  // Populate filtered tasks
  filteredTasks.forEach((t) => {
    const li = document.createElement("li");
    li.dataset.id = t.id;
    li.className = `task-item ${t.done ? "done" : ""}`;

    // Left content area (toggle button + label)
    const contentDiv = document.createElement("div");
    contentDiv.className = "task-content";

    // Toggle Checkbox Button
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "toggle-btn";
    toggleBtn.dataset.action = "toggle";
    toggleBtn.setAttribute("aria-label", t.done ? "Mark task active" : "Mark task done");
    toggleBtn.innerHTML = `
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>
    `;

    // Task Text (CRITICAL: textContent used to prevent XSS)
    const span = document.createElement("span");
    span.className = "task-label";
    span.textContent = t.text;

    contentDiv.append(toggleBtn, span);

    // Delete Button
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "delete-btn";
    delBtn.dataset.action = "delete";
    delBtn.setAttribute("aria-label", "Delete task");
    delBtn.innerHTML = `
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    `;

    li.append(contentDiv, delBtn);
    list.append(li);
  });

  // Update Remaining Tasks Counter
  const remainingCount = tasks.filter((t) => !t.done).length;
  countDisplay.textContent = `${remainingCount} ${remainingCount === 1 ? "task" : "tasks"} left`;

  // Update Completion Stats
  const totalCount = tasks.length;
  const completedCount = totalCount - remainingCount;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  statsDisplay.textContent = `${percentage}% completed (${completedCount}/${totalCount})`;

  // Enable/disable Clear Completed button
  clearCompletedBtn.disabled = completedCount === 0;
}

// --- 5. Event Listeners ---

// Add Task Form Submission
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = input.value.trim();

  // Validate: Reject empty inputs
  if (!text) {
    inputError.textContent = "Please enter a task description.";
    input.focus();
    return;
  }

  // Clear any existing error message
  inputError.textContent = "";

  // Append new task object
  tasks.push({
    id: Date.now(),
    text: text,
    done: false,
  });

  // Reset input field and persist
  input.value = "";
  input.focus();
  save();
  render();
});

// Clear error message on typing
input.addEventListener("input", function () {
  if (inputError.textContent) {
    inputError.textContent = "";
  }
});

// Event Delegation for Complete (toggle) and Delete actions
list.addEventListener("click", function (e) {
  const actionTarget = e.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;
  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (action === "delete") {
    tasks = tasks.filter((t) => t.id !== id);
  } else if (action === "toggle") {
    tasks.forEach((t) => {
      if (t.id === id) {
        t.done = !t.done;
      }
    });
  }

  save();
  render();
});

// Clear Completed Tasks Button
clearCompletedBtn.addEventListener("click", function () {
  const completedCount = tasks.filter((t) => t.done).length;
  if (completedCount === 0) return;

  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});

// Filter Tabs (All, Active, Done)
filterButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    filterButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });

    this.classList.add("active");
    this.setAttribute("aria-selected", "true");
    currentFilter = this.dataset.filter;
    render();
  });
});

// --- 6. Motivational Quotes Feature ---
const quotes = [
  "Small daily improvements over time lead to stunning results.",
  "The secret of getting ahead is getting started.",
  "Focus on being productive instead of busy.",
  "You don't have to be extreme, just consistent.",
  "Done is better than perfect.",
  "Action is the foundational key to all success.",
  "One task at a time, one day at a time.",
  "Make today so awesome yesterday gets jealous!"
];

const quoteText = document.getElementById("quote-text");
const newQuoteBtn = document.getElementById("new-quote-btn");

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

function updateQuote() {
  if (!quoteText) return;
  quoteText.classList.add("fading");
  setTimeout(() => {
    let newQuote = getRandomQuote();
    if (quotes.length > 1) {
      while (`"${newQuote}"` === quoteText.textContent) {
        newQuote = getRandomQuote();
      }
    }
    quoteText.textContent = `"${newQuote}"`;
    quoteText.classList.remove("fading");
  }, 200);
}

if (quoteText) {
  quoteText.textContent = `"${getRandomQuote()}"`;
}

if (newQuoteBtn) {
  newQuoteBtn.addEventListener("click", updateQuote);
}

// --- 7. Initial App Startup ---
render();
