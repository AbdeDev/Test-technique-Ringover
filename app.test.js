const { fetchAPI, loadTasks, deleteTask, filterTasks, displayTasks } = require('./app');


beforeEach(() => {
  fetch.resetMocks(); 
  document.body.innerHTML = `
    <div id="task-list"></div>
    <input type="text" id="task-label">
    <input type="datetime-local" id="task-date">
    <button id="add-task"></button>
    <input type="text" id="search-text">
    <input type="date" id="search-date">
  `;
});

describe('fetchAPI', () => {
  it('should fetch data successfully', async () => {
    const mockData = [{ label: 'Test Task', start_date: '2024-05-20T12:00:00Z' }];
    fetch.mockResponseOnce(JSON.stringify(mockData));

    const result = await fetchAPI('http://127.0.0.1:9000/v1/tasks');
    expect(result).toEqual(mockData);
  });

  it('should handle fetch errors', async () => {
    fetch.mockReject(new Error('Internal Server Error'));

    await expect(fetchAPI('http://127.0.0.1:9000/v1/tasks')).rejects.toThrow('Internal Server Error');
  });
});

describe('loadTasks', () => {
  it('should load and display tasks', async () => {
    const mockTasks = [{ label: 'Test Task', start_date: '2024-05-20T12:00:00Z' }];
    fetch.mockResponseOnce(JSON.stringify(mockTasks));

    await loadTasks();
    const taskList = document.getElementById('task-list');
    expect(taskList.innerHTML).toContain('Test Task');
  });

//   it('should handle errors during task loading', async () => {
//     fetch.mockReject(new Error('Internal Server Error'));

//     console.error = jest.fn();
//     await loadTasks();
//     expect(console.error).toHaveBeenCalledWith('Error loading tasks:', expect.any(Error));
//   });
});

describe('displayTasks', () => {
  it('should display tasks in the DOM', () => {
    const tasks = [{ label: 'Test Task', start_date: '2024-05-20T12:00:00Z' }];
    displayTasks(tasks);
    const taskList = document.getElementById('task-list');
    expect(taskList.innerHTML).toContain('Test Task');
  });

  it('should indicate when no tasks are available', () => {
    displayTasks([]);
    const taskList = document.getElementById('task-list');
    expect(taskList.innerHTML).toContain('No tasks available');
  });
});

describe('deleteTask', () => {
  it('should delete a task and reload tasks', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    await deleteTask('Test Task');
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:9000/v1/tasks/Test Task', { method: 'DELETE' });
  });

  it('should handle errors during task deletion', async () => {
    fetch.mockReject(new Error('Internal Server Error'));

    await expect(deleteTask('Test Task')).rejects.toThrow('Internal Server Error');
  });
});

describe('filterTasks', () => {
  it('should filter tasks by text and date', async () => {
    const mockTasks = [
      { label: 'Test Task 1', start_date: '2024-05-20T12:00:00Z' },
      { label: 'Other Task', start_date: '2024-05-21T12:00:00Z' },
    ];
    fetch.mockResponseOnce(JSON.stringify(mockTasks));

    document.getElementById('search-text').value = 'Test';
    document.getElementById('search-date').value = '2024-05-20';
    await filterTasks();
    const taskList = document.getElementById('task-list');
    expect(taskList.innerHTML).toContain('Test Task 1');
    expect(taskList.innerHTML).not.toContain('Other Task');
  });

  it('should handle errors during task filtering', async () => {
    fetch.mockReject(new Error('Internal Server Error'));

    console.error = jest.fn();
    await filterTasks();
    expect(console.error).toHaveBeenCalledWith('Error filtering tasks:', expect.any(Error));
  });
});

// describe('add-task button', () => {
//   it('should add a new task', async () => {
//     fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

//     document.getElementById('task-label').value = 'New Task';
//     document.getElementById('task-date').value = '2024-05-20T12:00';

//     const addButton = document.getElementById('add-task');
//     addButton.click();

//     expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:9000/v1/tasks', expect.objectContaining({
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ label: 'New Task', start_date: '2024-05-20T12:00:00.000Z' })
//     }));

//     const mockTasks = [{ label: 'New Task', start_date: '2024-05-20T12:00:00Z' }];
//     fetch.mockResponseOnce(JSON.stringify(mockTasks));

//     await loadTasks();
//     const taskList = document.getElementById('task-list');
//     expect(taskList.innerHTML).toContain('New Task');
//   });
// });