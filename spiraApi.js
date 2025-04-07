const fetch = require('node-fetch');

const API_BASE_URL = 'https://your-spiraplan-api-endpoint.com/api';

async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  const tasks = await response.json();
  return tasks;
}

async function updateTask(taskId, taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  const updatedTask = await response.json();
  return updatedTask;
}

async function createTask(taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  const newTask = await response.json();
  return newTask;
}

module.exports = { getTasks, updateTask, createTask };

