// Helper function to create a task element
const createTaskElement = (title, date) => {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <span>${title} <small>[${date}]</small></span>
        <div>
            <button class="complete-btn">Complete</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    return taskItem;
};

// DOM Elements
const addTaskBtn = document.getElementById('add-task-btn');
const taskTitleInput = document.getElementById('task-title');
const taskDateInput = document.getElementById('task-date');
const pendingTasks = document.getElementById('pending-tasks');
const completedTasks = document.getElementById('completed-tasks');
const errorMessage = document.getElementById('error-message');

// Add Task
addTaskBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim();
    const date = taskDateInput.value;

    if (title && date) {
        const taskElement = createTaskElement(title, date);
        pendingTasks.appendChild(taskElement);
        taskTitleInput.value = '';
        taskDateInput.value = '';
        errorMessage.classList.add('hidden');
    } else {
        errorMessage.textContent = 'Please provide both a task title and date.';
        errorMessage.classList.remove('hidden');
    }
});

// Task Actions
document.body.addEventListener('click', (event) => {
    const task = event.target.closest('li');

    if (task) {
        if (event.target.classList.contains('complete-btn')) {
            task.classList.add('completed-task');
            completedTasks.appendChild(task);
            event.target.remove(); // Remove the "Complete" button
        } else if (event.target.classList.contains('delete-btn')) {
            task.remove();
        }
    }
});
