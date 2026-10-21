// Get the elements from the page
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const filterButtons = document.querySelectorAll(".filter-btn");

// Which filter is selected: "all", "active", or "completed"
let currentFilter = "all";

// This array holds all our tasks.
// Each task looks like: { text: "Buy milk", completed: false }
let tasks = [];

// Save the tasks array into the browser's storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load the tasks array from the browser's storage
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}

// Draw every task on the page, based on the tasks array
function renderTasks() {
  // Clear the list first so we don't draw tasks twice
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
     // Skip tasks that don't match the selected filter
    if (currentFilter === "active" && task.completed) {
      return;
    }
    if (currentFilter === "completed" && !task.completed) {
      return;
    }

    // Create a list item
    const listItem = document.createElement("li");

    // Create the span that holds the task text
    const taskSpan = document.createElement("span");
    taskSpan.textContent = task.text;

    // If this task is completed, add the "completed" style
    if (task.completed) {
      taskSpan.classList.add("completed");
    }

    // Clicking the text switches completed on or off
    taskSpan.addEventListener("click", function () {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // Create the Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";

    // Clicking Edit asks for new text and updates the task
    editButton.addEventListener("click", function () {
      const newText = prompt("Edit your task:", task.text);

      // If Cancel was clicked, prompt gives back null, so stop
      if (newText === null) {
        return;
      }

      // Remove extra spaces, and stop if the new text is empty
      const trimmedText = newText.trim();
      if (trimmedText === "") {
        return;
      }

      tasks[index].text = trimmedText;
      saveTasks();
      renderTasks();
    });

    // Create the Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";

    // Clicking Delete removes this task from the array
    deleteButton.addEventListener("click", function () {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    // Put both buttons into one group so they sit side by side
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "task-buttons";
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    // Put the text and the button group in the list item, and the item in the list
    listItem.appendChild(taskSpan);
    listItem.appendChild(buttonGroup);
    taskList.appendChild(listItem);
  });

  // Count how many tasks are completed and show it on the page
  const completedCount = tasks.filter(function (task) {
    return task.completed;
  }).length;

  taskCounter.textContent = completedCount + " of " + tasks.length + " tasks completed";
}

// Add a new task
function addTask() {
  const taskText = taskInput.value.trim();

  // Do nothing if the box is empty
  if (taskText === "") {
    return;
  }

  // Add the new task to the array
  tasks.push({ text: taskText, completed: false });

  saveTasks();
  renderTasks();

  // Clear the text box
  taskInput.value = "";
}

// Run addTask when the Add button is clicked
addButton.addEventListener("click", addTask);

// Also add a task when the Enter key is pressed in the text box
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
// When a filter button is clicked, change the filter and redraw
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    // Highlight only the clicked button
    filterButtons.forEach(function (otherButton) {
      otherButton.classList.remove("active");
    });
    button.classList.add("active");

    renderTasks();
  });
});
// When the page first loads: load saved tasks, then draw them
loadTasks();
renderTasks();

// ----- Dark mode -----
const themeToggle = document.getElementById("themeToggle");

// Apply the chosen theme to the page and update the button label
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "Dark Mode";
  }
}

// When the toggle button is clicked, switch themes and remember the choice
themeToggle.addEventListener("click", function () {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
});

// When the page loads, apply the saved theme (light if nothing was saved)
applyTheme(localStorage.getItem("theme"));