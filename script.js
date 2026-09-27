// DOM Elements
const addTaskBtn = document.getElementById('add-task-btn');
const taskTitleInput = document.getElementById('task-title');
const taskDateInput = document.getElementById('task-date');
const pendingTasks = document.getElementById('pending-tasks');
const completedTasks = document.getElementById('completed-tasks');
const errorMessage = document.getElementById('error-message');
const themeToggle = document.getElementById('theme-toggle');
const progressFill = document.getElementById('progress-fill');
const taskSummary = document.getElementById('task-summary');
const filterButtons = document.querySelectorAll('.filter-btn');

// Helper Functions
const updateProgressBar = () => {
    const totalTasks = pendingTasks.children.length + completedTasks.children.length;
    const completedCount = completedTasks.children.length;

    if (totalTasks === 0) {
        progressFill.style.width = '0%';
        taskSummary.textContent = '0/0 tasks completed';
    } else {
        const progressPercentage = (completedCount / totalTasks) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        taskSummary.textContent = `${completedCount}/${totalTasks} tasks completed`;
    }
};

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

const saveTasksToLocalStorage = () => {
    const pending = Array.from(pendingTasks.children).map((task) => ({
        title: task.querySelector('span').textContent.trim(),
        date: task.querySelector('small').textContent.trim(),
        completed: false,
    }));

    const completed = Array.from(completedTasks.children).map((task) => ({
        title: task.querySelector('span').textContent.trim(),
        date: task.querySelector('small').textContent.trim(),
        completed: true,
    }));

    localStorage.setItem('tasks', JSON.stringify([...pending, ...completed]));
};

const loadTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(({ title, date, completed }) => {
        const taskElement = createTaskElement(title, date);
        if (completed) {
            completedTasks.appendChild(taskElement);
            taskElement.classList.add('completed-task');
            taskElement.querySelector('.complete-btn').remove();
        } else {
            pendingTasks.appendChild(taskElement);
        }
    });

    updateProgressBar();
};

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
        updateProgressBar();
        saveTasksToLocalStorage();
    } else {
        errorMessage.textContent = 'Please provide both a task title and date.';
        errorMessage.classList.remove('hidden');
    }
});

// Handle Task Actions
document.body.addEventListener('click', (event) => {
    const task = event.target.closest('li');

    if (task) {
        if (event.target.classList.contains('complete-btn')) {
            task.classList.add('completed-task');
            completedTasks.appendChild(task);
            event.target.remove();
            updateProgressBar();
            saveTasksToLocalStorage();
        } else if (event.target.classList.contains('delete-btn')) {
            task.remove();
            updateProgressBar();
            saveTasksToLocalStorage();
        }
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
});

// Filter Tasks
filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        if (filter === 'all') {
            pendingTasks.style.display = '';
            completedTasks.style.display = '';
        } else if (filter === 'pending') {
            pendingTasks.style.display = '';
            completedTasks.style.display = 'none';
        } else if (filter === 'completed') {
            pendingTasks.style.display = 'none';
            completedTasks.style.display = '';
        }
    });
});

// Initialize
loadTasksFromLocalStorage();
updateProgressBar();
