const API_URL = 'http://localhost:9000/v1/tasks';

// Fonction générique pour effectuer les requêtes API
async function fetchAPI(url, options = {}) {
  try {
    console.log('Request Options:', options); // Log request options
    const response = await fetch(url, options);
    console.log('Response:', response); // Log response object
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const text = await response.text();
    console.log('Response Text:', text); // Log the response text
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error('Fetch API error:', error);
    return null;
  }
}

// Charger les tâches
async function loadTasks() {
  try {
    console.log('Loading tasks...');
    const tasks = await fetchAPI(API_URL);
    console.log('Tasks loaded:', tasks);
    displayTasks(tasks);
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// Afficher les tâches
function displayTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  if (tasks && tasks.length > 0) {
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `${task.name} - ${task.date}`;
      if (new Date(task.date) < new Date()) {
        li.classList.add('completed');
      }
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteTask(task.id));
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No tasks available';
    taskList.appendChild(li);
  }
}

// Ajouter une tâche
document.getElementById('add-task').addEventListener('click', async () => {
  const name = document.getElementById('task-name').value;
  const date = document.getElementById('task-date').value;

  if (name && date) {
    try {
      const newTask = { name, date };
      console.log('Adding task:', newTask); // Log new task
      const result = await fetchAPI(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      console.log('Task added:', result);
      document.getElementById('task-name').value = '';
      document.getElementById('task-date').value = '';
      loadTasks(); // Recharger les tâches après l'ajout
    } catch (error) {
      console.error('Error adding task:', error);
    }
  } else {
    console.log('Name and date are required to add a task');
  }
});

// Supprimer une tâche
async function deleteTask(id) {
  try {
    console.log(`Deleting task: ${id}`);
    const result = await fetchAPI(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    console.log('Task deleted:', result);
    loadTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

// Recherche de tâches
document.getElementById('search-text').addEventListener('input', filterTasks);
document.getElementById('search-date').addEventListener('input', filterTasks);

async function filterTasks() {
  const searchText = document.getElementById('search-text').value.toLowerCase();
  const searchDate = document.getElementById('search-date').value;
  try {
    const tasks = await fetchAPI(API_URL);
    const filteredTasks = tasks.filter(task => {
      const matchesText = task.name.toLowerCase().includes(searchText);
      const matchesDate = searchDate ? task.date === searchDate : true;
      return matchesText && matchesDate;
    });
    displayTasks(filteredTasks);
  } catch (error) {
    console.error('Error filtering tasks:', error);
  }
}

// Charger les tâches au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  loadTasks();
});
