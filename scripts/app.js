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
  .then(res => {
    if (res.ok) {
      return res.json().then(data => {
        //Save user info locally
        localStorage.setItem("userId", data.id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("binId", data.bin_id);

        window.location.href = 'options.html';
      });
    } else {
      return res.json().then(data => {
        errorBox.textContent = data.error || 'Login failed';
      });
    }
  })
  .catch(() => {
    errorBox.textContent = 'Could not connect to server';
  });
}
