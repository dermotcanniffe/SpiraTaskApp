const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// Note: These steps simulate behavior. In a real app you might use a UI testing framework like Spectron.

Given('I have opened the app', function () {
  // Simulate that the app is open
  this.appOpened = true;
});

When('I create a task with title {string} and deadline {string}', function (title, deadline) {
  // Simulate task creation
  this.task = {
    id: Date.now().toString(),
    title: title,
    deadline: deadline,
    status: 'todo'
  };
});

Then('I should see the task {string} in the Today view', function (title) {
  // Simulate checking that the task appears in the Today view
  assert.strictEqual(this.task.title, title);
});

Given('a task {string} exists in {string} column', function (title, column) {
  this.task = { id: '123', title: title, status: column.toLowerCase() };
});

When('I drag the task {string} to {string} column', function (title, targetColumn) {
  if(this.task.title === title) {
    this.task.status = targetColumn.toLowerCase();
  }
});

Then('the task {string} should be in {string} column', function (title, targetColumn) {
  assert.strictEqual(this.task.status, targetColumn.toLowerCase());
});

