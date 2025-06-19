function login(event) {
  event.preventDefault();
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user === 'admin' && pass === 'password') {
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid credentials');
  }
}
