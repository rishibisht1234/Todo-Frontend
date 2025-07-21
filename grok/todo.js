const API_BASE = 'https://todoapi-3kjr.onrender.com/';
let editingId = null;

const authHeader = () => ({ 'Authorization': 'Token ' + localStorage.getItem('token') });

const logout = async () => {
  try {
    await fetch(API_BASE + 'logout/', { method: 'POST', headers: authHeader() });
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('An error occurred during logout');
  }
};

const loadTasks = async (query = '') => {
  try {
    const url = query ? `task-search/?q=${query}` : 'task-list/';
    const res = await fetch(API_BASE + url, { headers: authHeader() });
    const tasks = await res.json();
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    tasks.forEach(t => {
      const div = document.createElement('div');
      div.innerHTML = `
        <div>
          <h4>${t.title} ${t.completed ? '(Completed)' : ''}</h4>
          <p>${t.description || ''}</p>
          <p>Deadline: ${t.deadline ? new Date(t.deadline).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
          }) : 'N/A'}</p>
        </div>
        <div>
          <button onclick="toggle(${t.id})">${t.completed ? 'Undo' : 'Done'}</button>
          <button onclick="editTask(${t.id}, '${t.title}', \`${t.description || ''}\`, '${t.deadline || ''}')">Edit</button>
          <button onclick="deleteTask(${t.id})">Delete</button>
        </div>
      `;
      list.appendChild(div);
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
    alert('An error occurred while loading tasks');
  }
};

const toggle = async (id) => {
  try {
    await fetch(API_BASE + `task-toggle/${id}`, { method: 'PUT', headers: authHeader() });
    loadTasks(document.getElementById('search-input').value);
  } catch (error) {
    console.error('Toggle error:', error);
    alert('An error occurred while toggling task');
  }
};

const deleteTask = async (id) => {
  try {
    await fetch(API_BASE + `task-delete/${id}`, { method: 'DELETE', headers: authHeader() });
    loadTasks(document.getElementById('search-input').value);
  } catch (error) {
    console.error('Delete error:', error);
    alert('An error occurred while deleting task');
  }
};

const editTask = (id, title, description, deadline) => {
  document.getElementById('new-title').value = title;
  document.getElementById('new-desc').value = description;
  document.getElementById('new-deadline').value = deadline;
  document.getElementById('create-btn').textContent = 'Update';
  editingId = id;
};

document.getElementById('create-btn').addEventListener('click', async () => {
  const title = document.getElementById('new-title').value;
  const description = document.getElementById('new-desc').value;
  const deadline = document.getElementById('new-deadline').value;

  try {
    if (editingId) {
      await fetch(API_BASE + `task-update/${editingId}`, {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, deadline })
      });
      editingId = null;
      document.getElementById('create-btn').textContent = 'Add';
    } else {
      await fetch(API_BASE + 'task-create/', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, deadline })
      });
    }

    document.getElementById('new-title').value = '';
    document.getElementById('new-desc').value = '';
    document.getElementById('new-deadline').value = '';
    loadTasks(document.getElementById('search-input').value);
  } catch (error) {
    console.error('Task create/update error:', error);
    alert('An error occurred while creating/updating task');
  }
});

const searchTasks = () => loadTasks(document.getElementById('search-input').value);

const clearSearch = () => {
  document.getElementById('search-input').value = '';
  loadTasks();
};

// Load tasks on page load if authenticated
if (!localStorage.getItem('token')) {
  window.location.href = 'index.html';
} else {
  loadTasks();
}