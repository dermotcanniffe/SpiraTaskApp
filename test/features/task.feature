Feature: Task Management
  As a user, I want to manage my tasks through the app.

  Scenario: Creating a new task
    Given I have opened the app
    When I create a task with title "Test Task" and deadline "2025-12-31T23:59"
    Then I should see the task "Test Task" in the Today view

  Scenario: Drag and drop task in Kanban
    Given a task "Test Task" exists in "To Do" column
    When I drag the task "Test Task" to "Done" column
    Then the task "Test Task" should be in "Done" column

