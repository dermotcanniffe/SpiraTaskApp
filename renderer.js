const { ipcRenderer } = require('electron');

// Simulated in-memory task list
let tasks = [];

// Polling interval (30 minutes default)
const POLL_INTERVAL = 30 * 60 * 1000;

// Initialize Quill for rich text editing
const quill = new Quill('#editor-container', {
  theme: 'snow'
});

// DOM references
const todayBtn = document.getElementById('today-btn');
const kanbanBtn = document.getElementById('kanban-btn');
const todayView = document.getElementById('today-view');
const kanbanView = document.getElementById('kanban-view');
const todayTasksContainer = document.getElementById('today-tasks');
const todoTasksContainer = document.getElementById('todo-tasks');
const inprogressTasksContainer = document.getElementById('inprogress-tasks');
const doneTasksContainer = document.getElementById('done-tasks');
const taskForm = document.getElementById('task-form');

// View toggling
todayBtn.addEventListener('click', () => {
  todayView.classList.add('active-view');
  kanbanView.classList.remove('active-view');
});
kanbanBtn.addEventListener('click', () => {
  kanbanView.classList.add('active-view');
  todayView.classList.remove('active-view');
});

// Render tasks in both views
function renderTasks() {
  // Clear containers
  todayTasksContainer.innerHTML = '';
  todoTasksContainer.innerHTML = '';
  inprogressTasksContainer.innerHTML = '';
  doneTasksContainer.innerHTML = '';

  const today = new Date().toISOString().slice(0, 10);

  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-card';
    taskElement.setAttribute('draggable', true);
    taskElement.dataset.id = task.id;
    taskElement.innerHTML = `<strong>${task.title}</strong><br>
                             ${task.deadline ? new Date(task.deadline).toLocaleString() : ''}`;

    // Add drag events for Kanban
    taskElement.addEventListener('dragstart', dragStart);
    taskElement.addEventListener('dragend', dragEnd);

    // Today view: tasks with deadline today
    if (task.deadline && task.deadline.slice(0, 10) === today) {
      todayTasksContainer.appendChild(taskElement.cloneNode(true));
    }

    // Kanban view: place task in appropriate column based on status
    if (task.status === 'todo') {
      todoTasksContainer.appendChild(taskElement);
    } else if (task.status === 'inprogress') {
      inprogressTasksContainer.appendChild(taskElement);
    } else if (task.status === 'done') {
      doneTasksContainer.appendChild(taskElement);
    }
  });
}

// Drag & Drop handlers
function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.id);
  e.target.style.opacity = '0.5';
}

function dragEnd(e) {
  e.target.style.opacity = '1';
}

// Setup drop zones for Kanban columns
['todo-tasks', 'inprogress-tasks', 'done-tasks'].forEach(id => {
  const container = document.getElementById(id);
  container.addEventListener('dragover', (e) => e.preventDefault());
  container.addEventListener('drop', (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      if (id === 'todo-tasks') task.status = 'todo';
      if (id === 'inprogress-tasks') task.status = 'inprogress';
      if (id === 'done-tasks') task.status = 'done';
      // Simulate updating task in Spira (replace with real API call)
      updateTask(task);
      renderTasks();
    }
  });
});

// Handle form submission for creating or updating tasks
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('task-id').value;
  const title = document.getElementById('task-title').value;
  const description = quill.root.innerHTML;
  const deadline = document.getElementById('task-deadline').value;
  const priority = document.getElementById('task-priority').value;
  const status = document.getElementById('task-status').value;

  if (id) {
    // Update existing task
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.title = title;
      task.description = description;
      task.deadline = deadline;
      task.priority = priority;
      task.status = status;
      updateTask(task);
    }
  } else {
    // Create new task with a unique ID
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      deadline,
      priority,
      status
    };
    tasks.push(newTask);
    createTask(newTask);
  }
  taskForm.reset();
  quill.setContents([]);
  renderTasks();
});

// Stub functions to simulate API calls (replace with real API integration)
function updateTask(task) {
  console.log('Updating task to Spira ', task);
  // e.g., call spiraApi.updateTask(task.id, task);
}

function createTask(task) {
  console.log('Creating task in Spira ', task);
  // e.g., call spiraApi.createTask(task);
}

// Polling for updates from Spira at a customisable frequency (default: 30 minutes)
function pollTasks() {
  console.log('Polling Spira for tasks update...');
  // Simulate API call: e.g.,
  // spiraApi.getTasks().then(newTasks => { tasks = newTasks; renderTasks(); });
}

setInterval(pollTasks, POLL_INTERVAL);

// Initial render
renderTasks();

