
function login(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errorBox = document.getElementById('error');

    fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          localStorage.setItem("userId", data.id);
          window.location.href = 'dashboard.html';
        } else {
          alert('Login failed');
        }
      })
      .catch(() => {
        errorBox.textContent = 'Could not connect to server';
      });
    }