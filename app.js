const API_URL = 'http://127.0.0.1:9000/v1/tasks';

// Fonction pour effectuer les requêtes API
async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : [];
  } catch (error) {
    throw error;
  }
}

// Charger les tâches
async function loadTasks() {
  try {
    const tasks = await fetchAPI(API_URL);
    displayTasks(tasks);
    return tasks;
  } catch (error) {
    throw error;
  }
}

// Afficher les tâches
function displayTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  if (tasks && tasks.length > 0) {
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `${task.label} - ${task.start_date}`;
      if (new Date(task.start_date) < new Date()) {
        li.classList.add('completed');
      }
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () => {
        await deleteTask(task.label);
        const updatedTasks = await loadTasks();
        displayTasks(updatedTasks);
      });
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No tasks available';
    taskList.appendChild(li);
  }
}

// Supprimer une tâche
async function deleteTask(label) {
  try {
    const result = await fetchAPI(`${API_URL}/${label}`, {
      method: 'DELETE'
    });
    return result;
  } catch (error) {
    throw error;
  }
}

// Recherche de tâches
async function filterTasks() {
  const searchText = document.getElementById('search-text').value.toLowerCase();
  const searchDate = document.getElementById('search-date').value;
  try {
    const tasks = await fetchAPI(API_URL);
    const filteredTasks = tasks.filter(task => {
      const matchesText = task.label.toLowerCase().includes(searchText);
      const matchesDate = searchDate ? task.start_date.startsWith(searchDate) : true;
      return matchesText && matchesDate;
    });
    displayTasks(filteredTasks);
  } catch (error) {
    console.error('Error filtering tasks:', error);
  }
}

// Attacher les event lisrtener après le chargement du DOM et ajour date (et peut etre heure)
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('add-task').addEventListener('click', async () => {
    const label = document.getElementById('task-label').value;
    const start_date = document.getElementById('task-date').value;

    if (label && start_date) {
      try {
        const formattedDate = new Date(start_date).toISOString();
        const newTask = { label, start_date: formattedDate };
        await fetchAPI(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTask)
        });
        document.getElementById('task-label').value = '';
        document.getElementById('task-date').value = '';
        await loadTasks();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      console.log('Label and start date are required to add a task');
    }
  });

  document.getElementById('search-text').addEventListener('input', filterTasks);
  document.getElementById('search-date').addEventListener('input', filterTasks);

  // Charger les tâches au chargement de la page
  await loadTasks();
});

module.exports = {
  fetchAPI,
  loadTasks,
  deleteTask,
  filterTasks,
  displayTasks
};