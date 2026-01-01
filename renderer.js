const { ipcRenderer } = require('electron');

let tasks = [];
let editingIndex = -1;

// DOM elements
const taskNameInput = document.getElementById('taskName');
const taskMessageInput = document.getElementById('taskMessage');
const taskLinkInput = document.getElementById('taskLink');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksContainer = document.getElementById('tasksContainer');
const addTaskToggleBtn = document.getElementById('addTaskToggleBtn');
const taskForm = document.getElementById('taskForm');
const minimizeBtn = document.getElementById('minimizeBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const alwaysOnTopSetting = document.getElementById('alwaysOnTopSetting');
const autoLaunchSetting = document.getElementById('autoLaunchSetting');
const showFrameSetting = document.getElementById('showFrameSetting');

// Load tasks on startup
async function loadTasks() {
    try {
        tasks = await ipcRenderer.invoke('get-tasks');
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Save tasks
async function saveTasks() {
    try {
        await ipcRenderer.invoke('save-tasks', tasks);
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

// Load settings
async function loadSettings() {
    try {
        const settings = await ipcRenderer.invoke('get-settings');
        alwaysOnTopSetting.checked = settings.alwaysOnTop;
        autoLaunchSetting.checked = settings.autoLaunch;
        showFrameSetting.checked = settings.showFrame;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Render tasks
function renderTasks() {
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        return;
    }

    tasksContainer.innerHTML = tasks.map((task, index) => {
        const isEditing = editingIndex === index;
        return `
            <div class="task-item ${isEditing ? 'editing' : ''}" data-index="${index}">
                <div class="task-header">
                    ${isEditing ? `
                        <input type="text" class="task-edit-input" value="${escapeHtml(task.name)}" data-field="name">
                    ` : `
                        <div class="task-name">${escapeHtml(task.name)}</div>
                    `}
                    <div class="task-actions">
                        ${isEditing ? `
                            <button class="task-btn save-btn" onclick="saveTask(${index})">💾</button>
                            <button class="task-btn cancel-btn" onclick="cancelEdit()">❌</button>
                        ` : `
                            <button class="task-btn edit-btn" onclick="editTask(${index})">✏️</button>
                            <button class="task-btn delete-btn" onclick="deleteTask(${index})">🗑️</button>
                        `}
                    </div>
                </div>
                ${isEditing ? `
                    <textarea class="task-edit-textarea" data-field="message">${escapeHtml(task.message || '')}</textarea>
                    <input type="url" class="task-edit-input" value="${escapeHtml(task.link || '')}" placeholder="Link (optional)" data-field="link">
                ` : `
                    ${task.message ? `<div class="task-message">${escapeHtml(task.message)}</div>` : ''}
                    ${task.link ? `<a href="${escapeHtml(task.link)}" target="_blank" class="task-link">${escapeHtml(task.link)}</a>` : ''}
                `}
            </div>
        `;
    }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add new task
function addTask() {
    const name = taskNameInput.value.trim();
    const message = taskMessageInput.value.trim();
    const link = taskLinkInput.value.trim();

    if (!name) {
        alert('Please enter a task name');
        return;
    }

    tasks.push({
        name,
        message,
        link: link || null,
        createdAt: new Date().toISOString()
    });

    taskNameInput.value = '';
    taskMessageInput.value = '';
    taskLinkInput.value = '';

    saveTasks();
    renderTasks();
}

// Edit task
function editTask(index) {
    editingIndex = index;
    renderTasks();
}

// Save edited task
function saveTask(index) {
    const taskElement = document.querySelector(`[data-index="${index}"]`);
    const nameInput = taskElement.querySelector('[data-field="name"]');
    const messageInput = taskElement.querySelector('[data-field="message"]');
    const linkInput = taskElement.querySelector('[data-field="link"]');

    const name = nameInput.value.trim();
    if (!name) {
        alert('Task name cannot be empty');
        return;
    }

    tasks[index] = {
        ...tasks[index],
        name,
        message: messageInput.value.trim() || null,
        link: linkInput.value.trim() || null
    };

    editingIndex = -1;
    saveTasks();
    renderTasks();
}

// Cancel edit
function cancelEdit() {
    editingIndex = -1;
    renderTasks();
}

// Delete task
function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

// Minimize to tray
minimizeBtn.addEventListener('click', () => {
    ipcRenderer.invoke('minimize-window');
});

// Settings
settingsBtn.addEventListener('click', () => {
    settingsPanel.style.display = 'block';
    loadSettings();
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.style.display = 'none';
});

alwaysOnTopSetting.addEventListener('change', async (e) => {
    await ipcRenderer.invoke('update-setting', 'alwaysOnTop', e.target.checked);
});

autoLaunchSetting.addEventListener('change', async (e) => {
    await ipcRenderer.invoke('update-setting', 'autoLaunch', e.target.checked);
});

showFrameSetting.addEventListener('change', async (e) => {
    await ipcRenderer.invoke('update-setting', 'showFrame', e.target.checked);
});

// Toggle task form visibility
addTaskToggleBtn.addEventListener('click', () => {
    if (taskForm.style.display === 'none' || !taskForm.classList.contains('show')) {
        taskForm.style.display = 'block';
        taskForm.classList.add('show');
        // Focus on task name input
        setTimeout(() => {
            taskNameInput.focus();
        }, 100);
    } else {
        taskForm.classList.remove('show');
        setTimeout(() => {
            taskForm.style.display = 'none';
        }, 300); // Wait for animation to complete
        // Clear form when hiding
        taskNameInput.value = '';
        taskMessageInput.value = '';
        taskLinkInput.value = '';
    }
});

// Add task on button click
addTaskBtn.addEventListener('click', () => {
    addTask();
    // Hide form after adding task
    taskForm.classList.remove('show');
    setTimeout(() => {
        taskForm.style.display = 'none';
    }, 300);
});

// Add task on Enter key (in name field)
taskNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addTask();
        // Hide form after adding task
        taskForm.classList.remove('show');
        setTimeout(() => {
            taskForm.style.display = 'none';
        }, 300);
    }
});

// Make functions global for onclick handlers
window.editTask = editTask;
window.saveTask = saveTask;
window.cancelEdit = cancelEdit;
window.deleteTask = deleteTask;

// Initialize
loadTasks();
loadSettings();

