const API_BASE = 'https://todoapi-3kjr.onrender.com/';

const toggleForm = (form) => {
  document.getElementById('login-form').style.display = form === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = form === 'register' ? 'block' : 'none';
};

const login = async () => {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(API_BASE + 'login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'todo.html';
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login');
  }
};

const register = async () => {
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    await fetch(API_BASE + 'register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    toggleForm('login');
    alert('Registration successful. Please login.');
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration');
  }
};

// Check if already logged in
if (localStorage.getItem('token')) {
  window.location.href = 'todo.html';
}